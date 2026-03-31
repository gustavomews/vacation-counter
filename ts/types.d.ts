interface AppConfig {
  readonly startDate: string;
  readonly totalVacationDays: number;
  readonly locale: string;
}

interface DateUtilsApi {
  readonly ONE_DAY_MS: number;
  toLocalDate(isoDate: string): Date;
  formatPtBr(date: Date, locale: string): string;
  startOfDay(date: Date): Date;
  addDays(date: Date, amount: number): Date;
  diffDays(from: Date, to: Date): number;
  toIso(date: Date): string;
}

interface HolidayServiceApi {
  getNationalHolidays(year: number): Set<string>;
}

interface VacationSnapshot {
  readonly today: Date;
  readonly vacationStart: Date;
  readonly vacationEndExclusive: Date;
  readonly lastVacationDay: Date;
  readonly totalUntilStart: number;
  readonly business: number;
  readonly nonBusiness: number;
  readonly vacationLeft: number;
  readonly vacationStatus: string;
  readonly progress: number;
  readonly clockText: string;
}

interface VacationCalculatorApi {
  buildSnapshot(now: Date, config: AppConfig): VacationSnapshot;
}

interface VacationElements {
  readonly startDateText: HTMLElement;
  readonly remainingDays: HTMLElement;
  readonly clockText: HTMLElement;
  readonly totalDays: HTMLElement;
  readonly businessDays: HTMLElement;
  readonly nonBusinessDays: HTMLElement;
  readonly vacationLeft: HTMLElement;
  readonly vacationStatus: HTMLElement;
  readonly vacStartLabel: HTMLElement;
  readonly vacEndLabel: HTMLElement;
  readonly backToWorkLabel: HTMLElement;
  readonly progressToStart: HTMLElement;
  readonly themeToggle: HTMLButtonElement;
}

interface VacationUIApi {
  getElements(): VacationElements;
  renderSnapshot(elements: VacationElements, snapshot: VacationSnapshot, locale: string): void;
}

interface VacationConfigServiceApi {
  readonly DEFAULT_CONFIG: AppConfig;
  loadConfig(): Promise<AppConfig>;
}

interface Window {
  DateUtils: DateUtilsApi;
  HolidayService: HolidayServiceApi;
  VacationCalculator: VacationCalculatorApi;
  VacationUI: VacationUIApi;
  VacationConfigService: VacationConfigServiceApi;
}
