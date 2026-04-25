'use client';

import { useState, useMemo } from 'react';
import { calculateSavings, type Input } from '@/app/lib/calculations';
import CalculatorForm from '@/app/components/CalculatorForm';
import DecisionBadge from '@/app/components/DecisionBadge';
import ResultsPanel from '@/app/components/ResultsPanel';
import SensitivityTable from '@/app/components/SensitivityTable';
import InterpretationCard from '@/app/components/InterpretationCard';
import InfluenceCard from '@/app/components/InfluenceCard';
import SensitivityChart from '@/app/components/SensitivityChart';

// ─── Wartości domyślne (z arkusza "Model", kolumna C) ────────────────────────

const DEFAULT_INPUT: Input = {
  priceNow: 4500,
  priceForecast: 4900,
  volume: 500,
  wacc: 10,
  months: 4,
  storageCost: 40000,
};

// ─── Główny komponent ─────────────────────────────────────────────────────────

export default function Home() {
  const [input, setInput] = useState<Input>(DEFAULT_INPUT);

  const result = useMemo(() => calculateSavings(input), [input]);

  function handleChange<K extends keyof Input>(key: K, value: Input[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 px-4">
      {/* Baner testowy */}
      <p className="text-center text-2xl font-bold text-red-600 mb-6">VERSION 2 – TEST</p>

      {/* Nagłówek */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-blue-600 p-3 shadow-lg shadow-blue-200">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Model oszczędności vs. WACC</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Czy wcześniejszy zakup w T0 jest finansowo uzasadniony względem zakupu w T1?
            </p>
          </div>
        </div>
      </div>

      {/* Inputy + Wyniki */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalculatorForm values={input} onChange={handleChange} />

        <div className="flex flex-col gap-6">
          <DecisionBadge netResult={result.netResult} />
          <ResultsPanel result={result} storageCost={input.storageCost} />
        </div>
      </div>

      {/* Analiza wrażliwości */}
      <div className="max-w-5xl mx-auto mt-6">
        <SensitivityTable input={input} financingCost={result.financingCost} />
      </div>

      {/* Wykres wrażliwości */}
      <div className="max-w-5xl mx-auto mt-6">
        <SensitivityChart
          input={input}
          financingCost={result.financingCost}
          breakEvenPrice={result.breakEvenPrice}
        />
      </div>

      {/* Interpretacja wyniku */}
      <div className="max-w-5xl mx-auto mt-6">
        <InterpretationCard netResult={result.netResult} />
      </div>

      {/* Kluczowe czynniki */}
      <div className="max-w-5xl mx-auto mt-6">
        <InfluenceCard
          priceDiff={result.priceDiff}
          wacc={input.wacc}
          months={input.months}
        />
      </div>

      {/* Stopka */}
      <p className="text-center text-xs text-slate-400 mt-8">
        Model: WACC vs. Oszczędności na zakupach · obliczenia wykonywane w przeglądarce
      </p>
    </main>
  );
}
