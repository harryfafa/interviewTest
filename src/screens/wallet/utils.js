export function getProfitLossRate() {
    const num = Math.random() * 20 - 10;   // -10 ~ 10
    const rounded = Math.round(num * 100) / 100; // 四捨五入到小數點後兩位
    return {
        value: Math.abs(rounded),
        isNegative: rounded < 0
    };
}

export function getFiatValue(amount, symbol, fiatRates) {
  const rate = fiatRates.find(r => r.symbol === symbol);
  const fiatRate = rate?.fiat_rate || 0;
  return amount * fiatRate;
}