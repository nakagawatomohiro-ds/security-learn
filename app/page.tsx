// SecureLearn Home
"use client";
import { useState, useEffect } from "react";

type StageStatus = "completed" | "in_progress" | "locked";

interface Stage {
    id: number;
    title: string;
    description: string;
    totalQuestions: number;
    completedQuestions: number;
    status: StageStatus;
}

const stageDefaults = [
  { id: 1, title: "Stage 1: 基礎知識", description: "パスワード管理・フィッシング詐欺・不審メール対応", totalQuestions: 10, quizPath: "/quiz?stage=1" },
  { id: 2, title: "Stage 2: 社内ルール", description: "情報持ち出し・クラウド利用・アクセス権限管理", totalQuestions: 10, quizPath: "/quiz?stage=2" },
  { id: 3, title: "Stage 3: インシデント対応", description: "情報漏えい発生時の対応・報告フロー・初動対応", totalQuestions: 10, quizPath: "/quiz?stage=3" },
  { id: 4, title: "Stage 4: 上級者コース", description: "標的型攻撃・ソーシャルエンジニアリング・ゼロトラスト", totalQuestions: 15, quizPath: "/quiz?stage=4" },
  ];

const STORAGE_KEY = "securelearn_progress";

interface ProgressData {
    [stageId: number]: { completedQuestions: number; score: number; finished: boolean };
}

function buildStages(progress: ProgressData): Stage[] {
    return stageDefaults.map((def, idx) => {
          const p = progress[def.id];
          const completedQuestions = p?.completedQuestions ?? 0;
          const finished = p?.finished ?? false;
          let status: StageStatus;
          if (finished && completedQuestions >= def.totalQuestions) {
                  status = "completed";
          } else if (idx === 0) {
                  status = "in_progress";
          } else {
                  const prevDef = stageDefaults[idx - 1];
                  const prevFinished = progress[prevDef.id]?.finished ?? false;
                  if (prevFinished) {
                            status = finished ? "completed" : "in_progress";
                  } else {
                            status = "locked";
                  }
          }
          return { ...def, completedQuestions, status };
    });
}

function StageCard({ stage, quizPath }: { stage: Stage; quizPath: string }) {
    const [hovered, setHovered] = useState(false);
    const pct = Math.round((stage.completedQuestions / stage.totalQuestions) * 100);
    const colors = { completed: "#16a34a", in_progress: "#1e40af", locked: "#94a3b8" };
    const labels = { completed: "完了", in_progress: "進行中", locked: "ロック中" };
    const color = colors[stage.status];
    return (
          <div
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{ background: "#fff", border: `1.5px solid ${hovered ? color : "#e2e8f0"}`, borderRadius: 12, padding: 24, opacity: stage.status === "locked" ? 0.6 : 1, transform: hovered && stage.status !== "locked" ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s ease", cursor: stage.status === "locked" ? "not-allowed" : "pointer" }}
                  onClick={() => { if (stage.status !== "locked") window.location.href = quizPath; }}
                >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{stage.title}</h3>h3>
                        <span style={{ fontSize: 11, fontWeight: 600, color, background: color + "20", padding: "2px 10px", borderRadius: 20 }}>{labels[stage.status]}</span>span>
                </div>div>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{stage.description}</p>p>
            {stage.status !== "locked" && (
                          <div>
                                    <div style={{ background: "#f1f5f9", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 4 }}>
                                                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.8s ease" }} />
                                    </div>div>
                                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{stage.completedQuestions} / {stage.totalQuestions} 問 ({pct}%)</span>span>
                          </div>div>
                )}
            {stage.status === "locked" && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>前のステージをクリアするとアンロックされます</p>p>}
          </div>div>
        );
}

export default function App() {
    const [stages, setStages] = useState<Stage[]>([]);
    useEffect(() => {
          const raw = localStorage.getItem(STORAGE_KEY);
          const progress: ProgressData = raw ? JSON.parse(raw) : {};
          setStages(buildStages(progress));
          const onStorage = (e: StorageEvent) => {
                  if (e.key === STORAGE_KEY) {
                            const updated: ProgressData = e.newValue ? JSON.parse(e.newValue) : {};
                            setStages(buildStages(updated));
                  }
          };
          window.addEventListener("storage", onStorage);
          return () => window.removeEventListener("storage", onStorage);
    }, []);
    return (
          <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
                <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
                        <div style={{ maxWidth: 720, margin: "0 auto", height: 60, display: "flex", alignItems: "center" }}>
                                  <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>SecureLearn</span>span>
                        </div>div>
                </header>header>
                <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>学習ステージ</h2>h2>
                        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>順番にクリアしてセキュリティ知識を習得しましょう</p>p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {stages.map((stage, idx) => <StageCard key={stage.id} stage={stage} quizPath={stageDefaults[idx].quizPath} />)}
                        </div>div>
                </main>main>
          </div>div>
        );
}</div>
