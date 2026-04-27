import type { Output } from '@/app/lib/calculations';
import { pln } from '@/app/lib/formatters';

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface Props {
  result: Output;
  storageCost: number;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  subLabel?: string;
  highlight?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function KPICard({ label, value, subLabel, highlight, icon }: KPICardProps) {
  const valueColor =
    highlight === 'positive'
      ? 'text-emerald-600'
      : highlight === 'negative'
        ? 'text-red-500'
        : 'text-slate-800';

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-400 leading-snug">
          {label}
        </p>
        <div className="shrink-0 rounded-lg bg-white border border-slate-200 p-1.5 text-slate-400 shadow-sm">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-bold tabular-nums leading-tight break-words ${valueColor}`}>
          {value}
        </p>
        {subLabel && (
          <p className="text-xs text-slate-400 mt-1">{subLabel}</p>
        )}
      </div>
    </div>
  );
}

// ─── Ikony ────────────────────────────────────────────────────────────────────

function IconBenefit() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconCost() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  );
}

function IconNet() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconROI() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  );
}

// ─── ResultsPanel ─────────────────────────────────────────────────────────────

export default function ResultsPanel({ result }: Props) {
  const { benefit, totalCost, netResult, purchaseValue, breakEvenPrice } = result;
  const roi = purchaseValue > 0 ? (netResult / purchaseValue) * 100 : 0;
  const roiPrefix = roi > 0 ? '+' : '';

  return (
    <div className="space-y-4">

      {/* ── KPI grid 2×2 ── */}
      <div className="grid grid-cols-2 gap-4">
        <KPICard
          label="Korzyść brutto"
          value={pln(benefit)}
          highlight={benefit >= 0 ? 'positive' : 'negative'}
          icon={<IconBenefit />}
        />
        <KPICard
          label="Łączny koszt"
          value={pln(totalCost)}
          subLabel="WACC + składowanie"
          highlight="negative"
          icon={<IconCost />}
        />
        <KPICard
          label="Korzyść netto"
          value={pln(netResult)}
          highlight={netResult >= 0 ? 'positive' : 'negative'}
          icon={<IconNet />}
        />
        <KPICard
          label="ROI zakupu"
          value={`${roiPrefix}${roi.toFixed(1)} %`}
          subLabel="względem wartości zakupu"
          highlight={roi >= 0 ? 'positive' : 'negative'}
          icon={<IconROI />}
        />
      </div>

      {/* ── Break-even card ── */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-400 mb-0.5">
            Próg opłacalności (break-even)
          </p>
          <p className="text-sm text-slate-600 leading-snug">
            Minimalna cena T1, przy której zakup staje się opłacalny
          </p>
        </div>
        <p className="text-xl font-bold tabular-nums text-blue-700 shrink-0">
          {pln(breakEvenPrice)}<span className="text-sm font-medium text-blue-400 ml-1">/ szt.</span>
        </p>
      </div>
    </div>
  );
}
