function getRandomFromArray<T>(array: T[]):T {
  return array[Math.floor(Math.random() * array.length)];
}

export function buildName(brandNames: string[], modelNames: string[]): string {
  const brand = getRandomFromArray<string>(brandNames);
  const model = getRandomFromArray<string>(modelNames);
  return `${brand} ${model}`;
}
