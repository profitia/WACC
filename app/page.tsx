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

const DEFAULT_INPUT: Input = {
  priceNow: 4500,
  priceForecast: 4900,
  volume: 500,
  wacc: 10,
  months: 4,
  storageCost: 40000,
};

export default function Home() {
  const [input, setInput] = useState<Input>(DEFAULT_INPUT);

  const result = useMemo(() => calculateSavings(input), [input]);

  function handleChange<K extends keyof Input>(key: K, value: Input[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-6 xl:px-12">

      {/* ── Header ── */}
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Model oszczędności vs. WACC
          </h1>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Kalkulator decyzji zakupowej</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Oceń opłacalność wcześniejszego zakupu względem kosztu kapitału i kosztów składowania.
        </p>
      </header>

      {/* ── Main 2-column layout ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[38%_62%] gap-10 items-start">

        {/* ── Left column: Form + Key Factors ── */}
        <div className="flex flex-col gap-6 min-w-0">
          <CalculatorForm values={input} onChange={handleChange} />
          <InfluenceCard
            priceDiff={result.priceDiff}
            wacc={input.wacc}
            months={input.months}
          />
        </div>

        {/* ── Right column: Decision → KPIs → Interpretation → Chart ── */}
        <div className="flex flex-col gap-6 min-w-0">

          {/* A. Decision Hero */}
          <DecisionBadge netResult={result.netResult} />

          {/* B–C. KPI grid + Break-even */}
          <ResultsPanel result={result} storageCost={input.storageCost} />

          {/* D. Interpretation */}
          <InterpretationCard netResult={result.netResult} />

          {/* E. Sensitivity Chart */}
          <div className="min-w-0">
            <SensitivityChart
              input={input}
              financingCost={result.financingCost}
              breakEvenPrice={result.breakEvenPrice}
            />
          </div>
        </div>
      </div>

      {/* ── Full-width analysis section ── */}
      <section className="max-w-7xl mx-auto mt-12">
        <SensitivityTable input={input} financingCost={result.financingCost} />
      </section>
    </main>
  );
}