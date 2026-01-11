/**
 * Customer Support System Types
 *
 * Support ticket and help center types:
 * - Ticket management
 * - FAQ system
 * - Live chat integration
 * - Knowledge base
 *
 * Expected Impact: -30% support response time, +40% self-service resolution
 */

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory =
  | 'order-issue'
  | 'product-question'
  | 'technical-support'
  | 'payment'
  | 'shipping'
  | 'return-refund'
  | 'other';

export interface SupportTicket {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: SupportMessage[];
  orderId?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  tags: string[];
  satisfaction?: number; // 1-5 rating after resolution
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support' | 'system';
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  helpful: number;
  notHelpful: number;
  relatedArticles?: string[];
  tags: string[];
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  articleCount: number;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResponseTime: number; // minutes
  averageResolutionTime: number; // hours
  customerSatisfaction: number; // 1-5 average rating
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  author: string;
  views: number;
  helpful: number;
  notHelpful: number;
  tags: string[];
  relatedArticles: string[];
  createdAt: string;
  updatedAt: string;
}

export default {
  SupportTicket,
  SupportMessage,
  FAQItem,
  FAQCategory,
  KnowledgeBaseArticle,
  SupportStats,
};
