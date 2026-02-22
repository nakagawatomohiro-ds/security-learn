// DSCSS クイズページ（全5ステージ対応）
"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { STAGES, STORAGE_KEY, POINTS_PER_CORRECT } from "../../lib/questions";

function QuizContent() {
  const searchParams = useSearchParams();
  const stageNum = Math.min(5, Math.max(1, Number(searchParams.get("stage") ?? "1")));
  const stage = STAGES.find((s) => s.id === stageNum) ?? STAGES[0];
  const questions = stage.questions;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const progressPct = Math.round((current / questions.length) * 100);

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === q.correct) setScore((s) => s + 1);
    setShowResult(true);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      // 最終問題の正否を反映
      const finalScore = score + (selected === q.correct ? 0 : 0);
      // score は既に handleSelect で更新済み
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const prog = raw ? JSON.parse(raw) : {};
      prog[stageNum] = {
        completedQuestions: questions.length,
        score: score,
        finished: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  // ── 結果画面 ──
  if (finished) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    const pts = finalScore * POINTS_PER_CORRECT;
    const maxPts = questions.length * POINTS_PER_CORRECT;
    const message =
      pct >= 80 ? "素晴らしい結果です！" : pct >= 60 ? "もう少しで合格です！" : "もう一度復習しましょう";
    const resultColor = pct >= 80 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#ef4444";
    const resultEmoji = pct >= 80 ? "🎉" : pct >= 60 ? "💪" : "📖";

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f4f8",
          fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
            padding: "0 20px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              height: 60,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <a
              href="/"
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
            >
              ← ホーム
            </a>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {stage.emoji} Stage {stage.id}: {stage.name}
            </span>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
          }}
        >
          <div
            style={{
              background: "#fff",
               borderRadius: 20,
              padding: "32px 28px",
              maxWidth: 460,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: resultColor + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 16px",
              }}
            >
              {resultEmoji}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              {message}
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>
              {questions.length}問中{" "}
              <strong style={{ color: "#0f172a" }}>{finalScore}問</strong> 正解
            </p>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "18px 20px",
                marginBottom: 22,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      fontWeight: 600,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    正解率
                  </p>
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: resultColor,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {pct}%
                  </p>
                </div>
                <div style={{ width: 1, background: "#e2e8f0" }} />
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      fontWeight: 600,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    獲得ポイント
                  
</p>
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#1e40af",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {pts}
                    <span style={{ fontSize: 14, fontWeight: 600 }}>/{maxPts}pt</span>
                  </p>
                </div>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: 8, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: resultColor,
                    borderRadius: 8,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>

            <a
              href="/"
              style={{
                display: "block",
                background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 12,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 10,
                boxShadow: "0 4px 12px rgba(30,64,175,0.3)",
              }}
            >
              ← ホームに戻る
            </a>
            <button
              onClick={() => {
                setCurrent(0);
                setSelected(null);
                setShowResult(false);
                setScore(0);
                setFinished(false);
              }}
              style={{
                background: "#f1f5f9",
                color: "#374151",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
            >
              もう一度挑戦する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── クイズ画面 ──
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/"
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
            >
              ← 戻る
            </a>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {stage.emoji} Stage {stage.id}: {stage.name}
            </span>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            {current + 1} / {questions.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ background: "rgba(30,58,138,0.12)", height: 4 }}>
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: stage.color,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
        {/* Question card */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 16,
            padding: "20px 22px",
            marginBottom: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: stage.color,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 10,
            }}
          >
            問題 {current + 1}
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", lineHeight: 1.65, margin: 0 }}>
            {q.question}
          </p>
        </div>

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {q.choices.map((choice, i) => {
            let bg = "#fff",
              border = "#e2e8f0",
              color = "#0f172a";
            let badgeBg = "#f1f5f9";
            if (selected !== null) {
              if (i === q.correct) {
                bg = "#f0fdf4";
                border = "#16a34a";
                color = "#15803d";
                badgeBg = "#dcfce7";
              } else if (i === selected && selected !== q.correct) {
                bg = "#fff5f5";
                border = "#ef4444";
                color = "#dc2626";
                badgeBg = "#fee2e2";
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  textAlign: "left",
                  cursor: selected !== null ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  fontSize: 14,
                  color,
                  fontWeight:
                    selected !== null && (i === q.correct || i === selected) ? 600 : 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: badgeBg,
                    border: `1.5px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {selected !== null && i === q.correct
                    ? "○"
                    : selected !== null && i === selected && selected !== q.correct
                    ? "✕"
                    : ["A", "B", "C", "D"][i]}
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div
            style={{
              background: selected === q.correct ? "#f0fdf4" : "#fff5f5",
              border: `1.5px solid ${selected === q.correct ? "#86efac" : "#fca5a5"}`,
              borderRadius: 12,
              padding: "16px 18px",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: selected === q.correct ? "#16a34a" : "#dc2626",
                marginBottom: 6,
              }}
            >
              {selected === q.correct ? "✓ 正解！" : "✕ 不正解"}
            </p>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, margin: 0 }}>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 12px rgba(30,64,175,0.3)",
            }}
          >
            {current + 1 >= questions.length ? "結果を見る →" : "次の問題へ →"}
          </button>
        )}
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontSize: 16,
            color: "#64748b",
            background: "#f0f4f8",
          }}
        >
          読み込み中...
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
