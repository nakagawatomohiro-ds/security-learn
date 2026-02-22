// DSCSS ホーム画面
"use client";
import { useState, useEffect } from "react";
import { STAGES, STORAGE_KEY, POINTS_PER_CORRECT } from "../lib/questions";

interface StageProgress {
  completedQuestions: number;
  score: number;
  finished: boolean;
}

type Progress = Record<number, StageProgress>;

// ── ランク判定 ──
function getRank(totalPts: number) {
  if (totalPts >= 1000) return { label: "パーフェクト認定", color: "#7c3aed", icon: "👑" };
  if (totalPts >= 900) return { label: "クラウドマスター", color: "#dc2626", icon: "🏆" };
  if (totalPts >= 800) return { label: "セキュリティリーダー", color: "#2563eb", icon: "🛡️" };
  if (totalPts >= 400) return { label: "セキュリティ実践者", color: "#059669", icon: "📘" };
  if (totalPts > 0) return { label: "学習中", color: "#64748b", icon: "📖" };
  return { label: "未受講", color: "#94a3b8", icon: "—" };
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

  // ── アニメーション用 ──
  const pct = Math.min(100, Math.round((totalPoints / 1000) * 100));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
      }}
    >
      {/* ── ヘッダー ── */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
          padding: "0 20px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              DSCSS
            </span>
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
                letterSpacing: "0.3px",
                marginTop: 2,
              }}
            >
              DropStone Cloud Security Study
            </span>
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
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
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
                <p
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  完了ステージ
                </p>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#1e40af",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {mounted ? completedStages : "—"}
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>/5</span>
                </p>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  ランク
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: rank.color,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
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
                    ? "linear-gradient(90deg, #1e40af, #3b82f6)"
                    : "linear-gradient(90deg, #1e3a8a, #2563eb)",
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
          {STAGES.map((stage) => {
            const sp = progress[stage.id];
            const stagePts = sp ? sp.score * POINTS_PER_CORRECT : 0;
            const stageMax = stage.questions.length * POINTS_PER_CORRECT;
            const stagePct = sp ? Math.round((sp.score / stage.questions.length) * 100) : 0;
            const isFinished = sp?.finished ?? false;

            return (
              <a
                key={stage.id}
                href={`/quiz?stage=${stage.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  border: `1.5px solid ${isFinished ? stage.color + "40" : "#e2e8f0"}`,
                  borderRadius: 16,
                  padding: "18px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  display: "block",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
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
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        Stage {stage.id}｜{stage.name}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          margin: 0,
                          marginTop: 2,
                        }}
                      >
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
                          color: stagePct >= 80 ? "#16a34a" : "#94a3b8",
                          fontWeight: 600,
                          margin: 0,
                          marginTop: 2,
                        }}
                      >
                        {stagePct >= 80 ? "✓ 合格" : "再挑戦推奨"}
                      </p>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1e40af",
                        background: "#eff6ff",
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
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "20px 24px",
            marginTop: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { pts: "1,000pt", label: "パーフェクト認定", color: "#7c3aed", icon: "👑" },
              { pts: "900pt〜", label: "クラウドマスター", color: "#dc2626", icon: "🏆" },
              { pts: "800pt〜", label: "セキュリティリーダー", color: "#2563eb", icon: "🛡️" },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  background: r.color + "08",
                  borderRadius: 10,
                  border: `1px solid ${r.color}20`,
                }}
              >
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{r.pts}</span>
                </div>
              </div>
            ))}
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
            borderTop: "1px solid #e2e8f0",
            color: "#94a3b8",
            fontSize: 11,
          }}
        >
          <p style={{ margin: 0 }}>
            DSCSS — DropStone クラウドセキュリティ スタディ
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 10 }}>
            © DropStone Inc. クラウドで、全社哠のセキュリティ水準を引き上げる。
          </p>
        </footer>
      </main>
    </div>
  );
}
