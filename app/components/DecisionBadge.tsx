import { pln } from '@/app/lib/formatters';

// ─── Próg "bliski zera" ────────────────────────────────────────────────────────
const THRESHOLD_PLN = 5_000;

type Variant = 'profitable' | 'borderline' | 'unprofitable';

function getVariant(netResult: number): Variant {
  if (Math.abs(netResult) < THRESHOLD_PLN) return 'borderline';
  return netResult > 0 ? 'profitable' : 'unprofitable';
}

// ─── Konfiguracja wariantów ───────────────────────────────────────────────────

const CONFIG = {
  profitable: {
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    label: 'Zakup opłacalny',
    comment: 'Korzyść cenowa przewyższa koszt kapitału i koszty dodatkowe.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  borderline: {
    bg: 'bg-gradient-to-br from-amber-400 to-amber-500',
    label: 'Na granicy opłacalności',
    comment: 'Wynik jest bliski zeru — drobna zmiana ceny lub kosztów może go odwrócić.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  unprofitable: {
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    label: 'Zakup nieopłacalny',
    comment: 'Koszt kapitału i koszty dodatkowe przewyższają korzyść cenową.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  netResult: number;
}

// ─── Decision Hero ────────────────────────────────────────────────────────────

export default function DecisionBadge({ netResult }: Props) {
  const variant = getVariant(netResult);
  const { bg, label, comment, icon } = CONFIG[variant];
  const prefix = netResult > 0 ? '+' : '';
  const businessSentence =
    variant === 'profitable'
      ? `Wcześniejszy zakup generuje realne oszczędności względem kosztu kapitału.`
      : variant === 'unprofitable'
        ? `Koszt kapitału i składowania przewyższa prognozowaną korzyść cenową.`
        : `Wynik jest na granicy — każda zmiana parametrów może go odwrócić.`;

  return (
    <div className="flex justify-center">
      <div className={`w-full max-w-[640px] rounded-2xl p-7 text-white shadow-lg ${bg}`}>
        {/* Tiny label row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="shrink-0 opacity-80">{icon}</div>
          <p className="min-w-0 text-xs font-semibold uppercase tracking-widest opacity-70">
            Ocena decyzji zakupowej
          </p>
        </div>

        {/* Status name */}
        <p className="text-sm font-semibold opacity-80 mb-2">{label}</p>

        {/* DOMINANT: net result number */}
        <p className="text-4xl xl:text-5xl font-black tracking-tight leading-none tabular-nums mb-4 break-words">
          {prefix}{pln(netResult)}
        </p>

        {/* Separator */}
        <div className="w-12 h-px bg-white/25 mb-3" />

        {/* Short explanation */}
        <p className="text-sm opacity-75 leading-relaxed mb-1">{comment}</p>
        {/* Business sentence */}
        <p className="text-xs opacity-60 leading-relaxed">{businessSentence}</p>
      </div>
    </div>
  );
}
