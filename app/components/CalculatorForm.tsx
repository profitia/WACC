import type { Input } from '@/app/lib/calculations';

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  hint?: string;
}

interface Props {
  values: Input;
  onChange: <K extends keyof Input>(key: K, value: Input[K]) => void;
}

// ─── Wewnętrzny komponent pola ────────────────────────────────────────────────

function InputField({ label, unit, value, onChange, min = 0, step = 1, hint }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {hint && <span className="ml-1 normal-case font-normal text-slate-400">({hint})</span>}
      </label>
      <div className="flex items-center w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30 transition">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 rounded-l-lg px-3 py-2 text-right text-slate-800 font-semibold text-sm outline-none bg-transparent"
        />
        <span className="shrink-0 w-[76px] px-2 py-2 text-xs text-slate-400 border-l border-slate-200 bg-slate-50 rounded-r-lg text-center truncate">
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── CalculatorForm ───────────────────────────────────────────────────────────

export default function CalculatorForm({ values, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wide">
        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
        Założenia wejściowe
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Cena zakupu w T0"
          unit="PLN / szt."
          value={values.priceNow}
          onChange={(v) => onChange('priceNow', v)}
          step={50}
        />
        <InputField
          label="Prognozowana cena w T1"
          unit="PLN / szt."
          value={values.priceForecast}
          onChange={(v) => onChange('priceForecast', v)}
          step={50}
        />
        <InputField
          label="Wolumen zakupu"
          unit="jednostki"
          value={values.volume}
          onChange={(v) => onChange('volume', v)}
          step={10}
        />
        <InputField
          label="WACC"
          unit="% rocznie"
          value={values.wacc}
          onChange={(v) => onChange('wacc', v)}
          min={0}
          step={0.5}
          hint="koszt kapitału"
        />
        <InputField
          label="Okres finansowania"
          unit="miesiące"
          value={values.months}
          onChange={(v) => onChange('months', v)}
          min={1}
          step={1}
        />
        <InputField
          label="Koszty składowania / ubezp."
          unit="PLN"
          value={values.storageCost}
          onChange={(v) => onChange('storageCost', v)}
          step={1000}
        />
      </div>

      {/* Wzory – skrót */}
      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-400 leading-relaxed space-y-1">
        <p>
          <span className="font-semibold text-slate-500">Korzyść brutto</span>
          {' '}= (Cena T1 − Cena T0) × Wolumen
        </p>
        <p>
          <span className="font-semibold text-slate-500">Koszt WACC</span>
          {' '}= Wartość T0 × WACC × Okres/12
        </p>
        <p>
          <span className="font-semibold text-slate-500">Korzyść netto</span>
          {' '}= Korzyść brutto − Koszt WACC − Koszty dodatkowe
        </p>
      </div>
    </div>
  );
}
