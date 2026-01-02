-- Weekly Plans Schema
-- This schema supports the Weekly Plans (Planos Semanais) feature
-- which allows users to configure 7 days of meals with delivery times

CREATE TABLE IF NOT EXISTS weekly_plans (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_start_date DATE NOT NULL,
  plan_end_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 5.00,
  final_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_plan_days (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES weekly_plans(id) ON DELETE CASCADE,
  day_date DATE NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  size TEXT NOT NULL,
  meat TEXT NOT NULL,
  items JSONB NOT NULL, -- {itemId: boolean}
  delivery_method TEXT NOT NULL, -- 'balcao' or 'entrega'
  delivery_time TIME NOT NULL, -- HH:MM format
  payment_method TEXT NOT NULL,
  address JSONB, -- {street, number}
  needs_change BOOLEAN DEFAULT false,
  change_amount TEXT,
  whatsapp_link TEXT,
  day_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_status ON weekly_plans(status);
CREATE INDEX IF NOT EXISTS idx_weekly_plan_days_plan ON weekly_plan_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plan_days_date ON weekly_plan_days(day_date);
