import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const isValidWhatsAppOrders = (
  orders: unknown
): orders is Record<string, string> => {
  if (typeof orders !== "object" || orders === null) return false;

  return Object.entries(orders).every(([day, link]) => {
    const dayNum = Number(day);

    return (
      Number.isInteger(dayNum) &&
      dayNum >= 0 &&
      dayNum <= 6 &&
      typeof link === "string" &&
      link.startsWith("https://wa.me/")
    );
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 🔹 GET - Buscar pedidos do usuário
    if (req.method === "GET") {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required",
        });
      }

      const result = await pool.query(
        "SELECT orders FROM intelligent_orders WHERE user_id = $1",
        [userId]
      );

      return res.status(200).json({
        orders: result.rows[0]?.orders ?? null,
      });
    }

    // 🔹 POST - Salvar/Atualizar pedidos do usuário
    if (req.method === "POST") {
      const { userId, orders } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required",
        });
      }

      if (!isValidWhatsAppOrders(orders)) {
        return res.status(400).json({
          error: "Orders must be an object { dayNumber: wa.me link }",
        });
      }

      const cleanedOrders: Record<number, string> = {};

      Object.entries(orders).forEach(([day, link]) => {
        cleanedOrders[Number(day)] = link.trim();
      });

      const result = await pool.query(
        `INSERT INTO intelligent_orders (user_id, orders, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET orders = $2, updated_at = NOW()
         RETURNING *`,
        [userId, JSON.stringify(orders)]
      );

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
