-- DSCSSクイズプラットフォーム DBスキーマ
-- Vercel Postgres で実行

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(500),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id INT NOT NULL CHECK (stage_id BETWEEN 1 AND 5),
  score INT NOT NULL CHECK (score BETWEEN 0 AND 10),
  completed_questions INT NOT NULL DEFAULT 10,
  finished BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
