import type { Input, Output } from '@/app/lib/calculations';
import { pln } from '@/app/lib/formatters';

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface Props {
  input: Input;
  financingCost: Output['financingCost'];
}

interface ScenarioRow {
  label: string;
  multiplier: number;
  isBase: boolean;
  priceForecast: number;
  netBenefit: number;
  isProfitable: boolean;
}

// ─── Scenariusze (mapowanie z arkusza "Model", A14:C17) ───────────────────────

const SCENARIOS = [
  { label: '–5%',  multiplier: 0.95, isBase: false },
  { label: 'Baza', multiplier: 1.00, isBase: true  },
  { label: '+5%',  multiplier: 1.05, isBase: false },
  { label: '+10%', multiplier: 1.10, isBase: false },
] as const;

// ─── Obliczenie wierszy wewnątrz komponentu ───────────────────────────────────
//
// Wzór (Excel C14:C17):
//   netBenefit = (scenPrice − priceNow) × volume − (financingCost + storageCost)

function buildRows(input: Input, financingCost: number): ScenarioRow[] {
  const { priceNow, priceForecast, volume, storageCost } = input;

  return SCENARIOS.map(({ label, multiplier, isBase }) => {
    const scenPrice  = priceForecast * multiplier;
    const netBenefit = (scenPrice - priceNow) * volume - (financingCost + storageCost);
    return { label, multiplier, isBase, priceForecast: scenPrice, netBenefit, isProfitable: netBenefit > 0 };
  });
}

// ─── Subkomponenty ────────────────────────────────────────────────────────────

function StatusBadge({ isProfitable }: { isProfitable: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
        isProfitable
          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
          : 'bg-red-50 text-red-500 ring-1 ring-red-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isProfitable ? 'bg-emerald-500' : 'bg-red-400'}`} />
      {isProfitable ? 'Opłacalne' : 'Nieopłacalne'}
    </span>
  );
}

// ─── SensitivityTable ─────────────────────────────────────────────────────────

export default function SensitivityTable({ input, financingCost }: Props) {
  const rows = buildRows(input, financingCost);

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
        Analiza wrażliwości
      </h2>
      <p className="text-xs text-slate-400 mb-5 ml-4">
        Wpływ zmiany prognozy ceny T1 na korzyść netto
      </p>

      {/* ── Tabela (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left pb-3 pr-4 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                Scenariusz
              </th>
              <th className="text-right pb-3 px-4 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                Cena T1
              </th>
              <th className="text-right pb-3 px-4 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                Wynik netto
              </th>
              <th className="pb-3 pl-4 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className={`border-b border-slate-100 last:border-0 transition-colors ${
                  row.isBase ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <td className="py-3 pr-4">
                  <span className={`font-medium ${row.isBase ? 'text-blue-600' : 'text-slate-700'}`}>
                    {row.label}
                  </span>
                  {row.isBase && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded font-medium">
                      baza
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">
                  {pln(row.priceForecast)}
                </td>
                <td
                  className={`py-3 px-4 text-right tabular-nums font-bold ${
                    row.isProfitable ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {pln(row.netBenefit)}
                </td>
                <td className="py-3 pl-4">
                  <StatusBadge isProfitable={row.isProfitable} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Karty (mobile) ── */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-xl border p-4 ${
              row.isBase
                ? 'border-blue-200 bg-blue-50/60'
                : row.isProfitable
                  ? 'border-emerald-100 bg-white'
                  : 'border-red-100 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${row.isBase ? 'text-blue-600' : 'text-slate-700'}`}>
                  {row.label}
                </span>
                {row.isBase && (
                  <span className="text-xs bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded font-medium">
                    baza
                  </span>
                )}
              </div>
              <StatusBadge isProfitable={row.isProfitable} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Cena T1</p>
                <p className="text-sm font-semibold text-slate-700 tabular-nums">
                  {pln(row.priceForecast)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Wynik netto</p>
                <p
                  className={`text-sm font-bold tabular-nums ${
                    row.isProfitable ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {pln(row.netBenefit)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
