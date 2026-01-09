import { validateEmail, validatePassword, validateName, getPasswordStrength } from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_123@test-domain.com',
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@.com',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'MyPass123!',
        'Secure@Password1',
        'C0mpl3x#Pass',
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject passwords without special characters', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return all applicable errors', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateName', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John',
        'Mary Jane',
        'O\'Brien',
      ];

      validNames.forEach(name => {
        const result = validateName(name);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject empty names', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject names that are too short', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    it('should reject names with numbers', () => {
      const result = validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name can only contain letters, spaces, hyphens, and apostrophes');
    });
  });

  describe('getPasswordStrength', () => {
    it('should return strength 0 for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.strength).toBe(0);
      expect(result.label).toBe('');
      expect(result.color).toBe('');
    });

    it('should return strength 1 for password with 8+ chars', () => {
      const result = getPasswordStrength('password');
      expect(result.strength).toBe(1);
      expect(result.label).toBe('Weak');
      expect(result.color).toBe('bg-red-500');
    });

    it('should return strength 2 for password with 12+ chars', () => {
      const result = getPasswordStrength('passwordlong');
      expect(result.strength).toBe(2);
      expect(result.label).toBe('Fair');
      expect(result.color).toBe('bg-orange-500');
    });

    it('should return strength 3 for password with mixed case', () => {
      const result = getPasswordStrength('PasswordLong');
      expect(result.strength).toBe(3);
      expect(result.label).toBe('Good');
      expect(result.color).toBe('bg-yellow-500');
    });

    it('should return strength 4 for password with numbers', () => {
      const result = getPasswordStrength('PasswordLong123');
      expect(result.strength).toBe(4);
      expect(result.label).toBe('Strong');
      expect(result.color).toBe('bg-green-500');
    });

    it('should return strength 5 for very strong password', () => {
      const result = getPasswordStrength('MySecureP@ssw0rd!');
      expect(result.strength).toBe(5);
      expect(result.label).toBe('Very Strong');
      expect(result.color).toBe('bg-green-600');
    });
  });
});
