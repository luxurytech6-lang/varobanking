import { useState, useEffect, useRef } from 'react';
import Dashboard from '../dashboard/dashboard';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Public+Sans:wght@400;500;600&display=swap');
html, body, #root { width:100%; max-width:none !important; margin:0 !important; padding:0 !important; display:block !important; text-align:left !important; }
html { scroll-behavior:smooth; }
.ap { width:100%; overflow-x:hidden; font-family:'Public Sans',system-ui,sans-serif; color:#14202E; }
.ap .serif { font-family:'Source Serif 4',Georgia,serif; font-weight:600; letter-spacing:-0.015em; }
.ap a:focus-visible, .ap button:focus-visible, .ap input:focus-visible, .ap select:focus-visible { outline:2px solid #D8B76A; outline-offset:3px; }
.ap img, .ap svg { max-width:100%; }
.ap h1, .ap h2, .ap h3 { overflow-wrap:break-word; }
.ap input[type=range] { accent-color:#D8B76A; width:100%; }

/* Surfaces */
.ap .navy-bg { background: repeating-radial-gradient(circle at 85% -5%, rgba(216,183,106,.05) 0 1px, transparent 1px 10px), repeating-radial-gradient(circle at 5% 105%, rgba(216,183,106,.035) 0 1px, transparent 1px 12px), repeating-linear-gradient(115deg, rgba(255,255,255,.014) 0 1px, transparent 1px 6px), radial-gradient(900px 500px at 85% -10%, #1F4D78 0%, transparent 60%), radial-gradient(700px 400px at 0% 100%, rgba(176,138,62,.18) 0%, transparent 60%), linear-gradient(160deg,#0F2A43,#0A1D30); }
.ap .glass { background:linear-gradient(160deg, rgba(255,255,255,.14), rgba(255,255,255,.04)); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,.2); box-shadow:0 30px 60px -20px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.35); }
.ap .gloss { position:relative; }
.ap .gloss::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0) 42%); }

/* Buttons */
.ap .btn { position:relative; overflow:hidden; border-radius:4px; padding:1rem 2rem; font-weight:600; transition:transform .25s, box-shadow .25s; }
.ap .btn:hover { transform:translateY(-2px); }
.ap .btn::after { content:''; position:absolute; top:0; left:-120%; width:60%; height:100%; background:linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent); transform:skewX(-20deg); }
.ap .btn:hover::after { left:140%; transition:left .7s ease; }
.ap .btn-gold { color:#0A1D30; background:linear-gradient(180deg,#EDD595,#C9A24B); box-shadow:inset 0 1px 0 rgba(255,255,255,.7), 0 10px 28px -8px rgba(201,162,75,.65); }
.ap .btn-navy { color:#fff; background:linear-gradient(180deg,#1E4B73,#0F2A43); box-shadow:inset 0 1px 0 rgba(255,255,255,.25), 0 10px 24px -10px rgba(15,42,67,.7); }
.ap .btn-glass { color:#fff; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.35); backdrop-filter:blur(8px); }

/* Reveal + motion */
.ap .rv { opacity:0; transform:translateY(28px); transition:opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); transition-delay:var(--d,0s); }
.ap .rv.in { opacity:1; transform:none; }
@keyframes drift { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(40px,-30px) scale(1.12); } }
@keyframes floaty { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
@keyframes marquee { to { transform:translateX(-50%); } }
@keyframes ping { 0% { transform:scale(.6); opacity:.9; } 100% { transform:scale(3); opacity:0; } }
@keyframes ring { 0% { transform:scale(.55); opacity:.7; } 100% { transform:scale(1.25); opacity:0; } }
@keyframes sheen { 0% { transform:translateX(-120%) skewX(-20deg); } 60%,100% { transform:translateX(320%) skewX(-20deg); } }
@keyframes draw { to { stroke-dashoffset:0; } }
@keyframes fadeq { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
.ap .orb { position:absolute; border-radius:9999px; filter:blur(90px); animation:drift 16s ease-in-out infinite; pointer-events:none; }
.ap .float-a { animation:floaty 6s ease-in-out infinite; }
.ap .float-b { animation:floaty 7.5s ease-in-out infinite reverse; }
.ap .marquee { display:flex; width:max-content; animation:marquee 45s linear infinite; }
.ap .marquee:hover { animation-play-state:paused; }
.ap .ping { animation:ping 2.4s ease-out infinite; }
.ap .ring { animation:ring 3.6s ease-out infinite; }
.ap .sheen::after { content:''; position:absolute; top:0; left:0; width:35%; height:100%; background:linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent); animation:sheen 5s ease-in-out infinite; }
.ap .draw { stroke-dasharray:600; stroke-dashoffset:600; animation:draw 2.6s .4s ease forwards; }
.ap .quote-in { animation:fadeq .7s ease both; }

/* Polish */
.ap ::selection { background:#EDD595; color:#0A1D30; }
.ap a.btn { display:inline-block; text-align:center; }
.ap .btn-outline { color:#0F2A43; background:#fff; border:1px solid #0F2A43; }
.ap .btn-outline:hover { background:#F6F4EF; }
.ap .navlink::after { content:''; position:absolute; left:0; bottom:-3px; height:2px; width:100%; background:linear-gradient(90deg,#B08A3E,#EDD595); transform:scaleX(0); transform-origin:left; transition:transform .3s ease; }
.ap .navlink:hover::after, .ap .navlink[aria-current=page]::after { transform:scaleX(1); }
.ap article.spot { box-shadow:0 1px 0 rgba(15,42,67,.04), 0 14px 32px -22px rgba(15,42,67,.35); }
@keyframes menuIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
.ap .menu-in { animation:menuIn .22s ease both; }
.ap .auth-input { width:100%; border-radius:8px; border:1px solid #CFC9BA; background:#fff; padding:.8rem 1rem; color:#14202E; transition:border-color .2s, box-shadow .2s; }
.ap .auth-input:hover { border-color:#B08A3E; }
.ap .auth-input:focus { border-color:#B08A3E; box-shadow:0 0 0 3px rgba(216,183,106,.35); }
.ap .auth-input[aria-invalid=true] { border-color:#B3261E; }

/* Cards */
.ap .spot { position:relative; overflow:hidden; transition:transform .35s, box-shadow .35s, border-color .35s; }
.ap .spot::before { content:''; position:absolute; inset:0; opacity:0; transition:opacity .3s; pointer-events:none; background:radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(176,138,62,.2), transparent 45%); }
.ap .spot:hover { transform:translateY(-6px); box-shadow:0 28px 50px -24px rgba(15,42,67,.4); border-color:#B08A3E; }
.ap .spot:hover::before { opacity:1; }
.ap .dots { background-image:radial-gradient(rgba(216,183,106,.35) 1.2px, transparent 1.2px); background-size:22px 22px; }

@keyframes turn { to { transform:rotate(360deg); } }
.ap .guil { animation:turn 160s linear infinite; }
.ap .guil-r { animation-direction:reverse; animation-duration:220s; }

@media (prefers-reduced-motion: reduce) {
  .ap *, .ap *::before, .ap *::after { animation:none !important; transition:none !important; scroll-behavior:auto !important; }
  .ap .rv { opacity:1; transform:none; }
  .ap .draw { stroke-dashoffset:0; }
}

/* ---------- Texture & elegance pass ---------- */
/* Fine paper grain over every surface — felt, not seen */
.ap::after { content:''; position:fixed; inset:0; z-index:70; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:160px; opacity:.045; mix-blend-mode:overlay; }
/* Elegant gold keyline inside raised cards */
.ap .spot { position:relative; }
.ap .spot::after { content:''; position:absolute; inset:10px; border:1px solid rgba(176,138,62,.14);
  border-radius:inherit; pointer-events:none; opacity:0; transition:opacity .35s; }
.ap .spot:hover::after { opacity:1; }
/* Refined hairline dividers get a faint gold core */
.ap .dots { background-image:radial-gradient(rgba(216,183,106,.4) 1.1px, transparent 1.1px), radial-gradient(rgba(216,183,106,.12) 1.1px, transparent 1.1px); background-size:22px 22px, 22px 22px; background-position:0 0, 11px 11px; }

/* ---------- Depth ---------- */
/* Deep navy fields gain an inner vignette so foreground content sits forward */
.ap section.navy-bg { box-shadow: inset 0 90px 160px -90px rgba(0,0,0,.5), inset 0 -90px 160px -90px rgba(0,0,0,.55); }
/* Raised cards feel layered at rest, and lift further on hover */
.ap article.spot { box-shadow: inset 0 1px 0 rgba(255,255,255,.65), 0 1px 2px rgba(15,42,67,.05), 0 18px 36px -24px rgba(15,42,67,.4); }
.ap .spot:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,.75), 0 4px 10px rgba(15,42,67,.08), 0 40px 70px -28px rgba(15,42,67,.55); }
/* Floating glass panels read as truly lifted above the surface */
.ap .glass { box-shadow: 0 2px 6px rgba(0,0,0,.25), 0 44px 90px -30px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.4); }
/* A quiet raised bevel + ambient shadow for solid white cards that float on navy */
.ap .lift { box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 2px 6px rgba(10,29,48,.12), 0 40px 80px -34px rgba(10,29,48,.55); }
`;

/* ---------- Hooks and helpers ---------- */
function useInView(once = true) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); if (once) io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, seen];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, seen] = useInView();
  return <div ref={ref} className={`rv ${seen ? 'in' : ''} ${className}`} style={{ '--d': `${delay}s` }}>{children}</div>;
}

function CountUp({ to, prefix = '', suffix = '', decimals = 0 }) {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    let raf; const t0 = performance.now(); const dur = 1800;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setVal(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const wrap = 'mx-auto w-full max-w-[1920px] px-6 md:px-10 xl:px-16 2xl:px-24';

/* ---------- Routing (no dependency) ---------- */
const normalize = (p) => ((p || '/').replace(/\/+$/, '') || '/').toLowerCase();
const authMode = (p) => {
  if (['/signin', '/sign-in', '/login'].includes(p)) return 'signin';
  if (['/signup', '/sign-up', '/register'].includes(p)) return 'signup';
  if (['/forgot', '/forgot-password', '/reset', '/reset-password'].includes(p)) return 'forgot';
  return null;
};

function Link({ to, go, className = '', onClick, children, ...rest }) {
  const handle = (e) => {
    if (onClick) onClick(e);
    if (to.startsWith('#') || to === '#' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return <a href={to} className={className} onClick={handle} {...rest}>{children}</a>;
}

/* ---------- Data ---------- */
const nav = [['Services', '#services'], ['Membership', '#membership'], ['Digital banking', '#digital'], ['Security', '#security'], ['Insights', '#insights'], ['About', '#about']];

const fx = [['USD/EUR', '0.9214', '+0.12%', 1], ['GBP/USD', '1.2841', '-0.08%', 0], ['USD/JPY', '149.62', '+0.21%', 1], ['EUR/CHF', '0.9573', '-0.03%', 0], ['USD/CAD', '1.3522', '+0.06%', 1], ['AUD/USD', '0.6544', '-0.14%', 0], ['Gold (oz)', '$2,384', '+0.41%', 1], ['USD/SGD', '1.3418', '+0.02%', 1]];

const services = [
  ['Private accounts', 'Multi-currency current and savings accounts with preferential rates, a named relationship manager, and same-day global transfers.'],
  ['Wealth management', 'Portfolios built around your goals and risk tolerance, with quarterly reviews and access to private markets.'],
  ['Credit and lending', 'Mortgages, lombard loans, and business facilities with clear terms and a decision within one working day.'],
  ['Trusts and estates', 'Succession planning, trusts, and philanthropy, coordinated with your legal and tax advisers.'],
  ['Business banking', 'Treasury, trade finance, and payroll for owner-managed companies, under the same relationship manager.'],
  ['Insurance and protection', 'Life, property, and key-person cover arranged through independent underwriters.'],
];

const tiers = [
  { name: 'Classic', from: '$250,000', note: 'For individuals building a first international portfolio.', feats: ['Named relationship manager', 'Multi-currency accounts', 'Annual planning review', 'Concierge by chat'], grad: 'linear-gradient(135deg,#3A5670,#1B3347)' },
  { name: 'Reserve', from: '$1,000,000', note: 'For families and founders who need advice across borders.', feats: ['Dedicated advisory team of three', 'Lombard and mortgage lending', 'Quarterly planning reviews', 'Private market access', '24-hour concierge'], grad: 'linear-gradient(135deg,#E8CD8A,#B08A3E)', hot: true },
  { name: 'Sovereign', from: '$10,000,000', note: 'By invitation, for multi-generational wealth.', feats: ['Family office services', 'Trust and estate structuring', 'Bespoke investment mandates', 'Senior partner on your team'], grad: 'linear-gradient(135deg,#24262B,#0B0C0F)' },
];

const steps = [
  ['Meet', 'We learn how you earn, spend, and invest today, and what you want to be true in ten and thirty years.'],
  ['Plan', 'Your advisory team writes a plan covering investments, borrowing, tax, and succession, with fees shown in full.'],
  ['Invest', 'We carry out the plan and move your assets across, with no changes made without your approval.'],
  ['Review', 'Every quarter we compare results against the plan and adjust it when your circumstances change.'],
];

const security = [
  ['Biometric sign-in', 'Face or fingerprint approval on every login and every large payment.'],
  ['End-to-end encryption', 'Messages, documents, and transfers are encrypted from your device to ours.'],
  ['Live fraud monitoring', 'Our team reviews unusual activity around the clock and calls you before money moves.'],
  ['Independent audits', 'Systems and controls are tested every year by outside security firms.'],
];

const cities = [['London', '47%', '24%'], ['New York', '25%', '33%'], ['Zurich', '51%', '28%'], ['Dubai', '62%', '42%'], ['Lagos', '49%', '55%'], ['Singapore', '76%', '60%'], ['Hong Kong', '80%', '45%']];

const stories = [
  ['Moving our family office onto one platform cut our reporting time from weeks to a single morning.', 'Founder, logistics group'],
  ['Our relationship manager caught a currency exposure we had missed for two years. That one call paid for the year.', 'Retired surgeon'],
  ['They explained every fee before we signed. That is why we stayed.', 'Co-owner, manufacturing business'],
];

const articles = [
  ['Markets', 'What rate cuts mean for multi-currency savers', '6 min read'],
  ['Planning', 'Five questions to ask before setting up a family trust', '8 min read'],
  ['Business', 'Managing currency risk when you sell abroad', '5 min read'],
];

const timeline = [
  ['1892', 'Founded as a merchant house serving local trading families.'],
  ['1954', 'Granted a private banking licence.'],
  ['1998', 'Opened international offices and a multi-currency platform.'],
  ['2019', 'Launched the Aurelia mobile app.'],
  ['2026', 'Serving clients in more than 140 countries.'],
];

const faqs = [
  ['What is the minimum to open a private account?', 'Private accounts open from $250,000 in total assets with us. Business banking has separate thresholds that your advisor will confirm.'],
  ['How are you paid?', 'We charge a transparent annual fee based on assets managed. We do not take commissions from product providers.'],
  ['Is my money protected?', 'Eligible deposits are covered by the deposit protection scheme in the jurisdiction of your account. Your advisor will give you the exact limits.'],
  ['Can I bank from outside my home country?', 'Yes. Clients in 140+ countries use the app, with local support during their working hours.'],
];

const langs = [['en', 'English'], ['fr', 'Français'], ['es', 'Español'], ['pt', 'Português']];

/* Translations are keyed by the English text. Anything missing falls back to English. */
const dict = {
  fr: {
    'Client sign in': 'Connexion client',
    'Open an account': 'Ouvrir un compte',
    'Speak with an advisor': 'Parler à un conseiller',
    'Find an office': 'Trouver une agence',
    'Careers': 'Carrières',
    'Services': 'Services',
    'Membership': 'Adhésion',
    'Digital banking': 'Banque en ligne',
    'Security': 'Sécurité',
    'Insights': 'Analyses',
    'About': 'À propos',
    'Serving private clients since 1892': 'Au service des clients privés depuis 1892',
    'Private banking for families and founders with assets in more than one country.': 'La banque privée des familles et des entrepreneurs dont le patrimoine s’étend sur plusieurs pays.',
    'One relationship manager, one view of everything you own, and advice that answers only to you.': 'Un seul gestionnaire de relation, une vue d’ensemble de tout ce que vous possédez, et des conseils qui ne répondent qu’à vous.',
    'Advice shaped around how you hold wealth': 'Des conseils adaptés à la façon dont vous détenez votre patrimoine',
    'Everything your finances need, under one roof': 'Tout ce dont vos finances ont besoin, sous un même toit',
    'Choose the level of service that fits your wealth': 'Choisissez le niveau de service adapté à votre patrimoine',
    'What each tier costs and includes': 'Ce que coûte et inclut chaque niveau',
    'How we manage your wealth': 'Comment nous gérons votre patrimoine',
    'Your bank in one secure app': 'Votre banque dans une seule application sécurisée',
    'Download the app': 'Télécharger l’application',
    'Security you do not have to think about': 'Une sécurité à laquelle vous n’avez pas à penser',
    'Licensed, certified, and audited': 'Agréée, certifiée et auditée',
    'Local advisors in the world’s financial centres': 'Des conseillers locaux dans les centres financiers du monde',
    'What our clients say': 'Ce que disent nos clients',
    'Recognised by the industry': 'Reconnue par le secteur',
    'Insights from our advisors': 'Les analyses de nos conseillers',
    'View all articles': 'Voir tous les articles',
    'A small bank, by design': 'Une petite banque, par choix',
    'Common questions': 'Questions fréquentes',
    'Talk to an advisor about your needs': 'Parlez de vos besoins à un conseiller',
    'Market notes, once a month': 'Notes de marché, une fois par mois',
    'Subscribe': 'S’abonner',
    'Sign in': 'Se connecter',
    'Create account': 'Créer un compte',
    'Welcome back': 'Bon retour',
    'Open your account': 'Ouvrez votre compte',
  },
  es: {
    'Client sign in': 'Acceso de clientes',
    'Open an account': 'Abrir una cuenta',
    'Speak with an advisor': 'Hablar con un asesor',
    'Find an office': 'Encontrar una oficina',
    'Careers': 'Empleo',
    'Services': 'Servicios',
    'Membership': 'Membresía',
    'Digital banking': 'Banca digital',
    'Security': 'Seguridad',
    'Insights': 'Perspectivas',
    'About': 'Nosotros',
    'Serving private clients since 1892': 'Al servicio de clientes privados desde 1892',
    'Private banking for families and founders with assets in more than one country.': 'Banca privada para familias y fundadores con patrimonio en más de un país.',
    'One relationship manager, one view of everything you own, and advice that answers only to you.': 'Un único gestor de relación, una visión de todo lo que posee y un asesoramiento que responde solo ante usted.',
    'Advice shaped around how you hold wealth': 'Asesoramiento a la medida de cómo posee su patrimonio',
    'Everything your finances need, under one roof': 'Todo lo que sus finanzas necesitan, bajo un mismo techo',
    'Choose the level of service that fits your wealth': 'Elija el nivel de servicio que se ajusta a su patrimonio',
    'What each tier costs and includes': 'Lo que cuesta e incluye cada nivel',
    'How we manage your wealth': 'Cómo gestionamos su patrimonio',
    'Your bank in one secure app': 'Su banco en una sola app segura',
    'Download the app': 'Descargar la app',
    'Security you do not have to think about': 'Seguridad en la que no tiene que pensar',
    'Licensed, certified, and audited': 'Autorizado, certificado y auditado',
    'Local advisors in the world’s financial centres': 'Asesores locales en los centros financieros del mundo',
    'What our clients say': 'Lo que dicen nuestros clientes',
    'Recognised by the industry': 'Reconocido por el sector',
    'Insights from our advisors': 'Perspectivas de nuestros asesores',
    'View all articles': 'Ver todos los artículos',
    'A small bank, by design': 'Un banco pequeño, por diseño',
    'Common questions': 'Preguntas frecuentes',
    'Talk to an advisor about your needs': 'Hable con un asesor sobre sus necesidades',
    'Market notes, once a month': 'Notas de mercado, una vez al mes',
    'Subscribe': 'Suscribirse',
    'Sign in': 'Iniciar sesión',
    'Create account': 'Crear cuenta',
    'Welcome back': 'Le damos la bienvenida',
    'Open your account': 'Abra su cuenta',
  },
  pt: {
    'Client sign in': 'Acesso de clientes',
    'Open an account': 'Abrir uma conta',
    'Speak with an advisor': 'Falar com um consultor',
    'Find an office': 'Encontrar um escritório',
    'Careers': 'Carreiras',
    'Services': 'Serviços',
    'Membership': 'Associação',
    'Digital banking': 'Banco digital',
    'Security': 'Segurança',
    'Insights': 'Análises',
    'About': 'Sobre nós',
    'Serving private clients since 1892': 'Atendendo clientes privados desde 1892',
    'Private banking for families and founders with assets in more than one country.': 'Banco privado para famílias e fundadores com patrimônio em mais de um país.',
    'One relationship manager, one view of everything you own, and advice that answers only to you.': 'Um único gerente de relacionamento, uma visão de tudo o que você possui e uma consultoria que responde somente a você.',
    'Advice shaped around how you hold wealth': 'Consultoria sob medida para a forma como você mantém seu patrimônio',
    'Everything your finances need, under one roof': 'Tudo de que suas finanças precisam, sob o mesmo teto',
    'Choose the level of service that fits your wealth': 'Escolha o nível de serviço que combina com seu patrimônio',
    'What each tier costs and includes': 'Quanto custa e o que inclui cada nível',
    'How we manage your wealth': 'Como gerenciamos o seu patrimônio',
    'Your bank in one secure app': 'Seu banco em um único aplicativo seguro',
    'Download the app': 'Baixar o aplicativo',
    'Security you do not have to think about': 'Segurança em que você não precisa pensar',
    'Licensed, certified, and audited': 'Autorizado, certificado e auditado',
    'Local advisors in the world’s financial centres': 'Consultores locais nos centros financeiros do mundo',
    'What our clients say': 'O que nossos clientes dizem',
    'Recognised by the industry': 'Reconhecido pelo setor',
    'Insights from our advisors': 'Análises dos nossos consultores',
    'View all articles': 'Ver todos os artigos',
    'A small bank, by design': 'Um banco pequeno, por escolha',
    'Common questions': 'Perguntas frequentes',
    'Talk to an advisor about your needs': 'Converse com um consultor sobre suas necessidades',
    'Market notes, once a month': 'Notas de mercado, uma vez por mês',
    'Subscribe': 'Inscrever-se',
    'Sign in': 'Entrar',
    'Create account': 'Criar conta',
    'Welcome back': 'Bem-vindo de volta',
    'Open your account': 'Abra a sua conta',
  },
};

/* Real Unsplash photos (free to use under the Unsplash License). Cropped via w/h + object-position. */
const images = {
  /* Wide skyline – hero & auth backgrounds */
  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80',
  auth: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=1200&q=80',
  /* Client persona cards – landscape meeting / team shots */
  clients: [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&h=600&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&h=600&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&h=600&q=80',
  ],
  /* Team banner */
  team: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=900&q=80',
  /* Circular headshots – face-centred crops */
  voices: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&h=240&q=80',
  ],
  stories: [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80',
  ],
  about: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&h=700&q=80',
  articles: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&h=520&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=520&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=520&q=80',
  ],
  /* Service card tops – consistent landscape ratio */
  services: [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=440&q=80',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&h=440&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=440&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&h=440&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=440&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=440&q=80',
  ],
  digital: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&h=800&q=80',
  security: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=800&q=80',
  network: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&h=900&q=80',
  consult: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=800&q=80',
};

const certs = [
  ['Regulated', 'Licensed private bank', 'Authorised and regulated in each jurisdiction where we operate.'],
  ['ISO 27001', 'Information security', 'Certified, and re-audited every year by an outside body.'],
  ['Protected', 'Deposit protection', 'Eligible deposits are covered under the scheme in your account’s jurisdiction.'],
  ['Audited', 'Independent audit', 'Accounts and controls are audited by an external firm every year.'],
  ['GDPR', 'Data protection', 'Client data is handled under GDPR and local privacy laws.'],
  ['FATF', 'Financial crime controls', 'Checks aligned with FATF standards on every account opening.'],
];

const awards = [
  ['2026', 'Best private bank for cross-border clients', 'Private Banking Awards'],
  ['2025', 'Digital banking excellence', 'Wealth Technology Awards'],
  ['2024', 'Most trusted advisory team', 'Client Advisory Awards'],
  ['2023', 'Outstanding family office services', 'Wealth Management Awards'],
];

const voices = [
  ['Opening accounts in three currencies took one afternoon, not three months.', 'Adaeze Okafor', 'Managing director, import business'],
  ['My advisor called before the market moved, not after. That is the service I wanted.', 'Daniel Reyes', 'Retired engineer'],
  ['The trust was set up with our lawyers in the room. Nobody had to repeat themselves.', 'Haddad family', 'Clients since 2014'],
  ['I move countries every few years. My accounts and my advisor move with me.', 'Mei Lin', 'Management consultant'],
  ['Fees were on one page, in plain words. I have not had that from a bank before.', 'Tunde Adeyemi', 'Owner, restaurant group'],
  ['I can approve a payment from a car park in Dubai and it feels safe.', 'Priya Shah', 'Shipping executive'],
];

const chips = [['Multi-currency', 'Same-day transfers'], ['Quarterly reviews', 'Private markets'], ['Lombard loans', 'Mortgages'], ['Trusts', 'Philanthropy'], ['Treasury', 'Trade finance'], ['Life cover', 'Key-person cover']];

const personas = [
  { k: 'Founders', sub: 'Building or selling a company', head: 'Keep the business and the family balance sheet in one view', pts: ['Plan your exit years before it happens', 'Borrow against shares without selling them', 'Keep company cash and personal wealth separate'], days: [['Month 1', 'Map every company, account, and loan you hold.'], ['Month 2', 'Agree an exit and liquidity plan.'], ['Month 3', 'Move assets across and switch on reporting.']] },
  { k: 'Families', sub: 'Passing wealth between generations', head: 'Pass on wealth in a way every generation understands', pts: ['Trusts and estate plans coordinated with your lawyers', 'Meetings that bring the next generation into the plan', 'Philanthropy run through one structured vehicle'], days: [['Month 1', 'List assets, heirs, and your wishes.'], ['Month 2', 'Draft the trust and succession structure with your advisers.'], ['Month 3', 'Hold the first family meeting.']] },
  { k: 'Global professionals', sub: 'Earning in more than one country', head: 'One set of accounts that follows you from posting to posting', pts: ['Multi-currency accounts in your name wherever you live', 'Tax-aware investing across each country you work in', 'An advisor who works in your time zone'], days: [['Month 1', 'Review income, tax residency, and accounts abroad.'], ['Month 2', 'Consolidate into one multi-currency account.'], ['Month 3', 'Start the investment plan and book the first review.']] },
];

const feeRows = [
  ['Minimum assets', '$250,000', '$1,000,000', '$10,000,000'],
  ['Annual advisory fee', '0.85% of assets', '0.65% of assets', '0.45% of assets'],
  ['Advisory team', 'Relationship manager', 'Team of three', 'Team of three and a senior partner'],
  ['Planning reviews', 'Annual', 'Quarterly', 'Quarterly, plus a family meeting'],
  ['Lending', 'On request', 'Lombard and mortgage', 'Bespoke facilities'],
  ['Concierge', 'Chat, working hours', '24 hours', '24 hours, named concierge'],
];

const team = [
  ['Relationship manager', 'Your single point of contact. Knows your family, your companies, and your goals.'],
  ['Investment specialist', 'Builds your portfolio and checks it against the plan every quarter.'],
  ['Credit officer', 'Structures mortgages, lombard loans, and business facilities.'],
  ['Tax and legal coordinator', 'Works with your own advisers so each decision fits the rules in each country.'],
];

const profiles = { Conservative: 0.035, Balanced: 0.055, Growth: 0.075 };

/* ---------- Components ---------- */
function Planner() {
  const [start, setStart] = useState(250000);
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(15);
  const [profile, setProfile] = useState('Balanced');
  const i = profiles[profile] / 12; const n = years * 12;
  const total = start * Math.pow(1 + i, n) + monthly * ((Math.pow(1 + i, n) - 1) / i);
  const put = start + monthly * n;
  const pct = Math.max(4, Math.min(96, (put / total) * 100));

  const Row = ({ id, label, value, min, max, step, set, fmt }) => (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <label htmlFor={id} className="text-[#D5DEE8]">{label}</label>
        <span className="font-semibold tabular-nums text-white">{fmt(value)}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );

  return (
    <div className="glass gloss rounded-2xl p-5 sm:p-8">
      <h2 className="serif mb-1 text-2xl text-white">Project your portfolio</h2>
      <p className="mb-6 text-sm text-[#D5DEE8]">Adjust the sliders to see what steady investing could build.</p>
      <div className="space-y-5">
        <Row id="start" label="Starting amount" value={start} min={50000} max={2000000} step={10000} set={setStart} fmt={money} />
        <Row id="monthly" label="Monthly addition" value={monthly} min={0} max={20000} step={500} set={setMonthly} fmt={money} />
        <Row id="years" label="Years" value={years} min={5} max={40} step={1} set={setYears} fmt={(v) => `${v} years`} />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Investment profile">
        {Object.keys(profiles).map((p) => (
          <button key={p} role="radio" aria-checked={profile === p} onClick={() => setProfile(p)}
            className={`rounded-md border px-1 py-2 text-xs transition-all sm:px-2 sm:text-sm ${profile === p ? 'border-[#EDD595] bg-gradient-to-b from-[#EDD595] to-[#C9A24B] font-semibold text-[#0A1D30]' : 'border-white/25 text-[#D5DEE8] hover:border-[#D8B76A]'}`}>{p}</button>
        ))}
      </div>
      <div className="mt-8 border-t border-white/20 pt-6">
        <p className="text-sm text-[#D5DEE8]">Projected value after {years} years</p>
        <p className="serif text-5xl tabular-nums text-white">{money(total)}</p>
        <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-[#D8B76A]" aria-hidden="true">
          <div className="bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-[#D5DEE8]"><span>You contribute {money(put)}</span><span>Growth {money(total - put)}</span></div>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-[#B5C3D3]">Assumes annual returns of {(profiles[profile] * 100).toFixed(1)}%, compounded monthly, before fees and tax. Illustration only; returns are not guaranteed.</p>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-[#DDD8CC] border-y border-[#DDD8CC]">
      {faqs.map(([q, a], idx) => (
        <div key={q}>
          <button className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open === idx} onClick={() => setOpen(open === idx ? -1 : idx)}>
            <span className="serif text-xl">{q}</span>
            <span className={`text-2xl text-[#8A6A26] transition-transform duration-300 ${open === idx ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
          </button>
          <div className="grid transition-all duration-500" style={{ gridTemplateRows: open === idx ? '1fr' : '0fr' }}>
            <div className="overflow-hidden"><p className="max-w-2xl pb-6 leading-relaxed text-[#3D4C5B]">{a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Consultation() {
  const [sent, setSent] = useState(false);
  const field = 'w-full rounded-md border border-white/20 bg-white px-4 py-3 text-[#14202E]';
  if (sent) return <p className="serif text-2xl text-white">Request received. An advisor will contact you within one working day.</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <div><label htmlFor="name" className="mb-1 block text-sm text-white">Full name</label><input id="name" required className={field} /></div>
      <div><label htmlFor="email" className="mb-1 block text-sm text-white">Email</label><input id="email" type="email" required className={field} /></div>
      <div>
        <label htmlFor="topic" className="mb-1 block text-sm text-white">What would you like to discuss?</label>
        <select id="topic" className={field}><option>Opening a private account</option><option>Wealth management</option><option>Credit and lending</option><option>Business banking</option></select>
      </div>
      <button type="submit" className="btn btn-gold w-full">Request a consultation</button>
    </form>
  );
}

function Stories() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % stories.length), 6500); return () => clearInterval(t); }, []);
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div key={i} className="quote-in min-h-[220px]">
        <Frame src={images.stories[i]} alt={stories[i][1]} position="center top" className="mx-auto mb-8 h-24 w-24 rounded-full border-2 border-[#D8B76A]" />
        <p className="serif text-3xl font-normal leading-snug text-white md:text-4xl">“{stories[i][0]}”</p>
        <p className="mt-8 text-[#D8B76A]">{stories[i][1]}</p>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        {stories.map((s, idx) => (
          <button key={s[1]} aria-label={`Show story ${idx + 1}`} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all duration-500 ${i === idx ? 'w-10 bg-[#D8B76A]' : 'w-2 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}

function Tick({ items }) {
  return items.map(([p, v, c, up], idx) => (
    <span key={p + idx} className="flex items-center gap-3 px-8 text-sm">
      <span className="text-[#C5D0DC]">{p}</span>
      <span className="font-semibold tabular-nums text-white">{v}</span>
      <span className={`tabular-nums ${up ? 'text-[#7FE0A8]' : 'text-[#FF9A8F]'}`}>{up ? '▲' : '▼'} {c}</span>
    </span>
  ));
}

function Photo({ src, alt = '', className = '', eager = false, position = 'center' }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [src]);
  if (!src || !ok) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setOk(false)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}

function Frame({ src, alt, className = '', position = 'center' }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [src]);
  if (!src || !ok) return null;
  return (
    <div className={`navy-bg gloss relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

function Avatar({ name, src, size = 'h-12 w-12' }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] font-semibold text-[#EDD595] ${size}`}>
      <span aria-hidden="true">{initials}</span>
      <Photo src={src} position="center top" />
    </span>
  );
}

function LangSelect({ lang, setLang, className = '', dark = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg className={`h-4 w-4 shrink-0 ${dark ? 'text-[#C5D0DC]' : 'text-[#8A6A26]'}`} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className={
          dark
            ? 'min-w-0 cursor-pointer rounded border-0 bg-transparent py-1 pl-0 pr-5 text-xs text-[#C5D0DC] transition-colors hover:text-white focus:text-white'
            : 'min-w-0 flex-1 rounded-md border border-[#DDD8CC] bg-white px-2 py-1.5 text-[15px] text-[#0F2A43]'
        }
      >
        {langs.map(([c, n]) => <option key={c} value={c} className="text-[#0F2A43]">{n}</option>)}
      </select>
    </span>
  );
}

function Guilloche({ className = '' }) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden="true">
      <g className="guil" fill="none" stroke="#D8B76A" strokeWidth="0.6" opacity="0.5">
        {Array.from({ length: 36 }, (_, k) => <ellipse key={k} rx="190" ry="70" transform={`rotate(${k * 5})`} />)}
      </g>
      <g className="guil guil-r" fill="none" stroke="#EDD595" strokeWidth="0.5" opacity="0.35">
        {Array.from({ length: 36 }, (_, k) => <ellipse key={k} rx="125" ry="42" transform={`rotate(${k * 5 + 2.5})`} />)}
      </g>
    </svg>
  );
}

function Personas() {
  const [i, setI] = useState(0);
  const p = personas[i];
  return (
    <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
      <div role="tablist" aria-label="Client type" className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        {personas.map((x, idx) => (
          <button key={x.k} role="tab" id={`pt-${idx}`} aria-selected={i === idx} aria-controls="pp" onClick={() => setI(idx)}
            className={`flex-1 rounded-2xl border p-5 text-left transition-all lg:flex-none ${i === idx ? 'navy-bg border-[#B08A3E] text-white shadow-xl' : 'border-[#DDD8CC] bg-white text-[#0F2A43] hover:border-[#B08A3E]'}`}>
            <span className="serif block text-lg md:text-2xl">{x.k}</span>
            <span className={`mt-1 hidden text-sm md:block ${i === idx ? 'text-[#D5DEE8]' : 'text-[#4A5B6C]'}`}>{x.sub}</span>
          </button>
        ))}
      </div>
      <div id="pp" role="tabpanel" aria-labelledby={`pt-${i}`} key={i} className="quote-in rounded-3xl border border-[#DDD8CC] bg-white p-8 md:p-10">
        <Frame src={images.clients[i]} alt={`${p.k}: ${p.sub}`} position="center top" className="mb-8 h-52 rounded-2xl md:h-64" />
        <h3 className="serif mb-6 max-w-2xl text-2xl text-[#0F2A43] md:text-3xl">{p.head}</h3>
        <ul className="mb-10 space-y-3">
          {p.pts.map((t) => <li key={t} className="flex gap-3 text-[#14202E]"><span className="text-[#B08A3E]" aria-hidden="true">✓</span>{t}</li>)}
        </ul>
        <div className="border-t border-[#DDD8CC] pt-8">
          <h4 className="mb-5 text-sm font-semibold text-[#0F2A43]">Your first 90 days</h4>
          <ol className="grid gap-6 md:grid-cols-3">
            {p.days.map(([m, t]) => <li key={m} className="border-l-2 border-[#B08A3E] pl-4"><p className="serif text-lg text-[#8A6A26]">{m}</p><p className="mt-1 text-sm leading-relaxed text-[#3D4C5B]">{t}</p></li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  "Côte d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other',
];

const strength = (p) => {
  let n = 0;
  if (p.length >= 8) n++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) n++;
  if (/\d/.test(p)) n++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) n++;
  return n;
};
const strengthLabel = ['Use at least 8 characters', 'Weak', 'Fair', 'Good', 'Strong'];

function AuthSuccess({ up, forgot, go }) {
  useEffect(() => {
    if (forgot) return undefined;
    const id = setTimeout(() => go('/dashboard'), 1800);
    return () => clearTimeout(id);
  }, [forgot, go]);

  return (
    <div className="py-8 text-center" role="status">
      <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F6EE] text-3xl text-[#1B7A4B]" aria-hidden="true">✓</span>
      <h1 className="serif mb-3 text-3xl text-[#0F2A43]">
        {up ? 'Account creation successful' : forgot ? 'Password updated' : 'You are signed in'}
      </h1>
      <p className="mx-auto mb-8 max-w-sm leading-relaxed text-[#3D4C5B]">
        {up
          ? 'Your account has been created. Redirecting you to your dashboard…'
          : forgot
          ? 'Your password has been changed. You can now sign in with your new password.'
          : 'Your secure session has started. Redirecting you to your dashboard…'}
      </p>
      {forgot ? (
        <Link to="/signin" go={go} className="btn btn-navy">Sign in</Link>
      ) : (
        <Link to="/dashboard" go={go} className="btn btn-navy">Go to dashboard</Link>
      )}
    </div>
  );
}

function AuthPage({ mode, go, t }) {
  const up = mode === 'signup';
  const forgot = mode === 'forgot';
  /* signup: 1 details → 2 otp → 3 address → 4 identity → 5 done
     signin: 1 form → 5 done
     forgot: 1 email → 2 otp → 3 new password → 5 done */
  const emptyOtp = () => Array(8).fill('');
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [email, setEmail] = useState('');
  const [acctType, setAcctType] = useState('checking');
  const [otp, setOtp] = useState(emptyOtp);
  const [otpTimer, setOtpTimer] = useState(0);
  const [idFront, setIdFront] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState('');
  const otpRefs = useRef([]);
  const idFrontRef = useRef(null);
  const score = strength(pw);
  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  })();

  useEffect(() => {
    setShow(false); setPw(''); setPw2(''); setErr(''); setStep(1); setEmail(''); setAcctType('checking');
    setOtp(emptyOtp()); setOtpTimer(0); setIdFront(null); setIdFrontPreview('');
  }, [mode]);

  useEffect(() => () => { if (idFrontPreview) URL.revokeObjectURL(idFrontPreview); }, [idFrontPreview]);

  useEffect(() => {
    if (otpTimer <= 0) return undefined;
    const id = setTimeout(() => setOtpTimer((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

  const startOtp = () => {
    setOtp(emptyOtp());
    setOtpTimer(60);
    setErr('');
    setStep(2);
    // TODO: call your API to send OTP to `email`
  };

  const submitDetails = (e) => {
    e.preventDefault();
    if (up && score < 2) { setErr('Choose a stronger password: at least 8 characters, mixing letters and numbers.'); return; }
    setErr('');
    if (up) startOtp();
    else {
      // TODO: sign-in API
      setStep(5);
    }
  };

  const submitForgotEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) { setErr('Enter the email for your account.'); return; }
    setErr('');
    startOtp();
  };

  const submitOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 8) { setErr('Enter the 8-digit code sent to your email.'); return; }
    setErr('');
    // TODO: verify OTP with your API — accept any 8 digits in this demo
    if (forgot) setStep(3);
    else setStep(3);
  };

  const submitNewPassword = (e) => {
    e.preventDefault();
    if (score < 2) { setErr('Choose a stronger password: at least 8 characters, mixing letters and numbers.'); return; }
    if (pw !== pw2) { setErr('Passwords do not match.'); return; }
    setErr('');
    // TODO: reset password API
    setStep(5);
  };

  const submitAddress = (e) => {
    e.preventDefault();
    setErr('');
    // TODO: save address with your API
    setStep(4);
  };

  const onIdFront = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErr('Upload a photo or PDF of the front of your ID.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErr('File must be under 8 MB.');
      return;
    }
    setErr('');
    if (idFrontPreview) URL.revokeObjectURL(idFrontPreview);
    setIdFront(file);
    setIdFrontPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
  };

  const submitIdentity = (e) => {
    e.preventDefault();
    if (!idFront) { setErr('Upload the front of your government ID.'); return; }
    setErr('');
    // TODO: upload ID + save identity fields with your API
    setStep(5);
  };

  const onOtpChange = (i, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 7) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const onOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8).split('');
    if (!pasted.length) return;
    const next = [...otp];
    pasted.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 7)]?.focus();
  };

  const tab = (to, label, active) => (
    <Link to={to} go={go} aria-current={active ? 'page' : undefined}
      className={`flex-1 rounded-md py-2.5 text-center text-sm font-semibold transition-colors ${active ? 'bg-white text-[#0F2A43] shadow' : 'text-[#4A5B6C] hover:text-[#0F2A43]'}`}>{label}</Link>
  );

  const stepLabel = ['', 'Details', 'Verify', 'Address', 'Identity'];
  const Stepper = () => (
    <div className="mb-8" aria-label="Registration progress">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${step > n ? 'bg-[#1B7A4B] text-white' : step === n ? 'bg-[#0F2A43] text-white' : 'bg-[#EFEADC] text-[#4A5B6C]'}`}>
              {step > n ? '✓' : n}
            </span>
            <span className={`hidden text-[11px] font-medium sm:block ${step === n ? 'text-[#0F2A43]' : 'text-[#4A5B6C]'}`}>{stepLabel[n]}</span>
            {n < 4 && <span className={`h-px flex-1 ${step > n ? 'bg-[#1B7A4B]' : 'bg-[#E4DFD2]'}`} />}
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <section className="navy-bg relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-44">
      <Photo src={images.auth} eager position="center 30%" className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D30]/85 to-[#0A1D30]/50" />
      <div className="orb -left-20 top-24 h-[420px] w-[420px] bg-[#B08A3E]/25" />
      <div className="orb right-0 top-0 h-[480px] w-[480px] bg-[#2A6CA8]/40" style={{ animationDelay: '-6s' }} />
      <Guilloche className="pointer-events-none absolute -left-64 top-1/2 h-[900px] w-[900px] -translate-y-1/2 opacity-50" />
      <div className={`${wrap} relative grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,520px)] xl:gap-28`}>
        <div className="hidden lg:block">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur"><span className="h-2 w-2 rounded-full bg-[#7FE0A8]" />{t('Serving private clients since 1892')}</p>
          <h1 className="serif mb-8 max-w-xl text-4xl leading-[1.1] text-white xl:text-5xl">
            {up ? 'Start with one advisor and one view of everything you own.'
              : forgot ? 'Reset your password securely in a few steps.'
              : 'Your accounts, your advisor, and your documents in one secure place.'}
          </h1>
          <ul className="mb-10 max-w-lg space-y-5">
            {security.slice(0, 3).map(([h, d]) => (
              <li key={h} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D8B76A]/20 text-sm text-[#EDD595]" aria-hidden="true">✓</span>
                <span><span className="block font-semibold text-white">{h}</span><span className="text-[#D5DEE8]">{d}</span></span>
              </li>
            ))}
          </ul>
          <figure className="glass gloss max-w-lg rounded-2xl p-6">
            <blockquote className="serif text-lg font-normal leading-snug text-white">“{stories[2][0]}”</blockquote>
            <figcaption className="mt-3 text-sm text-[#D8B76A]">{stories[2][1]}</figcaption>
          </figure>
        </div>

        <Reveal>
          <div className="rounded-3xl bg-white p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] sm:p-10">
            {/* —— Done —— */}
            {step === 5 ? (
              <AuthSuccess up={up} forgot={forgot} go={go} />
            ) : (
              <>
                {/* Tabs only on first step of signup / signin form */}
                {step === 1 && !forgot && (
                  <div className="mb-8 flex gap-1 rounded-lg bg-[#EFEADC] p-1">{tab('/signin', t('Sign in'), !up)}{tab('/signup', t('Create account'), up)}</div>
                )}

                {/* —— Step 1: Account details (signup/signin) or forgot email —— */}
                {step === 1 && !forgot && (
                  <>
                    {up && <Stepper />}
                    <h1 className="serif text-3xl text-[#0F2A43]">{up ? t('Open your account') : t('Welcome back')}</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">{up ? 'Tell us a little about you. It takes about two minutes.' : 'Sign in to see your accounts and message your advisor.'}</p>

                    <form onSubmit={submitDetails} className="space-y-5">
                      {up && (
                        <>
                          <div>
                            <p className="mb-2 text-sm font-medium text-[#14202E]">Account type</p>
                            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
                              {[
                                { id: 'checking', label: 'Checking', desc: 'Everyday payments & transfers' },
                                { id: 'savings', label: 'Savings', desc: 'Preferential interest rates' },
                              ].map((a) => (
                                <button
                                  key={a.id}
                                  type="button"
                                  role="radio"
                                  aria-checked={acctType === a.id}
                                  onClick={() => setAcctType(a.id)}
                                  className={`rounded-xl border p-4 text-left transition-all ${acctType === a.id ? 'border-[#B08A3E] bg-[#FBF7EE] ring-2 ring-[#D8B76A]/40' : 'border-[#DDD8CC] bg-white hover:border-[#B08A3E]'}`}
                                >
                                  <span className="block font-semibold text-[#0F2A43]">{a.label}</span>
                                  <span className="mt-0.5 block text-xs text-[#4A5B6C]">{a.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label htmlFor="su-name" className="mb-1.5 block text-sm font-medium text-[#14202E]">Full name</label>
                              <input id="su-name" className="auth-input" autoComplete="name" required />
                            </div>
                            <div>
                              <label htmlFor="su-country" className="mb-1.5 block text-sm font-medium text-[#14202E]">Country of residence</label>
                              <select id="su-country" className="auth-input" defaultValue="" required>
                                <option value="" disabled>Select</option>
                                {countries.map((c) => <option key={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="su-tier" className="mb-1.5 block text-sm font-medium text-[#14202E]">Membership of interest</label>
                              <select id="su-tier" className="auth-input" defaultValue="Not sure yet">
                                {['Classic', 'Reserve', 'Sovereign (by invitation)', 'Not sure yet'].map((c) => <option key={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label htmlFor="au-email" className="mb-1.5 block text-sm font-medium text-[#14202E]">Email</label>
                        <input id="au-email" type="email" className="auth-input" autoComplete={up ? 'email' : 'username'} value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label htmlFor="au-pw" className="text-sm font-medium text-[#14202E]">Password</label>
                          {!up && <Link to="/forgot-password" go={go} className="text-sm font-medium text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Forgot password?</Link>}
                        </div>
                        <div className="relative">
                          <input id="au-pw" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} className="auth-input !pr-20" autoComplete={up ? 'new-password' : 'current-password'} minLength={up ? 8 : undefined} required aria-invalid={!!err} aria-describedby={err ? 'au-err' : up ? 'au-meter' : undefined} />
                          <button type="button" onClick={() => setShow(!show)} aria-pressed={show} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-3 py-1.5 text-sm font-medium text-[#0F2A43] hover:text-[#8A6A26]">{show ? 'Hide' : 'Show'}</button>
                        </div>
                        {up && (
                          <div id="au-meter" className="mt-3">
                            <div className="flex gap-1.5" aria-hidden="true">{[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${score >= n ? (score <= 1 ? 'bg-[#C0392B]' : score === 2 ? 'bg-[#D98E1F]' : 'bg-[#1B7A4B]') : 'bg-[#E4DFD2]'}`} />)}</div>
                            <p className="mt-1.5 text-xs text-[#4A5B6C]">{pw ? `Strength: ${strengthLabel[score]}` : strengthLabel[0]}</p>
                          </div>
                        )}
                        {err && <p id="au-err" role="alert" className="mt-2 text-sm text-[#B3261E]">{err}</p>}
                      </div>

                      {up ? (
                        <label className="flex items-start gap-3 text-sm leading-relaxed text-[#3D4C5B]">
                          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#0F2A43]" />
                          <span>I agree to the <a href="#" className="font-medium text-[#8A6A26] underline underline-offset-4">terms of service</a> and have read the <a href="#" className="font-medium text-[#8A6A26] underline underline-offset-4">privacy notice</a>.</span>
                        </label>
                      ) : (
                        <label className="flex items-center gap-3 text-sm text-[#3D4C5B]"><input type="checkbox" className="h-4 w-4 accent-[#0F2A43]" />Keep me signed in on this device</label>
                      )}

                      <button type="submit" className="btn btn-navy w-full">{up ? t('Create account') : t('Sign in')}</button>
                    </form>

                    {!up && (
                      <>
                        <div className="my-6 flex items-center gap-4 text-xs text-[#4A5B6C]"><span className="h-px flex-1 bg-[#DDD8CC]" />or<span className="h-px flex-1 bg-[#DDD8CC]" /></div>
                        <button type="button" className="btn btn-outline flex w-full items-center justify-center gap-3">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v3a6 6 0 01-1.5 4M8 14a4 4 0 018 0c0 2-.4 3.7-1.2 5M5 12a7 7 0 0114 0c0 1.5-.1 3-.5 4.5M3.5 9A9.5 9.5 0 0112 3a9.5 9.5 0 018.5 6" /></svg>
                          Sign in with Face ID or fingerprint
                        </button>
                      </>
                    )}

                    <p className="mt-8 text-center text-sm text-[#3D4C5B]">
                      {up ? 'Already a client? ' : 'New to Aurelia Private? '}
                      <Link to={up ? '/signin' : '/signup'} go={go} className="font-semibold text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">{up ? t('Sign in') : t('Open an account')}</Link>
                    </p>
                  </>
                )}

                {/* —— Forgot password: email —— */}
                {forgot && step === 1 && (
                  <>
                    <h1 className="serif text-3xl text-[#0F2A43]">Forgot password</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">Enter the email on your account. We will send an 8-digit code to reset your password.</p>
                    <form onSubmit={submitForgotEmail} className="space-y-5">
                      <div>
                        <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-[#14202E]">Email</label>
                        <input id="fp-email" type="email" className="auth-input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      {err && <p role="alert" className="text-sm text-[#B3261E]">{err}</p>}
                      <button type="submit" className="btn btn-navy w-full">Send reset code</button>
                      <p className="text-center text-sm text-[#3D4C5B]">
                        Remember your password?{' '}
                        <Link to="/signin" go={go} className="font-semibold text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">{t('Sign in')}</Link>
                      </p>
                    </form>
                  </>
                )}

                {/* —— Step 2: OTP (signup or forgot) —— */}
                {(up || forgot) && step === 2 && (
                  <>
                    {up && <Stepper />}
                    <h1 className="serif text-3xl text-[#0F2A43]">{forgot ? 'Enter reset code' : 'Verify your email'}</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">
                      We sent an 8-digit code to <span className="font-semibold text-[#0F2A43]">{email || 'your email'}</span>. Enter it below to continue.
                    </p>
                    <form onSubmit={submitOtp} className="space-y-6">
                      <div>
                        <label htmlFor="otp-0" className="sr-only">One-time password</label>
                        <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={onOtpPaste}>
                          {otp.map((d, i) => (
                            <input
                              key={i}
                              id={i === 0 ? 'otp-0' : undefined}
                              ref={(el) => { otpRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              autoComplete={i === 0 ? 'one-time-code' : 'off'}
                              maxLength={1}
                              value={d}
                              onChange={(e) => onOtpChange(i, e.target.value)}
                              onKeyDown={(e) => onOtpKey(i, e)}
                              className="auth-input h-11 w-full min-w-0 max-w-[2.75rem] px-0 text-center text-lg font-semibold tabular-nums sm:h-14 sm:max-w-[3rem] sm:text-xl"
                              aria-label={`Digit ${i + 1}`}
                            />
                          ))}
                        </div>
                        {err && <p role="alert" className="mt-3 text-sm text-[#B3261E]">{err}</p>}
                      </div>
                      <button type="submit" className="btn btn-navy w-full">Verify and continue</button>
                      <div className="flex items-center justify-between text-sm">
                        <button type="button" onClick={() => { setStep(1); setErr(''); }} className="font-medium text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Back</button>
                        <button
                          type="button"
                          disabled={otpTimer > 0}
                          onClick={() => { setOtpTimer(60); setOtp(emptyOtp()); setErr(''); /* TODO: resend OTP */ }}
                          className={`font-medium ${otpTimer > 0 ? 'text-[#4A5B6C]' : 'text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]'}`}
                        >
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend code'}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* —— Forgot: new password —— */}
                {forgot && step === 3 && (
                  <>
                    <h1 className="serif text-3xl text-[#0F2A43]">Set a new password</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">Choose a strong password for your account.</p>
                    <form onSubmit={submitNewPassword} className="space-y-5">
                      <div>
                        <label htmlFor="np-pw" className="mb-1.5 block text-sm font-medium text-[#14202E]">New password</label>
                        <div className="relative">
                          <input id="np-pw" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} className="auth-input !pr-20" autoComplete="new-password" minLength={8} required />
                          <button type="button" onClick={() => setShow(!show)} aria-pressed={show} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-3 py-1.5 text-sm font-medium text-[#0F2A43] hover:text-[#8A6A26]">{show ? 'Hide' : 'Show'}</button>
                        </div>
                        <div className="mt-3">
                          <div className="flex gap-1.5" aria-hidden="true">{[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${score >= n ? (score <= 1 ? 'bg-[#C0392B]' : score === 2 ? 'bg-[#D98E1F]' : 'bg-[#1B7A4B]') : 'bg-[#E4DFD2]'}`} />)}</div>
                          <p className="mt-1.5 text-xs text-[#4A5B6C]">{pw ? `Strength: ${strengthLabel[score]}` : strengthLabel[0]}</p>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="np-pw2" className="mb-1.5 block text-sm font-medium text-[#14202E]">Confirm password</label>
                        <input id="np-pw2" type={show ? 'text' : 'password'} value={pw2} onChange={(e) => setPw2(e.target.value)} className="auth-input" autoComplete="new-password" minLength={8} required />
                      </div>
                      {err && <p role="alert" className="text-sm text-[#B3261E]">{err}</p>}
                      <button type="submit" className="btn btn-navy w-full">Update password</button>
                      <button type="button" onClick={() => { setStep(2); setErr(''); }} className="w-full text-center text-sm font-medium text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Back</button>
                    </form>
                  </>
                )}

                {/* —— Step 3: Address —— */}
                {up && step === 3 && (
                  <>
                    <Stepper />
                    <h1 className="serif text-3xl text-[#0F2A43]">Your address</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">We need a residential address for account opening and regulatory checks.</p>
                    <form onSubmit={submitAddress} className="space-y-5">
                      <div>
                        <label htmlFor="ad-line1" className="mb-1.5 block text-sm font-medium text-[#14202E]">Street address</label>
                        <input id="ad-line1" className="auth-input" autoComplete="address-line1" required />
                      </div>
                      <div>
                        <label htmlFor="ad-line2" className="mb-1.5 block text-sm font-medium text-[#14202E]">Apartment, suite, or unit <span className="font-normal text-[#4A5B6C]">(optional)</span></label>
                        <input id="ad-line2" className="auth-input" autoComplete="address-line2" />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="ad-city" className="mb-1.5 block text-sm font-medium text-[#14202E]">City</label>
                          <input id="ad-city" className="auth-input" autoComplete="address-level2" required />
                        </div>
                        <div>
                          <label htmlFor="ad-state" className="mb-1.5 block text-sm font-medium text-[#14202E]">State / Province</label>
                          <input id="ad-state" className="auth-input" autoComplete="address-level1" required />
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="ad-postal" className="mb-1.5 block text-sm font-medium text-[#14202E]">Postal / ZIP code</label>
                          <input id="ad-postal" className="auth-input" autoComplete="postal-code" required />
                        </div>
                        <div>
                          <label htmlFor="ad-country" className="mb-1.5 block text-sm font-medium text-[#14202E]">Country</label>
                          <select id="ad-country" className="auth-input" defaultValue="" required>
                            <option value="" disabled>Select</option>
                            {countries.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      {err && <p role="alert" className="text-sm text-[#B3261E]">{err}</p>}
                      <button type="submit" className="btn btn-navy w-full">Continue to identity</button>
                      <button type="button" onClick={() => { setStep(2); setErr(''); }} className="w-full text-center text-sm font-medium text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Back to verification</button>
                    </form>
                  </>
                )}

                {/* —— Step 4: Identity —— */}
                {up && step === 4 && (
                  <>
                    <Stepper />
                    <h1 className="serif text-3xl text-[#0F2A43]">Verify your identity</h1>
                    <p className="mb-8 mt-2 text-[#3D4C5B]">Regulations require us to confirm who you are before opening an account.</p>
                    <form onSubmit={submitIdentity} className="space-y-5">
                      <div>
                        <label htmlFor="id-dob" className="mb-1.5 block text-sm font-medium text-[#14202E]">Date of birth</label>
                        <input id="id-dob" type="date" className="auth-input" autoComplete="bday" required max={maxDob} />
                        <p className="mt-1.5 text-xs text-[#4A5B6C]">You must be at least 18 years old.</p>
                      </div>
                      <div>
                        <label htmlFor="id-type" className="mb-1.5 block text-sm font-medium text-[#14202E]">Type of ID</label>
                        <select id="id-type" className="auth-input" defaultValue="" required>
                          <option value="" disabled>Select</option>
                          <option>National ID</option>
                          <option>Passport</option>
                          <option>Driver’s licence</option>
                          <option>Residence permit</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="id-number" className="mb-1.5 block text-sm font-medium text-[#14202E]">ID number</label>
                        <input id="id-number" className="auth-input" autoComplete="off" required placeholder="As shown on the document" />
                      </div>
                      <div>
                        <p className="mb-1.5 text-sm font-medium text-[#14202E]">ID upload — front</p>
                        <input
                          ref={idFrontRef}
                          id="id-front"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="sr-only"
                          onChange={onIdFront}
                        />
                        <label
                          htmlFor="id-front"
                          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-colors ${idFront ? 'border-[#B08A3E] bg-[#FBF7EE]' : 'border-[#DDD8CC] bg-[#F6F4EF] hover:border-[#B08A3E]'}`}
                        >
                          {idFrontPreview ? (
                            <img src={idFrontPreview} alt="ID front preview" className="max-h-40 rounded-lg object-contain" />
                          ) : (
                            <svg className="h-10 w-10 text-[#B08A3E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                          )}
                          <span className="text-center text-sm text-[#3D4C5B]">
                            {idFront
                              ? <><span className="font-semibold text-[#0F2A43]">{idFront.name}</span><br /><span className="text-xs">Click to replace · JPG, PNG, WebP or PDF · max 8 MB</span></>
                              : 'Click to upload the front of your ID · JPG, PNG, WebP or PDF · max 8 MB'}
                          </span>
                        </label>
                      </div>
                      {err && <p role="alert" className="text-sm text-[#B3261E]">{err}</p>}
                      <button type="submit" className="btn btn-navy w-full">Complete registration</button>
                      <button type="button" onClick={() => { setStep(3); setErr(''); }} className="w-full text-center text-sm font-medium text-[#8A6A26] underline underline-offset-4 hover:text-[#0F2A43]">Back to address</button>
                    </form>
                  </>
                )}

                <p className="mt-6 flex items-center justify-center gap-2 border-t border-[#EEEADF] pt-6 text-xs text-[#4A5B6C]">
                  <svg className="h-4 w-4 text-[#B08A3E]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                  Encrypted from your device to ours
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('lang') || 'en'; } catch (e) { return 'en'; } });
  const t = (k) => (dict[lang] && dict[lang][k]) || k;

  /* Routes: / (home), /signin, /signup, /forgot-password, /dashboard. Swap for react-router if your project already uses it. */
  const [route, setRoute] = useState(() => ({ path: typeof window === 'undefined' ? '/' : normalize(window.location.pathname), hash: typeof window === 'undefined' ? '' : window.location.hash.slice(1) }));
  const mode = authMode(route.path);
  const isDashboard = route.path === '/dashboard';
  const go = (to) => {
    const [p, h = ''] = to.split('#');
    try { window.history.pushState({}, '', to); } catch (e) { /* sandboxed preview: keep state only */ }
    setRoute({ path: normalize(p || '/'), hash: h });
    setMenu(false);
  };
  useEffect(() => {
    const on = () => setRoute({ path: normalize(window.location.pathname), hash: window.location.hash.slice(1) });
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; if (!route.hash) return undefined; }
    const id = setTimeout(() => {
      const el = route.hash ? document.getElementById(route.hash) : null;
      if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
    }, 30);
    return () => clearTimeout(id);
  }, [route]);
  const baseTitle = useRef(null);
  useEffect(() => {
    if (baseTitle.current === null) baseTitle.current = document.title;
    if (isDashboard) document.title = 'Dashboard | Aurelia Private';
    else if (mode) document.title = `${mode === 'signup' ? 'Open an account' : mode === 'forgot' ? 'Forgot password' : 'Sign in'} | Aurelia Private`;
    else document.title = baseTitle.current;
  }, [mode, isDashboard]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    const esc = (e) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [menu]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
  }, [lang]);

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setScrolled(window.scrollY > 24);
      setProgress((window.scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  /* Dashboard is a standalone page — no marketing header, footer, or site chrome */
  if (isDashboard) {
    return <Dashboard go={go} />;
  }

  return (
    <div className="ap min-h-screen bg-[#F6F4EF] antialiased">
      <style>{styles}</style>
      <div className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-[#B08A3E] via-[#EDD595] to-[#B08A3E]" style={{ width: `${progress}%` }} />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`hidden bg-[#0A1D30] text-xs text-[#C5D0DC] transition-all duration-300 md:block ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-9 opacity-100'}`}>
          <div className={`${wrap} flex h-9 items-center justify-between`}>
            <span>Private client line: +1 800 555 0142</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">{t('Find an office')}</a>
              <a href="#" className="hover:text-white">{t('Careers')}</a>
              <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
              <LangSelect lang={lang} setLang={setLang} dark />
            </div>
          </div>
        </div>
        <div className={`border-b transition-all duration-300 ${scrolled ? 'border-[#DDD8CC] bg-white/85 shadow-lg backdrop-blur-xl' : 'border-[#DDD8CC] bg-white'}`}>
          <div className={`${wrap} flex h-[72px] items-center justify-between gap-6`}>
            <div className="flex min-w-0 items-center gap-8 2xl:gap-12">
              <Link to="/" go={go} className="group flex shrink-0 items-center gap-3" aria-label="Aurelia Private home">
                <span className="serif gloss flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-xl text-[#EDD595] transition-transform duration-300 group-hover:scale-105">A</span>
                <span className="serif whitespace-nowrap text-xl text-[#0F2A43] sm:text-2xl">Aurelia Private</span>
              </Link>
              <nav className="hidden items-center gap-6 whitespace-nowrap text-[15px] font-medium text-[#14202E] xl:flex 2xl:gap-8" aria-label="Main">
                {nav.map(([l, h]) => <Link key={h} to={mode ? `/${h}` : h} go={go} className="navlink relative py-1 transition-colors hover:text-[#8A6A26]">{t(l)}</Link>)}
              </nav>
            </div>
            <div className="hidden shrink-0 items-center gap-5 xl:flex">
              <Link to="/signin" go={go} aria-current={mode === 'signin' ? 'page' : undefined} className="navlink relative inline-flex items-center gap-2 py-1 text-[15px] font-medium text-[#0F2A43] transition-colors hover:text-[#8A6A26]">
                <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.2-3.6 4.2-5.5 8-5.5s6.8 1.9 8 5.5" /></svg>
                {t('Sign in')}
              </Link>
              <Link to="/signup" go={go} className="btn btn-navy whitespace-nowrap !px-5 !py-2.5 text-[15px]">{t('Open an account')}</Link>
            </div>
            <div className="flex items-center gap-4 xl:hidden">
              <Link to="/signin" go={go} className="hidden text-[15px] font-medium text-[#0F2A43] hover:text-[#8A6A26] sm:block">{t('Sign in')}</Link>
              <button className="-mr-2 rounded-md p-2 text-[#0F2A43]" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={menu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
              </button>
            </div>
          </div>
          {menu && (
            <>
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setMenu(false)} className="fixed inset-x-0 bottom-0 top-[72px] -z-10 cursor-default bg-[#0A1D30]/50 backdrop-blur-sm xl:hidden" />
              <div className="menu-in max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[#DDD8CC] bg-white px-6 pb-8 pt-2 xl:hidden">
                <nav aria-label="Mobile" className="divide-y divide-[#EEEADF]">
                  {nav.map(([l, h]) => (
                    <Link key={h} to={mode ? `/${h}` : h} go={go} onClick={() => setMenu(false)} className="flex items-center justify-between py-4 text-lg font-medium text-[#14202E] active:text-[#8A6A26]">
                      {t(l)}
                      <svg className="h-4 w-4 text-[#B08A3E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                    </Link>
                  ))}
                </nav>
                <LangSelect lang={lang} setLang={setLang} className="mt-5 w-full" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link to="/signin" go={go} onClick={() => setMenu(false)} className="btn btn-outline">{t('Sign in')}</Link>
                  <Link to="/signup" go={go} onClick={() => setMenu(false)} className="btn btn-navy">{t('Open an account')}</Link>
                </div>
                <p className="mt-5 text-center text-xs text-[#4A5B6C]">Private client line: +1 800 555 0142</p>
              </div>
            </>
          )}
        </div>
      </header>

      {mode ? <AuthPage mode={mode} go={go} t={t} /> : (
      <>
      {/* Hero */}
      <section className="navy-bg relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32">
        <Photo src={images.hero} eager position="center 30%" className="opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D30]/90 via-[#0A1D30]/55 to-[#0A1D30]/10" />
        <div className="orb -left-20 top-20 h-[420px] w-[420px] bg-[#B08A3E]/30" />
        <div className="orb right-0 top-0 h-[480px] w-[480px] bg-[#2A6CA8]/40" style={{ animationDelay: '-6s' }} />
        <Guilloche className="pointer-events-none absolute -right-48 -top-32 h-[900px] w-[900px] opacity-60" />
        <div className={`${wrap} relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]`}>
          <div>
            <Reveal><p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur"><span className="h-2 w-2 rounded-full bg-[#7FE0A8]" />{t('Serving private clients since 1892')}</p></Reveal>
            <Reveal delay={0.1}><h1 className="serif mb-6 text-4xl leading-[1.08] text-white md:text-6xl 2xl:text-7xl">{t('Private banking for families and founders with assets in more than one country.')}</h1></Reveal>
            <Reveal delay={0.2}><p className="mb-10 max-w-xl text-lg leading-relaxed text-[#D5DEE8]">{t('One relationship manager, one view of everything you own, and advice that answers only to you.')}</p></Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-4 sm:flex-row"><Link to="/signup" go={go} className="btn btn-gold">{t('Open an account')}</Link><Link to="#consult" go={go} className="btn btn-glass">{t('Speak with an advisor')}</Link></div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-14 flex gap-10 text-white">
                {[[48, '$', 'B+', 'Assets managed'], [140, '', '+', 'Countries']].map(([n, p, s, l]) => (
                  <div key={l}><p className="serif text-4xl"><CountUp to={n} prefix={p} suffix={s} /></p><p className="text-sm text-[#C5D0DC]">{l}</p></div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="relative">
            <div className="float-a glass absolute -left-6 -top-8 z-10 hidden items-center gap-3 rounded-xl px-4 py-3 text-sm text-white md:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7FE0A8]/25 text-[#7FE0A8]">✓</span>Transfer completed
            </div>
            <div className="float-b glass absolute -bottom-6 -right-4 z-10 hidden rounded-xl px-4 py-3 text-white md:block">
              <p className="text-xs text-[#D5DEE8]">Portfolio this quarter</p><p className="serif text-xl text-[#7FE0A8]">+1.8%</p>
            </div>
            <Planner />
          </Reveal>
        </div>
      </section>

      {/* Ticker */}
      <section className="overflow-hidden border-y border-white/10 bg-[#0A1D30] py-4" aria-label="Indicative market rates">
        <div className="marquee"><Tick items={fx} /><Tick items={fx} /></div>
      </section>

      {/* Credentials */}
      <section className="bg-white">
        <Reveal>
          <ul className={`${wrap} grid grid-cols-2 gap-6 py-8 text-center text-sm font-medium text-[#3D4C5B] lg:grid-cols-4`}>
            <li>Licensed and regulated private bank</li><li>Deposits covered by protection scheme</li><li>ISO 27001 certified security</li><li>Independently audited every year</li>
          </ul>
        </Reveal>
      </section>

      {/* Who we serve */}
      <section id="clients" className="bg-[#EFEADC] py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Advice shaped around how you hold wealth')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-14 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">Choose the description closest to yours to see what we would do, and when.</p></Reveal>
          <Reveal delay={0.15}><Personas /></Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Everything your finances need, under one roof')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-14 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">Banking, investing, lending, and planning are handled by one team, so your decisions stay consistent.</p></Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(([t, d], idx) => {
              const wide = [0, 3, 5].includes(idx); const feat = idx === 0;
              return (
                <Reveal key={t} delay={(idx % 3) * 0.1} className={`h-full ${wide ? 'md:col-span-2' : ''}`}>
                  <article onMouseMove={spot} className={`spot flex h-full flex-col rounded-2xl border p-8 ${feat ? 'navy-bg border-[#B08A3E]' : 'border-[#DDD8CC] bg-white'}`}>
                    {feat && <Guilloche className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] opacity-70" />}
                    <Frame src={images.services[idx]} alt="" position="center" className="-mx-8 -mt-8 mb-6 h-44 shrink-0 rounded-t-2xl" />
                    <span className="relative mb-6 block h-1 w-12 rounded-full bg-gradient-to-r from-[#B08A3E] to-[#EDD595]" />
                    <h3 className={`serif relative mb-3 ${feat ? 'text-4xl text-white' : 'text-2xl text-[#0F2A43]'}`}>{t}</h3>
                    <p className={`relative mb-6 max-w-xl flex-1 leading-relaxed ${feat ? 'text-[#D5DEE8]' : 'text-[#3D4C5B]'}`}>{d}</p>
                    <ul className="relative mb-6 flex flex-wrap gap-2">
                      {chips[idx].map((c) => <li key={c} className={`rounded-full border px-3 py-1 text-xs font-medium ${feat ? 'border-white/30 text-white' : 'border-[#DDD8CC] text-[#3D4C5B]'}`}>{c}</li>)}
                    </ul>
                    <a href="#" className={`relative w-fit font-semibold underline underline-offset-4 ${feat ? 'text-[#EDD595] hover:text-white' : 'text-[#8A6A26] hover:text-[#0F2A43]'}`}>Learn more</a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className="bg-white py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Choose the level of service that fits your wealth')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-16 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">Every tier includes full fee disclosure and a named advisor. Higher tiers add team depth and specialist services.</p></Reveal>
          <div className="grid items-stretch gap-8 lg:grid-cols-3">
            {tiers.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 0.12} className="h-full">
                <article onMouseMove={spot} className={`spot flex h-full flex-col rounded-3xl border p-8 ${t.hot ? 'navy-bg border-[#B08A3E] text-white lg:-translate-y-4' : 'border-[#DDD8CC] bg-[#F6F4EF]'}`}>
                  <div className="gloss sheen relative mb-8 h-44 overflow-hidden rounded-2xl p-5 shadow-xl" style={{ background: t.grad }}>
                    <div className="h-8 w-11 rounded-md bg-gradient-to-br from-[#F4E3B0] to-[#B08A3E]" />
                    <p className={`serif absolute bottom-5 left-5 text-xl ${t.name === 'Reserve' ? 'text-[#0A1D30]' : 'text-white'}`}>Aurelia {t.name}</p>
                  </div>
                  {t.hot && <span className="mb-3 w-fit rounded-full bg-[#D8B76A] px-3 py-1 text-xs font-semibold text-[#0A1D30]">Most chosen</span>}
                  <h3 className={`serif text-3xl ${t.hot ? 'text-white' : 'text-[#0F2A43]'}`}>{t.name}</h3>
                  <p className={`mt-1 text-sm ${t.hot ? 'text-[#D5DEE8]' : 'text-[#4A5B6C]'}`}>From {t.from} in assets</p>
                  <p className={`mt-4 leading-relaxed ${t.hot ? 'text-[#D5DEE8]' : 'text-[#3D4C5B]'}`}>{t.note}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {t.feats.map((f) => <li key={f} className="flex gap-3"><span className="text-[#B08A3E]" aria-hidden="true">✓</span><span className={t.hot ? 'text-white' : 'text-[#14202E]'}>{f}</span></li>)}
                  </ul>
                  <Link to={t.name === 'Sovereign' ? '#consult' : '/signup'} go={go} className={`btn mt-8 ${t.hot ? 'btn-gold' : 'btn-navy'}`}>{t.name === 'Sovereign' ? 'Request an invitation' : 'Get started'}</Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section id="fees" className="py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('What each tier costs and includes')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-12 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">One annual fee, shown in your written proposal before you sign. We take no commissions from product providers.</p></Reveal>
          <Reveal delay={0.15}>
            <div className="overflow-x-auto rounded-3xl border border-[#DDD8CC] bg-white">
              <table className="w-full min-w-[680px] text-left">
                <caption className="sr-only">Fees and service levels by tier</caption>
                <thead>
                  <tr>
                    <td className="p-6" />
                    {tiers.map((t) => <th key={t.name} scope="col" className={`serif p-6 text-2xl ${t.hot ? 'bg-[#0F2A43] text-white' : 'text-[#0F2A43]'}`}>{t.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DA]">
                  {feeRows.map(([l, ...v]) => (
                    <tr key={l}>
                      <th scope="row" className="p-6 text-sm font-semibold text-[#0F2A43]">{l}</th>
                      {v.map((x, k) => <td key={k} className={`p-6 ${k === 1 ? 'bg-[#F6F4EF] font-medium text-[#0F2A43]' : 'text-[#3D4C5B]'}`}>{x}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 text-xs text-[#4A5B6C]">Fees shown are illustrative and are confirmed in your proposal.</p>
        </div>
      </section>

      {/* Process */}
      <section id="wealth" className="py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-16 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('How we manage your wealth')}</h2></Reveal>
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#B08A3E] to-transparent lg:block" />
            {steps.map(([t, d], idx) => (
              <li key={t} className="relative">
                <Reveal delay={idx * 0.15}>
                  <span className="serif gloss relative mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-xl text-[#EDD595] shadow-lg">{idx + 1}</span>
                  <h3 className="serif mb-2 text-2xl text-[#0F2A43]">{t}</h3>
                  <p className="leading-relaxed text-[#3D4C5B]">{d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-24 md:py-32">
        <div className={`${wrap} grid items-stretch gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
          <Reveal className="h-full">
            <div className="navy-bg gloss relative flex h-full min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl p-8 md:p-10">
              <Photo src={images.team} position="center 40%" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D30] via-[#0A1D30]/60 to-[#0A1D30]/10" />
              <Guilloche className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] opacity-70" />
              <h2 className="serif relative mb-4 text-3xl text-white md:text-4xl">The team behind your account</h2>
              <p className="relative max-w-sm leading-relaxed text-[#D5DEE8]">Every client has a small, named team that meets together before each review, so you never repeat yourself.</p>
            </div>
          </Reveal>
          <ul className="grid gap-4">
            {team.map(([t, d], idx) => (
              <Reveal key={t} delay={idx * 0.1}>
                <li className="flex items-start gap-5 rounded-2xl border border-[#DDD8CC] bg-[#F6F4EF] p-6">
                  <span className="serif flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#B08A3E] text-xl text-[#8A6A26]" aria-hidden="true">{t[0]}</span>
                  <div><h3 className="serif text-xl text-[#0F2A43]">{t}</h3><p className="mt-1 leading-relaxed text-[#3D4C5B]">{d}</p></div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Digital */}
      <section id="digital" className="navy-bg relative overflow-hidden py-24 md:py-32">
        <Photo src={images.digital} position="center" className="opacity-25" />
        <div className="orb -right-10 bottom-0 h-[380px] w-[380px] bg-[#B08A3E]/25" />
        <div className={`${wrap} relative grid items-center gap-16 lg:grid-cols-2`}>
          <div>
            <Reveal><h2 className="serif mb-6 text-3xl text-white md:text-5xl">{t('Your bank in one secure app')}</h2></Reveal>
            <Reveal delay={0.1}><p className="mb-8 max-w-lg text-lg leading-relaxed text-[#D5DEE8]">Check balances, move money, sign documents, and message your advisor at any hour.</p></Reveal>
            <Reveal delay={0.2}>
              <ul className="mb-10 space-y-4 text-white">
                {['Biometric sign-in and end-to-end encryption', 'International transfers in minutes', 'Spending alerts and limits you control', 'Chat or video with your concierge team'].map((f) => (
                  <li key={f} className="flex gap-3"><span className="text-[#D8B76A]" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
              <button className="btn btn-gold">{t('Download the app')}</button>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="relative">
            <div className="float-a glass absolute -left-4 top-24 z-10 hidden rounded-xl px-4 py-3 text-sm text-white md:block">Dividend received<br /><span className="serif text-xl text-[#7FE0A8]">+$3,120.45</span></div>
            <div className="float-b mx-auto w-full max-w-sm rounded-[36px] border-[6px] border-[#1B2D40] bg-white p-6 lift">
              <p className="text-sm text-[#4A5B6C]">Available balance</p>
              <p className="serif mb-4 text-4xl tabular-nums text-[#0F2A43]">$412,860.20</p>
              <svg viewBox="0 0 300 70" className="mb-4 h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
                <polyline className="draw" fill="none" stroke="#B08A3E" strokeWidth="2.5" strokeLinejoin="round" points="0,58 30,52 60,55 90,42 120,45 150,34 180,38 210,26 240,28 270,16 300,12" />
              </svg>
              <div className="mb-5 grid grid-cols-3 gap-2 text-center text-sm font-medium text-[#0F2A43]">{['Transfer', 'Pay', 'Exchange'].map((a) => <span key={a} className="rounded-lg bg-[#F6F4EF] py-3">{a}</span>)}</div>
              <ul className="divide-y divide-[#E8E4DA] text-sm">
                {[['Meridian Trust', '-$25,000.00'], ['Dividend received', '+$3,120.45'], ['Insurance premium', '-$1,840.00']].map(([n, a]) => (
                  <li key={n} className="flex justify-between py-3"><span className="text-[#3D4C5B]">{n}</span><span className="font-medium tabular-nums">{a}</span></li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[#4A5B6C]">Sample data shown for illustration.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 md:py-32">
        <div className={`${wrap} grid items-center gap-16 lg:grid-cols-2`}>
          <Reveal className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
            <Frame src={images.security} alt="" position="center" className="absolute inset-4 rounded-full shadow-2xl" />
            {[0, 1, 2].map((r) => <span key={r} className="ring absolute h-full w-full rounded-full border border-[#B08A3E]" style={{ animationDelay: `${r * 1.2}s` }} />)}
            <span className="gloss flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-[#1E4B73] to-[#0A1D30] shadow-2xl">
              <svg className="h-14 w-14 text-[#EDD595]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3zm-3 9l2 2 4-4" /></svg>
            </span>
          </Reveal>
          <div>
            <Reveal><h2 className="serif mb-10 text-3xl text-[#0F2A43] md:text-5xl">{t('Security you do not have to think about')}</h2></Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {security.map(([t, d], idx) => (
                <Reveal key={t} delay={idx * 0.1}>
                  <div className="h-full border-l-2 border-[#B08A3E] pl-5"><h3 className="mb-1 text-lg font-semibold text-[#0F2A43]">{t}</h3><p className="leading-relaxed text-[#3D4C5B]">{d}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="bg-white py-20 md:py-28">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Licensed, certified, and audited')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-12 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">The standards we are held to, and who checks that we meet them.</p></Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {certs.map(([seal, t, d], idx) => (
              <Reveal key={t} delay={(idx % 3) * 0.08} className="h-full">
                <li className="flex h-full items-start gap-5 rounded-2xl border border-[#DDD8CC] bg-[#F6F4EF] p-6">
                  <span className="serif flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-double border-[#B08A3E] bg-white px-1 text-center text-[11px] leading-tight text-[#0F2A43]" aria-hidden="true">{seal}</span>
                  <div className="min-w-0"><h3 className="serif text-xl text-[#0F2A43]">{t}</h3><p className="mt-1 leading-relaxed text-[#3D4C5B]">{d}</p></div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Global network */}
      <section className="navy-bg relative overflow-hidden py-24 md:py-32">
        <div className={`${wrap} relative`}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-white md:text-5xl">{t('Local advisors in the world’s financial centres')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-12 max-w-xl text-lg leading-relaxed text-[#D5DEE8]">Your advisor works in your time zone, and your accounts follow you wherever you move.</p></Reveal>
          <Reveal delay={0.15}>
            <div className="dots relative h-[320px] w-full overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] md:h-[460px]">
              <Photo src={images.network} position="center" className="opacity-30" />
              {cities.map(([c, x, y], idx) => (
                <div key={c} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
                  <span className="relative flex h-3 w-3">
                    <span className="ping absolute inline-flex h-full w-full rounded-full bg-[#D8B76A]" style={{ animationDelay: `${idx * 0.35}s` }} />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#EDD595]" />
                  </span>
                  <span className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-white sm:text-xs md:text-sm ${parseInt(x, 10) > 70 ? 'right-5' : 'left-5'}`}>{c}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <dl className={`${wrap} grid grid-cols-2 gap-y-10 text-center md:grid-cols-4`}>
          {[[48, '$', 'B+', 0, 'Assets under management'], [140, '', '+', 0, 'Countries served'], [130, '', '+', 0, 'Years of private banking'], [99.99, '', '%', 2, 'Platform uptime']].map(([n, p, s, d, l]) => (
            <div key={l}><dd className="serif text-4xl text-[#0F2A43] md:text-6xl"><CountUp to={n} prefix={p} suffix={s} decimals={d} /></dd><dt className="mt-2 text-sm text-[#3D4C5B]">{l}</dt></div>
          ))}
        </dl>
      </section>

      {/* Stories */}
      <section className="navy-bg py-24 md:py-32">
        <div className={wrap}><Stories /></div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-4 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('What our clients say')}</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-12 max-w-xl text-lg leading-relaxed text-[#3D4C5B]">Founders, families, and professionals on what changed once they had one advisor and one view.</p></Reveal>
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
            {voices.map(([q, n, r], idx) => (
              <Reveal key={n} delay={(idx % 3) * 0.08} className="mb-6 break-inside-avoid">
                <figure className="rounded-2xl border border-[#DDD8CC] bg-white p-7">
                  <p className="mb-4 text-[#B08A3E]" role="img" aria-label="Rated 5 out of 5">★★★★★</p>
                  <blockquote className="serif text-xl font-normal leading-snug text-[#0F2A43]">“{q}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <Avatar name={n} src={images.voices[idx]} />
                    <span className="min-w-0"><span className="block font-semibold text-[#14202E]">{n}</span><span className="block text-sm text-[#4A5B6C]">{r}</span></span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="bg-white py-20 md:py-28">
        <div className={wrap}>
          <Reveal><h2 className="serif mb-12 max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Recognised by the industry')}</h2></Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {awards.map(([y, t, by], idx) => (
              <Reveal key={t} delay={idx * 0.08} className="h-full">
                <li className="spot flex h-full flex-col rounded-2xl border border-[#DDD8CC] bg-[#F6F4EF] p-7" onMouseMove={spot}>
                  <svg className="mb-6 h-12 w-12 text-[#B08A3E]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><circle cx="24" cy="20" r="12" /><path d="M24 13l2 4.2 4.6.6-3.4 3.2.9 4.5-4.1-2.2-4.1 2.2.9-4.5-3.4-3.2 4.6-.6z" /><path d="M17 31l-4 13 11-5 11 5-4-13" /></svg>
                  <p className="serif text-4xl text-[#0F2A43]">{y}</p>
                  <h3 className="mt-2 flex-1 text-lg font-semibold leading-snug text-[#14202E]">{t}</h3>
                  <p className="mt-4 text-sm text-[#4A5B6C]">{by}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-xs text-[#4A5B6C]">Awards shown are examples. Replace them with the awards you hold.</p>
        </div>
      </section>

      {/* Insights */}
      <section id="insights" className="py-24 md:py-32">
        <div className={wrap}>
          <div className="mb-14 flex items-end justify-between gap-6">
            <Reveal><h2 className="serif max-w-4xl text-3xl text-[#0F2A43] md:text-5xl">{t('Insights from our advisors')}</h2></Reveal>
            <a href="#" className="hidden font-semibold text-[#8A6A26] underline underline-offset-4 md:block">{t('View all articles')}</a>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(([tag, title, time], idx) => (
              <Reveal key={title} delay={idx * 0.12}>
                <a href="#" className="group block">
                  <div className="navy-bg gloss relative mb-5 flex h-52 items-end overflow-hidden rounded-2xl p-5 transition-transform duration-500 group-hover:-translate-y-1">
                    <Photo src={images.articles[idx]} position="center" className="transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D30]/80 to-transparent" />
                    <span className="relative rounded-full bg-[#D8B76A] px-3 py-1 text-xs font-semibold text-[#0A1D30]">{tag}</span>
                  </div>
                  <h3 className="serif mb-2 text-2xl text-[#0F2A43] transition-colors group-hover:text-[#8A6A26]">{title}</h3>
                  <p className="text-sm text-[#4A5B6C]">{time}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white py-24 md:py-32">
        <div className={`${wrap} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <Reveal>
            <h2 className="serif mb-6 text-3xl text-[#0F2A43] md:text-5xl">{t('A small bank, by design')}</h2>
            <p className="max-w-md text-lg leading-relaxed text-[#3D4C5B]">We limit the size of each advisory team so every client reaches a person who knows their situation, and we have done since 1892.</p>
            <Frame src={images.about} alt="An advisor and a client reviewing a plan in a private office" position="center top" className="mt-10 h-72 rounded-3xl" />
          </Reveal>
          <ol className="border-l-2 border-[#B08A3E]">
            {timeline.map(([y, t], idx) => (
              <li key={y} className="relative pb-8 pl-8 last:pb-0">
                <Reveal delay={idx * 0.08} className="grid gap-1 sm:grid-cols-[90px_1fr]">
                  <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-[#B08A3E] ring-4 ring-white" />
                  <span className="serif text-2xl text-[#0F2A43]">{y}</span>
                  <span className="pt-1 text-[#3D4C5B]">{t}</span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
          <Reveal><h2 className="serif text-3xl text-[#0F2A43] md:text-5xl">{t('Common questions')}</h2></Reveal>
          <Reveal delay={0.1}><Faq /></Reveal>
        </div>
      </section>

      {/* Consultation */}
      <section id="consult" className="navy-bg relative overflow-hidden py-24 md:py-32">
        <Photo src={images.consult} position="center 40%" className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D30]/80 to-[#0A1D30]/40" />
        <div className="orb -left-10 top-10 h-[360px] w-[360px] bg-[#B08A3E]/25" />
        <div className={`${wrap} relative grid items-center gap-14 lg:grid-cols-2`}>
          <Reveal>
            <h2 className="serif mb-5 text-3xl text-white md:text-5xl">{t('Talk to an advisor about your needs')}</h2>
            <p className="max-w-md text-lg leading-relaxed text-[#D5DEE8]">Initial consultations are confidential and carry no obligation. Tell us what you want to discuss and we will arrange a time.</p>
          </Reveal>
          <Reveal delay={0.15}><div className="glass gloss rounded-2xl p-5 sm:p-8"><Consultation /></div></Reveal>
        </div>
      </section>

      </>
      )}

      {/* Footer */}
      {!mode && <footer className="bg-[#0A1D30] pt-16 pb-10 text-[#C5D0DC]">
        <div className={wrap}>
          <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-12 md:flex-row md:items-center">
            <div><h3 className="serif text-2xl text-white">{t('Market notes, once a month')}</h3><p className="mt-1 text-sm">Short commentary from our investment team. Unsubscribe at any time.</p></div>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="nl" className="sr-only">Email address</label>
              <input id="nl" type="email" required placeholder="Email address" className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#9FB0C2]" />
              <button type="submit" className="btn btn-gold !px-6">{t('Subscribe')}</button>
            </form>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div><span className="serif text-2xl text-white">Aurelia Private</span><p className="mt-3 text-sm leading-relaxed">1 Harbour Street<br />Private client line: +1 800 555 0142</p></div>
            {[['Services', ['Private accounts', 'Wealth management', 'Credit and lending', 'Business banking']], ['Company', ['About', 'Careers', 'Press', 'Offices']], ['Support', ['Client sign in', 'Security centre', 'Contact us', 'Complaints']]].map(([h, items]) => (
              <div key={h}><h3 className="mb-4 text-sm font-semibold text-white">{h}</h3><ul className="space-y-2 text-sm">{items.map((i) => <li key={i}><Link to={i === 'Client sign in' ? '/signin' : '#'} go={go} className="transition-colors hover:text-white">{i === 'Client sign in' ? t(i) : i}</Link></li>)}</ul></div>
            ))}
          </div>
          <p className="mt-12 max-w-4xl border-t border-white/15 pt-8 text-xs leading-relaxed text-[#9FB0C2]">
            Investments can fall as well as rise, and you may get back less than you invest. Figures, rates, and client stories shown are illustrative. Aurelia Private Bank is authorised and regulated in the jurisdictions in which it operates. © 2026 Aurelia Private Bank. All rights reserved.
          </p>
        </div>
      </footer>}

      {progress > 8 && !mode && (
        <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#D8B76A]/60 bg-gradient-to-b from-[#1E4B73] to-[#0F2A43] text-[#EDD595] shadow-xl transition-transform hover:-translate-y-0.5">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
        </button>
      )}
    </div>
  );
}