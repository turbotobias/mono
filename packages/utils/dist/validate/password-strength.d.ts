/**
 * Enum representing different password strength levels
 */
export declare enum TPasswordStrength {
    VERY_WEAK = 0,
    WEAK = 1,
    MEDIUM = 2,
    STRONG = 3,
    VERY_STRONG = 4
}
/**
 * Calculate password entropy based on character set diversity and length
 * This estimates how hard a password would be to crack through brute force
 */
export declare const calculate_entropy: (password: string) => number;
/**
 * Check if password contains multiple character types
 */
export declare const has_character_diversity: (password: string) => boolean;
/**
 * Calculate password strength based on entropy and brute-force resistance
 * @param password The password to evaluate
 * @returns A TPasswordStrength enum value representing the password strength
 */
export declare const calculate_password_strength: (password: string) => TPasswordStrength;
//# sourceMappingURL=password-strength.d.ts.map