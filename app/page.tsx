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
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 px-4 xl:px-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <h1 className="text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
          Model oszczędności vs. WACC
        </h1>
      </div>

      {/* ── Main grid: 1 col → 2 col (lg) → 3 col (xl) ──────────────────── */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 items-start">

        {/* Col 1 — Form */}
        <div className="lg:col-span-1">
          <CalculatorForm values={input} onChange={handleChange} />
        </div>

        {/* Col 2 — Results + cards */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <DecisionBadge netResult={result.netResult} />
          <ResultsPanel result={result} storageCost={input.storageCost} />
          <InterpretationCard netResult={result.netResult} />
          <InfluenceCard
            priceDiff={result.priceDiff}
            wacc={input.wacc}
            months={input.months}
          />
        </div>

        {/* Col 3 — Chart (desktop only: moves from below to right column) */}
        <div className="lg:col-span-2 xl:col-span-1">
          <SensitivityChart
            input={input}
            financingCost={result.financingCost}
            breakEvenPrice={result.breakEvenPrice}
          />
        </div>
      </div>

      {/* ── Sensitivity table — full width below ──────────────────────────── */}
      <div className="max-w-[1400px] mx-auto mt-8 xl:mt-10">
        <SensitivityTable input={input} financingCost={result.financingCost} />
      </div>
    </main>
  );
}