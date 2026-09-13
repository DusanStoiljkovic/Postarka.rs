export function packageUnitCount(title: string) {
  const match = title.match(/od (\d+)/i);
  return match ? Number(match[1]) : 1;
}
