import { pln } from '@/app/lib/formatters';

// ─── Próg "bliski zera" — spójny z DecisionBadge ─────────────────────────────
const THRESHOLD_PLN = 5_000;

// ─── Warianty ─────────────────────────────────────────────────────────────────

type Variant = 'profitable' | 'borderline' | 'unprofitable';

function getVariant(netResult: number): Variant {
  if (Math.abs(netResult) < THRESHOLD_PLN) return 'borderline';
  return netResult > 0 ? 'profitable' : 'unprofitable';
}

const STYLES: Record<Variant, { card: string; icon: string; title: string }> = {
  profitable: {
    card: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-500 bg-emerald-100',
    title: 'text-emerald-800',
  },
  borderline: {
    card: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-500 bg-amber-100',
    title: 'text-amber-800',
  },
  unprofitable: {
    card: 'bg-red-50 border-red-200',
    icon: 'text-red-500 bg-red-100',
    title: 'text-red-800',
  },
};

// ─── Ikony ────────────────────────────────────────────────────────────────────

function IconProfitable() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconBorderline() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function IconUnprofitable() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  );
}

const ICONS: Record<Variant, React.ReactNode> = {
  profitable:   <IconProfitable />,
  borderline:   <IconBorderline />,
  unprofitable: <IconUnprofitable />,
};

// ─── Treść interpretacji ──────────────────────────────────────────────────────

function buildText(variant: Variant, netResult: number): { headline: string; body: string } {
  switch (variant) {
    case 'profitable':
      return {
        headline: 'Zakup finansowo uzasadniony',
        body: `Zakup generuje około ${pln(netResult)} korzyści netto. Oznacza to, że wcześniejszy zakup jest finansowo uzasadniony przy obecnych założeniach.`,
      };
    case 'unprofitable':
      return {
        headline: 'Zakup finansowo nieuzasadniony',
        body: `Koszt finansowania i utrzymania zapasu przewyższa potencjalną oszczędność o ${pln(Math.abs(netResult))}. W tej konfiguracji wcześniejszy zakup nie jest opłacalny.`,
      };
    case 'borderline':
      return {
        headline: 'Wynik na granicy opłacalności',
        body: 'Decyzja znajduje się na granicy opłacalności – niewielkie zmiany parametrów mogą zmienić wynik.',
      };
  }
}

// ─── InterpretationCard ───────────────────────────────────────────────────────

interface Props {
  netResult: number;
}

export default function InterpretationCard({ netResult }: Props) {
  const variant = getVariant(netResult);
  const styles  = STYLES[variant];
  const { headline, body } = buildText(variant, netResult);

  return (
    <div className={`rounded-2xl border p-6 ${styles.card}`}>
      {/* Nagłówek sekcji */}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
        Interpretacja wyniku
      </p>

      {/* Karta */}
      <div className="flex items-start gap-4">
        {/* Ikona */}
        <div className={`shrink-0 rounded-xl p-2.5 ${styles.icon}`}>
          {ICONS[variant]}
        </div>

        {/* Tekst */}
        <div>
          <p className={`text-base font-bold leading-snug mb-2 ${styles.title}`}>
            {headline}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
