export const MEMORY_SYMBOLS = ["🎈", "🍓", "🪐", "🐸", "🌈", "🍩", "🧸", "🦋"];

export function makeMemoryDeck(symbols = MEMORY_SYMBOLS, random = Math.random) {
  const deck = symbols.flatMap((symbol, pair) => [
    { pair, symbol, revealed: false, matched: false },
    { pair, symbol, revealed: false, matched: false }
  ]);
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}

export function memoryMatchScore(moves, seconds, pairCount = MEMORY_SYMBOLS.length) {
  const extraMoves = Math.max(0, Number(moves) - pairCount);
  const elapsed = Math.max(0, Number(seconds));
  return Math.max(10, pairCount * 150 - extraMoves * 25 - elapsed * 3);
}
