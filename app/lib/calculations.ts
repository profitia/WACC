// ─── Typy wejściowe ───────────────────────────────────────────────────────────

export type Input = {
  priceNow: number;       // Cena zakupu w T0 [PLN/szt.]        – Excel C4
  priceForecast: number;  // Prognozowana cena w T1 [PLN/szt.]  – Excel C5
  volume: number;         // Wolumen zakupu [szt.]              – Excel C6
  wacc: number;           // WACC [% rocznie, np. 10 = 10%]     – Excel C7
  months: number;         // Okres finansowania [miesiące]      – Excel C8
  storageCost: number;    // Koszty składowania/ubezp. [PLN]    – Excel C9
};

// ─── Typy wyjściowe ───────────────────────────────────────────────────────────

export type Output = {
  priceDiff: number;      // F4  Różnica ceny (T1 − T0)
  benefit: number;        // F5  Korzyść cenowa brutto
  purchaseValue: number;  // F6  Wartość zakupu w T0
  financingCost: number;  // F7  Koszt finansowania (WACC)
  totalCost: number;      // F8  Łączny koszt wcześniejszego zakupu
  netResult: number;      // F9  Korzyść netto
  breakEvenPrice: number; // I6  Próg ceny T1 dla break-even
};

// ─── Typ wiersza analizy wrażliwości ─────────────────────────────────────────

export type SensitivityRow = {
  label: string;
  multiplier: number;
  priceForecast: number;  // Cena T1 w danym scenariuszu
  netBenefit: number;
  isProfitable: boolean;
};

// ─── Scenariusze wrażliwości (arkusz "Model", A14:C17) ────────────────────────

const SENSITIVITY_SCENARIOS = [
  { label: '–5% vs baza',  multiplier: 0.95 },
  { label: 'Baza',         multiplier: 1.00 },
  { label: '+5% vs baza',  multiplier: 1.05 },
  { label: '+10% vs baza', multiplier: 1.10 },
] as const;

// ─── Główna funkcja kalkulacji ────────────────────────────────────────────────
//
// Wzory (arkusz "Model"):
//   F4  priceDiff      = C5 - C4
//   F5  benefit        = (C5 - C4) × C6
//   F6  purchaseValue  = C4 × C6
//   F7  financingCost  = F6 × (C7/100) × (C8 / 12)
//   F8  totalCost      = F7 + C9
//   F9  netResult      = F5 - F8
//   I6  breakEvenPrice = C4 + F8 / C6

export function calculateSavings(input: Input): Output {
  const { priceNow, priceForecast, volume, wacc, months, storageCost } = input;

  const priceDiff     = priceForecast - priceNow;                    // F4
  const benefit       = priceDiff * volume;                           // F5
  const purchaseValue = priceNow * volume;                            // F6
  const financingCost = purchaseValue * (wacc / 100) * (months / 12);// F7
  const totalCost     = financingCost + storageCost;                  // F8
  const netResult     = benefit - totalCost;                          // F9
  const breakEvenPrice = volume > 0                                   // I6
    ? priceNow + totalCost / volume
    : 0;

  return { priceDiff, benefit, purchaseValue, financingCost, totalCost, netResult, breakEvenPrice };
}

// ─── Analiza wrażliwości ──────────────────────────────────────────────────────
//
// Wzór (arkusz "Model", C14:C17):
//   scenNet = (scenPrice - priceNow) × volume − (financingCost + storageCost)

export function calculateSensitivity(input: Input, financingCost: number): SensitivityRow[] {
  const { priceNow, priceForecast, volume, storageCost } = input;

  return SENSITIVITY_SCENARIOS.map(({ label, multiplier }) => {
    const scenPrice  = priceForecast * multiplier;
    const netBenefit = (scenPrice - priceNow) * volume - (financingCost + storageCost);
    return { label, multiplier, priceForecast: scenPrice, netBenefit, isProfitable: netBenefit > 0 };
  });
}
