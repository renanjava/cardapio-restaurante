import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

interface WeeklyPlanDay {
  dayDate: string;
  dayOfWeek: number;
  size: string;
  meat: string;
  items: Record<string, boolean>;
  deliveryMethod: string;
  deliveryTime: string;
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
      const orderNsu = req.query.orderNsu as string;
      const transactionNsu = req.query.transactionNsu as string;
      const slug = req.query.slug as string;

      if (!orderNsu) {
        return res.status(400).json({ error: "orderNsu is required" });
      }

      if (transactionNsu && slug) {
        try {
          const checkUrl = "https://api.infinitepay.io/invoices/public/checkout/payment_check";
          const checkResp = await fetch(checkUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              handle: "renan-g-l",
              order_nsu: orderNsu,
              transaction_nsu: transactionNsu,
              slug: slug,
            }),
          });

          if (checkResp.ok) {
            const checkData = await checkResp.json();
            if (checkData.paid) {
              return res.status(200).json({
                plan: {
                  order_nsu: orderNsu,
                  status: "active",
                  amount: checkData.amount,
                  paid_amount: checkData.paid_amount,
                },
              });
            }
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }

      return res.status(200).json({
        plan: {
          order_nsu: orderNsu,
          status: "pending_payment",
        },
      });
    }

    if (req.method === "POST") {
      if (req.body.invoice_slug && (req.body.paid_amount || req.body.order_nsu)) {
        const { order_nsu, amount, paid_amount, invoice_slug } = req.body;
        console.log("Webhook received (Stateless):", { order_nsu, amount, paid_amount, invoice_slug });
        return res.status(200).json({ success: true });
      }

      const {
        userId,
        finalAmount,
      } = req.body as CreatePlanRequest;

      const orderNsu = Math.random().toString(36).substring(2, 10);

      const infinitePayUrl = "https://api.infinitepay.io/invoices/public/checkout/links";
      const infinitePayResp = await fetch(infinitePayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: "renan-g-l",
          redirect_url: `https://restaurante-juliana.vercel.app/?payment=processing&order_nsu=${orderNsu}`,
          webhook_url: "https://restaurante-juliana.vercel.app/api/weekly-plan",
          order_nsu: orderNsu,
          items: [
            {
              quantity: 1,
              price: Math.round(finalAmount * 100),
              description: "Plano Semanal - 7 dias",
            },
          ],
        }),
      });

      if (!infinitePayResp.ok) {
        const errText = await infinitePayResp.text();
        console.error("InfinitePay error:", errText);
        return res.status(500).json({ error: "Failed to create checkout link" });
      }

      const infinitePayData = await infinitePayResp.json();
      const checkoutUrl = infinitePayData.url;

      return res.status(201).json({
        success: true,
        orderNsu,
        checkoutUrl,
      });
    }

    if (req.method === "PUT") {
      return res.status(200).json({ success: true, message: "DB calls removed" });
    }

    if (req.method === "DELETE") {
      return res.status(200).json({ success: true, message: "DB calls removed" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Weekly plan API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
