// DS クラウドセキュリティサービス - Home
"use client";
import { useState, useEffect } from "react";

type StageStatus = "completed" | "in_progress" | "locked";

const STORAGE_KEY = "securelearn_progress";
const POINTS_PER_CORRECT = 20;

interface ProgressData {
  [stageId: number]: { completedQuestions: number; score: number; finished: boolean };
}

const stageDefaults = [
  { id: 1, title: "Stage 1", name: "基礎知識", topics: ["パスワード管理", "フィッシング対策", "不審メール対応"], totalQuestions: 10, quizPath: "/quiz?stage=1", color: "#16a34a", emoji: "🟢", purpose: "ヒューマンエラーの削減" },
  { id: 2, title: "Stage 2", name: "社内ルール理解", topics: ["情報持ち出し基準", "クラウド利用ルール", "アクセス権管理"], totalQuestions: 10, quizPath: "/quiz?stage=2", color: "#ca8a04", emoji: "🟡", purpose: "内部事故の防止" },
  { id: 3, title: "Stage 3", name: "実践対応力", topics: ["標的型攻撃メール対応", "ランサムウェア初動", "報告フロー"], totalQuestions: 10, quizPath: "/quiz?stage=3", color: "#ea580c", emoji: "🟠", purpose: "初動対応の迅速化" },
  { id: 4, title: "Stage 4", name: "経営リスク管理", topics: ["損害額シミュレーション", "法的責任", "ゼロトラスト概念"], totalQuestions: 10, quizPath: "/quiz?stage=4", color: "#dc2626", emoji: "🔴", purpose: "経営判断レベルでの理解" },
  { id: 5, title: "Stage 5", name: "上級者コース", topics: ["サプライチェーン攻撃", "AI悪用リスク", "内部不正対策"], totalQuestions: 10, quizPath: "/quiz?stage=5", color: "#374151", emoji: "⚫", purpose: "社内セキュリティリーダー育成" },
];

function getTier(score: number) {
  if (score >= 1000) return { label: "パーフェクト認定", color: "#f59e0b", icon: "🏆" };
  if (score >= 900) return { label: "クラウドマスター", color: "#7c3aed", icon: "⭐" };
  if (score >= 800) return { label: "セキュリティリーダー", color: "#1e40af", icon: "🛡️" };
  return { label: "学習中", color: "#64748b", icon: "📚" };
}

function buildStages(progress: ProgressData) {
  return stageDefaults.map((def, idx) => {
    const p = progress[def.id];
    const completedQuestions = p?.completedQuestions ?? 0;
    const finished = p?.finished ?? false;
    let status: StageStatus;
    if (finished) status = "completed";
    else if (idx === 0) status = "in_progress";
    else status = (progress[stageDefaults[idx - 1].id]?.finished ?? false) ? "in_progress" : "locked";
    return { ...def, completedQuestions, status };
  });
}

export default function App() {
  const [stages, setStages] = useState<ReturnType<typeof buildStages>>([]);
  const [totalScore, setTotalScore] = useState(0);

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const progress: ProgressData = raw ? JSON.parse(raw) : {};
    setStages(buildStages(progress));
    const pts = Object.values(progress).reduce((s, p) => s + (p.score ?? 0), 0) * POINTS_PER_CORRECT;
    setTotalScore(pts);
  }

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tier = getTier(totalScore);
  const scorePct = Math.min(100, Math.round((totalScore / 1000) * 100));
  const completedStages = stages.filter(s => s.status === "completed").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif" }}>

      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", padding: "0 20px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2 }}>DSクラウドセキュリティ</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>Security Learning Platform</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{tier.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{totalScore} pt</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "20px 14px 80px" }}>

        {/* Score Card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>年間累積スコア</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{totalScore}</span>
                <span style={{ fontSize: 15, color: "#94a3b8", fontWeight: 500 }}> / 1,000 pt</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ background: tier.color + "18", border: `1.5px solid ${tier.color}60`, borderRadius: 20, padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15 }}>{tier.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: tier.color }}>{tier.label}</span>
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>{completedStages} / 5 ステージ完了</p>
            </div>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${scorePct}%`, height: "100%", background: "linear-gradient(90deg, #1e40af, #60a5fa)", borderRadius: 8, transition: "width 1.2s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 600 }}>0 pt</span>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ s: 800, label: "リーダー" }, { s: 900, label: "マスター" }, { s: 1000, label: "完璧" }].map(t => (
                <span key={t.s} style={{ fontSize: 10, color: totalScore >= t.s ? "#1e40af" : "#cbd5e1", fontWeight: 700 }}>
                  {t.s}pt {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stages label */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
          学習ステージ — 順番にクリアして知識を積み上げましょう
        </p>

        {/* Stage cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stages.map((stage) => {
            const pct = Math.round((stage.completedQuestions / stage.totalQuestions) * 100);
            const isLocked = stage.status === "locked";
            const isDone = stage.status === "completed";
            return (
              <div
                key={stage.id}
                onClick={() => { if (!isLocked) window.location.href = stage.quizPath; }}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: `1.5px solid ${isDone ? stage.color + "50" : isLocked ? "#e8ecf0" : stage.color + "40"}`,
                  opacity: isLocked ? 0.5 : 1,
                  cursor: isLocked ? "not-allowed" : "pointer",
                  boxShadow: isDone ? `0 2px 12px ${stage.color}18` : "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isDone && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${stage.color}, ${stage.color}66)` }} />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isLocked ? "#f1f5f9" : stage.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {isLocked ? "🔒" : stage.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isLocked ? "#94a3b8" : stage.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {stage.title} · {stage.purpose}
                        </span>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: isLocked ? "#94a3b8" : "#0f172a", margin: "2px 0 3px" }}>{stage.name}</h3>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{stage.topics.join(" · ")}</p>
                      </div>
                      <div style={{ flexShrink: 0, marginLeft: 10 }}>
                        {isDone ? (
                          <span style={{ background: stage.color + "18", border: `1.5px solid ${stage.color}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: stage.color }}>✓ 完了</span>
                        ) : isLocked ? (
                          <span style={{ background: "#f1f5f9", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>🔒 ロック中</span>
                        ) : (
                          <span style={{ background: "#1e40af18", border: "1.5px solid #1e40af60", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#1e40af" }}>進行中 →</span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{stage.completedQuestions} / {stage.totalQuestions} 問</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: isDone ? stage.color : "#64748b" }}>{pct}%</span>
                        </div>
                        <div style={{ background: "#f1f5f9", borderRadius: 6, height: 5, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: stage.color, borderRadius: 6, transition: "width 0.8s ease" }} />
                        </div>
                      </div>
                    )}
                    {isLocked && (
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>前のステージを完了するとアンロックされます</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature pills */}
        <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { icon: "☁️", text: "クラウド型SaaS" },
            { icon: "🔄", text: "年次アップデート" },
            { icon: "📊", text: "1,000点満点制度" },
            { icon: "🏆", text: "認定バッジ制度" },
          ].map(item => (
            <div key={item.text} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              <span>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
