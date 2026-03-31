(() => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function toLocalDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatPtBr(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date: Date, amount: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + amount);
    return nextDate;
  }

  function diffDays(from: Date, to: Date): number {
    const diff = startOfDay(to).getTime() - startOfDay(from).getTime();
    return Math.max(0, Math.round(diff / ONE_DAY_MS));
  }

  function toIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  window.DateUtils = Object.freeze({
    ONE_DAY_MS,
    toLocalDate,
    formatPtBr,
    startOfDay,
    addDays,
    diffDays,
    toIso
  });
})();
