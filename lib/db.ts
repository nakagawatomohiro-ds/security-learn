import { sql } from "@vercel/postgres";

// ── ユーザー関連 ──

export async function getOrCreateUser(profile: {
  email: string;
  name?: string | null;
  image?: string | null;
  googleId?: string;
}) {
  const { rows } = await sql`
    INSERT INTO users (email, name, image, google_id)
    VALUES (${profile.email}, ${profile.name ?? null}, ${profile.image ?? null}, ${profile.googleId ?? null})
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, users.name),
      image = COALESCE(EXCLUDED.image, users.image),
      google_id = COALESCE(EXCLUDED.google_id, users.google_id)
    RETURNING id, email, name, image
  `;
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const { rows } = await sql`
    SELECT id, email, name, image FROM users WHERE email = ${email}
  `;
  return rows[0] ?? null;
}

// ── クイズ結果関連 ──

export async function saveQuizResult(
  userId: number,
  stageId: number,
  score: number,
  completedQuestions: number = 10
) {
  const { rows } = await sql`
    INSERT INTO quiz_results (user_id, stage_id, score, completed_questions, finished, updated_at)
    VALUES (${userId}, ${stageId}, ${score}, ${completedQuestions}, TRUE, NOW())
    ON CONFLICT (user_id, stage_id) DO UPDATE SET
      score = GREATEST(quiz_results.score, EXCLUDED.score),
      completed_questions = EXCLUDED.completed_questions,
      finished = TRUE,
      updated_at = NOW()
    RETURNING *
  `;
  return rows[0];
}

export async function loadQuizResults(userId: number) {
  const { rows } = await sql`
    SELECT stage_id, score, completed_questions, finished
    FROM quiz_results
    WHERE user_id = ${userId}
    ORDER BY stage_id
  `;
  const results: Record<number, { score: number; completedQuestions: number; finished: boolean }> = {};
  for (const row of rows) {
    results[row.stage_id] = {
      score: row.score,
      completedQuestions: row.completed_questions,
      finished: row.finished,
    };
  }
  return results;
}
