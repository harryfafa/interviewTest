export function getProfitLossRate() {
    const num = Math.random() * 20 - 10;
    return {
        value: Math.abs(num.toFixed(2)),
        isNegative: num < 0,
        color: num === 0 ? 'black' : num < 0 ? 'red' : 'green',
    };
}

export function getFiatValue(amount, symbol, fiatRates) {
    const rate = fiatRates.find(r => r.symbol === symbol);
    const fiatRate = rate?.fiat_rate || 0;
    return amount * fiatRate;
}