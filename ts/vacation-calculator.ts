(() => {
  const { ONE_DAY_MS, toLocalDate, startOfDay, addDays, diffDays, toIso } = window.DateUtils;
  const { getNationalHolidays } = window.HolidayService;

  function countBusinessAndNonBusinessDays(from: Date, toExclusive: Date): { business: number; nonBusiness: number } {
    let business = 0;
    let nonBusiness = 0;
    const holidayCache = new Map<number, Set<string>>();

    for (let date = startOfDay(from); date < toExclusive; date = addDays(date, 1)) {
      const year = date.getFullYear();

      if (!holidayCache.has(year)) {
        holidayCache.set(year, getNationalHolidays(year));
      }

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidayCache.get(year)?.has(toIso(date)) ?? false;

      if (!isWeekend && !isHoliday) {
        business += 1;
      } else {
        nonBusiness += 1;
      }
    }

    return { business, nonBusiness };
  }

  function resolveVacationStatus(
    today: Date,
    vacationStart: Date,
    vacationEndExclusive: Date,
    totalVacationDays: number
  ): { vacationLeft: number; vacationStatus: string } {
    if (today < vacationStart) {
      return {
        vacationLeft: totalVacationDays,
        vacationStatus: "Você ainda vai curtir todos os dias"
      };
    }

    if (today >= vacationEndExclusive) {
      return {
        vacationLeft: 0,
        vacationStatus: "Férias encerradas"
      };
    }

    return {
      vacationLeft: diffDays(today, vacationEndExclusive),
      vacationStatus: "Dias restantes durante as férias"
    };
  }

  function resolveClockText(
    totalUntilStart: number,
    today: Date,
    vacationEndExclusive: Date,
    hr: number,
    min: number,
    sec: number
  ): string {
    if (totalUntilStart > 0) {
      return `Faltam ${hr}h ${min}min ${sec}s para o início das férias.`;
    }

    if (today < vacationEndExclusive) {
      return "Suas férias começaram. Aproveite.";
    }

    return "Contagem finalizada. Bora planejar as próximas.";
  }

  function calculateProgress(today: Date, vacationStart: Date): number {
    const yearStart = new Date(vacationStart.getFullYear(), 0, 1);
    const spanFromYearStart = Math.max(1, diffDays(yearStart, vacationStart));
    const elapsedFromYearStart = diffDays(yearStart, today);

    if (today >= vacationStart) {
      return 100;
    }

    return Math.max(0, Math.min(100, (elapsedFromYearStart / spanFromYearStart) * 100));
  }

  function buildSnapshot(now: Date, config: AppConfig): VacationSnapshot {
    const today = startOfDay(now);
    const vacationStart = toLocalDate(config.startDate);
    const vacationEndExclusive = addDays(vacationStart, config.totalVacationDays);
    const lastVacationDay = addDays(vacationEndExclusive, -1);
    const totalUntilStart = diffDays(today, vacationStart);

    const { business, nonBusiness } = countBusinessAndNonBusinessDays(today, vacationStart);

    const msToStart = vacationStart.getTime() - now.getTime();
    const safeMsToStart = Math.max(0, msToStart);

    const hr = Math.floor((safeMsToStart % ONE_DAY_MS) / (1000 * 60 * 60));
    const min = Math.floor((safeMsToStart % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((safeMsToStart % (1000 * 60)) / 1000);

    const { vacationLeft, vacationStatus } = resolveVacationStatus(
      today,
      vacationStart,
      vacationEndExclusive,
      config.totalVacationDays
    );

    return {
      today,
      vacationStart,
      vacationEndExclusive,
      lastVacationDay,
      totalUntilStart,
      business,
      nonBusiness,
      vacationLeft,
      vacationStatus,
      progress: calculateProgress(today, vacationStart),
      clockText: resolveClockText(totalUntilStart, today, vacationEndExclusive, hr, min, sec)
    };
  }

  window.VacationCalculator = Object.freeze({
    buildSnapshot
  });
})();
