import { getContrastRatio, checkContrastCompliance, testBrandColorContrast, BRAND_COLORS } from '../lib/accessibility';

describe('Accessibility Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0); // Perfect contrast
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeCloseTo(21, 0); // Perfect contrast
    });

    it('should calculate correct contrast ratio for gray on white', () => {
      const ratio = getContrastRatio('#666666', '#FFFFFF');
      expect(ratio).toBeGreaterThan(3); // Should be readable
    });
  });

  describe('checkContrastCompliance', () => {
    it('should pass WCAG AA for normal text with high contrast', () => {
      const result = checkContrastCompliance('#000000', '#FFFFFF', 'normal');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThan(4.5);
    });

    it('should pass WCAG AA for UI components with medium contrast', () => {
      const result = checkContrastCompliance('#666666', '#FFFFFF', 'ui');
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThan(3.0);
    });

    it('should fail WCAG AA for low contrast combinations', () => {
      const result = checkContrastCompliance('#CCCCCC', '#FFFFFF', 'normal');
      expect(result.passes).toBe(false);
      expect(result.ratio).toBeLessThan(4.5);
    });
  });

  describe('Brand Color Contrast Tests', () => {
    it('should have all brand colors defined', () => {
      expect(BRAND_COLORS.brandMint).toBeDefined();
      expect(BRAND_COLORS.brandMintDark).toBeDefined();
      expect(BRAND_COLORS.brandRose).toBeDefined();
      expect(BRAND_COLORS.brandRoseDark).toBeDefined();
      expect(BRAND_COLORS.gray900).toBeDefined();
      expect(BRAND_COLORS.white).toBeDefined();
    });

    it('should pass WCAG AA for brand colors on white backgrounds', () => {
      const tests = testBrandColorContrast();
      
      // Test brand colors on white backgrounds
      expect(tests['brandMint on white'].passes).toBe(true);
      expect(tests['brandMintDark on white'].passes).toBe(true);
      expect(tests['brandRose on white'].passes).toBe(true);
      expect(tests['brandRoseDark on white'].passes).toBe(true);
    });

    it('should pass WCAG AA for dark text on brand colors', () => {
      const tests = testBrandColorContrast();
      
      // Test dark text on brand colors
      expect(tests['gray900 on brandMint'].passes).toBe(true);
      expect(tests['gray900 on brandRose'].passes).toBe(true);
    });

    it('should have contrast ratios above 3.0 for UI components', () => {
      const tests = testBrandColorContrast();
      
      Object.values(tests).forEach(test => {
        expect(test.ratio).toBeGreaterThanOrEqual(3.0);
        expect(test.required).toBe(3.0);
      });
    });
  });
}); 