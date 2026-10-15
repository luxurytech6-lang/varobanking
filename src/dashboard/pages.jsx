import { useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

/* =========================================================================
   Shared building blocks
   ========================================================================= */

const ICONS = {
  in: 'M19 14l-7 7m0 0l-7-7m7 7V3',
  out: 'M5 10l7-7m0 0l7 7m-7-7v18',
  transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  trend: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  check: 'M5 13l4 4L19 7',
  plane: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  device: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  eyeOff: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  plus: 'M12 4v16m8-8H4',
  x: 'M6 18L18 6M6 6l12 12',
  chevron: 'M19 9l-7 7-7-7',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  sparkle: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  sliders: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
};

export function Icon({ d, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Panel({ title, subtitle, children, action, className = '' }) {
  return (
    <div className={`panel rounded-xl sm:rounded-2xl border border-[#DDD8CC] bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-7 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            {title && <h2 className="serif m-0 text-lg sm:text-xl text-[#0F2A43] leading-tight">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-[#4A5B6C]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 sm:mb-6 flex flex-wrap items-end justify-between gap-3 anim-in">
      <div className="min-w-0">
        <h1 className="serif m-0 text-2xl sm:text-3xl text-[#0F2A43]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#4A5B6C]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const PILL = {
  green: 'bg-[#E7F6EE] text-[#1B7A4B]',
  amber: 'bg-[#FBF3E2] text-[#8A6A26]',
  red: 'bg-[#FDECEA] text-[#B3261E]',
  navy: 'bg-[#E8EEF5] text-[#0F2A43]',
  gray: 'bg-[#EFEDE8] text-[#4A5B6C]',
};
export function Pill({ tone = 'gray', children, dot = true }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${PILL[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Toggle({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-[#0F2A43]">{label}</label>
        {description && <p className="mt-0.5 text-xs text-[#4A5B6C]">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-[#0F2A43]' : 'bg-[#D6D1C4]'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}>
          {checked && <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-[#C9A24B]" />}
        </span>
      </button>
    </div>
  );
}

export function Meter({ value, max, label, sub, tone = 'navy' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const bar = pct > 85 ? 'bg-[#B3261E]' : tone === 'gold' ? 'bg-gradient-to-r from-[#C9A24B] to-[#EDD595]' : 'bg-gradient-to-r from-[#0F2A43] to-[#1E4B73]';
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-[#0F2A43]">{label}</span>
        <span className="whitespace-nowrap tabular-nums text-xs text-[#4A5B6C]">{sub}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#EFEBE1]" role="meter" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(pct, value > 0 ? 2 : 0)}%` }} />
      </div>
    </div>
  );
}

export function CopyButton({ value, label = 'Copy', dark = false }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); } catch { /* clipboard unavailable */ }
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${dark ? 'text-[#A8B8C8] hover:bg-white/10 hover:text-white' : 'text-[#8A6A26] hover:bg-[#F6F4EF]'}`}
    >
      <Icon d={done ? ICONS.check : ICONS.copy} className="h-4 w-4" />
    </button>
  );
}

function Segmented({ options, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg bg-[#EFEBE1] p-0.5">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${value === v ? 'bg-white text-[#0F2A43] shadow-sm' : 'text-[#4A5B6C] hover:text-[#0F2A43]'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'max-w-md' }) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="ap ap-portal fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[#0A1D30]/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={`relative max-h-[92dvh] w-full ${size} overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 anim-in`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="serif m-0 text-xl text-[#0F2A43]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#4A5B6C] transition hover:bg-[#F6F4EF] hover:text-[#0F2A43]">
            <Icon d={ICONS.x} className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

const money = (n, opts = {}) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', ...opts }).format(n);
const signed = (dir, n) => `${dir === 'in' ? '+' : '−'}${money(n)}`;
const lbl = 'text-xs text-[#4A5B6C]';
const inputCls = 'w-full rounded-md border border-[#CFC9BA] bg-white px-3 py-2 text-sm text-[#14202E] focus:border-[#B08A3E] focus:outline-none focus:ring-2 focus:ring-[#D8B76A]/35 transition';

/* =========================================================================
   Data (illustrative)
   ========================================================================= */

const CLIENT = { name: 'Alex Palmer', email: 'alex.palmer@example.com', phone: '+44 7700 900142', address: '14 Cadogan Square, London SW1X 0JU' };

const CATEGORY_ICON = { Transfer: ICONS.transfer, Investment: ICONS.trend, Card: ICONS.card, Income: ICONS.briefcase, Insurance: ICONS.shield, Travel: ICONS.plane };

const TRANSACTIONS = [
  { id: 't1', name: 'Harbour Property Ltd', cat: 'Transfer', dir: 'out', amount: 12000, day: 'Today', time: '10:24', status: 'Pending' },
  { id: 't2', name: 'Meridian Trust', cat: 'Transfer', dir: 'out', amount: 25000, day: 'Yesterday', time: '16:42' },
  { id: 't3', name: 'Global Equity Fund dividend', cat: 'Investment', dir: 'in', amount: 3120.45, day: 'Yesterday', time: '09:00' },
  { id: 't4', name: 'Boutique Mayfair', cat: 'Card', dir: 'out', amount: 420, day: 'Yesterday', time: '14:11', card: '4821' },
  { id: 't5', name: 'Okafor Holdings salary', cat: 'Income', dir: 'in', amount: 18500, day: 'Earlier this month', time: '10 Oct' },
  { id: 't6', name: 'Lloyd’s insurance premium', cat: 'Insurance', dir: 'out', amount: 1840, day: 'Earlier this month', time: '10 Oct' },
  { id: 't7', name: 'Emirates', cat: 'Travel', dir: 'out', amount: 6230, day: 'Earlier this month', time: '8 Oct', card: '7740' },
];

/* =========================================================================
   Recent activity (overview)
   ========================================================================= */

export function RecentActivity({ onViewAll }) {
  const [filter, setFilter] = useState('all');
  const rows = TRANSACTIONS.filter((t) => filter === 'all' || t.dir === filter);
  const totalIn = TRANSACTIONS.filter((t) => t.dir === 'in').reduce((s, t) => s + t.amount, 0);
  const totalOut = TRANSACTIONS.filter((t) => t.dir === 'out').reduce((s, t) => s + t.amount, 0);
  const groups = rows.reduce((acc, t) => { (acc[t.day] = acc[t.day] || []).push(t); return acc; }, {});

  return (
    <Panel
      title="Recent activity"
      action={<Segmented label="Filter activity" value={filter} onChange={setFilter} options={[['all', 'All'], ['in', 'Money in'], ['out', 'Money out']]} />}
    >
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#E4DFD2] bg-[#F7FBF8] px-3 py-2.5">
          <p className={lbl}>In this month</p>
          <p className="serif mt-0.5 text-lg tabular-nums text-[#1B7A4B]">+{money(totalIn)}</p>
        </div>
        <div className="rounded-lg border border-[#E4DFD2] bg-[#FBF9F4] px-3 py-2.5">
          <p className={lbl}>Out this month</p>
          <p className="serif mt-0.5 text-lg tabular-nums text-[#0F2A43]">−{money(totalOut)}</p>
        </div>
      </div>

      {Object.entries(groups).map(([day, items]) => (
        <div key={day} className="mb-1">
          <p className="mb-1 mt-3 text-[11px] font-semibold tracking-wide text-[#8A6A26]">{day}</p>
          <ul className="divide-y divide-[#EEEAE0]">
            {items.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.dir === 'in' ? 'bg-[#E7F6EE] text-[#1B7A4B]' : 'bg-[#F1EEE6] text-[#0F2A43]'}`}>
                  <Icon d={CATEGORY_ICON[t.cat]} className="h-[18px] w-[18px]" />
                  <span className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white ${t.dir === 'in' ? 'bg-[#1B7A4B]' : 'bg-[#0F2A43]'}`}>
                    <Icon d={t.dir === 'in' ? ICONS.in : ICONS.out} className="h-2.5 w-2.5 text-white" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#14202E]">{t.name}</p>
                  <p className="text-xs text-[#4A5B6C]">{t.cat}{t.card ? ` · •••• ${t.card}` : ''} · {t.time}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className={`text-sm font-semibold tabular-nums ${t.dir === 'in' ? 'text-[#1B7A4B]' : 'text-[#0F2A43]'}`}>{signed(t.dir, t.amount)}</span>
                  {t.status && <Pill tone="amber">{t.status}</Pill>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {onViewAll && (
        <button type="button" onClick={onViewAll} className="mt-3 w-full rounded-lg border border-[#E4DFD2] py-2.5 text-sm font-semibold text-[#8A6A26] transition hover:border-[#C9A24B] hover:bg-[#FBF9F4]">
          View all transactions
        </button>
      )}
    </Panel>
  );
}

/* =========================================================================
   Account info
   ========================================================================= */

const STATEMENTS = [
  ['September 2026', 'Monthly statement', 'PDF · 214 KB'],
  ['August 2026', 'Monthly statement', 'PDF · 198 KB'],
  ['July 2026', 'Monthly statement', 'PDF · 203 KB'],
  ['Q2 2026', 'Tax certificate', 'PDF · 96 KB'],
];

export function AccountInfoPage({ available }) {
  const [reveal, setReveal] = useState(false);
  const acct = '0048 2290 4821';
  const details = [
    ['Account holder', CLIENT.name, false],
    ['Account type', 'Private checking · USD', false],
    ['Routing number (ABA)', '026 009 593', true],
    ['SWIFT / BIC', 'AURPUS33', true],
    ['Branch', 'Aurelia Private, 640 Fifth Avenue, New York', false],
    ['Opened', '3 March 2026', false],
  ];

  return (
    <>
      <PageHeader title="Account info" subtitle="Your account details, limits, and statements." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] anim-in">
        {/* Account card */}
        <div className="balance-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] p-5 sm:p-6 text-white">
          <div className="engrave" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="serif text-lg text-[#EDD595]">USD Current</p>
                <p className="text-xs text-[#A8B8C8]">Private checking</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7FE0A8]/30 bg-[#7FE0A8]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#7FE0A8]"><span className="h-1.5 w-1.5 rounded-full bg-current" />Active</span>
            </div>
            <p className="mt-6 text-xs text-[#A8B8C8]">Account number</p>
            <div className="mt-1 flex items-center gap-1">
              <p className="serif text-xl sm:text-2xl tracking-wider tabular-nums">{reveal ? acct : '•••• •••• 4821'}</p>
              <button type="button" onClick={() => setReveal((v) => !v)} aria-label={reveal ? 'Hide account number' : 'Show account number'} className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-[#A8B8C8] transition hover:bg-white/10 hover:text-white">
                <Icon d={reveal ? ICONS.eyeOff : ICONS.eye} className="h-4 w-4" />
              </button>
              <CopyButton value={acct.replace(/\s/g, '')} label="Copy account number" dark />
            </div>
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4 mt-6">
              <div>
                <p className="text-xs text-[#A8B8C8]">Available balance</p>
                <p className="serif text-2xl tabular-nums">{available}</p>
              </div>
              <p className="text-right text-xs text-[#A8B8C8]">Reserve<br />membership</p>
            </div>
          </div>
        </div>

        {/* Banking details */}
        <Panel title="Banking details" subtitle="Share these to receive payments into this account.">
          <dl className="divide-y divide-[#EEEAE0]">
            {details.map(([k, v, copy]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-sm text-[#4A5B6C]">{k}</dt>
                <dd className="flex min-w-0 items-center gap-1 text-right text-sm font-medium text-[#0F2A43]">
                  <span className="truncate">{v}</span>
                  {copy && <CopyButton value={v.replace(/\s/g, '')} label={`Copy ${k}`} />}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3 anim-in anim-in-d1">
        <Panel title="Limits" subtitle="Resets daily at midnight ET.">
          <div className="space-y-4">
            <Meter label="Daily transfers" value={39500} max={250000} sub={`${money(39500, { maximumFractionDigits: 0 })} of $250,000`} />
            <Meter label="Card spending (month)" value={6650} max={50000} sub="$6,650 of $50,000" />
            <Meter label="ATM withdrawals (day)" value={0} max={5000} sub="$0 of $5,000" />
          </div>
          <p className="mt-4 text-xs text-[#4A5B6C]">Need a higher limit? Ask your relationship manager.</p>
        </Panel>

        <Panel title="Relationship manager">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#EDD595] to-[#C9A24B] text-sm font-semibold text-[#0A1D30]">EM</span>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F2A43]">Emma Mensah</p>
              <p className="text-xs text-[#4A5B6C]">Senior relationship manager · London</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-[#3D4C5B]"><Icon d={ICONS.phone} className="h-4 w-4 text-[#8A6A26]" />+44 20 7946 0142</li>
            <li className="flex items-center gap-2 text-[#3D4C5B]"><Icon d={ICONS.mail} className="h-4 w-4 text-[#8A6A26]" />e.mensah@aurelia.example</li>
            <li className="flex items-center gap-2 text-[#3D4C5B]"><Icon d={ICONS.clock} className="h-4 w-4 text-[#8A6A26]" />Mon–Fri, 08:00–19:00 GMT</li>
          </ul>
          <button type="button" className="btn btn-navy mt-4 w-full !py-2 text-sm">Book a call</button>
        </Panel>

        <Panel title="Statements" className="lg:col-span-2 2xl:col-span-1">
          <ul className="divide-y divide-[#EEEAE0]">
            {STATEMENTS.map(([period, kind, meta]) => (
              <li key={period} className="flex items-center gap-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F6F4EF] text-[#8A6A26]"><Icon d={ICONS.doc} className="h-[18px] w-[18px]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#0F2A43]">{period}</p>
                  <p className="text-xs text-[#4A5B6C]">{kind} · {meta}</p>
                </div>
                <button type="button" aria-label={`Download ${period} ${kind}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#0F2A43] transition hover:bg-[#F6F4EF]">
                  <Icon d={ICONS.download} className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* =========================================================================
   Cards
   ========================================================================= */

const CARD_LIST = [
  { id: 'c1', name: 'Aurelia Reserve', kind: 'Physical · Metal', last: '4821', exp: '09/28', limit: 50000, spent: 6650 },
  { id: 'c2', name: 'Aurelia Virtual', kind: 'Virtual · Online only', last: '7740', exp: '12/27', limit: 10000, spent: 6230 },
  { id: 'c3', name: 'Aurelia Travel', kind: 'Physical · Multi-currency', last: '1192', exp: '03/29', limit: 20000, spent: 0 },
];

function CardFace({ card, frozen, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`swatch relative flex aspect-[1.586/1] w-full flex-col justify-between overflow-hidden rounded-xl p-4 text-left text-white transition ${selected ? 'ring-2 ring-[#C9A24B] ring-offset-2 ring-offset-[#F6F4EF]' : 'opacity-90 hover:opacity-100'}`}
      style={{ background: frozen ? 'linear-gradient(135deg,#5A6878,#273340)' : 'linear-gradient(135deg,#1E4B73,#0A1D30)' }}
    >
      <span className="engrave" />
      <div className="relative flex items-start justify-between">
        <span className="text-xs text-[#D5DEE8]">{card.name}</span>
        <span className="serif text-base text-[#EDD595]">A</span>
      </div>
      <span className="chip relative h-6 w-9 rounded" aria-hidden="true" />
      <div className="relative flex items-end justify-between">
        <span className="serif text-base tracking-widest">•••• {card.last}</span>
        {frozen ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D5DEE8]"><Icon d={ICONS.lock} className="h-3.5 w-3.5" />Frozen</span> : <span className="text-[11px] text-[#D5DEE8]">{card.exp}</span>}
      </div>
    </button>
  );
}

export function CardsPage() {
  const [selId, setSelId] = useState('c1');
  const [frozen, setFrozen] = useState({ c3: true });
  const [controls, setControls] = useState({
    c1: { online: true, intl: true, contactless: true, atm: true },
    c2: { online: true, intl: false, contactless: false, atm: false },
    c3: { online: false, intl: true, contactless: true, atm: true },
  });
  const card = CARD_LIST.find((c) => c.id === selId);
  const isFrozen = !!frozen[selId];
  const ctl = controls[selId];
  const setCtl = (k) => (v) => setControls((all) => ({ ...all, [selId]: { ...all[selId], [k]: v } }));
  const tx = TRANSACTIONS.filter((t) => t.card === card.last);

  return (
    <>
      <PageHeader title="Cards" subtitle="Freeze a card, set controls, and see what’s been spent." action={<button type="button" className="btn btn-navy !px-4 !py-2 text-sm">Request a card</button>} />

      <div className="grid gap-4 sm:grid-cols-3 anim-in">
        {CARD_LIST.map((c) => <CardFace key={c.id} card={c} frozen={!!frozen[c.id]} selected={c.id === selId} onClick={() => setSelId(c.id)} />)}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] anim-in anim-in-d1">
        <Panel
          title={card.name}
          subtitle={`${card.kind} · •••• ${card.last} · Expires ${card.exp}`}
          action={isFrozen ? <Pill tone="gray">Frozen</Pill> : <Pill tone="green">Active</Pill>}
        >
          <Meter label="Spent this month" value={card.spent} max={card.limit} sub={`${money(card.spent, { maximumFractionDigits: 0 })} of ${money(card.limit, { maximumFractionDigits: 0 })}`} tone="gold" />

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setFrozen((f) => ({ ...f, [selId]: !f[selId] }))}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${isFrozen ? 'border-[#0F2A43] bg-[#0F2A43] text-white hover:bg-[#1E4B73]' : 'border-[#DDD8CC] text-[#0F2A43] hover:border-[#C9A24B] hover:bg-[#FBF9F4]'}`}
            >
              <Icon d={ICONS.lock} className="h-4 w-4" />{isFrozen ? 'Unfreeze' : 'Freeze'}
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#DDD8CC] px-3 py-2.5 text-sm font-semibold text-[#0F2A43] transition hover:border-[#C9A24B] hover:bg-[#FBF9F4]">
              <Icon d={ICONS.eye} className="h-4 w-4" />Details
            </button>
            <button type="button" className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-[#F2C9C4] px-3 py-2.5 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDF2F1] sm:col-span-1">
              Report lost
            </button>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-[#0F2A43]">Recent spending</h3>
          {tx.length ? (
            <ul className="mt-1 divide-y divide-[#EEEAE0]">
              {tx.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#14202E]">{t.name}</p>
                    <p className="text-xs text-[#4A5B6C]">{t.cat} · {t.day.toLowerCase() === 'yesterday' ? 'Yesterday' : t.time}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-[#0F2A43]">{signed(t.dir, t.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-lg bg-[#F6F4EF] px-3 py-3 text-sm text-[#4A5B6C]">No spending on this card this month.</p>
          )}
        </Panel>

        <Panel title="Card controls" subtitle={isFrozen ? 'Unfreeze the card to use these.' : 'Changes apply immediately.'}>
          <div className={`divide-y divide-[#EEEAE0] ${isFrozen ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={isFrozen}>
            <Toggle id={`${selId}-online`} label="Online payments" description="Shopping and subscriptions on the web" checked={ctl.online} onChange={setCtl('online')} />
            <Toggle id={`${selId}-intl`} label="International use" description="Payments and withdrawals outside the US" checked={ctl.intl} onChange={setCtl('intl')} />
            <Toggle id={`${selId}-contactless`} label="Contactless" description="Tap to pay in store" checked={ctl.contactless} onChange={setCtl('contactless')} />
            <Toggle id={`${selId}-atm`} label="ATM withdrawals" description="Cash from any ATM worldwide" checked={ctl.atm} onChange={setCtl('atm')} />
          </div>
        </Panel>
      </div>
    </>
  );
}

/* =========================================================================
   Tracking
   ========================================================================= */

const TRACK = [
  { id: 'k1', title: 'Wire to Zurich Private AG', ref: 'WR-26101-8841', amount: 40025, method: 'Wire', steps: ['Initiated', 'Processing', 'Sent', 'Delivered'], at: 2, eta: 'Expected 16 October', times: ['14 Oct, 11:02', '14 Oct, 11:40', '15 Oct, 08:15', ''] },
  { id: 'k2', title: 'Transfer to Harbour Property Ltd', ref: 'RT-26101-3310', amount: 12000, method: 'Realtime', steps: ['Initiated', 'Approval', 'Sent', 'Delivered'], at: 1, eta: 'Waiting for your approval in the app', times: ['Today, 10:24', '', '', ''], action: true },
  { id: 'k3', title: 'Realtime to Adaeze Okafor', ref: 'RT-26101-2207', amount: 2500, method: 'Realtime', steps: ['Initiated', 'Processing', 'Sent', 'Delivered'], at: 3, eta: 'Delivered today at 09:14', times: ['09:13', '09:13', '09:14', '09:14'] },
  { id: 'k4', title: 'Aurelia Virtual card', ref: 'CD-26100-7740', amount: null, method: 'Card', steps: ['Requested', 'Approved', 'Issued', 'Ready'], at: 3, eta: 'Ready to use in the app', times: ['8 Oct', '8 Oct', '8 Oct', '8 Oct'] },
];
const normRef = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '');
const isTrackDone = (t) => t.at === t.steps.length - 1;

function Stepper({ steps, at, times }) {
  const done = at === steps.length - 1;
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1">
      {steps.map((s, i) => {
        const complete = i < at || done;
        const current = i === at && !done;
        return (
          <li key={s} className="relative">
            {i > 0 && <span className={`absolute right-1/2 top-[11px] h-0.5 w-full ${i <= at ? 'bg-[#1B7A4B]' : 'bg-[#E4DFD2]'}`} aria-hidden="true" />}
            <div className="relative flex flex-col items-center text-center">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-4 ring-white ${complete ? 'bg-[#1B7A4B] text-white' : current ? 'bg-[#C9A24B] text-[#0A1D30]' : 'bg-[#EFEBE1] text-[#4A5B6C]'}`}>
                {complete ? <Icon d={ICONS.check} className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={`mt-1.5 text-[11px] font-semibold ${current ? 'text-[#8A6A26]' : complete ? 'text-[#0F2A43]' : 'text-[#4A5B6C]'}`}>{s}</span>
              <span className="text-[10px] text-[#4A5B6C]">{times[i] || (current ? 'In progress' : '')}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TrackCard({ t, highlight = false }) {
  return (
    <Panel className={`min-w-0 ${highlight ? 'ring-2 ring-[#C9A24B]/60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE6] text-[#0F2A43]"><Icon d={t.method === 'Card' ? ICONS.card : t.method === 'Wire' ? ICONS.plane : ICONS.transfer} className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#0F2A43]">{t.title}</p>
            <p className="text-xs text-[#4A5B6C]">{t.method} · <span>{t.ref}</span></p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          {t.amount != null && <p className="serif text-lg tabular-nums text-[#0F2A43]">{money(t.amount)}</p>}
          {isTrackDone(t) ? <Pill tone="green">Completed</Pill> : t.action ? <Pill tone="amber">Action needed</Pill> : <Pill tone="navy">In transit</Pill>}
        </div>
      </div>
      <Stepper steps={t.steps} at={t.at} times={t.times} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F6F4EF] px-3 py-2">
        <p className="flex items-center gap-2 text-xs text-[#3D4C5B]"><Icon d={ICONS.clock} className="h-4 w-4 text-[#8A6A26]" />{t.eta}</p>
        {t.action && <button type="button" className="btn btn-gold !px-3 !py-1.5 text-xs">Approve</button>}
      </div>
    </Panel>
  );
}

export function TrackingPage({ extra = [], initialRef = '' }) {
  const ALL = [...extra, ...TRACK];
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState(initialRef);
  const [result, setResult] = useState(() => {
    const hit = initialRef && ALL.find((t) => normRef(t.ref) === normRef(initialRef));
    return hit ? { status: 'found', item: hit } : null;
  });
  const list = ALL.filter((t) => filter === 'all' || (filter === 'done' ? isTrackDone(t) : !isTrackDone(t)));

  const search = (e) => {
    e.preventDefault();
    const q = normRef(query);
    if (!q) { setResult({ status: 'empty' }); return; }
    const item = ALL.find((t) => normRef(t.ref) === q);
    setResult(item ? { status: 'found', item } : { status: 'missing', q: query.trim() });
  };
  const tryRef = (t) => { setQuery(t.ref); setResult({ status: 'found', item: t }); };

  return (
    <>
      <PageHeader title="Tracking" subtitle="Enter a tracking number, or follow your recent transfers and card orders." />

      <div className="balance-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] p-5 sm:p-7 text-white anim-in">
        <div className="engrave" />
        <div className="relative max-w-2xl">
          <p className="serif text-xl text-[#EDD595]">Track a transfer or card</p>
          <p className="mt-1 text-sm text-[#D5DEE8]">You’ll find the tracking number on your confirmation email and receipt.</p>
          <form onSubmit={search} className="mt-4 flex flex-col gap-2 sm:flex-row" role="search">
            <label htmlFor="track-q" className="sr-only">Tracking number</label>
            <div className="relative flex-1">
              <Icon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8796A6]" />
              <input
                id="track-q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter tracking number, e.g. WR-26101-8841"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-md border border-white/20 bg-white py-2.5 pl-9 pr-3 text-sm uppercase tracking-wide text-[#14202E] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#8796A6] focus:outline-none focus:ring-2 focus:ring-[#EDD595]/70"
              />
            </div>
            <button type="submit" className="btn btn-gold shrink-0 !px-6 !py-2.5 text-sm">Track</button>
          </form>
          <p className="mt-2.5 text-xs text-[#A8B8C8]">
            Try{' '}
            {TRACK.slice(0, 2).map((t, i) => (
              <span key={t.id}>
                {i > 0 && ' or '}
                <button type="button" onClick={() => tryRef(t)} className="font-medium text-[#EDD595] underline underline-offset-2 hover:text-white">{t.ref}</button>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="mt-5 anim-in">
            {result.status === 'found' && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0F2A43]">Result for <span>{result.item.ref}</span></p>
                  <button type="button" onClick={() => { setResult(null); setQuery(''); }} className="text-xs font-semibold text-[#8A6A26] underline underline-offset-4">Clear</button>
                </div>
                <TrackCard t={result.item} highlight />
              </>
            )}
            {result.status === 'empty' && <p className="rounded-lg bg-[#FDF2F1] px-4 py-3 text-sm text-[#B3261E]">Enter a tracking number to search.</p>}
            {result.status === 'missing' && (
              <div className="flex gap-3 rounded-xl border border-[#F2C9C4] bg-[#FDF8F7] p-4">
                <Icon d={ICONS.alert} className="mt-0.5 h-5 w-5 shrink-0 text-[#B3261E]" />
                <div className="text-sm">
                  <p className="font-semibold text-[#B3261E]">No transfer found for “{result.q}”</p>
                  <p className="mt-1 text-[#4A5B6C]">Check the number on your receipt. It starts with WR (wire), RT (realtime), or CD (card). If it still doesn’t show, contact support.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-3 mt-7 flex flex-wrap items-center justify-between gap-3">
        <h2 className="serif m-0 text-xl text-[#0F2A43]">Recent</h2>
        <Segmented label="Filter tracking" value={filter} onChange={setFilter} options={[['all', 'All'], ['active', 'In progress'], ['done', 'Completed']]} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 anim-in anim-in-d1">
        {list.map((t) => <TrackCard key={t.id} t={t} />)}
        {!list.length && <p className="rounded-xl border border-dashed border-[#DDD8CC] p-8 text-center text-sm text-[#4A5B6C]">Nothing to show for this filter.</p>}
      </div>
    </>
  );
}

/* =========================================================================
   Investing
   ========================================================================= */

const PERF = [1169.4, 1158.2, 1176.9, 1190.3, 1183.6, 1201.8, 1212.4, 1205.1, 1219.7, 1228.3, 1236.0, 1241.8];
const PERF_MONTHS = ['Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26'];
const ALLOC = [
  { name: 'Global equity', pct: 42, color: '#3170AE', ret: 8.1 },
  { name: 'Fixed income', pct: 35, color: '#C2922F', ret: 2.4 },
  { name: 'Alternatives', pct: 15, color: '#239076', ret: 4.0 },
  { name: 'Cash', pct: 8, color: '#8467B5', ret: 0.9 },
];
const PORTFOLIO = 1241830;
const START_CASH = 99346;
const START_INVESTED = PORTFOLIO - START_CASH;
const CURRENT_ACCOUNT_AVAILABLE = 412860.2;

const ASSETS = [
  { id: 'a1', name: 'Global Equity Index Fund', cat: 'Equity', risk: 4, metric: '1-year return', value: '+11.8%', min: 1000, desc: 'More than 4,000 companies across developed and emerging markets.' },
  { id: 'a2', name: 'US Treasury 2-Year Note', cat: 'Bonds', risk: 1, metric: 'Yield', value: '4.10%', min: 1000, desc: 'Backed by the US government and held to maturity.' },
  { id: 'a3', name: 'Investment-Grade Corporate Bonds', cat: 'Bonds', risk: 2, metric: 'Yield', value: '5.05%', min: 5000, desc: 'A-rated issuers with an average maturity of five years.' },
  { id: 'a4', name: 'Allocated Gold', cat: 'Commodities', risk: 3, metric: '1-year return', value: '+14.2%', min: 2500, desc: 'Physical bullion held in your name in a Zurich vault.' },
  { id: 'a5', name: 'Private Real Estate Income', cat: 'Alternatives', risk: 3, metric: 'Income yield', value: '6.40%', min: 25000, desc: 'Prime logistics and office property across Europe and the US.' },
  { id: 'a6', name: 'Sustainable Infrastructure Fund', cat: 'Alternatives', risk: 3, metric: '1-year return', value: '+7.3%', min: 10000, desc: 'Renewables, power grids, and water assets on long contracts.' },
];
const ASSET_ICON = { Equity: ICONS.trend, Bonds: ICONS.doc, Commodities: ICONS.sparkle, Alternatives: ICONS.briefcase };

function PerformanceChart() {
  const [hover, setHover] = useState(null);
  const min = 1150, max = 1250, n = PERF.length;
  const x = (i) => (i / (n - 1)) * 100;
  const y = (v) => 40 - ((v - min) / (max - min)) * 40;
  const line = PERF.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `0,40 ${line} 100,40`;
  const ticks = [1175, 1200, 1225];
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };
  const h = hover;
  return (
    <div>
      <div className="relative ml-12 h-48 sm:h-56">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-dashed border-[#E8E4DA]" style={{ top: `${(y(t) / 40) * 100}%` }}>
            <span className="absolute -left-12 -top-2 w-10 text-right text-[10px] tabular-nums text-[#4A5B6C]">${(t / 1000).toFixed(2)}M</span>
          </div>
        ))}
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E4B73" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1E4B73" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#perfFill)" />
          <polyline points={line} fill="none" stroke="#1E4B73" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 cursor-crosshair" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label={`Portfolio value rose from $${PERF[0]}k in ${PERF_MONTHS[0]} to $${PERF[n - 1]}k in ${PERF_MONTHS[n - 1]}.`}>
          {h != null && (
            <>
              <div className="pointer-events-none absolute inset-y-0 w-px bg-[#0F2A43]/30" style={{ left: `${x(h)}%` }} />
              <div className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1E4B73] shadow" style={{ left: `${x(h)}%`, top: `${(y(PERF[h]) / 40) * 100}%` }} />
              <div className={`pointer-events-none absolute top-0 z-10 rounded-lg bg-[#0F2A43] px-3 py-2 text-white shadow-lg ${h > n / 2 ? '-translate-x-[calc(100%+10px)]' : 'translate-x-[10px]'}`} style={{ left: `${x(h)}%` }}>
                <p className="text-[11px] text-[#A8B8C8]">{PERF_MONTHS[h]}</p>
                <p className="text-sm font-semibold tabular-nums">{money(PERF[h] * 1000, { maximumFractionDigits: 0 })}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ml-12 mt-2 flex justify-between text-[10px] text-[#4A5B6C]">
        {PERF_MONTHS.map((m, i) => <span key={m} className={i % 2 ? 'hidden sm:inline' : ''}>{m.split(' ')[0]}</span>)}
      </div>
      <table className="sr-only">
        <caption>Portfolio value by month</caption>
        <tbody>{PERF.map((v, i) => <tr key={PERF_MONTHS[i]}><th>{PERF_MONTHS[i]}</th><td>{money(v * 1000, { maximumFractionDigits: 0 })}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function RiskDots({ level }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`Risk ${level} of 5`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => <span key={i} className={`h-1.5 w-3 rounded-full ${i <= level ? 'bg-[#0F2A43]' : 'bg-[#E4DFD2]'}`} />)}
      </span>
      <span className="text-[11px] text-[#4A5B6C]">Risk {level}/5</span>
    </span>
  );
}

function AmountField({ id, value, onChange, presets, onPreset }) {
  return (
    <>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4A5B6C]">$</span>
        <input id={id} type="number" inputMode="decimal" min="0" step="100" autoFocus className={`${inputCls} pl-7 text-base tabular-nums`} placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map(([label, v]) => (
          <button key={label} type="button" onClick={() => onPreset(v)} className="rounded-full border border-[#DDD8CC] px-3 py-1 text-xs font-semibold text-[#0F2A43] transition hover:border-[#C9A24B] hover:bg-[#FBF9F4]">{label}</button>
        ))}
      </div>
    </>
  );
}

function InvestForm({ asset, cash, onConfirm, onClose }) {
  const [amount, setAmount] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const amt = parseFloat(amount) || 0;

  const submit = (e) => {
    e.preventDefault();
    if (amt < asset.min) { setErr(`The minimum for this investment is ${money(asset.min, { maximumFractionDigits: 0 })}.`); return; }
    if (amt > cash) { setErr(`You have ${money(cash)} available to invest. Add funds first, or enter a smaller amount.`); return; }
    onConfirm(asset, amt);
    setDone(amt);
  };

  if (done) {
    return (
      <div className="py-2 text-center" role="status">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F6EE] text-[#1B7A4B]"><Icon d={ICONS.check} className="h-6 w-6" /></span>
        <p className="serif text-xl text-[#0F2A43]">Order placed</p>
        <p className="mt-1 text-sm text-[#4A5B6C]">{money(done)} into {asset.name}. It settles on the next business day, and you’ll see it in your holdings then.</p>
        <button type="button" onClick={onClose} className="btn btn-navy mt-5 w-full !py-2.5 text-sm">Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-start gap-3 rounded-lg bg-[#F6F4EF] p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0F2A43]"><Icon d={ASSET_ICON[asset.cat]} className="h-[18px] w-[18px]" /></span>
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-[#0F2A43]">{asset.name}</p>
          <p className="text-xs text-[#4A5B6C]">{asset.metric} {asset.value} · Minimum {money(asset.min, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between">
          <label htmlFor="inv-amt" className="text-xs font-semibold text-[#3D4C5B]">Amount to invest</label>
          <span className="text-xs text-[#4A5B6C]">Available <span className="font-semibold tabular-nums text-[#0F2A43]">{money(cash)}</span></span>
        </div>
        <AmountField id="inv-amt" value={amount} onChange={(v) => { setAmount(v); setErr(''); }} presets={[['$5,000', 5000], ['$10,000', 10000], ['$25,000', 25000], ['Max', Math.floor(cash)]]} onPreset={(v) => { setAmount(String(v)); setErr(''); }} />
      </div>
      <dl className="mt-4 space-y-1.5 border-t border-[#EEEAE0] pt-3 text-sm">
        <div className="flex justify-between"><dt className="text-[#4A5B6C]">Paid from</dt><dd className="font-medium text-[#0F2A43]">Investment cash</dd></div>
        <div className="flex justify-between"><dt className="text-[#4A5B6C]">Dealing fee</dt><dd className="font-medium text-[#0F2A43]">None</dd></div>
        <div className="flex justify-between"><dt className="text-[#4A5B6C]">Settlement</dt><dd className="font-medium text-[#0F2A43]">Next business day</dd></div>
      </dl>
      {err && <p role="alert" className="mt-3 rounded-md bg-[#FDF2F1] px-3 py-2 text-sm text-[#B3261E]">{err}</p>}
      <button type="submit" className="btn btn-gold mt-4 w-full !py-2.5 text-sm">Invest {amt > 0 ? money(amt) : ''}</button>
      <p className="mt-2 text-[11px] leading-relaxed text-[#4A5B6C]">Investments can fall as well as rise. Past returns don’t guarantee future results.</p>
    </form>
  );
}

function AddFundsForm({ onConfirm, onClose }) {
  const [amount, setAmount] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const amt = parseFloat(amount) || 0;
  const submit = (e) => {
    e.preventDefault();
    if (amt <= 0) { setErr('Enter an amount greater than zero.'); return; }
    if (amt > CURRENT_ACCOUNT_AVAILABLE) { setErr(`USD Current has ${money(CURRENT_ACCOUNT_AVAILABLE)} available.`); return; }
    onConfirm(amt);
    setDone(amt);
  };
  if (done) {
    return (
      <div className="py-2 text-center" role="status">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F6EE] text-[#1B7A4B]"><Icon d={ICONS.check} className="h-6 w-6" /></span>
        <p className="serif text-xl text-[#0F2A43]">Funds added</p>
        <p className="mt-1 text-sm text-[#4A5B6C]">{money(done)} moved from USD Current. It’s ready to invest now.</p>
        <button type="button" onClick={onClose} className="btn btn-navy mt-5 w-full !py-2.5 text-sm">Done</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-center justify-between rounded-lg bg-[#F6F4EF] px-3 py-2.5 text-sm">
        <span className="text-[#4A5B6C]">From <span className="font-medium text-[#0F2A43]">USD Current •••• 4821</span></span>
        <span className="tabular-nums text-xs text-[#4A5B6C]">{money(CURRENT_ACCOUNT_AVAILABLE)}</span>
      </div>
      <div className="mt-4">
        <label htmlFor="fund-amt" className="mb-1 block text-xs font-semibold text-[#3D4C5B]">Amount</label>
        <AmountField id="fund-amt" value={amount} onChange={(v) => { setAmount(v); setErr(''); }} presets={[['$10,000', 10000], ['$50,000', 50000], ['$100,000', 100000]]} onPreset={(v) => { setAmount(String(v)); setErr(''); }} />
      </div>
      {err && <p role="alert" className="mt-3 rounded-md bg-[#FDF2F1] px-3 py-2 text-sm text-[#B3261E]">{err}</p>}
      <button type="submit" className="btn btn-navy mt-4 w-full !py-2.5 text-sm">Add funds</button>
      <p className="mt-2 text-[11px] text-[#4A5B6C]">Transfers between your own accounts are free and instant.</p>
    </form>
  );
}

export function InvestingPage() {
  const [cash, setCash] = useState(START_CASH);
  const [positions, setPositions] = useState({});
  const [cat, setCat] = useState('All');
  const [modal, setModal] = useState(null);
  const [hl, setHl] = useState(null);

  const newlyInvested = Object.values(positions).reduce((s, v) => s + v, 0);
  const invested = START_INVESTED + newlyInvested;
  const total = invested + cash;
  const assets = ASSETS.filter((a) => cat === 'All' || a.cat === cat);
  const close = () => setModal(null);

  return (
    <>
      <PageHeader title="Investing" subtitle="Managed by your advisory team. Values as of market close yesterday." />

      {/* Investment balance */}
      <div className="balance-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] text-white anim-in">
        <div className="engrave" />
        <div className="relative grid lg:grid-cols-[1.2fr_1fr]">
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="serif text-lg text-[#EDD595]">Investment balance</p>
              <span className="rounded-full border border-[#EDD595]/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#EDD595]">Balanced mandate</span>
            </div>
            <p className="serif mt-5 text-4xl tabular-nums sm:text-5xl">{money(total, { maximumFractionDigits: 0 })}</p>
            <p className="mt-1.5 text-sm text-[#7FE0A8]">+$72,410 (+6.2%) this year</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => setModal({ type: 'fund' })} className="btn btn-gold !px-5 !py-2.5 text-sm">Add funds</button>
              <button type="button" onClick={() => document.getElementById('invest-assets')?.scrollIntoView({ behavior: 'smooth' })} className="btn border border-white/25 bg-white/5 !px-5 !py-2.5 text-sm text-white hover:bg-white/10">Invest</button>
            </div>
          </div>
          <dl className="grid grid-cols-2 border-t border-white/10 lg:border-l lg:border-t-0">
            {[
              ['Invested', money(invested, { maximumFractionDigits: 0 })],
              ['Available to invest', money(cash, { maximumFractionDigits: 0 })],
              ['Income this year', '$28,940'],
              ['Risk profile', 'Balanced'],
            ].map(([k, v], i) => (
              <div key={k} className={`p-4 sm:p-5 ${i % 2 === 0 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b border-white/10' : ''}`}>
                <dt className="text-xs text-[#A8B8C8]">{k}</dt>
                <dd className="serif mt-1 text-xl tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Assets to invest in */}
      <section id="invest-assets" className="mt-7 scroll-mt-4 anim-in anim-in-d1" aria-labelledby="assets-h">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="assets-h" className="serif m-0 text-xl text-[#0F2A43]">Invest in</h2>
            <p className="mt-0.5 text-sm text-[#4A5B6C]">Selected by your advisory team. Orders are paid from investment cash.</p>
          </div>
          <div className="-mx-1 max-w-full overflow-x-auto px-1">
            <Segmented label="Filter assets" value={cat} onChange={setCat} options={[['All', 'All'], ['Equity', 'Equity'], ['Bonds', 'Bonds'], ['Alternatives', 'Alternatives'], ['Commodities', 'Commodities']]} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {assets.map((a) => (
            <article key={a.id} className="panel flex flex-col rounded-xl border border-[#DDD8CC] bg-white/95 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE6] text-[#0F2A43]"><Icon d={ASSET_ICON[a.cat]} className="h-5 w-5" /></span>
                <Pill tone="gray" dot={false}>{a.cat}</Pill>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug text-[#0F2A43]">{a.name}</h3>
              <p className="mt-1 text-sm text-[#4A5B6C]">{a.desc}</p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#EEEAE0] pt-3">
                <div>
                  <p className="text-[11px] text-[#4A5B6C]">{a.metric}</p>
                  <p className={`serif text-xl tabular-nums ${a.value.startsWith('+') ? 'text-[#1B7A4B]' : 'text-[#0F2A43]'}`}>{a.value}</p>
                </div>
                <div className="text-right">
                  <RiskDots level={a.risk} />
                  <p className="mt-1 text-[11px] text-[#4A5B6C]">Min {money(a.min, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
              {positions[a.id] ? <p className="mt-3 rounded-md bg-[#E7F6EE] px-2.5 py-1.5 text-xs font-medium text-[#1B7A4B]">You’ve invested {money(positions[a.id], { maximumFractionDigits: 0 })} · settling</p> : null}
              <button type="button" onClick={() => setModal({ type: 'invest', asset: a })} className="btn btn-navy mt-4 w-full !py-2 text-sm">Invest</button>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] anim-in anim-in-d2">
        <Panel title="Portfolio value" subtitle="Last 12 months">
          <PerformanceChart />
        </Panel>
        <Panel title="Allocation" subtitle="Target: balanced mandate">
          <div className="flex h-3.5 gap-[2px] overflow-hidden rounded" role="img" aria-label={ALLOC.map((a) => `${a.name} ${a.pct}%`).join(', ')}>
            {ALLOC.map((a, i) => (
              <div key={a.name} title={`${a.name}: ${a.pct}%`} onMouseEnter={() => setHl(a.name)} onMouseLeave={() => setHl(null)}
                className={`h-full transition-opacity ${i === 0 ? 'rounded-l' : ''} ${i === ALLOC.length - 1 ? 'rounded-r' : ''} ${hl && hl !== a.name ? 'opacity-35' : ''}`}
                style={{ width: `${a.pct}%`, background: a.color }} />
            ))}
          </div>
          <ul className="mt-4 space-y-1">
            {ALLOC.map((a) => (
              <li key={a.name} onMouseEnter={() => setHl(a.name)} onMouseLeave={() => setHl(null)} className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition ${hl === a.name ? 'bg-[#F6F4EF]' : ''}`}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} aria-hidden="true" />
                <span className="flex-1 text-[#14202E]">{a.name}</span>
                <span className="tabular-nums text-[#4A5B6C]">{a.pct}%</span>
                <span className="w-24 text-right font-medium tabular-nums text-[#0F2A43]">{money((PORTFOLIO * a.pct) / 100, { maximumFractionDigits: 0 })}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] anim-in anim-in-d3">
        <Panel title="Holdings by asset class">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-[#E4DFD2] text-left text-xs text-[#4A5B6C]">
                  <th className="px-1 pb-2 font-medium">Asset class</th>
                  <th className="px-1 pb-2 text-right font-medium">Weight</th>
                  <th className="px-1 pb-2 text-right font-medium">Value</th>
                  <th className="px-1 pb-2 text-right font-medium">Return YTD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEAE0]">
                {ALLOC.map((a) => (
                  <tr key={a.name}>
                    <td className="px-1 py-3"><span className="inline-flex items-center gap-2 font-medium text-[#0F2A43]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} aria-hidden="true" />{a.name}</span></td>
                    <td className="px-1 py-3 text-right tabular-nums text-[#4A5B6C]">{a.pct}%</td>
                    <td className="px-1 py-3 text-right tabular-nums text-[#0F2A43]">{money((PORTFOLIO * a.pct) / 100, { maximumFractionDigits: 0 })}</td>
                    <td className="px-1 py-3 text-right font-semibold tabular-nums text-[#1B7A4B]">+{a.ret.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#E4DFD2] font-semibold text-[#0F2A43]">
                  <td className="px-1 pt-3">Total</td>
                  <td className="px-1 pt-3 text-right tabular-nums">100%</td>
                  <td className="px-1 pt-3 text-right tabular-nums">{money(PORTFOLIO, { maximumFractionDigits: 0 })}</td>
                  <td className="px-1 pt-3 text-right tabular-nums text-[#1B7A4B]">+6.2%</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#4A5B6C]">New orders appear here once they settle.</p>
        </Panel>

        <div className="balance-card relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] p-5 sm:p-6 text-white">
          <div className="engrave" />
          <div className="relative">
            <p className="serif text-lg text-[#EDD595]">Note from your advisor</p>
            <p className="mt-3 text-sm leading-relaxed text-[#D5DEE8]">“With rates easing, we’ve moved 3% from cash into short-dated bonds to lock in yield. Your allocation stays within the balanced mandate.”</p>
            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#EDD595] to-[#C9A24B] text-xs font-semibold text-[#0A1D30]">JO</span>
              <div>
                <p className="text-sm font-semibold">James Osei</p>
                <p className="text-xs text-[#A8B8C8]">Investment specialist · Next review 12 Nov</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modal?.type === 'invest'} onClose={close} title="Invest">
        {modal?.type === 'invest' && (
          <InvestForm
            key={modal.asset.id}
            asset={modal.asset}
            cash={cash}
            onClose={close}
            onConfirm={(asset, amt) => { setCash((c) => c - amt); setPositions((p) => ({ ...p, [asset.id]: (p[asset.id] || 0) + amt })); }}
          />
        )}
      </Modal>
      <Modal open={modal?.type === 'fund'} onClose={close} title="Add funds">
        {modal?.type === 'fund' && <AddFundsForm onClose={close} onConfirm={(amt) => setCash((c) => c + amt)} />}
      </Modal>
    </>
  );
}

/* =========================================================================
   Notifications
   ========================================================================= */

const N_ICON = { transaction: ICONS.transfer, card: ICONS.card, security: ICONS.shield, account: ICONS.doc };
const N_TINT = { transaction: 'bg-[#E8EEF5] text-[#0F2A43]', card: 'bg-[#F1EEE6] text-[#0F2A43]', security: 'bg-[#FBF3E2] text-[#8A6A26]', account: 'bg-[#E7F6EE] text-[#1B7A4B]' };

export function NotificationsPage({ items, setItems }) {
  const [filter, setFilter] = useState('all');
  const unread = items.filter((n) => !n.read).length;
  const shown = items.filter((n) => (
    filter === 'all' ? true
      : filter === 'unread' ? !n.read
      : filter === 'transactions' ? (n.type === 'transaction' || n.type === 'card')
      : n.type === filter
  ));
  const groups = shown.reduce((acc, n) => { (acc[n.day] = acc[n.day] || []).push(n); return acc; }, {});
  const markRead = (id) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={unread ? `${unread} unread` : 'You’re all caught up.'}
        action={<button type="button" disabled={!unread} onClick={() => setItems((l) => l.map((n) => ({ ...n, read: true })))} className="text-sm font-semibold text-[#8A6A26] underline underline-offset-4 disabled:cursor-not-allowed disabled:text-[#B9B3A6] disabled:no-underline">Mark all as read</button>}
      />
      <Panel>
        <div className="-mx-1 mb-2 overflow-x-auto px-1 pb-1">
          <Segmented label="Filter notifications" value={filter} onChange={setFilter} options={[['all', 'All'], ['unread', `Unread${unread ? ` (${unread})` : ''}`], ['transactions', 'Transactions'], ['security', 'Security'], ['account', 'Account']]} />
        </div>
        {Object.entries(groups).map(([day, list]) => (
          <div key={day}>
            <p className="mb-1 mt-4 text-[11px] font-semibold tracking-wide text-[#8A6A26]">{day}</p>
            <ul className="divide-y divide-[#EEEAE0]">
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => markRead(n.id)} className={`-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 py-3 text-left transition hover:bg-[#FBF9F4] ${n.read ? '' : 'bg-[#FBF8F0]'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${N_TINT[n.type]}`}><Icon d={N_ICON[n.type]} className="h-[18px] w-[18px]" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-sm ${n.read ? 'font-medium text-[#14202E]' : 'font-semibold text-[#0F2A43]'}`}>{n.title}</span>
                        {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#C9A24B]" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 block text-sm text-[#4A5B6C]">{n.body}</span>
                    </span>
                    <span className="shrink-0 text-xs text-[#4A5B6C]">{n.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!shown.length && (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F4EF] text-[#8A6A26]"><Icon d={ICONS.bell} className="h-6 w-6" /></span>
            <p className="mt-3 text-sm font-medium text-[#0F2A43]">No notifications here</p>
            <p className="text-xs text-[#4A5B6C]">Try another filter.</p>
          </div>
        )}
      </Panel>
    </>
  );
}

/* =========================================================================
   Loan — coming soon
   ========================================================================= */

export function LoanPage({ onContact }) {
  const [notify, setNotify] = useState(false);
  const features = [
    [ICONS.trend, 'Borrow against your portfolio', 'Unlock cash without selling your investments.'],
    [ICONS.clock, 'A decision in one working day', 'Request online and your credit officer replies the next day.'],
    [ICONS.shield, 'Repay whenever you like', 'Interest-only, with no early repayment fees.'],
  ];
  return (
    <>
      <PageHeader title="Loan" />
      <div className="balance-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] text-white anim-in">
        <div className="engrave" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EDD595]/30 bg-[#EDD595]/10 px-3 py-1 text-xs font-semibold text-[#EDD595]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EDD595]" aria-hidden="true" />Coming soon
            </span>
            <h2 className="serif m-0 mt-5 text-3xl leading-tight text-white sm:text-4xl">Lending is coming to your dashboard</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#D5DEE8] sm:text-base">Soon you’ll be able to request a facility secured against your portfolio, see your rate, and track repayments, all from here.</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {notify ? (
                <span className="inline-flex items-center gap-2 rounded-md border border-[#7FE0A8]/30 bg-[#7FE0A8]/10 px-5 py-2.5 text-sm font-semibold text-[#7FE0A8]" role="status">
                  <Icon d={ICONS.check} className="h-4 w-4" />We’ll email you when it’s live
                </span>
              ) : (
                <button type="button" onClick={() => setNotify(true)} className="btn btn-gold !px-6 !py-2.5 text-sm">Notify me when it’s live</button>
              )}
              <button type="button" onClick={onContact} className="btn border border-white/25 bg-white/5 !px-6 !py-2.5 text-sm text-white hover:bg-white/10">Talk to your advisor</button>
            </div>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 border-t border-white/10 pt-8 sm:grid-cols-3">
            {features.map(([icon, h, d]) => (
              <li key={h} className="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDD595]/30 text-[#EDD595]"><Icon d={icon} className="h-[18px] w-[18px]" /></span>
                <p className="mt-3 text-sm font-semibold text-white">{h}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#A8B8C8]">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-[#4A5B6C]">Need credit today? Your relationship manager can arrange a facility now.</p>
    </>
  );
}

/* =========================================================================
   Settings
   ========================================================================= */

const pwScore = (p) => {
  let n = 0;
  if (p.length >= 8) n++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) n++;
  if (/\d/.test(p)) n++;
  if (/[^A-Za-z0-9]/.test(p)) n++;
  return n;
};
const PW_LABEL = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

function PasswordInput({ id, label, value, onChange, show, autoComplete, autoFocus }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-[#3D4C5B]">{label}</label>
      <input id={id} type={show ? 'text' : 'password'} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} autoFocus={autoFocus} />
    </div>
  );
}

function PasswordForm({ onClose, onDone }) {
  const [cur, setCur] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const score = pwScore(pw);
  const rules = [
    ['At least 8 characters', pw.length >= 8],
    ['Upper- and lower-case letters', /[a-z]/.test(pw) && /[A-Z]/.test(pw)],
    ['At least one number', /\d/.test(pw)],
    ['At least one symbol', /[^A-Za-z0-9]/.test(pw)],
  ];
  const barColor = score <= 1 ? 'bg-[#B3261E]' : score === 2 ? 'bg-[#C9A24B]' : 'bg-[#1B7A4B]';

  const submit = (e) => {
    e.preventDefault();
    if (!cur) { setErr('Enter your current password.'); return; }
    if (score < 3 || pw.length < 8) { setErr('Choose a stronger password: at least 8 characters and three of the rules below.'); return; }
    if (pw === cur) { setErr('Your new password must be different from your current one.'); return; }
    if (pw !== pw2) { setErr('The new passwords don’t match.'); return; }
    setErr('');
    setDone(true);
    onDone();
  };

  if (done) {
    return (
      <div className="py-2 text-center" role="status">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F6EE] text-[#1B7A4B]"><Icon d={ICONS.check} className="h-6 w-6" /></span>
        <p className="serif text-xl text-[#0F2A43]">Password updated</p>
        <p className="mt-1 text-sm text-[#4A5B6C]">Use your new password next time you sign in. We’ve emailed you a confirmation.</p>
        <button type="button" onClick={onClose} className="btn btn-navy mt-5 w-full !py-2.5 text-sm">Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5">
      <PasswordInput id="pw-cur" label="Current password" value={cur} onChange={(v) => { setCur(v); setErr(''); }} show={show} autoComplete="current-password" autoFocus />
      <div>
        <PasswordInput id="pw-new" label="New password" value={pw} onChange={(v) => { setPw(v); setErr(''); }} show={show} autoComplete="new-password" />
        <div className="mt-2 flex items-center gap-2" aria-hidden={!pw}>
          <div className="grid flex-1 grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 rounded-full ${pw && i <= score ? barColor : 'bg-[#EFEBE1]'}`} />)}
          </div>
          <span className="w-16 text-right text-[11px] font-semibold text-[#4A5B6C]">{pw ? PW_LABEL[score] : ''}</span>
        </div>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {rules.map(([r, ok]) => (
            <li key={r} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-[#1B7A4B]' : 'text-[#4A5B6C]'}`}>
              <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${ok ? 'bg-[#1B7A4B] text-white' : 'border border-[#CFC9BA]'}`}>{ok && <Icon d={ICONS.check} className="h-2.5 w-2.5" />}</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
      <PasswordInput id="pw-new2" label="Confirm new password" value={pw2} onChange={(v) => { setPw2(v); setErr(''); }} show={show} autoComplete="new-password" />
      {pw2 && pw !== pw2 && <p className="-mt-2 text-xs text-[#B3261E]">Passwords don’t match yet.</p>}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3D4C5B]">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-4 w-4 accent-[#0F2A43]" />
        Show passwords
      </label>
      {err && <p role="alert" className="rounded-md bg-[#FDF2F1] px-3 py-2 text-sm text-[#B3261E]">{err}</p>}
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="btn btn-outline !px-5 !py-2 text-sm">Cancel</button>
        <button type="submit" className="btn btn-navy !px-5 !py-2 text-sm">Update password</button>
      </div>
    </form>
  );
}

function EditableRow({ id, label, icon, value, onSave, type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  return (
    <div className="flex flex-wrap items-center gap-3 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6F4EF] text-[#8A6A26]"><Icon d={icon} className="h-[18px] w-[18px]" /></span>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-xs text-[#4A5B6C]">{label}</label>
        {editing ? (
          <input id={id} type={type} className={`${inputCls} mt-1`} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
        ) : (
          <p className="truncate text-sm font-medium text-[#0F2A43]">{value}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <button type="button" onClick={() => { onSave(draft.trim() || value); setEditing(false); }} className="btn btn-navy !px-3 !py-1.5 text-xs">Save</button>
          <button type="button" onClick={() => { setDraft(value); setEditing(false); }} className="btn btn-outline !px-3 !py-1.5 text-xs">Cancel</button>
        </div>
      ) : (
        <button type="button" onClick={() => { setDraft(value); setEditing(true); }} className="text-sm font-semibold text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Edit</button>
      )}
    </div>
  );
}

export function SettingsPage({ onSignOut }) {
  const [profile, setProfile] = useState(CLIENT);
  const [sec, setSec] = useState({ twofa: true, bio: true, newDevice: true });
  const [alerts, setAlerts] = useState({ email: true, push: true, sms: false, market: true });
  const [prefs, setPrefs] = useState({ lang: 'English', statements: 'Electronic', currency: 'USD' });
  const [sessions, setSessions] = useState([
    { id: 's1', device: 'iPhone 16 Pro · Aurelia app', place: 'London, UK', when: 'Active now', current: true },
    { id: 's2', device: 'Safari on Mac', place: 'London, UK', when: 'Today, 07:12', current: false },
    { id: 's3', device: 'Chrome on Windows', place: 'Lagos, Nigeria', when: '3 Oct', current: false },
  ]);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwChanged, setPwChanged] = useState(false);
  const setP = (k) => (v) => setProfile((p) => ({ ...p, [k]: v }));
  const setS = (k) => (v) => setSec((p) => ({ ...p, [k]: v }));
  const setA = (k) => (v) => setAlerts((p) => ({ ...p, [k]: v }));

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile, security, and how we contact you." />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Profile" className="anim-in">
          <div className="divide-y divide-[#EEEAE0]">
            <EditableRow id="set-name" label="Full name" icon={ICONS.user} value={profile.name} onSave={setP('name')} />
            <EditableRow id="set-email" label="Email" icon={ICONS.mail} type="email" value={profile.email} onSave={setP('email')} />
            <EditableRow id="set-phone" label="Mobile" icon={ICONS.phone} type="tel" value={profile.phone} onSave={setP('phone')} />
            <EditableRow id="set-addr" label="Residential address" icon={ICONS.doc} value={profile.address} onSave={setP('address')} />
          </div>
        </Panel>

        <Panel title="Security" className="anim-in anim-in-d1">
          <div className="divide-y divide-[#EEEAE0]">
            <Toggle id="sec-2fa" label="Two-factor authentication" description="A code from your authenticator app at every sign-in" checked={sec.twofa} onChange={setS('twofa')} />
            <Toggle id="sec-bio" label="Face ID or fingerprint" description="Approve sign-ins and large payments biometrically" checked={sec.bio} onChange={setS('bio')} />
            <Toggle id="sec-new" label="Alert me about new devices" description="Email and push when a new device signs in" checked={sec.newDevice} onChange={setS('newDevice')} />
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div><p className="text-sm font-medium text-[#0F2A43]">Password</p><p className="text-xs text-[#4A5B6C]">{pwChanged ? 'Changed just now' : 'Last changed 3 months ago'}</p></div>
              <button type="button" onClick={() => setPwOpen(true)} className="btn btn-outline !px-3 !py-1.5 text-xs">Change password</button>
            </div>
          </div>
        </Panel>

        <Panel title="Signed-in devices" subtitle="Sign out anything you don’t recognise." className="anim-in anim-in-d1">
          <ul className="divide-y divide-[#EEEAE0]">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6F4EF] text-[#0F2A43]"><Icon d={ICONS.device} className="h-[18px] w-[18px]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#0F2A43]">{s.device}</p>
                  <p className="text-xs text-[#4A5B6C]">{s.place} · {s.when}</p>
                </div>
                {s.current ? <Pill tone="green">This device</Pill> : (
                  <button type="button" onClick={() => setSessions((l) => l.filter((x) => x.id !== s.id))} className="text-xs font-semibold text-[#B3261E] hover:underline">Sign out</button>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Notifications" subtitle="Security alerts are always on." className="anim-in anim-in-d2">
          <div className="divide-y divide-[#EEEAE0]">
            <Toggle id="al-email" label="Email alerts" description="Transfers, card payments, and statements" checked={alerts.email} onChange={setA('email')} />
            <Toggle id="al-push" label="Push notifications" description="Instant alerts in the Aurelia app" checked={alerts.push} onChange={setA('push')} />
            <Toggle id="al-sms" label="SMS for payments over $10,000" description="A text message for large transactions" checked={alerts.sms} onChange={setA('sms')} />
            <Toggle id="al-market" label="Market notes" description="Monthly commentary from our investment team" checked={alerts.market} onChange={setA('market')} />
          </div>
        </Panel>

        <Panel title="Preferences" className="anim-in anim-in-d2">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['pref-lang', 'Language', 'lang', ['English', 'Français', 'Español', 'Português']],
              ['pref-stmt', 'Statements', 'statements', ['Electronic', 'Paper and electronic']],
              ['pref-cur', 'Display currency', 'currency', ['USD', 'GBP', 'EUR', 'NGN']],
            ].map(([id, l, k, opts]) => (
              <div key={id}>
                <label htmlFor={id} className="mb-1 block text-xs font-semibold text-[#3D4C5B]">{l}</label>
                <select id={id} className={inputCls} value={prefs[k]} onChange={(e) => setPrefs((p) => ({ ...p, [k]: e.target.value }))}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="anim-in anim-in-d3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#0F2A43]">Sign out</p>
              <p className="text-xs text-[#4A5B6C]">End your session on this device.</p>
            </div>
            <button type="button" onClick={onSignOut} className="rounded-lg border border-[#F2C9C4] px-4 py-2 text-sm font-semibold text-[#B3261E] transition hover:bg-[#FDF2F1]">Sign out</button>
          </div>
        </Panel>
      </div>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change password">
        {pwOpen && <PasswordForm onClose={() => setPwOpen(false)} onDone={() => setPwChanged(true)} />}
      </Modal>
    </>
  );
}

/* =========================================================================
   Support
   ========================================================================= */

const CHANNELS = [
  { icon: ICONS.chat, title: 'Secure chat', body: 'Message the client team from your dashboard.', meta: 'Typical reply in 3 minutes', cta: 'Start chat' },
  { icon: ICONS.phone, title: 'Private client line', body: '+1 800 555 0142', meta: '24 hours for Reserve and Sovereign', cta: 'Call now', href: 'tel:+18005550142' },
  { icon: ICONS.mail, title: 'Email', body: 'clientservice@aurelia.example', meta: 'Reply within one working day', cta: 'Send email', href: 'mailto:clientservice@aurelia.example' },
  { icon: ICONS.user, title: 'Relationship manager', body: 'Emma Mensah', meta: 'Mon–Fri, 08:00–19:00 GMT', cta: 'Book a call' },
];

const SUPPORT_CATEGORIES = ['Payments and transfers', 'Cards', 'Signing in and security', 'Investments', 'Statements and documents', 'Something else'];

const FAQS = [
  ['How do I add a new beneficiary?', 'Open Realtime bank transfer or Wire transfer, then choose “Add new beneficiary” above the beneficiary list. Once saved, they’re selected for you and appear in “Send again” on your overview.'],
  ['How long do wire transfers take?', 'International wires usually arrive in 1–3 business days. Enter the tracking number from your receipt on the Tracking page to see where it is.'],
  ['I don’t recognise a card payment. What should I do?', 'Freeze the card straight away from the Cards page, then open a request under “Cards” below or call the private client line. We’ll investigate and send a replacement if needed.'],
  ['How do I change my password?', 'Go to Settings, then Security, and choose “Change password”. You’ll need your current password.'],
  ['Where can I find my statements?', 'Monthly statements and tax certificates are on the Account info page under Statements. Each one downloads as a PDF.'],
  ['Can I raise my daily transfer limit?', 'Yes. Ask your relationship manager or open a request under “Payments and transfers”. Temporary increases can usually be arranged the same day.'],
];

const TICKET_TONE = { Open: 'navy', 'In progress': 'amber', Resolved: 'green' };

export function SupportPage() {
  const [tickets, setTickets] = useState([
    { id: 'SR-4425', subject: 'Question about a wire fee', cat: 'Payments and transfers', status: 'In progress', updated: 'Today, 11:20' },
    { id: 'SR-4410', subject: 'Replacement for a damaged card', cat: 'Cards', status: 'Resolved', updated: '9 Oct' },
  ]);
  const [form, setForm] = useState({ cat: SUPPORT_CATEGORIES[0], subject: '', message: '', urgent: false });
  const [err, setErr] = useState('');
  const [sentId, setSentId] = useState(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) { setErr('Add a subject and a short description so we can help.'); return; }
    const id = `SR-${4426 + tickets.length}`;
    setTickets((t) => [{ id, subject: form.subject.trim(), cat: form.cat, status: 'Open', updated: 'Just now', urgent: form.urgent }, ...t]);
    setForm({ cat: SUPPORT_CATEGORIES[0], subject: '', message: '', urgent: false });
    setErr('');
    setSentId(id);
  };

  const faqs = FAQS.filter(([qq, a]) => (qq + a).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <PageHeader title="Support" subtitle="Reach the client team, raise a request, or find a quick answer." />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#F2C9C4] bg-[#FDF8F7] px-4 py-3 anim-in">
        <Icon d={ICONS.alert} className="mt-0.5 h-5 w-5 shrink-0 text-[#B3261E]" />
        <p className="text-sm text-[#3D4C5B]"><span className="font-semibold text-[#B3261E]">Lost or stolen card?</span> Freeze it now on the Cards page, then call <a href="tel:+18005550142" className="font-semibold text-[#0F2A43] underline underline-offset-2">+1 800 555 0142</a>. We answer 24 hours a day.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4 anim-in">
        {CHANNELS.map((c) => {
          const Cta = c.href ? 'a' : 'button';
          return (
            <div key={c.title} className="panel flex flex-col rounded-xl border border-[#DDD8CC] bg-white/95 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F2A43] text-[#EDD595]"><Icon d={c.icon} className="h-5 w-5" /></span>
              <p className="mt-3 text-sm font-semibold text-[#0F2A43]">{c.title}</p>
              <p className="mt-0.5 break-words text-sm text-[#3D4C5B]">{c.body}</p>
              <p className="mt-1 text-xs text-[#4A5B6C]">{c.meta}</p>
              <Cta {...(c.href ? { href: c.href } : { type: 'button' })} className="mt-4 inline-flex w-fit items-center text-sm font-semibold text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">{c.cta}</Cta>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] anim-in anim-in-d1">
        <Panel title="Open a request" subtitle="We reply by email and here, usually within one working day.">
          {sentId && (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-[#E7F6EE] px-3 py-2.5 text-sm text-[#1B7A4B]" role="status">
              <Icon d={ICONS.check} className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Request <span className="font-semibold">{sentId}</span> sent. You can follow it under “Your requests”.</p>
            </div>
          )}
          <form onSubmit={submit} noValidate className="space-y-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="sr-cat" className="mb-1 block text-xs font-semibold text-[#3D4C5B]">Topic</label>
                <select id="sr-cat" className={inputCls} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                  {SUPPORT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span className="mb-1 block text-xs font-semibold text-[#3D4C5B]">Priority</span>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Priority">
                  {[[false, 'Normal'], [true, 'Urgent']].map(([v, l]) => (
                    <button key={l} type="button" role="radio" aria-checked={form.urgent === v} onClick={() => setForm({ ...form, urgent: v })}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${form.urgent === v ? (v ? 'border-[#B3261E] bg-[#FDF2F1] text-[#B3261E]' : 'border-[#0F2A43] bg-[#0F2A43] text-white') : 'border-[#CFC9BA] text-[#3D4C5B] hover:border-[#B08A3E]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="sr-subject" className="mb-1 block text-xs font-semibold text-[#3D4C5B]">Subject</label>
              <input id="sr-subject" className={inputCls} value={form.subject} maxLength={80} placeholder="e.g. Wire to Zurich hasn’t arrived" onChange={(e) => { setForm({ ...form, subject: e.target.value }); setErr(''); setSentId(null); }} />
            </div>
            <div>
              <label htmlFor="sr-msg" className="mb-1 block text-xs font-semibold text-[#3D4C5B]">How can we help?</label>
              <textarea id="sr-msg" className={`${inputCls} min-h-[110px] resize-y`} value={form.message} placeholder="Include any tracking numbers, amounts, or dates." onChange={(e) => { setForm({ ...form, message: e.target.value }); setErr(''); setSentId(null); }} />
            </div>
            {err && <p role="alert" className="rounded-md bg-[#FDF2F1] px-3 py-2 text-sm text-[#B3261E]">{err}</p>}
            <button type="submit" className="btn btn-navy w-full !py-2.5 text-sm sm:w-auto sm:!px-6">Send request</button>
          </form>
        </Panel>

        <Panel title="Your requests" subtitle={`${tickets.filter((t) => t.status !== 'Resolved').length} open`}>
          <ul className="divide-y divide-[#EEEAE0]">
            {tickets.map((t) => (
              <li key={t.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0F2A43]">{t.subject}</p>
                    <p className="text-xs text-[#4A5B6C]">{t.id} · {t.cat}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Pill tone={TICKET_TONE[t.status]}>{t.status}</Pill>
                    {t.urgent && <span className="text-[10px] font-semibold text-[#B3261E]">Urgent</span>}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-[#4A5B6C]">Updated {t.updated}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Common questions" className="mt-5 anim-in anim-in-d2">
        <div className="relative mb-2">
          <label htmlFor="faq-q" className="sr-only">Search common questions</label>
          <Icon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8796A6]" />
          <input id="faq-q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setOpen(-1); }} placeholder="Search questions" className={`${inputCls} pl-9`} />
        </div>
        {faqs.length ? (
          <ul className="divide-y divide-[#EEEAE0]">
            {faqs.map(([qq, a], i) => {
              const isOpen = open === i || (q.trim() && faqs.length <= 2);
              return (
                <li key={qq}>
                  <button type="button" aria-expanded={!!isOpen} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
                    <span className="text-sm font-medium text-[#0F2A43]">{qq}</span>
                    <Icon d={ICONS.chevron} className={`h-4 w-4 shrink-0 text-[#8A6A26] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="-mt-1 pb-4 pr-8 text-sm leading-relaxed text-[#4A5B6C]">{a}</p>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-[#4A5B6C]">No answers match “{q}”. Open a request above and we’ll help.</p>
        )}
      </Panel>
    </>
  );
}
