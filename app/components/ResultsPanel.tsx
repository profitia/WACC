import type { Output } from '@/app/lib/calculations';
import { pln, pct, num } from '@/app/lib/formatters';

// ─── Typy ─────────────────────────────────────────────────────────────────────

type Highlight = 'positive' | 'negative' | 'neutral';

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: Highlight;
  large?: boolean;
}

interface Props {
  result: Output;
  storageCost: number;
}

// ─── Wewnętrzny wiersz wyniku ─────────────────────────────────────────────────

function ResultRow({ label, value, highlight, large }: ResultRowProps) {
  const valueColor =
    highlight === 'positive'
      ? 'text-emerald-600'
      : highlight === 'negative'
        ? 'text-red-500'
        : 'text-slate-700';

  return (
    <div
      className={`flex items-center justify-between border-b border-slate-100 last:border-0 ${
        large ? 'py-3' : 'py-2'
      }`}
    >
      <span className={`text-sm ${large ? 'font-medium text-slate-600' : 'text-slate-500'}`}>
        {label}
      </span>
      <span className={`font-semibold tabular-nums ${valueColor} ${large ? 'text-base' : 'text-sm'}`}>
        {value}
      </span>
    </div>
  );
}

// ─── ResultsPanel ─────────────────────────────────────────────────────────────

export default function ResultsPanel({ result, storageCost }: Props) {
  const { priceDiff, benefit, purchaseValue, financingCost, totalCost, netResult, breakEvenPrice } = result;
  const returnRate = purchaseValue > 0 ? netResult / purchaseValue : 0;

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 xl:p-8">
      <h2 className="text-base xl:text-lg font-semibold text-slate-700 mb-4 xl:mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
        Obliczenia
      </h2>

      <div className="space-y-0">
        <ResultRow
          label="Różnica ceny (T1 − T0)"
          value={`${num(priceDiff)} PLN/szt.`}
          highlight={priceDiff > 0 ? 'positive' : 'negative'}
        />
        <ResultRow
          label="Korzyść cenowa brutto"
          value={pln(benefit)}
          highlight={benefit > 0 ? 'positive' : 'negative'}
        />
        <ResultRow
          label="Wartość zakupu w T0"
          value={pln(purchaseValue)}
        />
        <ResultRow
          label="Koszt finansowania (WACC)"
          value={pln(financingCost)}
          highlight="negative"
        />
        <ResultRow
          label="Koszty dodatkowe (składowanie / ubezp.)"
          value={pln(storageCost)}
          highlight="negative"
        />
        <ResultRow
          label="Łączny koszt wcześniejszego zakupu"
          value={pln(totalCost)}
          highlight="negative"
        />
        <ResultRow
          label="Korzyść netto"
          value={pln(netResult)}
          highlight={netResult > 0 ? 'positive' : 'negative'}
          large
        />
      </div>

      {/* Dynamiczny komentarz */}
      {netResult !== 0 && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm leading-snug border ${
            netResult > 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {netResult > 0 ? (
            <>
              Decyzja generuje{' '}
              <span className="font-bold tabular-nums">{pln(netResult)}</span>{' '}
              korzyści netto — wcześniejszy zakup jest finansowo uzasadniony przy założonych parametrach.
            </>
          ) : (
            <>
              Koszt wcześniejszego zakupu przewyższa potencjalną oszczędność o{' '}
              <span className="font-bold tabular-nums">{pln(Math.abs(netResult))}</span>{' '}
              — zakup w T1 byłby korzystniejszy finansowo.
            </>
          )}
        </div>
      )}

      {/* Break-even */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5 rounded-lg bg-white border border-slate-200 p-1.5 shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              Minimalna cena prognozowana (break-even)
            </p>
            <p className="text-xl font-bold text-slate-800 tabular-nums">
              {pln(breakEvenPrice)}<span className="text-sm font-medium text-slate-400 ml-1">/ szt.</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Przy tej cenie decyzja = 0 — korzyść cenowa dokładnie pokrywa koszt kapitału i koszty dodatkowe.
            </p>
          </div>
        </div>
      </div>

      {/* Zwrot */}
      <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">Zwrot netto / wartość zakupu T0</p>
        <p className={`text-sm font-semibold tabular-nums ${returnRate > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {pct(returnRate)}
        </p>
      </div>
    </div>
  );
}
