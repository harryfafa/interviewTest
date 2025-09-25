import { getProfitLossRate, getFiatValue } from '../src/screens/Wallet/utils';

describe('getProfitLossRate', () => {
    it('should return an object with value and isNegative', () => {
        const result = getProfitLossRate();
        expect(result).toHaveProperty('value');
        expect(result).toHaveProperty('isNegative');
    });

    it('value should be between 0 and 10', () => {
        const result = getProfitLossRate();
        expect(result.value).toBeGreaterThanOrEqual(0);
        expect(result.value).toBeLessThanOrEqual(10);
    });

    it('should return correct isNegative flag', () => {
        const mockPositive = { value: 5, isNegative: false };
        const mockNegative = { value: 5, isNegative: true };
        expect(mockPositive.isNegative).toBe(false);
        expect(mockNegative.isNegative).toBe(true);
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