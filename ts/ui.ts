(() => {
  const { formatPtBr } = window.DateUtils;

  function mustGetElement(id: string): HTMLElement {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Elemento com id \"${id}\" não foi encontrado.`);
    }

    return element;
  }

  function mustGetButton(id: string): HTMLButtonElement {
    const element = document.getElementById(id);

    if (!element || !(element instanceof HTMLButtonElement)) {
      throw new Error(`Botão com id \"${id}\" não foi encontrado.`);
    }

    return element;
  }

  function getElements(): VacationElements {
    return {
      startDateText: mustGetElement("startDateText"),
      remainingDays: mustGetElement("remainingDays"),
      clockText: mustGetElement("clockText"),
      totalDays: mustGetElement("totalDays"),
      businessDays: mustGetElement("businessDays"),
      nonBusinessDays: mustGetElement("nonBusinessDays"),
      vacationLeft: mustGetElement("vacationLeft"),
      vacationStatus: mustGetElement("vacationStatus"),
      vacStartLabel: mustGetElement("vacStartLabel"),
      vacEndLabel: mustGetElement("vacEndLabel"),
      backToWorkLabel: mustGetElement("backToWorkLabel"),
      progressToStart: mustGetElement("progressToStart"),
      themeToggle: mustGetButton("themeToggle")
    };
  }

  function renderSnapshot(elements: VacationElements, snapshot: VacationSnapshot, locale: string): void {
    elements.startDateText.textContent = formatPtBr(snapshot.vacationStart, locale);
    elements.remainingDays.textContent = String(snapshot.totalUntilStart);
    elements.totalDays.textContent = String(snapshot.totalUntilStart);
    elements.businessDays.textContent = String(snapshot.business);
    elements.nonBusinessDays.textContent = String(snapshot.nonBusiness);
    elements.vacationLeft.textContent = String(snapshot.vacationLeft);
    elements.vacationStatus.textContent = snapshot.vacationStatus;

    elements.vacStartLabel.textContent = formatPtBr(snapshot.vacationStart, locale);
    elements.vacEndLabel.textContent = formatPtBr(snapshot.lastVacationDay, locale);
    elements.backToWorkLabel.textContent = formatPtBr(snapshot.vacationEndExclusive, locale);

    elements.progressToStart.style.width = `${snapshot.progress.toFixed(1)}%`;
    elements.clockText.textContent = snapshot.clockText;
  }

  window.VacationUI = Object.freeze({
    getElements,
    renderSnapshot
  });
})();
