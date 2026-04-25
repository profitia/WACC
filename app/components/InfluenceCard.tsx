import { pln } from '@/app/lib/formatters';

// ─── Pojedynczy czynnik ────────────────────────────────────────────────────────

interface Factor {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function FactorItem({ icon, label, value, description }: Factor) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 rounded-xl bg-blue-100 p-2.5 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Ikony ────────────────────────────────────────────────────────────────────

function IconPrice() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconWacc() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconMonths() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

// ─── InfluenceCard ────────────────────────────────────────────────────────────

interface Props {
  priceDiff: number;
  wacc: number;
  months: number;
}

export default function InfluenceCard({ priceDiff, wacc, months }: Props) {
  const factors: Factor[] = [
    {
      icon: <IconPrice />,
      label: 'Różnica ceny (T1 vs T0)',
      value: pln(priceDiff) + '/szt.',
      description: 'Spodziewana zmiana ceny między zakupem teraz a później.',
    },
    {
      icon: <IconWacc />,
      label: 'WACC (koszt kapitału)',
      value: `${wacc} % rocznie`,
      description: 'Im wyższy WACC, tym droższe finansowanie wcześniejszego zakupu.',
    },
    {
      icon: <IconMonths />,
      label: 'Okres finansowania',
      value: `${months} ${months === 1 ? 'miesiąc' : months < 5 ? 'miesiące' : 'miesięcy'}`,
      description: 'Dłuższy horyzont zwiększa koszt kapitału proporcjonalnie.',
    },
  ];

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
      {/* Nagłówek sekcji */}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
        Kluczowe czynniki
      </p>
      <p className="text-base font-bold text-slate-800 mb-1">
        Co ma największy wpływ na wynik?
      </p>
      <p className="text-sm text-slate-500 mb-6">
        Największy wpływ na opłacalność mają różnice cen oraz koszt kapitału (WACC).
      </p>

      {/* Trzy czynniki */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {factors.map((f) => (
          <FactorItem key={f.label} {...f} />
        ))}
      </div>
    </div>
  );
}
