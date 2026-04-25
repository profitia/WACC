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
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 px-4">
      
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Model oszczędności vs. WACC
        </h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalculatorForm values={input} onChange={handleChange} />

        <div className="flex flex-col gap-6">
          <DecisionBadge netResult={result.netResult} />
          <ResultsPanel result={result} storageCost={input.storageCost} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <SensitivityTable input={input} financingCost={result.financingCost} />
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <SensitivityChart
          input={input}
          financingCost={result.financingCost}
          breakEvenPrice={result.breakEvenPrice}
        />
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <InterpretationCard netResult={result.netResult} />
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <InfluenceCard
          priceDiff={result.priceDiff}
          wacc={input.wacc}
          months={input.months}
        />
      </div>
    </main>
  );
}