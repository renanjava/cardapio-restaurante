import { describe, it, expect } from 'vitest';
import {
  calculatePlanDates,
  isValidDeliveryTime,
  formatDateForDB,
  getDayName,
  formatDateForDisplay,
} from './weekly-plan-dates';

describe('calculatePlanDates', () => {
  it('should return exactly 7 dates', () => {
    const dates = calculatePlanDates();
    expect(dates).toHaveLength(7);
  });

  it('should not include any Sundays', () => {
    const dates = calculatePlanDates();
    const hasSunday = dates.some(date => date.getDay() === 0);
    expect(hasSunday).toBe(false);
  });

  it('should start from tomorrow', () => {
    const dates = calculatePlanDates();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    
    expect(dates[0].toDateString()).toBe(tomorrow.toDateString());
  });

  it('should return all Date objects', () => {
    const dates = calculatePlanDates();
    dates.forEach(date => {
      expect(date).toBeInstanceOf(Date);
    });
  });
});

describe('isValidDeliveryTime', () => {
  it('should accept valid times within range', () => {
    expect(isValidDeliveryTime('11:00')).toBe(true);
    expect(isValidDeliveryTime('12:00')).toBe(true);
    expect(isValidDeliveryTime('12:30')).toBe(true);
    expect(isValidDeliveryTime('13:45')).toBe(true);
    expect(isValidDeliveryTime('14:00')).toBe(true);
  });

  it('should reject times before 11:00', () => {
    expect(isValidDeliveryTime('10:59')).toBe(false);
    expect(isValidDeliveryTime('09:00')).toBe(false);
    expect(isValidDeliveryTime('08:30')).toBe(false);
  });

  it('should reject times after 14:00', () => {
    expect(isValidDeliveryTime('14:01')).toBe(false);
    expect(isValidDeliveryTime('15:00')).toBe(false);
    expect(isValidDeliveryTime('18:00')).toBe(false);
  });

  it('should reject invalid time formats', () => {
    expect(isValidDeliveryTime('25:00')).toBe(false);
    expect(isValidDeliveryTime('12:60')).toBe(false);
    expect(isValidDeliveryTime('12')).toBe(false);
    expect(isValidDeliveryTime('invalid')).toBe(false);
    expect(isValidDeliveryTime('')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isValidDeliveryTime(null as any)).toBe(false);
    expect(isValidDeliveryTime(undefined as any)).toBe(false);
    expect(isValidDeliveryTime(123 as any)).toBe(false);
  });
});

describe('formatDateForDB', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date('2026-01-15T10:30:00');
    expect(formatDateForDB(date)).toBe('2026-01-15');
  });

  it('should handle different dates correctly', () => {
    const date1 = new Date('2026-12-31T23:59:59');
    expect(formatDateForDB(date1)).toBe('2026-12-31');
    
    const date2 = new Date('2026-01-01T00:00:00');
    expect(formatDateForDB(date2)).toBe('2026-01-01');
  });
});

describe('getDayName', () => {
  it('should return correct Portuguese day names', () => {
    expect(getDayName(new Date('2026-01-04'))).toBe('Domingo');
    expect(getDayName(new Date('2026-01-05'))).toBe('Segunda-feira');
    expect(getDayName(new Date('2026-01-06'))).toBe('Terça-feira');
    expect(getDayName(new Date('2026-01-07'))).toBe('Quarta-feira');
    expect(getDayName(new Date('2026-01-08'))).toBe('Quinta-feira');
    expect(getDayName(new Date('2026-01-09'))).toBe('Sexta-feira');
    expect(getDayName(new Date('2026-01-10'))).toBe('Sábado');
  });
});

describe('formatDateForDisplay', () => {
  it('should format Date object as DD/MM/YYYY', () => {
    const date = new Date('2026-01-15');
    expect(formatDateForDisplay(date)).toBe('15/01/2026');
  });

  it('should format ISO string as DD/MM/YYYY', () => {
    expect(formatDateForDisplay('2026-12-25')).toBe('25/12/2026');
  });

  it('should pad single digits with zeros', () => {
    const date = new Date('2026-03-05');
    expect(formatDateForDisplay(date)).toBe('05/03/2026');
  });
});
