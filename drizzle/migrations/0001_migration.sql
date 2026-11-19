CREATE TABLE public.design_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  product_type text,
  price numeric,
  config jsonb
);
GRANT ALL ON public.design_messages TO service_role;
ALTER TABLE public.design_messages ENABLE ROW LEVEL SECURITY;