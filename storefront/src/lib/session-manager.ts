/**
 * Session Management System
 *
 * Tracks active user sessions, enables session revocation,
 * and provides security monitoring capabilities.
 *
 * In production, this should use a persistent store like Redis
 * instead of in-memory storage.
 */

export interface UserSession {
	sessionId: string;
	userId: string;
	email: string;
	ip: string;
	userAgent: string;
	createdAt: Date;
	lastActivityAt: Date;
	expiresAt: Date;
	isActive: boolean;
}

export interface SessionStore {
	sessions: Map<string, UserSession>;
	userSessions: Map<string, Set<string>>; // userId -> sessionIds
}

// In-memory session store (use Redis in production)
const sessionStore: SessionStore = {
	sessions: new Map(),
	userSessions: new Map(),
};

/**
 * Create a new session
 */
export function createSession(
	userId: string,
	email: string,
	ip: string,
	userAgent: string,
	ttlMs: number = 30 * 24 * 60 * 60 * 1000 // 30 days default
): UserSession {
	const sessionId = generateSessionId();
	const now = new Date();

	const session: UserSession = {
		sessionId,
		userId,
		email,
		ip,
		userAgent,
		createdAt: now,
		lastActivityAt: now,
		expiresAt: new Date(now.getTime() + ttlMs),
		isActive: true,
	};

	// Store session
	sessionStore.sessions.set(sessionId, session);

	// Track user sessions
	if (!sessionStore.userSessions.has(userId)) {
		sessionStore.userSessions.set(userId, new Set());
	}
	sessionStore.userSessions.get(userId)!.add(sessionId);

	return session;
}

/**
 * Get session by ID
 */
export function getSession(sessionId: string): UserSession | null {
	const session = sessionStore.sessions.get(sessionId);

	if (!session) {
		return null;
	}

	// Check if expired
	if (new Date() > session.expiresAt) {
		revokeSession(sessionId);
		return null;
	}

	return session;
}

/**
 * Update session activity
 */
export function updateSessionActivity(sessionId: string): void {
	const session = sessionStore.sessions.get(sessionId);

	if (session && session.isActive) {
		session.lastActivityAt = new Date();
	}
}

/**
 * Revoke a specific session
 */
export function revokeSession(sessionId: string): boolean {
	const session = sessionStore.sessions.get(sessionId);

	if (!session) {
		return false;
	}

	session.isActive = false;

	// Remove from user sessions
	const userSessionIds = sessionStore.userSessions.get(session.userId);
	if (userSessionIds) {
		userSessionIds.delete(sessionId);
	}

	// Delete session
	sessionStore.sessions.delete(sessionId);

	return true;
}

/**
 * Revoke all sessions for a user
 */
export function revokeAllUserSessions(userId: string): number {
	const sessionIds = sessionStore.userSessions.get(userId);

	if (!sessionIds) {
		return 0;
	}

	let revokedCount = 0;
	for (const sessionId of sessionIds) {
		if (revokeSession(sessionId)) {
			revokedCount++;
		}
	}

	sessionStore.userSessions.delete(userId);

	return revokedCount;
}

/**
 * Get all active sessions for a user
 */
export function getUserSessions(userId: string): UserSession[] {
	const sessionIds = sessionStore.userSessions.get(userId);

	if (!sessionIds) {
		return [];
	}

	const sessions: UserSession[] = [];
	const now = new Date();

	for (const sessionId of sessionIds) {
		const session = sessionStore.sessions.get(sessionId);

		if (session && session.isActive && now <= session.expiresAt) {
			sessions.push(session);
		} else if (session) {
			// Clean up expired/inactive sessions
			revokeSession(sessionId);
		}
	}

	return sessions;
}

/**
 * Clean up expired sessions (run periodically)
 */
export function cleanupExpiredSessions(): number {
	const now = new Date();
	let cleanedCount = 0;

	for (const [sessionId, session] of sessionStore.sessions.entries()) {
		if (now > session.expiresAt || !session.isActive) {
			revokeSession(sessionId);
			cleanedCount++;
		}
	}

	return cleanedCount;
}

/**
 * Get session statistics
 */
export function getSessionStats() {
	const now = new Date();
	let activeCount = 0;
	let expiredCount = 0;

	for (const session of sessionStore.sessions.values()) {
		if (session.isActive && now <= session.expiresAt) {
			activeCount++;
		} else {
			expiredCount++;
		}
	}

	return {
		total: sessionStore.sessions.size,
		active: activeCount,
		expired: expiredCount,
		users: sessionStore.userSessions.size,
	};
}

/**
 * Detect concurrent sessions from different locations
 */
export function detectConcurrentSessions(userId: string): {
	hasMultipleSessions: boolean;
	sessions: UserSession[];
	suspiciousActivity: boolean;
} {
	const sessions = getUserSessions(userId);

	if (sessions.length <= 1) {
		return {
			hasMultipleSessions: false,
			sessions,
			suspiciousActivity: false,
		};
	}

	// Check for suspicious patterns
	const uniqueIps = new Set(sessions.map((s) => s.ip));
	const uniqueUserAgents = new Set(sessions.map((s) => s.userAgent));

	// Multiple IPs or user agents could indicate account sharing or compromise
	const suspiciousActivity = uniqueIps.size > 2 || uniqueUserAgents.size > 2;

	return {
		hasMultipleSessions: true,
		sessions,
		suspiciousActivity,
	};
}

/**
 * Generate secure session ID
 */
function generateSessionId(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Session middleware helper - validates and updates session
 */
export async function validateSession(sessionId: string): Promise<{
	valid: boolean;
	session: UserSession | null;
	reason?: string;
}> {
	const session = getSession(sessionId);

	if (!session) {
		return { valid: false, session: null, reason: "Session not found" };
	}

	if (!session.isActive) {
		return { valid: false, session: null, reason: "Session revoked" };
	}

	if (new Date() > session.expiresAt) {
		revokeSession(sessionId);
		return { valid: false, session: null, reason: "Session expired" };
	}

	// Update last activity
	updateSessionActivity(sessionId);

	return { valid: true, session };
}

/**
 * Get session summary for user display
 */
export function formatSessionSummary(session: UserSession): {
	device: string;
	location: string;
	lastActive: string;
	isCurrent: boolean;
} {
	// Parse user agent for device info
	const ua = session.userAgent.toLowerCase();
	let device = "Unknown Device";

	if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
		device = "Mobile Device";
	} else if (ua.includes("tablet") || ua.includes("ipad")) {
		device = "Tablet";
	} else if (ua.includes("windows")) {
		device = "Windows PC";
	} else if (ua.includes("mac")) {
		device = "Mac";
	} else if (ua.includes("linux")) {
		device = "Linux PC";
	}

	// In production, use IP geolocation service
	const location = session.ip === "unknown" ? "Unknown Location" : `IP: ${session.ip}`;

	// Format last active time
	const minutesAgo = Math.floor((Date.now() - session.lastActivityAt.getTime()) / 1000 / 60);
	let lastActive: string;

	if (minutesAgo < 1) {
		lastActive = "Just now";
	} else if (minutesAgo < 60) {
		lastActive = `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
	} else {
		const hoursAgo = Math.floor(minutesAgo / 60);
		if (hoursAgo < 24) {
			lastActive = `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
		} else {
			const daysAgo = Math.floor(hoursAgo / 24);
			lastActive = `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
		}
	}

	return {
		device,
		location,
		lastActive,
		isCurrent: minutesAgo < 5, // Consider current if active in last 5 mins
	};
}

// Cleanup expired sessions every hour
if (typeof setInterval !== "undefined") {
	setInterval(() => {
		const cleaned = cleanupExpiredSessions();
		if (cleaned > 0) {
			console.log(`[SESSION_CLEANUP] Removed ${cleaned} expired sessions`);
		}
	}, 60 * 60 * 1000); // 1 hour
}
