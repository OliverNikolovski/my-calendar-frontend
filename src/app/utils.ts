export function areDatesSameDay(d1: Date, d2: Date): boolean {
  // console.log('d1', d1, typeof d1);
  // console.log('d2', d2, typeof d2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export function notNull(value: any): boolean {
  return value !== null;
}
