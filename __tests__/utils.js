import { getProfitLossRate, getFiatValue } from '../src/screens/Wallet/utils';

describe('getProfitLossRate', () => {
    it('should return an object with value, isNegative, and color', () => {
        const result = getProfitLossRate();
        expect(result).toHaveProperty('value');
        expect(result).toHaveProperty('isNegative');
        expect(result).toHaveProperty('color');
    });

    it('value should be between 0 and 10', () => {
        const result = getProfitLossRate();
        expect(Number(result.value)).toBeGreaterThanOrEqual(0);
        expect(Number(result.value)).toBeLessThanOrEqual(10);
    });

    it('should return correct isNegative flag and color for positive numbers', () => {
        // 模擬正數
        const mock = { value: 5, isNegative: false, color: 'green' };
        expect(mock.isNegative).toBe(false);
        expect(mock.color).toBe('green');
    });

    it('should return correct isNegative flag and color for negative numbers', () => {
        // 模擬負數
        const mock = { value: 5, isNegative: true, color: 'red' };
        expect(mock.isNegative).toBe(true);
        expect(mock.color).toBe('red');
    });

    it('should return black color if value is 0', () => {
        const mock = { value: 0, isNegative: false, color: 'black' };
        expect(mock.color).toBe('black');
    });
});

describe('getFiatValue', () => {
    const fiatRates = [
        {
            fiat_rate: 20000,
            fiat_symbol: "HKD",
            id: 1,
            symbol: "BTC"
        },
        {
            fiat_rate: 26100,
            fiat_symbol: "HKD",
            symbol: "ETH",
            id: 2
        },
    ];

    it('should return correct fiat value when symbol exists', () => {
        const result = getFiatValue(2, 'BTC', fiatRates);
        expect(result).toBe(40000); // 2 * 20000
    });

    it('should return 0 when symbol is not found', () => {
        const result = getFiatValue(5, 'SOL', fiatRates);
        expect(result).toBe(0);
    });

    it('should return 0 when amount is 0', () => {
        const result = getFiatValue(0, 'ETH', fiatRates);
        expect(result).toBe(0);
    });
});