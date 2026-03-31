(() => {
  const THEME_STORAGE_KEY = "vacation-theme";

  type AppTheme = "light" | "dark";

  function detectPreferredTheme(): AppTheme {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme: AppTheme, toggleButton: HTMLButtonElement): void {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    toggleButton.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

    toggleButton.textContent = theme === "dark"
      ? "Tema claro"
      : "Tema escuro";
  }

  async function initialize(): Promise<void> {
    const configService = window.VacationConfigService;
    const fallbackConfig: AppConfig = {
      startDate: "2026-05-04",
      totalVacationDays: 30,
      locale: "pt-BR"
    };

    const config = configService
      ? await configService.loadConfig()
      : fallbackConfig;

    const elements = window.VacationUI.getElements();
    let currentTheme: AppTheme = detectPreferredTheme();
    applyTheme(currentTheme, elements.themeToggle);

    elements.themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme, elements.themeToggle);
    });

    function update(): void {
      const snapshot = window.VacationCalculator.buildSnapshot(new Date(), config);
      window.VacationUI.renderSnapshot(elements, snapshot, config.locale);
    }

    update();
    setInterval(update, 1000);
  }

  void initialize();
})();
