import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface WeeklyPlanDay {
  dayDate: string; // ISO date string
  dayOfWeek: number;
  size: string;
  meat: string;
  items: Record<string, boolean>;
  deliveryMethod: string;
  deliveryTime: string; // HH:MM format
  paymentMethod: string;
  address?: { street: string; number: string };
  needsChange?: boolean;
  changeAmount?: string;
  whatsappLink?: string;
  dayTotal: number;
}

interface CreatePlanRequest {
  userId: string;
  planStartDate: string;
  planEndDate: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  days: WeeklyPlanDay[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const planResult = await pool.query(
        `SELECT * FROM weekly_plans 
         WHERE user_id = $1 AND status = 'active' 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      if (planResult.rows.length === 0) {
        return res.status(200).json({ plan: null });
      }

      const plan = planResult.rows[0];

      const daysResult = await pool.query(
        `SELECT * FROM weekly_plan_days 
         WHERE plan_id = $1 
         ORDER BY day_date ASC`,
        [plan.id]
      );

      return res.status(200).json({
        plan: {
          ...plan,
          days: daysResult.rows,
        },
      });
    }

    if (req.method === "POST") {
      const {
        userId,
        planStartDate,
        planEndDate,
        totalAmount,
        discountAmount,
        finalAmount,
        days,
      } = req.body as CreatePlanRequest;

      if (!userId || !planStartDate || !planEndDate || !days || days.length !== 7) {
        return res.status(400).json({
          error: "Missing required fields or invalid days count (must be 7)",
        });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const planResult = await client.query(
          `INSERT INTO weekly_plans 
           (user_id, plan_start_date, plan_end_date, total_amount, discount_amount, final_amount, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'active')
           RETURNING *`,
          [userId, planStartDate, planEndDate, totalAmount, discountAmount, finalAmount]
        );

        const planId = planResult.rows[0].id;

        for (const day of days) {
          await client.query(
            `INSERT INTO weekly_plan_days 
             (plan_id, day_date, day_of_week, size, meat, items, delivery_method, 
              delivery_time, payment_method, address, needs_change, change_amount, 
              whatsapp_link, day_total)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              planId,
              day.dayDate,
              day.dayOfWeek,
              day.size,
              day.meat,
              JSON.stringify(day.items),
              day.deliveryMethod,
              day.deliveryTime,
              day.paymentMethod,
              day.address ? JSON.stringify(day.address) : null,
              day.needsChange || false,
              day.changeAmount || null,
              day.whatsappLink || null,
              day.dayTotal,
            ]
          );
        }

        await client.query("COMMIT");

        return res.status(201).json({
          success: true,
          plan: planResult.rows[0],
        });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    }

    if (req.method === "PUT") {
      const planId = req.query.id as string;
      const { status } = req.body;

      if (!planId || !status) {
        return res.status(400).json({ error: "planId and status are required" });
      }

      const result = await pool.query(
        `UPDATE weekly_plans 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [status, planId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Plan not found" });
      }

      return res.status(200).json({
        success: true,
        plan: result.rows[0],
      });
    }

    if (req.method === "DELETE") {
      const planId = req.query.id as string;

      if (!planId) {
        return res.status(400).json({ error: "planId is required" });
      }

      const result = await pool.query(
        `UPDATE weekly_plans 
         SET status = 'cancelled', updated_at = NOW() 
         WHERE id = $1 
         RETURNING *`,
        [planId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Plan not found" });
      }

      return res.status(200).json({
        success: true,
        plan: result.rows[0],
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Weekly plan API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
