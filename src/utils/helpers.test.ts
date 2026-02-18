import { formatPrice, formatDate, truncateText } from './helpers';

describe('formatPrice', () => {
  it('formats a round number in INR without decimals', () => {
    const result = formatPrice(2999);
    expect(result).toContain('2,999');
  });

  it('formats zero as INR', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats large numbers with Indian grouping', () => {
    const result = formatPrice(100000);
    expect(result).toContain('1,00,000');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to long format', () => {
    const result = formatDate('2026-01-15');
    expect(result).toContain('January');
    expect(result).toContain('2026');
    expect(result).toContain('15');
  });

  it('handles another date correctly', () => {
    const result = formatDate('2026-02-10');
    expect(result).toContain('February');
    expect(result).toContain('2026');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis when text exceeds maxLength', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('handles exact boundary length', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('trims trailing whitespace before adding ellipsis', () => {
    expect(truncateText('hello world', 6)).toBe('hello...');
  });
});
