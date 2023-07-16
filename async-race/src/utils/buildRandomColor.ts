export function getRandomColor(): string {
  const color = `#${Math.floor(Math.random() * 256 * 256 * 256).toString(16)}`;
  return color;
}
