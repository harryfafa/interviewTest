export function getProfitLossRate() {
    const num = Math.random() * 20 - 10;   // -10 ~ 10
    const rounded = Math.round(num * 100) / 100; // 四捨五入到小數點後兩位
    return {
        value: Math.abs(rounded),
        isNegative: rounded < 0
    };
}