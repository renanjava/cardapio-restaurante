import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ⚠️ USER FIXO APENAS PARA TESTE
const TEST_USER_ID = "test_user";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 🔹 GET
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT orders FROM intelligent_orders WHERE user_id = $1",
        [TEST_USER_ID]
      );

      return res.status(200).json({
        orders: result.rows[0]?.orders ?? null,
      });
    }

    // 🔹 POST
    if (req.method === "POST") {
      const { orders } = req.body;

      if (!orders || typeof orders !== "object") {
        return res.status(400).json({ error: "Invalid orders" });
      }

      const result = await pool.query(
        `INSERT INTO intelligent_orders (user_id, orders, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET orders = $2, updated_at = NOW()
         RETURNING *`,
        [TEST_USER_ID, JSON.stringify(orders)]
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
