(() => {
  const DEFAULT_CONFIG: AppConfig = Object.freeze({
    startDate: "2026-05-04", // 04/05/2026
    totalVacationDays: 30,
    locale: "pt-BR"
  });

  function parseEnvText(envText: string): Record<string, string> {
    const parsed: Record<string, string> = {};
    const lines = envText.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      parsed[key] = value;
    }

    return parsed;
  }

  function isValidIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  function normalizeStartDate(value: string | undefined): string {
    if (!value || !isValidIsoDate(value)) {
      return DEFAULT_CONFIG.startDate;
    }

    return value;
  }

  function normalizeTotalDays(value: string | undefined): number {
    const parsed = Number.parseInt(value ?? "", 10);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return DEFAULT_CONFIG.totalVacationDays;
    }

    return parsed;
  }

  function normalizeLocale(value: string | undefined): string {
    if (!value) {
      return DEFAULT_CONFIG.locale;
    }

    return value;
  }

  async function loadConfig(): Promise<AppConfig> {
    try {
      const response = await fetch(".env", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Falha ao carregar .env");
      }

      const envText = await response.text();
      const env = parseEnvText(envText);

      return Object.freeze({
        startDate: normalizeStartDate(env.VACATION_START_DATE),
        totalVacationDays: normalizeTotalDays(env.VACATION_TOTAL_DAYS),
        locale: normalizeLocale(env.VACATION_LOCALE)
      });
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  window.VacationConfigService = Object.freeze({
    loadConfig,
    DEFAULT_CONFIG
  });
})();
