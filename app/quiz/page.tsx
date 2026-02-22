// DS クラウドセキュリティサービス - Quiz
"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "安全なパスワードとして最も適切なものはどれですか？",
    choices: [
      "自分の誕生日（例：19900101）",
      "12文字以上の英数字と記号の組み合わせ",
      "会社名と入社年度の組み合わせ",
      "覚えやすいように同じ文字を並べたもの",
    ],
    correct: 1,
    explanation: "安全なパスワードは12文字以上で、英大文字・小文字・数字・記号を組み合わせたものが推奨されます。誕生日や会社名など推測されやすい情報は避けましょう。",
  },
  {
    id: 2,
    question: "フィッシングメールの特徴として正しいものはどれですか？",
    choices: [
      "送信者のメールアドレスが必ず公式ドメインになっている",
      "日本語が完全に正確で不自然な点がない",
      "緊急性を煽り、リンクのクリックや個人情報の入力を求める",
      "添付ファイルは絶対に含まれていない",
    ],
    correct: 2,
    explanation: "フィッシングメールは「今すぐ対応が必要」など緊急性を煽り、偽サイトへ誘導して個人情報を盗もうとします。不審なリンクはクリックしないようにしましょう。",
  },
  {
    id: 3,
    question: "不審なメールを受信した場合、最初にすべき行動はどれですか？",
    choices: [
      "記載されたリンクをクリックして内容を確認する",
      "添付ファイルを開いて詳細を確認する",
      "メールを開かずに削除する、または情報システム部門に報告する",
      "同僚に転送して意見を聞く",
    ],
    correct: 2,
    explanation: "不審なメールはリンクや添付ファイルを開かず、情報システム部門に報告するのが正しい対応です。同僚への転送もウイルス拡散につながる可能性があります。",
  },
  {
    id: 4,
    question: "パスワードの管理方法として最も安全なものはどれですか？",
    choices: [
      "全サービスで同じパスワードを使い回す",
      "パスワードをメモ帳に書いてPCのモニターに貼る",
      "パスワード管理ツールを使い、サービスごとに異なるパスワードを設定する",
      "パスワードをメールの下書きに保存しておく",
    ],
    correct: 2,
    explanation: "パスワード管理ツール（1Password、Bitwardenなど）を使い、サービスごとに異なる強力なパスワードを設定するのが最も安全です。使い回しは一つが漏れると全て危険になります。",
  },
  {
    id: 5,
    question: "多要素認証（MFA）とは何ですか？",
    choices: [
      "パスワードを複数回入力する認証方式",
      "パスワードに加えてSMSコードや認証アプリなど複数の方法で本人確認する方式",
      "複数の管理者が承認する認証方式",
      "生体認証のみを使った認証方式",
    ],
    correct: 1,
    explanation: "多要素認証は「知識（パスワード）」「所持（スマホ）」「生体（指紋）」など複数の要素を組み合わせた認証方式です。パスワードが漏れても不正アクセスを防げます。",
  },
  {
    id: 6,
    question: "公共のWi-Fiを使用する際のリスクとして正しいものはどれですか？",
    choices: [
      "通信速度が遅くなる可能性があるだけで、セキュリティリスクはない",
      "通信内容を第三者に傍受される可能性がある",
      "会社のVPNを使えば完全に安全である",
      "HTTPSサイトにアクセスすれば何も問題ない",
    ],
    correct: 1,
    explanation: "公共Wi-Fiは暗号化されていない場合が多く、通信内容が傍受されるリスクがあります。業務利用時は会社のVPNを必ず使用し、重要な操作は避けましょう。",
  },
  {
    id: 7,
    question: "PCをその場に置いたまま離席する際に行うべき最も適切な対応はどれですか？",
    choices: [
      "特に何もしなくてよい",
      "ブラウザのウィンドウを最小化する",
      "画面ロック（Windowsキー+L）をかける",
      "電源を切る",
    ],
    correct: 2,
    explanation: "離席時は必ず画面ロックをかけましょう。Windowsは「Windowsキー+L」で即座にロックできます。電源を切ると作業中のデータが失われる場合があります。",
  },
  {
    id: 8,
    question: "ソーシャルエンジニアリングとは何ですか？",
    choices: [
      "SNSを使ったマーケティング手法",
      "人間の心理や行動を悪用して情報を騙し取る攻撃手法",
      "社内SNSを使った情報共有の仕組み",
      "エンジニア採用のためのSNS活用法",
    ],
    correct: 1,
    explanation: "ソーシャルエンジニアリングは技術ではなく人間の心理（信頼・恐怖・親切心）を悪用して機密情報を入手する攻撃です。電話やなりすましメールなどが典型例です。",
  },
  {
    id: 9,
    question: "パスワードを忘れた同僚から「ログインを手伝って」と頼まれました。どうすべきですか？",
    choices: [
      "同僚を信頼して自分のIDとパスワードを教える",
      "自分のIDでログインして同僚に作業させる",
      "断り、情報システム部門にパスワードリセットを依頼するよう伝える",
      "同僚のパスワードを推測して一緒に試す",
    ],
    correct: 2,
    explanation: "IDとパスワードは絶対に他人と共有してはいけません。本人が情報システム部門にパスワードリセットを依頼するのが正しい手順です。善意の行動でも規則違反になります。",
  },
  {
    id: 10,
    question: "メールに添付されたファイルを開く前に確認すべきことはどれですか？",
    choices: [
      "ファイルのサイズ",
      "送信者のアドレス・件名・ファイルの拡張子が不審でないか",
      "メールの受信時刻",
      "CCに誰が入っているか",
    ],
    correct: 1,
    explanation: "添付ファイルを開く前に、送信者アドレスが正規のものか、件名が自然か、拡張子が二重になっていないか（例：report.pdf.exe）を必ず確認しましょう。",
  },
];

const STORAGE_KEY = "securelearn_progress";
const POINTS_PER_CORRECT = 20;

const STAGE_INFO: Record<number, { name: string; color: string; emoji: string }> = {
  1: { name: "基礎知識", color: "#16a34a", emoji: "🟢" },
  2: { name: "社内ルール理解", color: "#ca8a04", emoji: "🟡" },
  3: { name: "実践対応力", color: "#ea580c", emoji: "🟠" },
  4: { name: "経営リスク管理", color: "#dc2626", emoji: "🔴" },
  5: { name: "上級者コース", color: "#374151", emoji: "⚫" },
};

function QuizContent() {
  const searchParams = useSearchParams();
  const stageNum = Math.min(5, Math.max(1, Number(searchParams.get("stage") ?? "1")));
  const stageInfo = STAGE_INFO[stageNum];

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
      // score is already updated from handleSelect (previous render cycle)
      const finalScore = score + (selected === q.correct ? 1 : 0);
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const prog = raw ? JSON.parse(raw) : {};
      prog[stageNum] = { completedQuestions: questions.length, score: finalScore, finished: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  if (finished) {
    const finalScore = score + (selected === q.correct ? 1 : 0);
    const pct = Math.round((finalScore / questions.length) * 100);
    const pts = finalScore * POINTS_PER_CORRECT;
    const message = pct >= 80 ? "素晴らしい結果です！" : pct >= 60 ? "もう少しで合格です！" : "もう一度復習しましょう";
    const resultColor = pct >= 80 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#ef4444";
    const resultEmoji = pct >= 80 ? "🎉" : pct >= 60 ? "💪" : "📖";

    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif", display: "flex", flexDirection: "column" }}>
        <header style={{ background: "linear-gradient(135deg, #1e3a8a, #1e40af)", padding: "0 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(255,255,255,0.12)", borderRadius: 8 }}>← ホーム</a>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{stageInfo.emoji} Stage {stageNum}: {stageInfo.name}</span>
          </div>
        </header>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: resultColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>
              {resultEmoji}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{message}</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>
              {questions.length}問中 <strong style={{ color: "#0f172a" }}>{finalScore}問</strong> 正解
            </p>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>正解率</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: resultColor, margin: 0, lineHeight: 1 }}>{pct}%</p>
                </div>
                <div style={{ width: 1, background: "#e2e8f0" }} />
                <div>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>獲得ポイント</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: "#1e40af", margin: 0, lineHeight: 1 }}>{pts}<span style={{ fontSize: 14, fontWeight: 600 }}>pt</span></p>
                </div>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: 8, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: resultColor, borderRadius: 8, transition: "width 1s ease" }} />
              </div>
            </div>

            <a
              href="/"
              style={{ display: "block", background: "linear-gradient(135deg, #1e3a8a, #1e40af)", color: "#fff", textDecoration: "none", borderRadius: 12, padding: "13px 24px", fontSize: 14, fontWeight: 700, marginBottom: 10, boxShadow: "0 4px 12px rgba(30,64,175,0.3)" }}
            >
              ← ホームに戻る
            </a>
            <button
              onClick={() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false); }}
              style={{ background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}
            >
              もう一度挑戦する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #1e3a8a, #1e40af)", padding: "0 20px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(255,255,255,0.12)", borderRadius: 8 }}>
              ← 戻る
            </a>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{stageInfo.emoji} Stage {stageNum}: {stageInfo.name}</span>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{current + 1} / {questions.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ background: "rgba(30,58,138,0.12)", height: 4 }}>
        <div style={{ width: `${progressPct}%`, height: "100%", background: stageInfo.color, transition: "width 0.4s ease" }} />
      </div>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
        {/* Question card */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 22px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 11, color: stageInfo.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>
            問題 {current + 1}
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", lineHeight: 1.65, margin: 0 }}>{q.question}</p>
        </div>

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {q.choices.map((choice, i) => {
            let bg = "#fff", border = "#e2e8f0", color = "#0f172a";
            let badgeBg = "#f1f5f9";
            if (selected !== null) {
              if (i === q.correct) { bg = "#f0fdf4"; border = "#16a34a"; color = "#15803d"; badgeBg = "#dcfce7"; }
              else if (i === selected && selected !== q.correct) { bg = "#fff5f5"; border = "#ef4444"; color = "#dc2626"; badgeBg = "#fee2e2"; }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "14px 18px",
                  textAlign: "left", cursor: selected !== null ? "default" : "pointer",
                  transition: "all 0.15s ease", fontSize: 14, color,
                  fontWeight: selected !== null && (i === q.correct || i === selected) ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: badgeBg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
                  {selected !== null && i === q.correct ? "○" : selected !== null && i === selected && selected !== q.correct ? "✕" : ["A", "B", "C", "D"][i]}
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div style={{ background: selected === q.correct ? "#f0fdf4" : "#fff5f5", border: `1.5px solid ${selected === q.correct ? "#86efac" : "#fca5a5"}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: selected === q.correct ? "#16a34a" : "#dc2626", marginBottom: 6 }}>
              {selected === q.correct ? "✓ 正解！" : "✕ 不正解"}
            </p>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, margin: 0 }}>{q.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            style={{ background: "linear-gradient(135deg, #1e3a8a, #1e40af)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", boxShadow: "0 4px 12px rgba(30,64,175,0.3)" }}
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
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: 16, color: "#64748b", background: "#f0f4f8" }}>
        読み込み中...
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
