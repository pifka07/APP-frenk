-- ============================================================
--  Fränk Game – Supabase Database Schema
--  Ausführen: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Katalog-Tabellen ─────────────────────────────────────

CREATE TABLE upgrades (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  key               TEXT    UNIQUE NOT NULL,
  name              TEXT    NOT NULL,
  description       TEXT,
  base_cost         INT     DEFAULT 100,
  cost_multiplier   FLOAT   DEFAULT 1.5,
  max_level         INT     DEFAULT 10,
  effect_per_level  FLOAT   DEFAULT 0.1,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skins (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  key              TEXT    UNIQUE NOT NULL,
  name             TEXT    NOT NULL,
  description      TEXT,
  cost_coins       INT     DEFAULT 500,
  image_url        TEXT,
  color_primary    TEXT    DEFAULT '#2DD4BF',
  color_secondary  TEXT    DEFAULT '#0f172a',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Spieler-Tabellen ─────────────────────────────────────

CREATE TABLE player_stats (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT,
  best_score     INT     DEFAULT 0,
  best_distance  FLOAT   DEFAULT 0,
  total_coins    INT     DEFAULT 0,
  total_runs     INT     DEFAULT 0,
  equipped_skin  TEXT    DEFAULT 'default',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE runs (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_session_id  TEXT,
  score           INT     NOT NULL DEFAULT 0,
  coins_collected INT     DEFAULT 0,
  distance        FLOAT   DEFAULT 0,
  duration_ms     INT     DEFAULT 0,
  difficulty      TEXT    DEFAULT 'normal',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_upgrades (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upgrade_id  UUID NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
  level       INT  DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, upgrade_id)
);

CREATE TABLE player_skins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_id     UUID NOT NULL REFERENCES skins(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skin_id)
);

CREATE TABLE leaderboard_entries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT NOT NULL,
  score          INT  NOT NULL DEFAULT 0,
  player_avatar  TEXT,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────

CREATE INDEX idx_runs_user_id        ON runs(user_id);
CREATE INDEX idx_runs_score          ON runs(score DESC);
CREATE INDEX idx_player_upgrades_uid ON player_upgrades(user_id);
CREATE INDEX idx_player_skins_uid    ON player_skins(user_id);
CREATE INDEX idx_leaderboard_score   ON leaderboard_entries(score DESC);

-- ── Trigger: player_stats bei Registrierung anlegen ──────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.player_stats (user_id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ────────────────────────────────────

ALTER TABLE upgrades            ENABLE ROW LEVEL SECURITY;
ALTER TABLE skins               ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_upgrades     ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_skins        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Katalog: öffentlich lesbar (kein Login nötig)
CREATE POLICY "upgrades_read"    ON upgrades            FOR SELECT USING (true);
CREATE POLICY "skins_read"       ON skins               FOR SELECT USING (true);
CREATE POLICY "leaderboard_read" ON leaderboard_entries FOR SELECT USING (true);

-- Spielerdaten: nur eigene Zeilen
CREATE POLICY "stats_select" ON player_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "stats_insert" ON player_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "stats_update" ON player_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "stats_delete" ON player_stats FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "runs_select" ON runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "runs_insert" ON runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "runs_delete" ON runs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "pu_select" ON player_upgrades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pu_insert" ON player_upgrades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pu_update" ON player_upgrades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pu_delete" ON player_upgrades FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "ps_select" ON player_skins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ps_insert" ON player_skins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ps_delete" ON player_skins FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "lb_insert" ON leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lb_update" ON leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lb_delete" ON leaderboard_entries FOR DELETE USING (auth.uid() = user_id);

-- ── Upgrade-Katalog ───────────────────────────────────────

INSERT INTO upgrades (key, name, description, base_cost, cost_multiplier, max_level, effect_per_level) VALUES
  ('poop_tank',     'Poop Tank',     'Erhöht die Poop-Tank-Kapazität',  100, 1.5, 10, 3.0),
  ('poop_cooldown', 'Poop Cooldown', 'Reduziert die Abklingzeit',       150, 1.8,  5, 0.1),
  ('wing_speed',    'Wing Speed',    'Erhöht die Fluggeschwindigkeit',  120, 1.6,  8, 0.2),
  ('combo_booster', 'Combo Booster', 'Verlängert die Combo-Dauer',      200, 2.0,  5, 1.0);

-- ── Skin-Katalog ──────────────────────────────────────────
-- image_url-Werte kommen aus dem Supabase Storage deines alten base44-Projekts.
-- Die Assets liegen bereits öffentlich auf qtrypzzcjebvfcihiynt.supabase.co

INSERT INTO skins (key, name, description, cost_coins, color_primary, color_secondary, image_url) VALUES
  ('default',
   'Fränk Classic',
   'Der Original-Fränk – kostenlos für alle!',
   0,
   '#2DD4BF', '#0f172a',
   'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693033c50efef1894f9768b3/71a9e1eb7_frnkoriginal.png'),

  ('gold',
   'Goldener Fränk',
   'Glänzt wie eine Münze!',
   500,
   '#FACC15', '#92400E',
   NULL),   -- TODO: image_url aus base44 Storage einfügen

  ('pink',
   'Rosa Fränk',
   'Für den stilvollen Auftritt.',
   750,
   '#EC4899', '#831843',
   NULL);   -- TODO: image_url aus base44 Storage einfügen

