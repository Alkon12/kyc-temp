export function getMondayOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  return new Date(new Date().setDate(date.getDate() - daysFromMonday))
}
