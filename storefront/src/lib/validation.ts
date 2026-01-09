// Form validation utilities

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export function validateEmail(email: string): ValidationResult {
	const errors: string[] = [];

	if (!email) {
		errors.push("Email is required");
		return { isValid: false, errors };
	}

	// Basic email format validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		errors.push("Please enter a valid email address");
	}

	// Check for common typos
	const commonDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
	const domain = email.split("@")[1]?.toLowerCase();
	if (domain && !commonDomains.includes(domain)) {
		// Allow but don't reject - just a suggestion
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validatePassword(password: string): ValidationResult {
	const errors: string[] = [];

	if (!password) {
		errors.push("Password is required");
		return { isValid: false, errors };
	}

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}

	if (!/[0-9]/.test(password)) {
		errors.push("Password must contain at least one number");
	}

	if (!/[^a-zA-Z0-9]/.test(password)) {
		errors.push("Password must contain at least one special character");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function getPasswordStrength(password: string): {
	strength: number;
	label: string;
	color: string;
} {
	let strength = 0;

	if (password.length >= 8) strength++;
	if (password.length >= 12) strength++;
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
	if (/[0-9]/.test(password)) strength++;
	if (/[^a-zA-Z0-9]/.test(password)) strength++;

	const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
	const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];

	return {
		strength,
		label: labels[strength],
		color: colors[strength],
	};
}

export function validatePhone(phone: string): ValidationResult {
	const errors: string[] = [];

	if (!phone) {
		errors.push("Phone number is required");
		return { isValid: false, errors };
	}

	// Remove all non-digit characters
	const digitsOnly = phone.replace(/\D/g, "");

	// Uganda phone numbers are typically 10 digits (including 0) or 9 digits (without 0)
	// Format: 0XXX XXX XXX or 256 XXX XXX XXX
	if (digitsOnly.length < 9 || digitsOnly.length > 12) {
		errors.push("Please enter a valid phone number");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validateName(name: string, fieldName: string = "Name"): ValidationResult {
	const errors: string[] = [];

	if (!name) {
		errors.push(`${fieldName} is required`);
		return { isValid: false, errors };
	}

	if (name.trim().length < 2) {
		errors.push(`${fieldName} must be at least 2 characters long`);
	}

	if (!/^[a-zA-Z\s'-]+$/.test(name)) {
		errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validateAddress(address: string): ValidationResult {
	const errors: string[] = [];

	if (!address) {
		errors.push("Address is required");
		return { isValid: false, errors };
	}

	if (address.trim().length < 5) {
		errors.push("Please enter a complete address");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validatePostalCode(postalCode: string): ValidationResult {
	const errors: string[] = [];

	// Postal code is optional in Uganda, but if provided should be reasonable
	if (postalCode && postalCode.length > 0) {
		if (postalCode.length < 3 || postalCode.length > 10) {
			errors.push("Please enter a valid postal code");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
	const errors: string[] = [];

	if (!value || (typeof value === "string" && value.trim().length === 0)) {
		errors.push(`${fieldName} is required`);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
