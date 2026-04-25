// ─── Próg "bliski zera" – ±2% wartości zakupu lub stała kwota ────────────────
// Uznajemy wynik za "na granicy", gdy jego wartość bezwzględna < THRESHOLD_PLN
const THRESHOLD_PLN = 5_000;

type Variant = 'profitable' | 'borderline' | 'unprofitable';

function getVariant(netResult: number): Variant {
  if (Math.abs(netResult) < THRESHOLD_PLN) return 'borderline';
  return netResult > 0 ? 'profitable' : 'unprofitable';
}

// ─── Konfiguracja wariantów ───────────────────────────────────────────────────

const CONFIG = {
  profitable: {
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-600/30',
    label: 'Zakup opłacalny',
    comment: 'Korzyść cenowa przewyższa koszt kapitału i koszty dodatkowe.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  borderline: {
    bg: 'bg-amber-400',
    ring: 'ring-amber-500/30',
    label: 'Na granicy opłacalności',
    comment: 'Wynik jest bliski zeru — drobna zmiana ceny lub kosztów może go odwrócić.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  unprofitable: {
    bg: 'bg-red-500',
    ring: 'ring-red-600/30',
    label: 'Zakup nieopłacalny',
    comment: 'Koszt kapitału i koszty dodatkowe przewyższają korzyść cenową.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  netResult: number;
}

// ─── DecisionBadge ────────────────────────────────────────────────────────────

export default function DecisionBadge({ netResult }: Props) {
  const variant = getVariant(netResult);
  const { bg, ring, label, comment, icon } = CONFIG[variant];

  return (
    <div className={`rounded-2xl p-5 text-white shadow-md ring-4 ${bg} ${ring}`}>
      <div className="flex items-start gap-4">
        {/* Ikona */}
        <div className="shrink-0 opacity-90 mt-0.5">{icon}</div>

        {/* Treść */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide opacity-75 mb-1">
            Ocena decyzji zakupowej
          </p>
          <p className="text-2xl font-bold leading-tight">{label}</p>
          <p className="text-sm opacity-80 mt-2 leading-snug">{comment}</p>
        </div>
      </div>
    </div>
  );
}
