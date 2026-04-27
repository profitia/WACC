'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { Input, Output } from '@/app/lib/calculations';
import { pln } from '@/app/lib/formatters';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  input: Input;
  financingCost: Output['financingCost'];
  breakEvenPrice: Output['breakEvenPrice'];
}

// ─── Scenariusze (spójne z SensitivityTable) ──────────────────────────────────

const SCENARIOS = [
  { label: '–5%',  multiplier: 0.95 },
  { label: 'Baza', multiplier: 1.00 },
  { label: '+5%',  multiplier: 1.05 },
  { label: '+10%', multiplier: 1.10 },
] as const;

function buildData(input: Input, financingCost: number) {
  const { priceNow, priceForecast, volume, storageCost } = input;
  return SCENARIOS.map(({ label, multiplier }) => {
    const isBase     = multiplier === 1.00;
    const scenPrice  = priceForecast * multiplier;
    const netBenefit = (scenPrice - priceNow) * volume - (financingCost + storageCost);
    return { label, netBenefit, isBase };
  });
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const positive = value >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md text-sm min-w-[180px]">
      <p className="font-semibold text-slate-700 mb-2">Scenariusz: {label}</p>
      <p className={`text-base font-bold mb-2 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {pln(value)}
      </p>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
          positive
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${positive ? 'bg-emerald-500' : 'bg-red-500'}`} />
        {positive ? 'Opłacalny scenariusz' : 'Nieopłacalny scenariusz'}
      </span>
    </div>
  );
}

// ─── Label nad słupkiem Baza ──────────────────────────────────────────────────

interface LabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: boolean;
}

function BaseLabel({ x = 0, y = 0, width = 0, value }: LabelProps) {
  if (!value) return null;
  return (
    <g>
      <rect x={x + width / 2 - 62} y={y - 30} width={124} height={20} rx={6} fill="#3b82f6" />
      <text
        x={x + width / 2}
        y={y - 16}
        textAnchor="middle"
        fill="#fff"
        fontSize={10}
        fontWeight={600}
      >
        Aktualny scenariusz
      </text>
    </g>
  );
}

// ─── SensitivityChart ─────────────────────────────────────────────────────────

export default function SensitivityChart({ input, financingCost, breakEvenPrice }: Props) {
  const data = buildData(input, financingCost);

  return (
    <div>
      {/* Nagłówek */}
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
        Wykres
      </p>
      <p className="text-base font-bold text-slate-800 mb-6">
        Wynik netto wg scenariusza ceny T1
      </p>

      {/* Wykres */}
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 40, right: 16, bottom: 0, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) =>
              new Intl.NumberFormat('pl-PL', {
                notation: 'compact',
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0,
              }).format(v)
            }
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
          <Bar dataKey="netBenefit" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={
                  entry.isBase
                    ? entry.netBenefit >= 0 ? '#059669' : '#dc2626'
                    : entry.netBenefit >= 0 ? '#10b981' : '#ef4444'
                }
                fillOpacity={entry.isBase ? 1 : 0.6}
                stroke={entry.isBase ? '#1e3a5f' : 'none'}
                strokeWidth={entry.isBase ? 2 : 0}
              />
            ))}
            <LabelList dataKey="isBase" content={(props) => <BaseLabel {...(props as LabelProps)} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Break-even badge */}
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="shrink-0 rounded-lg bg-amber-100 p-2 text-amber-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm text-amber-700">Próg opłacalności znajduje się przy cenie:</span>
          <span className="text-base font-bold text-amber-900">{pln(breakEvenPrice)}</span>
          <span className="text-xs text-amber-600">/ szt.</span>
        </div>
      </div>
    </div>
  );
}
