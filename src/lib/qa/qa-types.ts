/**
 * Q&A System Types
 *
 * Type definitions for product questions and answers:
 * - Questions with answers
 * - Voting system
 * - Verified answerers (vendors, verified buyers)
 * - Best answer selection
 */

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  question: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  answers: Answer[];
  hasAnswer: boolean;
  hasBestAnswer: boolean;
  tags?: string[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  answer: string;
  isVendor: boolean;
  isVerifiedPurchase: boolean;
  isBestAnswer: boolean;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes: number;
}

export interface QAStats {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  answeredPercentage: number;
  averageAnswerTime?: number; // in hours
}

export interface QAFilters {
  answered?: boolean;
  unanswered?: boolean;
  sortBy?: 'recent' | 'popular' | 'unanswered';
  search?: string;
}

export type QASortOption = 'recent' | 'popular' | 'unanswered';

export default {
  Question,
  Answer,
  QAStats,
  QAFilters,
};
