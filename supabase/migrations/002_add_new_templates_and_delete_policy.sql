-- Love101 — Migration 002
-- Adds quiz-game and rdv template types + delete policies
-- Run this if you already executed 001_initial_schema.sql

-- ============================================
-- 1. UPDATE template_type constraint
-- ============================================

ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_template_type_check;
ALTER TABLE cards ADD CONSTRAINT cards_template_type_check
  CHECK (template_type IN ('valentine', 'apology', 'love-letter', 'anniversary', 'quiz-game', 'rdv'));

-- ============================================
-- 2. ADD DELETE policies
-- ============================================

CREATE POLICY "Card owners can delete their cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Card owners can delete their card views"
  ON card_views FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_views.card_id
      AND cards.user_id = auth.uid()
    )
  );
