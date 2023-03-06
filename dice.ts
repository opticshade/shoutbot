export function makeRoll(
  { count, sides, ex, rote }: {
    count: number;
    sides: number;
    ex: number;
    rote: boolean;
  },
): Array<number> {
  const rolls: number[] = [];

  for (let i = 0; i < count; i++) {
    const res = rollDie(sides);
    rolls.push(res);
    if (res >= ex) {
      rolls.push(makeRoll({ count: 1, sides, ex, rote: false })[0]);
    } else if (res < 8 && rote) {
      rolls.push(makeRoll({ count: 1, sides, ex, rote: false })[0]);
    }
  }
  return rolls;
}

function rollDie(sides: number): number {
  const roll = new Uint8Array(1);
  crypto.getRandomValues(roll);
  let value = roll[0];
  if (value >= Math.floor(256 / sides) * sides) {
    value = rollDie(sides);
  }
  return 1 + (value % sides);
}
