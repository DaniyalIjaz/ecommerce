-- Site banner (editable banner over navbar)
CREATE TABLE IF NOT EXISTS public.site_banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  text text,
  link text,
  bg_color text DEFAULT '#C45C3E',
  text_color text DEFAULT '#FFFFFF',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_banners_pkey PRIMARY KEY (id)
);

-- Site settings (sales, discounts - global or per-product)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);

-- Support queries (user questions, admin replies)
CREATE TABLE IF NOT EXISTS public.support_queries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  guest_email text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'replied', 'closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT support_queries_pkey PRIMARY KEY (id)
);

-- Product reviews (if not exists)
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  image_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id)
);

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES 
  ('global_discount', '{"enabled": false, "percent": 0, "label": ""}'::jsonb),
  ('navbar_banner', '{"enabled": false, "text": "Free shipping on orders over $50!", "link": "/collection"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
