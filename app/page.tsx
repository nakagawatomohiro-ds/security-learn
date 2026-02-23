// DSCSS ホーム画面（ロゴ＋グリーンテーマ版）
"use client";
import { useState, useEffect } from "react";
import { STAGES, STORAGE_KEY, POINTS_PER_CORRECT } from "../lib/questions";

interface StageProgress {
  completedQuestions: number;
  score: number;
  finished: boolean;
}

type Progress = Record<number, StageProgress>;

// ── ブランドカラー ──
const BRAND = {
  dark: "#0A2E1F",
  primary: "#14532D",
  medium: "#166534",
  accent: "#15803d",
  light: "#22c55e",
  bg: "#f0f7f3",
  bgCard: "#f0fdf4",
  border: "#d1e7dd",
};

// ── ランク判定 ──
const RANKS = [
  { min: 1000, label: "パーフェクト認定", color: "#7c3aed", icon: "👑", desc: "1,000pt" },
  { min: 900, label: "クラウドマスター", color: "#dc2626", icon: "🏆", desc: "900pt〜" },
  { min: 800, label: "セキュリティリーダー", color: "#166534", icon: "🛡️", desc: "800pt〜" },
  { min: 400, label: "セキュリティ実践者", color: "#059669", icon: "📘", desc: "400pt〜" },
  { min: 1, label: "学習中", color: "#64748b", icon: "📖", desc: "1pt〜" },
  { min: 0, label: "未受講", color: "#94a3b8", icon: "—", desc: "0pt" },
];

function getRank(totalPts: number) {
  return RANKS.find((r) => totalPts >= r.min) ?? RANKS[RANKS.length - 1];
}

// ── シールドロゴSVG ──
function ShieldLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L8 12V22C8 33.1 14.84 43.36 24 46C33.16 43.36 40 33.1 40 22V12L24 4Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M20 24L23 27L29 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
  }, []);

  // ── スコア計算 ──
  const totalPoints = Object.values(progress).reduce(
    (sum, p) => sum + (p.score ?? 0) * POINTS_PER_CORRECT,
    0
  );
  const completedStages = Object.values(progress).filter((p) => p.finished).length;
  const rank = getRank(totalPoints);
  const pct = Math.min(100, Math.round((totalPoints / 1000) * 100));

  // 次に挑戦すべきステージ
  const nextStage = STAGES.find((s) => !progress[s.id]?.finished);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BRAND.bg,
        fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
      }}
    >
      <style>{`
        .stage-card {
          transition: all 0.2s ease;
        }
        .stage-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
        }
        .rank-row-current {
          animation: rankPulse 2s ease-in-out infinite;
        }
        @keyframes rankPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.4s ease forwards; }
        .fade-in-d1 { animation: fadeInUp 0.4s ease 0.05s both; }
        .fade-in-d2 { animation: fadeInUp 0.4s ease 0.1s both; }
        .fade-in-d3 { animation: fadeInUp 0.4s ease 0.15s both; }
        .fade-in-d4 { animation: fadeInUp 0.4s ease 0.2s both; }
        .fade-in-d5 { animation: fadeInUp 0.4s ease 0.25s both; }
      `}</style>

      {/* ── ヘッダー ── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primary} 50%, ${BRAND.medium} 100%)`,
          padding: "0 20px",
          boxShadow: "0 2px 20px rgba(10,46,31,0.3)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldLogo size={32} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", lineHeight: 1.1 }}>
                DSCSS
              </span>
              <span
                style={{
                  fontSize: 8.5,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                DropStone Cloud Security Study
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "6px 14px",
            }}
          >
            <span style={{ fontSize: 16 }}>{rank.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{rank.label}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 60px" }}>
        {/* ── スコアサマリー ── */}
        <div
          className="fade-in"
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {/* 左：年間スコア */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: 4,
                }}
              >
                年間スコア
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {mounted ? totalPoints : "—"}
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>
                  / 1,000 pt
                </span>
              </div>
            </div>

            {/* 右：ステータス */}
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                  完了ステージ
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, color: BRAND.medium, margin: 0, lineHeight: 1 }}>
                  {mounted ? completedStages : "—"}
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>/5</span>
                </p>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                  ランク
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: rank.color, margin: 0, lineHeight: 1.3 }}>
                  {rank.icon} {mounted ? rank.label : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div
            style={{
              background: "#e2e8f0",
              borderRadius: 8,
              height: 10,
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: mounted ? `${pct}%` : "0%",
                height: "100%",
                background:
                  pct >= 100
                    ? "linear-gradient(90deg, #7c3aed, #a855f7)"
                    : pct >= 80
                    ? `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})`
                    : `linear-gradient(90deg, ${BRAND.dark}, ${BRAND.medium})`,
                borderRadius: 8,
                transition: "width 1s ease",
              }}
            />
          </div>

          {/* ランク目安 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 10,
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            <span>0</span>
            <span>800 リーダー</span>
            <span>900 マスター</span>
            <span>1,000</span>
          </div>
        </div>

        {/* ── おすすめ案内 ── */}
        {mounted && nextStage && (
          <a
            href={`/quiz?stage=${nextStage.id}`}
            className="stage-card fade-in-d1"
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              background: `linear-gradient(135deg, ${nextStage.color}10, ${nextStage.color}05)`,
              border: `1.5px solid ${nextStage.color}30`,
              borderRadius: 14,
              padding: "14px 20px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{nextStage.emoji}</span>
                <div>
                  <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600, margin: 0, marginBottom: 2 }}>
                    {completedStages === 0 ? "まずはここから！" : "次のステージ"}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Stage {nextStage.id}｜{nextStage.name}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: nextStage.color,
                  background: nextStage.color + "14",
                  padding: "6px 14px",
                  borderRadius: 8,
                }}
              >
                挑戦する →
              </span>
            </div>
          </a>
        )}

        {/* ── ステージ一覧 ── */}
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#374151",
            marginBottom: 14,
            paddingLeft: 4,
          }}
        >
          ステージ一覧
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STAGES.map((stage, idx) => {
            const sp = progress[stage.id];
            const stagePts = sp ? sp.score * POINTS_PER_CORRECT : 0;
            const stageMax = stage.questions.length * POINTS_PER_CORRECT;
            const stagePct = sp ? Math.round((sp.score / stage.questions.length) * 100) : 0;
            const isFinished = sp?.finished ?? false;

            return (
              <a
                key={stage.id}
                href={`/quiz?stage=${stage.id}`}
                className={`stage-card fade-in-d${Math.min(idx + 1, 5)}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  border: `1.5px solid ${isFinished ? stage.color + "40" : BRAND.border}`,
                  borderRadius: 16,
                  padding: "18px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "block",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isFinished ? 10 : 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: stage.color + "14",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {stage.emoji}
                    </span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Stage {stage.id}｜{stage.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, marginTop: 2 }}>
                        {stage.subtitle} — {stage.purpose}
                      </p>
                    </div>
                  </div>

                  {/* スコアバッジ */}
                  {isFinished ? (
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: stage.color,
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {stagePts}
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>
                          /{stageMax}pt
                        </span>
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: stagePct >= 80 ? "#16a34a" : "#f59e0b",
                          fontWeight: 600,
                          margin: 0,
                          marginTop: 2,
                        }}
                      >
                        {stagePct >= 80 ? "✓ 合格" : "⚠ 再挑戦推奨"}
                      </p>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: BRAND.medium,
                        background: BRAND.bgCard,
                        padding: "6px 14px",
                        borderRadius: 8,
                      }}
                    >
                      挑戦する →
                    </span>
                  )}
                </div>

                {/* ステージ内プログレスバー */}
                {isFinished && (
                  <div
                    style={{
                      background: "#f1f5f9",
                      borderRadius: 6,
                      height: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${stagePct}%`,
                        height: "100%",
                        background: stage.color,
                        borderRadius: 6,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* ── ランク説明 ── */}
        <div
          className="fade-in-d5"
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "20px 24px",
            marginTop: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 14,
            }}
          >
            年間1,000点満点評価制度
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {RANKS.filter((r) => r.min > 0).map((r) => {
              const isCurrent = mounted && rank.label === r.label;
              return (
                <div
                  key={r.label}
                  className={isCurrent ? "rank-row-current" : ""}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    background: isCurrent ? r.color + "14" : r.color + "06",
                    borderRadius: 10,
                    border: `1.5px solid ${isCurrent ? r.color + "40" : r.color + "15"}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.label}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{r.desc}</span>
                  </div>
                  {isCurrent && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: r.color + "18", padding: "2px 8px", borderRadius: 6 }}>
                      現在
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── データリセット ── */}
        {mounted && totalPoints > 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => {
                if (confirm("学習データをリセットしますか？この操作は取り消せません。")) {
                  localStorage.removeItem(STORAGE_KEY);
                  setProgress({});
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              学習データをリセット
            </button>
          </div>
        )}

        {/* ── フッター ── */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 32,
            paddingTop: 20,
            borderTop: `1px solid ${BRAND.border}`,
            color: "#94a3b8",
            fontSize: 11,
          }}
        >
          <p style={{ margin: 0 }}>
            DSCSS — DropStone クラウドセキュリティ スタディ
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 10 }}>
            © DropStone Inc. クラウドで、全社員のセキュリティ水準を引き上げる。
          </p>
        </footer>
      </main>
    </div>
  );
}
