"use client";
import { useState } from "react";

type StageStatus = "completed" | "in_progress" | "locked";

interface Stage {
  id: number;
  title: string;
  description: string;
  icon: string;
  totalQuestions: number;
  completedQuestions: number;
  status: StageStatus;
  xp: number;
  badge: string;
}

const stages: Stage[] = [
  { id: 1, title: "基礎知識", description: "パスワード管理・フィッシング詐欺・不審メール対応", icon: "??", totalQuestions: 10, completedQuestions: 10, status: "completed", xp: 200, badge: "セキュリティ入門者" },
  { id: 2, title: "社内ルール", description: "情報持ち出し・クラウド利用・アクセス権限管理", icon: "??", totalQuestions: 10, completedQuestions: 6, status: "in_progress", xp: 0, badge: "社内ルール遵守者" },
  { id: 3, title: "インシデント対応", description: "情報漏えい発生時の対応・報告フロー・初動対応", icon: "??", totalQuestions: 10, completedQuestions: 0, status: "locked", xp: 0, badge: "危機対応エキスパート" },
  { id: 4, title: "上級者コース", description: "標的型攻撃・ソーシャルエンジニアリング・ゼロトラスト", icon: "?", totalQuestions: 15, completedQuestions: 0, status: "locked", xp: 0, badge: "セキュリティ戦士" },
];

const userStats = { name: "田中 太郎", department: "営業部", level: 3, xp: 740, nextLevelXp: 1000, streak: 5, totalBadges: 1 };

export default function App() {
  return <div>SecureLearn</div>;
}
