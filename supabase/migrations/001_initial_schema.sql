-- Love101 — Initial Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- 1. TABLES
-- ============================================

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('valentine', 'apology', 'love-letter', 'anniversary', 'quiz-game', 'rdv')),
  recipient_name TEXT NOT NULL CHECK (char_length(recipient_name) <= 50),
  sender_name TEXT NOT NULL CHECK (char_length(sender_name) <= 50),
  message TEXT NOT NULL CHECK (char_length(message) <= 2000),
  theme_colors JSONB NOT NULL DEFAULT '{}',
  custom_config JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE card_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewer_ip_hash TEXT,
  user_agent TEXT
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  question TEXT NOT NULL CHECK (char_length(question) <= 200),
  correct_answer TEXT NOT NULL CHECK (char_length(correct_answer) <= 100),
  options JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX idx_card_views_card_id ON card_views(card_id);
CREATE INDEX idx_quiz_questions_card_id ON quiz_questions(card_id);
CREATE INDEX idx_cards_user_id ON cards(user_id);

-- ============================================
-- 3. AUTO-UPDATE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Cards: anyone can read published cards
CREATE POLICY "Published cards are viewable by everyone"
  ON cards FOR SELECT
  USING (is_published = true);

-- Cards: anyone can insert (anonymous card creation)
CREATE POLICY "Anyone can create cards"
  ON cards FOR INSERT
  WITH CHECK (true);

-- Cards: owners can update their own cards
CREATE POLICY "Card owners can update their cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

-- Card views: anyone can insert (tracking views)
CREATE POLICY "Anyone can record views"
  ON card_views FOR INSERT
  WITH CHECK (true);

-- Card views: card owners can read views on their cards
CREATE POLICY "Card owners can view their card stats"
  ON card_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_views.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Cards: owners can delete their own cards
CREATE POLICY "Card owners can delete their cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- Card views: owners can delete views on their cards (cascade from card delete)
CREATE POLICY "Card owners can delete their card views"
  ON card_views FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_views.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Quiz questions: anyone can read (needed to display quiz)
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  USING (true);

-- Quiz questions: anyone can insert (created with card)
CREATE POLICY "Anyone can create quiz questions"
  ON quiz_questions FOR INSERT
  WITH CHECK (true);
