import { useState, useEffect, useRef } from 'react';
import { Panel, RecentActivity, AccountInfoPage, CardsPage, TrackingPage, InvestingPage, NotificationsPage, LoanPage, SettingsPage, SupportPage } from './pages';
import { NOTIFICATIONS } from './data';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Public+Sans:wght@400;500;600&display=swap');
html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.ap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  font-family: 'Public Sans', system-ui, sans-serif;
  color: #14202E;
  box-sizing: border-box;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(201,162,75,0.08), transparent 55%),
    radial-gradient(900px 500px at 95% 20%, rgba(30,75,115,0.06), transparent 50%),
    #F6F4EF;
}
.ap *, .ap *::before, .ap *::after { box-sizing: border-box; }
.ap .serif { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; letter-spacing: -0.015em; }
.ap .navy-bg { background: radial-gradient(900px 500px at 85% -10%, #1F4D78 0%, transparent 60%), linear-gradient(160deg, #0F2A43, #0A1D30); }
.ap .gloss { position: relative; }
.ap .gloss::before { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0) 42%); }
.ap .btn { position: relative; overflow: hidden; border-radius: 4px; padding: 0.875rem 1.5rem; font-weight: 600; transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; display: inline-block; text-align: center; }
@media (min-width: 640px) { .ap .btn { padding: 1rem 2rem; } }
.ap .btn:hover { transform: translateY(-2px); }
.ap .btn:active { transform: translateY(0); }
.ap .btn-gold { color: #0A1D30; background: linear-gradient(180deg, #EDD595, #C9A24B); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 10px 28px -8px rgba(201,162,75,.65); }
.ap .btn-navy { color: #fff; background: linear-gradient(180deg, #1E4B73, #0F2A43); box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 10px 24px -10px rgba(15,42,67,.7); }
.ap .btn-outline { color: #0F2A43; background: #fff; border: 1px solid #0F2A43; }
.ap .btn-outline:hover { background: #F6F4EF; }
@keyframes ap-blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45); }
  50% { opacity: 0.5; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}
.ap .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #22C55E;
  animation: ap-blink 1.6s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes ap-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ap-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ap-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.ap .anim-in {
  animation: ap-fade-up 0.55s cubic-bezier(.22,1,.36,1) both;
}
.ap .anim-in-d1 { animation-delay: 0.06s; }
.ap .anim-in-d2 { animation-delay: 0.12s; }
.ap .anim-in-d3 { animation-delay: 0.18s; }
.ap .anim-in-d4 { animation-delay: 0.24s; }
.ap .card-lift {
  transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s, border-color 0.25s;
}
.ap .card-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px -16px rgba(15,42,67,0.18);
}
.ap .balance-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s;
}
.ap .balance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px -16px rgba(10,29,48,0.45);
}
.ap .balance-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: ap-shimmer 6s ease-in-out infinite;
}
.ap .qa-btn {
  transition: transform 0.25s cubic-bezier(.22,1,.36,1), border-color 0.2s, background 0.2s, box-shadow 0.25s;
}
.ap .qa-btn:hover {
  transform: translateY(-3px);
  border-color: #C9A24B;
  background: #FBF9F4;
  box-shadow: 0 12px 28px -12px rgba(201,162,75,0.35);
}
.ap .qa-btn:active { transform: translateY(-1px); }
.ap .qa-icon {
  transition: transform 0.3s cubic-bezier(.22,1,.36,1), background 0.2s;
}
.ap .qa-btn:hover .qa-icon {
  transform: scale(1.08);
  background: #F0EBE0;
}
.ap .menu-item {
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.ap .menu-item:hover:not(.menu-active) {
  background: #F6F4EF;
}
.ap .menu-active {
  box-shadow: inset 3px 0 0 #C9A24B;
}
.ap .panel {
  transition: box-shadow 0.3s;
}
.ap .panel:hover {
  box-shadow: 0 8px 30px -12px rgba(15,42,67,0.1);
}
.ap .eye-btn {
  transition: background 0.2s, transform 0.2s;
}
.ap .eye-btn:hover {
  background: rgba(255,255,255,0.22);
  transform: scale(1.06);
}
/* ---------- Alignment ---------- */
.ap { text-align: left; }

/* ---------- Texture ---------- */
/* Fine paper grain over every surface */
.ap::after { content: ''; position: fixed; inset: 0; z-index: 70; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px; opacity: .045; mix-blend-mode: overlay; }
/* Engine-turned guilloché for deep surfaces (balance card, cards, team banner) */
.ap .engrave { position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background:
    repeating-radial-gradient(circle at 100% 0%, rgba(237,213,149,.075) 0 1px, transparent 1px 9px),
    repeating-radial-gradient(circle at 0% 100%, rgba(237,213,149,.04) 0 1px, transparent 1px 11px),
    repeating-linear-gradient(115deg, rgba(255,255,255,.018) 0 1px, transparent 1px 6px); }
.ap .navy-bg { background:
  repeating-radial-gradient(circle at 90% -10%, rgba(216,183,106,.05) 0 1px, transparent 1px 10px),
  radial-gradient(900px 500px at 85% -10%, #1F4D78 0%, transparent 60%),
  linear-gradient(160deg, #0F2A43, #0A1D30); }
/* Gold EMV chip for card swatches */
.ap .chip { background: linear-gradient(135deg, #F3E1A9, #C9A24B 55%, #9C7A33);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.5); }

/* ---------- Depth ---------- */
.ap .panel { box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 1px 2px rgba(15,42,67,.04), 0 20px 44px -30px rgba(15,42,67,.3); }
.ap .panel:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 2px 6px rgba(15,42,67,.05), 0 30px 60px -32px rgba(15,42,67,.4); }
.ap .balance-card { box-shadow: 0 2px 6px rgba(10,29,48,.18), 0 40px 80px -36px rgba(10,29,48,.65); }
.ap .balance-card:hover { box-shadow: 0 4px 10px rgba(10,29,48,.2), 0 50px 90px -36px rgba(10,29,48,.72); }
.ap .qa-btn { box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(15,42,67,.05), 0 12px 24px -20px rgba(15,42,67,.3); }
.ap .swatch { box-shadow: 0 1px 2px rgba(0,0,0,.25), 0 10px 18px -10px rgba(10,29,48,.6); }
.ap .dash-aside { box-shadow: 1px 0 0 rgba(255,255,255,.6), 12px 0 32px -28px rgba(15,42,67,.35); }
.ap .dash-header { box-shadow: 0 1px 0 rgba(255,255,255,.7), 0 10px 30px -26px rgba(15,42,67,.4); }

@media (prefers-reduced-motion: reduce) {
  .ap .anim-in,
  .ap .balance-card::after,
  .ap .status-dot { animation: none !important; }
  .ap .card-lift:hover,
  .ap .balance-card:hover,
  .ap .qa-btn:hover { transform: none; }
}
`;

const dashMenu = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { id: 'transfer', label: 'Realtime bank transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'wire', label: 'Wire transfer', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'account', label: 'Account info', icon: 'M3 6h18M3 12h18M3 18h18' },
  { id: 'cards', label: 'Cards', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'tracking', label: 'Tracking', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { id: 'investing', label: 'Investing', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'loan', label: 'Loan', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'support', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
];

function DashIcon({ d, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const MAIN_ACCOUNT = { name: 'USD Current', type: 'Checking', num: '•••• 4821', available: 412860.20 };
const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const lastFour = (acct) => acct.replace(/\s+/g, '').slice(-4);

const SEED_BENEFICIARIES = [
  { id: 'b1', kind: 'transfer', name: 'Adaeze Okafor', bank: 'First Bank of Nigeria', account: '3012456789' },
  { id: 'b2', kind: 'transfer', name: 'Harbour Property Ltd', bank: 'Chase Bank', account: '000123459876' },
  { id: 'b3', kind: 'wire', name: 'Meridian Trust', bank: 'NatWest', account: 'GB29 NWBK 6016 1331 9268 19', swift: 'NWBKGB2L', country: 'United Kingdom' },
  { id: 'b4', kind: 'wire', name: 'Zurich Private AG', bank: 'UBS Switzerland', account: 'CH93 0076 2011 6238 5295 7', swift: 'UBSWCHZH80A', country: 'Switzerland' },
];

const TRANSFER_KINDS = {
  transfer: { title: 'Realtime bank transfer', subtitle: 'Arrives in minutes on supported instant rails.', fee: 0, eta: 'Within minutes', cta: 'Send now', accountLabel: 'Account number' },
  wire: { title: 'Wire transfer', subtitle: 'International transfer via SWIFT.', fee: 25, eta: '1–3 business days', cta: 'Send wire', accountLabel: 'IBAN / account number' },
};

const inputCls = 'w-full rounded-md border border-[#CFC9BA] bg-white px-3 py-2 text-sm text-[#14202E] focus:border-[#B08A3E] focus:outline-none focus:ring-2 focus:ring-[#D8B76A]/35 transition';
const labelCls = 'mb-1 block text-xs font-semibold text-[#3D4C5B]';

function TransferForm({ kind, beneficiaries, onAddBeneficiary, preselectId }) {
  const cfg = TRANSFER_KINDS[kind];
  const list = beneficiaries.filter((b) => b.kind === kind);
  const [benId, setBenId] = useState(() => (list.some((b) => b.id === preselectId) ? preselectId : ''));
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', bank: '', account: '', swift: '', country: '' });
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(null);

  const ben = list.find((b) => b.id === benId);
  const amt = parseFloat(amount) || 0;
  const total = amt + (amt > 0 ? cfg.fee : 0);

  const onSelect = (e) => {
    const v = e.target.value;
    if (v === '__new') { setAdding(true); setBenId(''); return; }
    setAdding(false);
    setBenId(v);
    setErr('');
  };

  const saveBeneficiary = () => {
    const required = kind === 'wire' ? ['name', 'bank', 'account', 'swift'] : ['name', 'bank', 'account'];
    if (required.some((k) => !draft[k].trim())) { setErr('Fill in the beneficiary’s name, bank, and account details to save them.'); return; }
    const nb = { id: `b${Date.now()}`, kind, ...Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, v.trim()])) };
    onAddBeneficiary(nb);
    setBenId(nb.id);
    setAdding(false);
    setDraft({ name: '', bank: '', account: '', swift: '', country: '' });
    setErr('');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!ben) { setErr('Choose a beneficiary, or add a new one.'); return; }
    if (amt <= 0) { setErr('Enter an amount greater than zero.'); return; }
    if (total > MAIN_ACCOUNT.available) { setErr(`This exceeds your available balance of ${usd(MAIN_ACCOUNT.available)}.`); return; }
    setErr('');
    setSent({ name: ben.name, amount: amt, total });
  };

  const reset = () => { setSent(null); setAmount(''); setReference(''); };

  if (sent) {
    return (
      <Panel title={cfg.title} className="anim-in">
        <div className="mx-auto max-w-md py-6 text-center" role="status">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F6EE] text-2xl text-[#1B7A4B]" aria-hidden="true">✓</span>
          <p className="serif text-2xl text-[#0F2A43]">{kind === 'wire' ? 'Wire sent' : 'Transfer sent'}</p>
          <p className="mt-2 text-sm text-[#3D4C5B]">{usd(sent.amount)} to {sent.name}. Expected: {cfg.eta.toLowerCase()}.</p>
          <p className="mt-1 text-xs text-[#4A5B6C]">Total debited {usd(sent.total)} from {MAIN_ACCOUNT.name} {MAIN_ACCOUNT.num}</p>
          <button type="button" onClick={reset} className="btn btn-navy mt-6 !px-5 !py-2.5 text-sm">Make another transfer</button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title={cfg.title} subtitle={cfg.subtitle} className="anim-in">
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div className="space-y-4">
          {/* From — single account, shown as a fixed line */}
          <div>
            <span className={labelCls}>From</span>
            <div className="flex items-center justify-between gap-3 rounded-md border border-[#E4DFD2] bg-[#FBF9F4] px-3 py-2">
              <span className="text-sm font-medium text-[#0F2A43]">{MAIN_ACCOUNT.name} <span className="text-[#4A5B6C]">{MAIN_ACCOUNT.num}</span></span>
              <span className="text-xs text-[#4A5B6C]">Available <span className="font-semibold tabular-nums text-[#0F2A43]">{usd(MAIN_ACCOUNT.available)}</span></span>
            </div>
          </div>

          {/* Beneficiary */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor={`${kind}-ben`} className="text-xs font-semibold text-[#3D4C5B]">Beneficiary</label>
              {!adding && (
                <button type="button" onClick={() => { setAdding(true); setBenId(''); setErr(''); }} className="text-xs font-semibold text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">+ Add new beneficiary</button>
              )}
            </div>
            <select id={`${kind}-ben`} className={inputCls} value={adding ? '__new' : benId} onChange={onSelect}>
              <option value="" disabled>Select a saved beneficiary</option>
              {list.map((b) => (
                <option key={b.id} value={b.id}>{b.name} — {b.bank} •••• {lastFour(b.account)}</option>
              ))}
              <option value="__new">+ Add new beneficiary…</option>
            </select>

            {ben && !adding && (
              <div className="mt-2 flex items-center gap-3 rounded-md border border-[#E4DFD2] bg-white px-3 py-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-[11px] font-semibold text-[#EDD595]">{initialsOf(ben.name)}</span>
                <div className="min-w-0 text-xs text-[#4A5B6C]">
                  <p className="truncate text-sm font-medium text-[#0F2A43]">{ben.name}</p>
                  <p className="truncate">{ben.bank} · {ben.account}{ben.swift ? ` · ${ben.swift}` : ''}</p>
                </div>
              </div>
            )}

            {adding && (
              <div className="mt-2 rounded-lg border border-[#D8B76A]/60 bg-[#FBF9F4] p-3 sm:p-4">
                <p className="mb-3 text-sm font-semibold text-[#0F2A43]">New beneficiary</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={`${kind}-nb-name`} className={labelCls}>Full name</label>
                    <input id={`${kind}-nb-name`} className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor={`${kind}-nb-bank`} className={labelCls}>Bank name</label>
                    <input id={`${kind}-nb-bank`} className={inputCls} value={draft.bank} onChange={(e) => setDraft({ ...draft, bank: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor={`${kind}-nb-acct`} className={labelCls}>{cfg.accountLabel}</label>
                    <input id={`${kind}-nb-acct`} className={inputCls} value={draft.account} onChange={(e) => setDraft({ ...draft, account: e.target.value })} autoComplete="off" />
                  </div>
                  {kind === 'wire' && (
                    <>
                      <div>
                        <label htmlFor={`${kind}-nb-swift`} className={labelCls}>SWIFT / BIC</label>
                        <input id={`${kind}-nb-swift`} className={`${inputCls} uppercase`} value={draft.swift} onChange={(e) => setDraft({ ...draft, swift: e.target.value })} autoComplete="off" />
                      </div>
                      <div>
                        <label htmlFor={`${kind}-nb-country`} className={labelCls}>Country</label>
                        <input id={`${kind}-nb-country`} className={inputCls} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} autoComplete="off" />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={saveBeneficiary} className="btn btn-navy !px-4 !py-2 text-xs">Save beneficiary</button>
                  <button type="button" onClick={() => { setAdding(false); setErr(''); }} className="btn btn-outline !px-4 !py-2 text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Amount + reference */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${kind}-amt`} className={labelCls}>Amount (USD)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4A5B6C]">$</span>
                <input id={`${kind}-amt`} type="number" inputMode="decimal" min="0.01" step="0.01" className={`${inputCls} pl-7 tabular-nums`} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor={`${kind}-ref`} className={labelCls}>Reference <span className="font-normal text-[#4A5B6C]">(optional)</span></label>
              <input id={`${kind}-ref`} className={inputCls} placeholder={kind === 'wire' ? 'e.g. Invoice 2041' : 'e.g. Rent October'} value={reference} onChange={(e) => setReference(e.target.value)} maxLength={35} />
            </div>
          </div>

          {err && <p role="alert" className="rounded-md bg-[#FDF2F1] px-3 py-2 text-sm text-[#B3261E]">{err}</p>}
        </div>

        {/* Summary */}
        <aside className="balance-card relative h-fit overflow-hidden rounded-xl bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] p-5 text-white">
          <div className="engrave" />
          <div className="relative">
            <p className="serif text-lg text-[#EDD595]">Summary</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[#A8B8C8]">To</dt><dd className="truncate text-right font-medium">{ben ? ben.name : '—'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#A8B8C8]">Amount</dt><dd className="tabular-nums">{usd(amt)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#A8B8C8]">Fee</dt><dd className="tabular-nums">{cfg.fee ? usd(cfg.fee) : 'Free'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#A8B8C8]">Arrives</dt><dd>{cfg.eta}</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-3">
              <span className="text-sm text-[#D5DEE8]">Total</span>
              <span className="serif text-2xl tabular-nums">{usd(total)}</span>
            </div>
            <button type="submit" className="btn btn-gold mt-4 w-full !py-2.5 text-sm">{cfg.cta}</button>
            <p className="mt-3 text-[11px] leading-relaxed text-[#A8B8C8]">
              {kind === 'wire' ? 'Fees are shown before you confirm. Correspondent banks may deduct charges.' : 'Payments to new beneficiaries may need a one-time approval in the app.'}
            </p>
          </div>
        </aside>
      </form>
    </Panel>
  );
}

export default function Dashboard({ go: goProp } = {}) {
  const go = goProp || ((to) => { try { window.location.assign(to); } catch { /* ignore */ } });
  const [section, setSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const mainRef = useRef(null);
  const [beneficiaries, setBeneficiaries] = useState(SEED_BENEFICIARIES);
  const [notifItems, setNotifItems] = useState(NOTIFICATIONS);
  const unreadCount = notifItems.filter((n) => !n.read).length;
  const [preselect, setPreselect] = useState(null);
  const addBeneficiary = (b) => setBeneficiaries((list) => [...list, b]);
  const sendTo = (b) => { selectSection(b.kind); setPreselect(b.id); };
  const current = dashMenu.find((m) => m.id === section) || dashMenu[0];
  const firstName = 'Alex';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const quickActions = [
    { id: 'transfer', label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { id: 'wire', label: 'Wire', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'cards', label: 'Cards', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'investing', label: 'Invest', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  ];

  const activeCards = [
    { name: 'Aurelia Reserve', last: '4821', exp: '09/28', status: 'Active', type: 'Physical' },
    { name: 'Aurelia Virtual', last: '7740', exp: '12/27', status: 'Active', type: 'Virtual' },
  ];


  const selectSection = (id) => {
    setPreselect(null);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setSection(id);
    setAnimKey((k) => k + 1);
    setMobileOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  };


  const maskBalance = (value) => (balanceVisible ? value : '••••••••');

  const content = () => {
    switch (section) {
      case 'transfer':
      case 'wire':
        return (
          <TransferForm
            key={`${section}-${preselect || ''}`}
            kind={section}
            beneficiaries={beneficiaries}
            onAddBeneficiary={addBeneficiary}
            preselectId={preselect}
          />
        );
      case 'account':
        return <AccountInfoPage available={maskBalance(usd(MAIN_ACCOUNT.available))} />;
      case 'cards':
        return <CardsPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'investing':
        return <InvestingPage />;
      case 'notifications':
        return <NotificationsPage items={notifItems} setItems={setNotifItems} />;
      case 'loan':
        return <LoanPage onContact={() => selectSection('support')} />;
      case 'settings':
        return <SettingsPage onSignOut={() => go('/signin')} />;
      case 'support':
        return <SupportPage />;
      default:
        return (
          <div key={animKey}>
            {/* Page header */}
            <div className="mb-5 sm:mb-6 flex flex-wrap items-end justify-between gap-3 anim-in">
              <div>
                <p className="text-sm font-medium text-[#8A6A26]">{today}</p>
                <h1 className="serif m-0 mt-1 text-2xl sm:text-3xl text-[#0F2A43]">{greeting}, {firstName}</h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#DDD8CC] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#3D4C5B] shadow-sm">
                <span className="status-dot" aria-hidden="true" />
                Reserve membership · all accounts active
              </div>
            </div>

            {/* Balance card */}
            <div className="mb-6 sm:mb-8 anim-in">
              <div className="balance-card relative overflow-hidden rounded-2xl text-white bg-gradient-to-br from-[#1E4B73] via-[#163A5C] to-[#0A1D30] text-left">
                <div className="engrave" />
                <div className="gloss absolute inset-0 rounded-2xl pointer-events-none" />
                <div className="relative z-[1] grid lg:grid-cols-[1.25fr_1fr]">
                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="serif text-lg sm:text-xl text-[#EDD595]">Account overview</p>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#EDD595] backdrop-blur-sm border border-[#EDD595]/25">
                      Checking
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-[#D5DEE8] text-left">Available balance</p>
                  <div className="mt-1.5 flex items-center gap-3 text-left">
                    <p className="serif text-3xl sm:text-4xl tracking-tight tabular-nums">
                      {maskBalance('$412,860.20')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBalanceVisible((v) => !v)}
                      className="eye-btn flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
                      aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
                    >
                      {balanceVisible ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-[#B8C4D0] text-left">
                    Ledger balance{' '}
                    <span className="font-medium tabular-nums text-[#D5DEE8]">
                      {maskBalance('$415,200.00')}
                    </span>
                  </p>

                  <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-xs font-medium text-[#A8B8C8]">Checking · •••• 4821 · USD</span>
                    <button
                      type="button"
                      onClick={() => selectSection('transfer')}
                      className="btn btn-gold !px-4 !py-2 text-xs"
                    >
                      Transfer
                    </button>
                  </div>
                </div>

                {/* Send again — saved beneficiaries */}
                <div className="border-t border-white/10 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:bg-black/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#D5DEE8]">Send again</p>
                    <button type="button" onClick={() => selectSection('transfer')} className="text-xs font-semibold text-[#EDD595] underline underline-offset-4 hover:text-white transition">New transfer</button>
                  </div>
                  <ul className="mt-3 divide-y divide-white/10">
                    {beneficiaries.slice(0, 3).map((b) => (
                      <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EDD595]/30 bg-white/5 text-xs font-semibold text-[#EDD595]">{initialsOf(b.name)}</span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{b.name}</p>
                            <p className="truncate text-xs text-[#A8B8C8]">{b.kind === 'wire' ? 'Wire' : 'Realtime'} · {b.bank} •••• {lastFour(b.account)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => sendTo(b)} className="shrink-0 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#EDD595]/60 hover:bg-white/10">Send</button>
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mb-6 sm:mb-8 anim-in anim-in-d1">
              <h2 className="serif mb-3 text-lg sm:text-xl text-[#0F2A43]">Quick actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {quickActions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => selectSection(a.id)}
                    className="qa-btn flex flex-col items-center gap-2 rounded-xl border border-[#DDD8CC] bg-white/95 p-3 sm:p-4 text-center shadow-sm"
                  >
                    <span className="qa-icon flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F4EF] text-[#0F2A43]">
                      <DashIcon d={a.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#14202E] leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cards + activity */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-[1fr_1.1fr] anim-in anim-in-d2">
              <Panel
                title="Your cards"
                action={
                  <button type="button" onClick={() => selectSection('cards')} className="text-sm font-semibold text-[#8A6A26] underline underline-offset-4">
                    Manage
                  </button>
                }
              >
                <div className="space-y-3">
                  {activeCards.map((c) => (
                    <div
                      key={c.last}
                      className="card-lift flex items-center gap-3 sm:gap-4 rounded-xl border border-[#DDD8CC] bg-[#FBF9F4] p-3 sm:p-4"
                    >
                      <div
                        className="swatch relative flex h-12 w-[4.75rem] shrink-0 items-end justify-end overflow-hidden rounded-lg p-1.5 text-white"
                        style={{ background: 'linear-gradient(135deg,#1E4B73,#0A1D30)' }}
                      >
                        <span className="engrave" />
                        <span className="chip absolute left-2 top-2 h-2.5 w-3.5 rounded-[2px]" aria-hidden="true" />
                        <span className="relative text-[9px] font-medium tracking-wider text-[#D5DEE8]">•••• {c.last}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#0F2A43] text-sm sm:text-base truncate">{c.name}</p>
                        <p className="text-xs text-[#4A5B6C]">{c.type} · Exp {c.exp}</p>
                      </div>
                      <span className="rounded-full bg-[#E7F6EE] px-2.5 py-1 text-[11px] font-semibold text-[#1B7A4B] shrink-0">
                        {c.status}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => selectSection('cards')}
                    className="mt-1 w-full rounded-xl border border-dashed border-[#CFC9BA] py-3 text-sm font-semibold text-[#8A6A26] hover:bg-[#F6F4EF] hover:border-[#C9A24B] transition"
                  >
                    + Request new card
                  </button>
                </div>
              </Panel>

              <RecentActivity />
            </div>

            {/* Relationship team */}
            <div className="balance-card mt-6 sm:mt-8 navy-bg relative overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white anim-in anim-in-d3">
              <div className="engrave" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="serif m-0 mb-2 sm:mb-3 text-xl sm:text-2xl text-white">Your relationship team</h2>
                  <p className="mb-5 sm:mb-6 text-sm leading-relaxed text-[#D5DEE8]">A named advisor is assigned to your account. Book a call or send a secure message anytime.</p>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => selectSection('support')} className="btn btn-gold relative !px-4 !py-2 sm:!px-5 sm:!py-2.5 text-sm">Schedule a call</button>
                    <button type="button" onClick={() => selectSection('support')} className="btn relative border border-white/25 bg-white/5 !px-4 !py-2 sm:!px-5 sm:!py-2.5 text-sm text-white hover:bg-white/10">Send a message</button>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 pr-5 backdrop-blur-sm">
                  <div className="flex -space-x-2">
                    {['EM', 'JO', 'SK'].map((i) => (
                      <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0F2A43] bg-gradient-to-b from-[#EDD595] to-[#C9A24B] text-xs font-semibold text-[#0A1D30]">{i}</span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Team of three</p>
                    <p className="whitespace-nowrap text-xs text-[#A8B8C8]">Usually replies within 1 hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderMenuItems = (isMobile = false) => (
    <>
      {dashMenu.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => selectSection(m.id)}
          className={`menu-item mb-0.5 flex w-full items-center gap-2.5 sm:gap-3 rounded-lg px-2.5 sm:px-3 py-2.5 text-left text-sm font-medium ${
            section === m.id ? 'menu-active bg-[#0F2A43] text-white' : 'text-[#14202E]'
          }`}
        >
          <DashIcon d={m.icon} className={`h-5 w-5 shrink-0 ${section === m.id ? 'text-[#EDD595]' : 'text-[#8A6A26]'}`} />
          <span className="leading-snug">{m.label}</span>
        </button>
      ))}
      <div className={`${isMobile ? 'mt-2 pt-2 border-t border-[#EEEADF]' : 'mt-3 pt-3 border-t border-[#EEEADF]'}`}>
        <button
          type="button"
          onClick={() => go('/signin')}
          className="menu-item flex w-full items-center gap-2.5 sm:gap-3 rounded-lg px-2.5 sm:px-3 py-2.5 text-left text-sm font-medium text-[#B3261E] hover:bg-[#FDF2F1]"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="leading-snug">Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="ap w-full max-w-none h-[100dvh] antialiased overflow-hidden flex flex-col">
      <style>{styles}</style>

      <header className="dash-header relative shrink-0 z-40 w-full border-b border-[#DDD8CC]/80 bg-white/90 backdrop-blur-md">
        <div className="flex h-14 sm:h-16 w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#0F2A43] hover:bg-[#F6F4EF] lg:hidden transition"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => { setMobileOpen(!mobileOpen); setNotifOpen(false); setProfileOpen(false); }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
          <button type="button" onClick={() => selectSection('overview')} className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label="Dashboard home">
            <span className="serif gloss flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-base sm:text-lg text-[#EDD595] shadow-md">A</span>
            <span className="serif hidden text-base sm:text-lg text-[#0F2A43] truncate sm:inline">Aurelia Private</span>
          </button>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                aria-expanded={notifOpen}
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setMobileOpen(false); }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0F2A43] hover:bg-[#F6F4EF] transition"
              >
                <DashIcon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="h-[22px] w-[22px]" />
                {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C0392B] ring-2 ring-white" />}
              </button>
              {notifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-[#DDD8CC] bg-white/95 backdrop-blur-md p-2 shadow-xl anim-in">
                  <p className="px-3 py-2 text-xs font-semibold text-[#4A5B6C]">Notifications{unreadCount ? ` · ${unreadCount} unread` : ''}</p>
                  {notifItems.slice(0, 3).map((n) => (
                    <button key={n.id} type="button" onClick={() => { setNotifItems((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x))); selectSection('notifications'); }} className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-[#F6F4EF] transition">
                      <p className="flex items-center gap-2 text-sm font-medium text-[#0F2A43]">{n.title}{!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" aria-label="Unread" />}</p>
                      <p className="text-xs text-[#4A5B6C] line-clamp-2">{n.body}</p>
                      <p className="mt-0.5 text-[11px] text-[#4A5B6C]">{n.day} · {n.time}</p>
                    </button>
                  ))}
                  <button type="button" onClick={() => selectSection('notifications')} className="mt-1 w-full rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#8A6A26] hover:bg-[#F6F4EF] transition">View all</button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setMobileOpen(false); }}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-xs sm:text-sm font-semibold text-[#EDD595] shadow-md transition hover:opacity-95"
              >
                AP
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 sm:w-56 rounded-xl border border-[#DDD8CC] bg-white/95 backdrop-blur-md py-2 shadow-xl anim-in">
                  <div className="border-b border-[#EEEADF] px-4 py-3">
                    <p className="text-sm font-semibold text-[#0F2A43]">Client account</p>
                    <p className="text-xs text-[#4A5B6C]">Reserve membership</p>
                  </div>
                  <button type="button" onClick={() => selectSection('account')} className="block w-full px-4 py-2.5 text-left text-sm text-[#14202E] hover:bg-[#F6F4EF] transition">Account info</button>
                  <button type="button" onClick={() => selectSection('settings')} className="block w-full px-4 py-2.5 text-left text-sm text-[#14202E] hover:bg-[#F6F4EF] transition">Settings</button>
                  <button type="button" onClick={() => go('/signin')} className="block w-full border-t border-[#EEEADF] px-4 py-2.5 text-left text-sm font-medium text-[#B3261E] hover:bg-[#F6F4EF] transition">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <nav className="max-h-[min(70vh,calc(100dvh-3.5rem))] overflow-y-auto border-t border-[#EEEADF] bg-white px-2 py-2 lg:hidden overscroll-contain" aria-label="Dashboard menu">
            {renderMenuItems(true)}
          </nav>
        )}
      </header>

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <aside className="dash-aside relative z-10 hidden w-56 xl:w-64 2xl:w-72 shrink-0 border-r border-[#DDD8CC]/80 bg-white/90 backdrop-blur-sm lg:flex lg:flex-col overflow-hidden">
          <nav className="flex-1 overflow-y-auto overscroll-contain space-y-0.5 p-2 sm:p-3" aria-label="Dashboard">
            {renderMenuItems(false)}
          </nav>
        </aside>

        <main ref={mainRef} className="min-w-0 flex-1 w-full overflow-y-auto overscroll-contain px-3 py-5 sm:px-5 sm:py-6 md:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[1280px]">
            {section !== 'overview' && (
              <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-2 text-sm anim-in">
                <button type="button" onClick={() => selectSection('overview')} className="font-medium text-[#4A5B6C] hover:text-[#0F2A43] transition">Overview</button>
                <svg className="h-3.5 w-3.5 text-[#B08A3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
                <span className="font-semibold text-[#8A6A26]">{current.label}</span>
              </nav>
            )}
            {content()}
          </div>
        </main>
      </div>
    </div>
  );
}
