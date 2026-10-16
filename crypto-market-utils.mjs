export function normalizeCryptoAmount(value, max = 1_000_000) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > max) return null;
  const micros = Math.round(amount * 1_000_000);
  return Math.abs(amount - micros / 1_000_000) <= 1e-9 ? micros / 1_000_000 : null;
}

export function quoteServerBuybackCoins(amountValue, coinsPerUnitValue) {
  const amount = normalizeCryptoAmount(amountValue);
  const coinsPerUnit = Number(coinsPerUnitValue);
  if (amount === null || !Number.isFinite(coinsPerUnit) || coinsPerUnit <= 0) return null;
  const amountMicros = BigInt(Math.round(amount * 1_000_000));
  const rateMicros = BigInt(Math.round(coinsPerUnit * 1_000_000));
  return Number((amountMicros * rateMicros) / 1_000_000_000_000n);
}
