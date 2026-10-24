import { describe, it, expect } from 'vitest';
import { addDays, daysBetween, discount, hourlyPay, percentChange, percentOf, pyeongToSqm, sqmToPyeong, vatFromSupply, vatFromTotal } from './calculations';
describe('생활 계산식 경계값과 반올림', () => {
  it('비율 계산은 0과 소수점도 처리한다', () => { expect(percentOf(0, 20)).toBe(0); expect(percentOf(19.99, 10)).toBe(2); expect(percentChange(0, 5)).toBeNull(); expect(percentChange(100, 80)).toBe(-20); });
  it('할인율의 양 끝과 중간값을 계산한다', () => { expect(discount(10000, 0)).toEqual({ savings: 0, final: 10000 }); expect(discount(10000, 100)).toEqual({ savings: 10000, final: 0 }); expect(discount(9999, 15)).toEqual({ savings: 1499.85, final: 8499.15 }); });
  it('날짜는 시간대와 윤년을 고려해 날짜 단위로 계산한다', () => { expect(daysBetween(new Date(2024, 1, 28), new Date(2024, 2, 1))).toBe(2); expect(addDays(new Date(2024, 11, 31), 1).getFullYear()).toBe(2025); expect(daysBetween(new Date(2025, 0, 2), new Date(2025, 0, 1))).toBe(-1); });
  it('시급은 0시간과 소수 시간에도 계산한다', () => { expect(hourlyPay(10000, 0)).toBe(0); expect(hourlyPay(9860, 7.5)).toBe(73950); expect(hourlyPay(-1, 1)).toBe(-1); });
  it('부가세 포함과 별도 계산을 반올림한다', () => { expect(vatFromSupply(10000)).toEqual({ vat: 1000, total: 11000 }); expect(vatFromSupply(0)).toEqual({ vat: 0, total: 0 }); expect(vatFromTotal(11000)).toEqual({ supply: 10000, vat: 1000, total: 11000 }); expect(vatFromTotal(1)).toEqual({ supply: 0.91, vat: 0.09, total: 1 }); });
  it('면적 환산 계수를 양방향 적용한다', () => { expect(sqmToPyeong(0)).toBe(0); expect(sqmToPyeong(84)).toBe(25.41); expect(pyeongToSqm(25.41)).toBe(84); });
});
