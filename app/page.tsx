"use client";
import { useState } from "react";

const stages = [
  {
    id: 1,
    title: "基礎知識",
    description: "パスワード管理・フィッシング詐欺・不審メール対応",
    icon: "🔑",
    totalQuestions: 10,
    completedQuestions: 10,
    status: "completed",
    xp: 200,
    badge: "セキュリティ入門者",
  },
  {
    id: 2,
    title: "社内ルール",
    description: "情報持ち出し・クラウド利用・アクセス権限管理",
    icon: "📋",
    totalQuestions: 10,
    completedQuestions: 6,
    status: "in_progress",
    xp: 0,
    badge: "社内ルール遵守者",
  },
  {
    id: 3,
    title: "インシデント対応",
    description: "情報漏えい発生時の対応・報告フロー・初動対応",
    icon: "🚨",
    totalQuestions: 10,
    completedQuestions: 0,
    status: "locked",
    xp: 0,
    badge: "危機対応エキスパート",
  },
  {
    id: 4,
    title: "上級者コース",
    description: "標的型攻撃・ソーシャルエンジニアリング・ゼロトラスト",
    icon: "⚡",
    totalQuestions: 15,
    completedQuestions: 0,
    status: "locked",
    xp: 0,
    badge: "セキュリティ戦士",
  },
];

const userStats = {
  name: "田中 太郎",
  department: "営業部",
  level: 3,
  xp: 740,
  nextLevelXp: 1000,
  streak: 5,
  totalBadges: 1,
};

function XPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.round((current / max) * 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>次のレベルまで</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>{current} / {max} XP</span>
      </div>
      <div style={{ background: "#e2e8f0", borderRadius: 8, height: 8, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #1e40af, #3b82f6)",
            borderRadius: 8,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function StageCard({ stage, index }) {
  const [hovered, setHovered] = useState(false);
  const pct = Math.round((stage.completedQuestions / stage.totalQuestions) * 100);

  const statusConfig = {
    completed: { label: "完了", color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
    in_progress: { label: "進行中", color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
    locked: { label: "ロック中", color: "#94a3b8", bg: "#f1f5f9", border: "#e2e8f0" },
  };

  const cfg = statusConfig[stage.status];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        border: `1.5px solid ${hovered && stage.status !== "locked" ? cfg.border : "#e2e8f0"}`,
        borderRadius: 12,
        padding: "24px",
        cursor: stage.status === "locked" ? "not-allowed" : "pointer",
        opacity: stage.status === "locked" ? 0.6 : 1,
        transform: hovered && stage.status !== "locked" ? "translateY(-2px)" : "none",
        boxShadow: hovered && stage.status !== "locked"
          ? "0 8px 24px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        animationDelay: `${index * 80}ms`,
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48,
          background: cfg.bg,
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          {stage.status === "locked" ? "🔒" : stage.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
              STAGE {stage.id}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: cfg.color, background: cfg.bg,
              padding: "2px 8px", borderRadius: 20,
            }}>
              {cfg.label}
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            {stage.title}
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 }}>
            {stage.description}
          </p>

          {/* Progress */}
          {stage.status !== "locked" && (
            <div>
              <div style={{ background: "#f1f5f9", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 6 }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: stage.status === "completed"
                    ? "linear-gradient(90deg, #16a34a, #4ade80)"
                    : "linear-gradient(90deg, #1e40af, #3b82f6)",
                  borderRadius: 6,
                  transition: "width 0.8s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {stage.completedQuestions} / {stage.totalQuestions} 問
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>
                  {pct}%
                </span>
              </div>
            </div>
          )}

          {stage.status === "locked" && (
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
              前のステージをクリアするとアンロックされます
            </p>
          )}
        </div>

        {/* Arrow */}
        {stage.status !== "locked" && (
          <div style={{ color: "#cbd5e1", fontSize: 18, alignSelf: "center" }}>›</div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "#1e40af",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 16,
            }}>🛡️</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              SecureLearn
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>🔥 {userStats.streak}日連続</span>
            <div style={{
              width: 34, height: 34,
              background: "#1e40af",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              {userStats.name[0]}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* User Card */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 14,
          padding: "24px",
          marginBottom: 32,
          animation: "fadeUp 0.4s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52,
              background: "#1e40af",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 20, fontWeight: 700,
            }}>
              {userStats.name[0]}
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>{userStats.department}</p>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{userStats.name}</h2>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#dbeafe", color: "#1e40af",
                padding: "4px 12px", borderRadius: 20, marginBottom: 4,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Lv.{userStats.level}</span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>🏅 {userStats.totalBadges} バッジ獲得</p>
            </div>
          </div>
          <XPBar current={userStats.xp} max={userStats.nextLevelXp} />
        </div>

        {/* Section heading */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
            学習ステージ
          </h2>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            順番にクリアしてセキュリティ知識を習得しましょう
          </p>
        </div>

        {/* Stage List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stages.map((stage, i) => (
            <StageCard key={stage.id} stage={stage} index={i} />
          ))}
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12, marginTop: 32,
          animation: "fadeUp 0.5s ease both",
          animationDelay: "0.3s",
        }}>
          {[
            { label: "完了ステージ", value: "1 / 4", icon: "✅" },
            { label: "総獲得XP", value: "740 XP", icon: "⭐" },
            { label: "連続学習", value: "5日", icon: "🔥" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "16px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0 env(safe-area-inset-bottom)",
      }}>
        {[
          { icon: "🏠", label: "ホーム", active: true },
          { icon: "📊", label: "ランキング", active: false },
          { icon: "🏅", label: "バッジ", active: false },
          { icon: "👤", label: "マイページ", active: false },
        ].map((item) => (
          <button key={item.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: "none", border: "none", cursor: "pointer", padding: "4px 12px",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: item.active ? 700 : 400,
              color: item.active ? "#1e40af" : "#94a3b8",
            }}>
              {item.label}
            </span>
            {item.active && (
              <div style={{ width: 4, height: 4, background: "#1e40af", borderRadius: "50%" }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}