export function parseCustomDate(dateStr: string): Date {
  const [day, monthStr, yearStr] = dateStr.split("/");
  const monthsMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const dayNum = parseInt(day, 10);
  const monthNum = monthsMap[monthStr];
  const yearNum = parseInt(yearStr, 10);

  return new Date(yearNum, monthNum, dayNum);
}
