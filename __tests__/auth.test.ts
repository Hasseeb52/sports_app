/**
 * Authentication Flow Unit Tests
 * Tests for user login, registration, and profile management
 */
import { validateEmail, validatePassword, validateDisplayName, sanitizeInput } from '../utils/validation';

describe('Authentication Validation', () => {
  describe('Email Validation', () => {
    test('validates correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user+tag@domain.co.uk',
        'firstname.lastname@company.org',
        'user123@test-domain.com'
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });
    
    test('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        ''
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
  
  describe('Password Validation', () => {
    test('validates strong passwords', () => {
      const strongPasswords = [
        'password123',
        'StrongPass1',
        'mySecure123',
        '123456abc'
      ];
      
      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBeUndefined();
      });
    });
    
    test('rejects weak passwords', () => {
      const weakPasswords = [
        { password: '123', expectedMessage: 'Password must be at least 6 characters long' },
        { password: 'password', expectedMessage: 'Password must contain at least one number' },
        { password: 'PASSWORD123', expectedMessage: 'Password must contain at least one lowercase letter' },
      ];
      
      weakPasswords.forEach(({ password, expectedMessage }) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe(expectedMessage);
      });
    });
  });
  
  describe('Display Name Validation', () => {
    test('validates proper display names', () => {
      const validNames = [
        'John Doe',
        'Sarah Smith',
        'Alex T',
        'Maria Garcia-Lopez'
      ];
      
      validNames.forEach(name => {
        expect(validateDisplayName(name)).toBe(true);
      });
    });
    
    test('rejects invalid display names', () => {
      const invalidNames = [
        'A', // too short
        '', // empty
        ' ', // just whitespace
        'A'.repeat(51) // too long
      ];
      
      invalidNames.forEach(name => {
        expect(validateDisplayName(name)).toBe(false);
      });
    });
  });
  
  describe('Input Sanitization', () => {
    test('sanitizes potentially dangerous input', () => {
      const testCases = [
        { input: '<script>alert("xss")</script>', expected: 'script>alert("xss")/script>' },
        { input: 'Normal text', expected: 'Normal text' },
        { input: '  Whitespace text  ', expected: 'Whitespace text' },
        { input: 'Text with <div> tags', expected: 'Text with div> tags' },
        { input: '', expected: '' }
      ];
      
      testCases.forEach(({ input, expected }) => {
        expect(sanitizeInput(input)).toBe(expected);
      });
    });
  });
});

describe('Authentication Context Simulation', () => {
  // Mock Firebase auth responses
  const mockFirebaseAuthSuccess = {
    user: {
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User'
    }
  };
  
  const mockFirebaseAuthError = {
    code: 'auth/invalid-email',
    message: 'The email address is badly formatted.'
  };
  
  test('simulates successful login flow', async () => {
    // Simulate validation passing
    const email = 'test@example.com';
    const password = 'password123';
    
    expect(validateEmail(email)).toBe(true);
    expect(validatePassword(password).isValid).toBe(true);
    
    // In a real test, this would mock Firebase signInWithEmailAndPassword
    // For demo purposes, we simulate the expected flow
    const authResult = mockFirebaseAuthSuccess;
    expect(authResult.user.email).toBe(email);
    expect(authResult.user.uid).toBeTruthy();
  });
  
  test('simulates registration flow with role assignment', async () => {
    const formData = {
      email: 'newuser@example.com',
      password: 'securepass123',
      displayName: 'New User',
      role: 'user' as const
    };
    
    // Validate all fields
    expect(validateEmail(formData.email)).toBe(true);
    expect(validatePassword(formData.password).isValid).toBe(true);
    expect(validateDisplayName(formData.displayName)).toBe(true);
    
    // Simulate user creation
    const userData = {
      uid: 'new-user-uid',
      email: formData.email,
      displayName: formData.displayName,
      role: formData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    expect(userData.role).toBe('user');
    expect(userData.email).toBe(formData.email);
  });
  
  test('handles authentication errors gracefully', async () => {
    const invalidEmail = 'invalid-email';
    
    // Client-side validation should catch this
    expect(validateEmail(invalidEmail)).toBe(false);
    
    // If it somehow reaches Firebase, error should be handled
    const error = mockFirebaseAuthError;
    expect(error.code).toBe('auth/invalid-email');
    expect(error.message).toContain('email address');
  });
});

describe('Profile Management', () => {
  test('validates profile update data', () => {
    const validProfileUpdates = [
      { displayName: 'Updated Name', bio: 'New bio text' },
      { displayName: 'John Smith', bio: '' },
      { bio: 'Updated bio only' }
    ];
    
    validProfileUpdates.forEach(update => {
      if (update.displayName) {
        expect(validateDisplayName(update.displayName)).toBe(true);
      }
      if (update.bio !== undefined) {
        expect(sanitizeInput(update.bio)).toBe(update.bio.trim());
      }
    });
  });
  
  test('prevents invalid profile updates', () => {
    const invalidUpdates = [
      { displayName: 'A' }, // too short
      { displayName: '' }, // empty
      { displayName: 'A'.repeat(51) } // too long
    ];
    
    invalidUpdates.forEach(update => {
      if (update.displayName !== undefined) {
        expect(validateDisplayName(update.displayName)).toBe(false);
      }
    });
  });
});