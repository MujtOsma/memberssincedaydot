/* globals loaded via UMD CDN tags in index.html: React, ReactDOM, htm */
const { useState, useEffect, useContext, createContext, useRef, useCallback } = React;
const { createRoot } = ReactDOM;

// htm passes '' for <> fragments; map that to React.Fragment
function h(type, props, ...children) {
  return React.createElement(type || React.Fragment, props, ...children);
}
const html = htm.bind(h);

/* ═══════════════════════════════════════════════════════════════
   CONFIG — Edit brand details, links, pricing rules here
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  brand:       'Since Day Dot',
  tagline:     'Built by eleven. Carried by all.',
  subTagline:  'Member-driven. Community-first. Day one or never.',
  instagram:   'https://www.instagram.com/',
  tiktok:      'https://www.tiktok.com/',
  memberSeed:  1147,          // displayed member count base
  shipping:    8.99,
  freeShipping:100,
  taxRate:     0.13,          // 13% HST
  storageKey:  'sdd_user',
};

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Day One Hoodie',
    price: 89,
    desc: 'Heavyweight 400gsm fleece. Dropped shoulders, kangaroo pocket, embroidered XI crest on chest. The hoodie that started it all.',
    imgs: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=80',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=900&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    colors: [{ name:'Ink',label:'#0D0D0D' },{ name:'Bone',label:'#F2EDE4' },{ name:'Stone',label:'#7A7570' }],
    sizes:  ['XS','S','M','L','XL','XXL'],
    stock:  { 'XS':4,'S':12,'M':18,'L':15,'XL':9,'XXL':3 },
    badge:  'Bestseller',
    category:'hoodies',
  },
  {
    id: 'p2',
    name: 'Carry All Tee',
    price: 49,
    desc: '240gsm garment-dyed cotton. Pre-shrunk, oversized cut. Washed for that lived-in feel from day one.',
    imgs: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    colors: [{ name:'Chalk',label:'#FAFAF8' },{ name:'Gold',label:'#C4963A' },{ name:'Ink',label:'#0D0D0D' }],
    sizes:  ['XS','S','M','L','XL'],
    stock:  { 'XS':8,'S':20,'M':25,'L':18,'XL':7 },
    badge:  null,
    category:'tees',
  },
  {
    id: 'p3',
    name: 'XI Crewneck',
    price: 79,
    desc: 'French terry construction. Ribbed cuffs and hem. The number eleven stitched in gold across the back — a nod to where it all began.',
    imgs: [
      'https://images.unsplash.com/photo-1591257447430-6e9638b50afc?w=900&q=80',
      'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1591257447430-6e9638b50afc?w=600&q=80',
    colors: [{ name:'Stone',label:'#7A7570' },{ name:'Ink',label:'#0D0D0D' }],
    sizes:  ['S','M','L','XL','XXL'],
    stock:  { 'S':6,'M':14,'L':12,'XL':8,'XXL':2 },
    badge:  'Member Exclusive',
    category:'crewnecks',
  },
  {
    id: 'p4',
    name: 'Cargo Shorts',
    price: 69,
    desc: 'Relaxed ripstop cargo. Six pockets, adjustable waist, drawcord hem. Built for all-day wear.',
    imgs: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    colors: [{ name:'Bone',label:'#F2EDE4' },{ name:'Stone',label:'#7A7570' },{ name:'Ink',label:'#0D0D0D' }],
    sizes:  ['S','M','L','XL'],
    stock:  { 'S':5,'M':11,'L':9,'XL':4 },
    badge:  'New',
    category:'bottoms',
  },
  {
    id: 'p5',
    name: 'Origin Cap',
    price: 39,
    desc: 'Six-panel structured cap. Tonal embroidery on crown, woven label on strap. Adjustable fit.',
    imgs: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&q=80',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    colors: [{ name:'Ink',label:'#0D0D0D' },{ name:'Bone',label:'#F2EDE4' }],
    sizes:  ['One Size'],
    stock:  { 'One Size':30 },
    badge:  null,
    category:'accessories',
  },
  {
    id: 'p6',
    name: 'Founder Track Pant',
    price: 85,
    desc: 'Tapered twill track pant. Welt pockets, zip ankle, XI woven patch at hem. Limited to founding members.',
    imgs: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80',
    ],
    thumb: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    colors: [{ name:'Ink',label:'#0D0D0D' },{ name:'Stone',label:'#7A7570' }],
    sizes:  ['S','M','L','XL'],
    stock:  { 'S':3,'M':8,'L':6,'XL':2 },
    badge:  'Limited',
    category:'bottoms',
  },
];

/* ═══════════════════════════════════════════════════════════════
   FOUNDERS — 11 original members
   ═══════════════════════════════════════════════════════════════ */
const FOUNDERS = [
  { num:'001', name:'Marcus T.',  role:'Creative Director',   since:'Day 1',  img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { num:'002', name:'Zara A.',   role:'Brand Strategist',    since:'Day 1',  img:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
  { num:'003', name:'Devon C.',  role:'Head of Product',     since:'Day 1',  img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { num:'004', name:'Priya N.',  role:'Community Lead',      since:'Day 1',  img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { num:'005', name:'Eli B.',    role:'Art Direction',       since:'Day 1',  img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
  { num:'006', name:'Aaliyah W.',role:'Operations',          since:'Day 1',  img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { num:'007', name:'Jace M.',   role:'Photography',         since:'Day 1',  img:'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80' },
  { num:'008', name:'Kenji S.',  role:'Digital & Web',       since:'Day 1',  img:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80' },
  { num:'009', name:'Camille R.',role:'Marketing',           since:'Day 1',  img:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80' },
  { num:'010', name:'Tobias K.', role:'Logistics & Supply',  since:'Day 1',  img:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80' },
  { num:'011', name:'Nadia F.',  role:'Member Experience',   since:'Day 1',  img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80' },
];

const TIERS = [
  {
    name:'Day One',
    num:'#001–#100',
    price:'Free',
    perks:['Early access to every drop','Members-only colourways','Behind-the-scenes content','XI crest patch kit'],
    gold: false,
  },
  {
    name:'Carry All',
    num:'#101–#500',
    price:'$9.99/mo',
    perks:['Everything in Day One','10% off every order','Monthly drop previews','Name in annual credits','Exclusive member tee (yearly)'],
    gold: true,
  },
  {
    name:'Founder',
    num:'#501–#1147',
    price:'$19.99/mo',
    perks:['Everything in Carry All','20% off every order','First access to collabs','Signed founder-edition pieces','Annual meet IRL invite'],
    gold: false,
  },
];

const DROPS = [
  { name:'Volume II — Autumn Collection', date:'2026-09-01T00:00:00', img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', tag:'COMING SOON' },
  { name:'The XI Anniversary Pack',       date:'2026-11-11T11:11:00', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tag:'MEMBER ONLY' },
];

/* ═══════════════════════════════════════════════════════════════
   AUTH HELPERS
   ═══════════════════════════════════════════════════════════════ */
const hashPw = pw => btoa(encodeURIComponent(pw + '__sdd_salt'));
const getStored = () => { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null'); } catch { return null; } };
const safeUser  = () => { const s = getStored(); if (!s) return null; const { pw: _, ...safe } = s; return safe; };

/* ═══════════════════════════════════════════════════════════════
   CART CONTEXT
   ═══════════════════════════════════════════════════════════════ */
const CartCtx = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, size, color, qty = 1) => {
    setItems(prev => {
      const key = `${product.id}|${size}|${color}`;
      const ex  = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, product, size, color, qty }];
    });
  }, []);

  const removeItem = useCallback(key => setItems(prev => prev.filter(i => i.key !== key)), []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) { removeItem(key); return; }
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const count    = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);

  return html`
    <${CartCtx.Provider} value=${{ items, addItem, removeItem, updateQty, clearCart, count, subtotal }}>
      ${children}
    </>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════════ */
const Bag    = ({ size=20, cls='' }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" class=${cls}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`;
const Bars   = ({ size=22 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
const XIcon  = ({ size=22 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ArrowL = ({ size=20 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const Chev   = ({ size=16, down=true }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points=${down?"6 9 12 15 18 9":"6 15 12 9 18 15"}/></svg>`;
const Trash  = ({ size=16 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const Star   = ({ filled=false, size=14 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill=${filled?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const IGIcon = ({ size=20 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>`;
const TTIcon = ({ size=20 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>`;
const Check  = ({ size=18 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const Mail   = ({ size=18 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>`;
const UserIc = ({ size=20 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

/* ═══════════════════════════════════════════════════════════════
   SCROLL-REVEAL HOOK
   ═══════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .women-panel');
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useImageFade() {
  useEffect(() => {
    document.querySelectorAll('.img-fade').forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   CART DRAWER
   ═══════════════════════════════════════════════════════════════ */
function CartDrawer({ open, onClose, go }) {
  const { items, removeItem, updateQty, subtotal, count } = useContext(CartCtx);
  const shipping = subtotal >= CONFIG.freeShipping ? 0 : CONFIG.shipping;
  const tax      = (subtotal + shipping) * CONFIG.taxRate;
  const total    = subtotal + shipping + tax;

  return html`
    <>
      <div class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}"
           onClick=${onClose}/>
      <aside class="cart-drawer fixed right-0 top-0 h-full w-full max-w-md bg-chalk z-50 flex flex-col ${open?'is-open':''}">
        <div class="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h2 class="font-display text-lg tracking-widest uppercase">Your Bag ${count>0?html`<span class="text-gold">(${count})</span>`:''}</h2>
          <button onClick=${onClose} class="t-btn p-1 rounded hover:text-gold transition-colors" aria-label="Close cart"><${XIcon}/></button>
        </div>

        <div class="flex-1 overflow-y-auto drawer-scroll px-6 py-4">
          ${items.length===0 ? html`
            <div class="flex flex-col items-center justify-center h-full gap-4 text-stone">
              <${Bag} size=${48} cls="opacity-20"/>
              <p class="font-display tracking-widest uppercase text-sm">Your bag is empty</p>
              <button onClick=${()=>{onClose();go('shop');}} class="text-xs uppercase tracking-widest underline hover:text-ink transition-colors">Start Shopping</button>
            </div>
          ` : items.map(item => html`
            <div key=${item.key} class="flex gap-4 py-4 border-b border-ink/8 last:border-0">
              <img src=${item.product.thumb} alt=${item.product.name}
                   class="w-20 h-20 object-cover flex-shrink-0"/>
              <div class="flex-1 min-w-0">
                <p class="font-display text-sm tracking-wide uppercase truncate">${item.product.name}</p>
                <p class="text-xs text-stone mt-0.5">${item.size} · ${item.color}</p>
                <p class="text-sm font-semibold mt-1">$${item.product.price}</p>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center border border-ink/15">
                    <button onClick=${()=>updateQty(item.key,item.qty-1)} class="qty-btn w-8 h-8 text-base">−</button>
                    <span class="w-8 text-center text-sm font-mono">${item.qty}</span>
                    <button onClick=${()=>updateQty(item.key,item.qty+1)} class="qty-btn w-8 h-8 text-base">+</button>
                  </div>
                  <button onClick=${()=>removeItem(item.key)} class="text-stone hover:text-red-600 transition-colors p-1" aria-label="Remove"><${Trash}/></button>
                </div>
              </div>
            </div>
          `)}
        </div>

        ${items.length>0 && html`
          <div class="px-6 py-5 border-t border-ink/10 space-y-2">
            <div class="flex justify-between text-sm"><span class="text-stone">Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="flex justify-between text-sm">
              <span class="text-stone">Shipping</span>
              <span>${shipping===0?html`<span class="text-green-700 font-semibold">Free</span>`:`$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="flex justify-between text-sm"><span class="text-stone">HST (13%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="flex justify-between font-semibold text-base pt-2 border-t border-ink/10">
              <span>Total</span><span>$${total.toFixed(2)}</span>
            </div>
            ${subtotal<CONFIG.freeShipping && html`
              <p class="text-xs text-stone text-center">Add $${(CONFIG.freeShipping-subtotal).toFixed(2)} more for free shipping</p>
            `}
            <button onClick=${()=>{onClose();go('checkout');}}
                    class="w-full bg-ink text-chalk font-display tracking-widest uppercase py-3.5 text-sm hover:bg-gold transition-colors t-btn mt-2">
              Checkout
            </button>
          </div>
        `}
      </aside>
    </>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════════ */
function Nav({ go, page }) {
  const { count } = useContext(CartCtx);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [page]);

  const navLinks = [
    { label:'Shop',    page:'shop' },
    { label:'Story',   page:'story' },
    { label:'Members', page:'members' },
    { label:'Drops',   page:'drops' },
  ];

  const isHero = page === 'home';
  const dark   = isHero && !scrolled && !menuOpen;

  return html`
    <>
      <nav class="fixed top-0 left-0 right-0 z-40 transition-all duration-300
                  ${scrolled||!isHero||menuOpen ? 'bg-chalk/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          <!-- Logo -->
          <button onClick=${()=>go('home')} class="font-display tracking-widest uppercase text-lg ${dark?'text-chalk':'text-ink'} hover:text-gold transition-colors leading-none flex flex-col items-start">
            <span class="text-xl leading-none">MAC</span>
            <span class="font-mono text-[8px] tracking-[0.22em] opacity-60 normal-case" style=${{fontFamily:'var(--font-mono)'}}>Members Apparel Collective</span>
          </button>

          <!-- Desktop links -->
          <div class="hidden md:flex items-center gap-8">
            ${navLinks.map(l=>html`
              <button key=${l.page} onClick=${()=>go(l.page)}
                      class="nav-link font-display text-xs tracking-widest uppercase ${dark?'text-chalk':'text-ink'} hover:text-gold transition-colors ${page===l.page?'text-gold':''}">
                ${l.label}
              </button>
            `)}
          </div>

          <!-- Right icons -->
          <div class="flex items-center gap-3">
            <button onClick=${()=>go('account')} class="${dark?'text-chalk':'text-ink'} hover:text-gold transition-colors p-1" aria-label="Account"><${UserIc}/></button>
            <button onClick=${()=>setCartOpen(true)} class="relative ${dark?'text-chalk':'text-ink'} hover:text-gold transition-colors p-1" aria-label="Cart">
              <${Bag}/>
              ${count>0 && html`<span class="absolute -top-1 -right-1 bg-gold text-chalk text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">${count}</span>`}
            </button>
            <button onClick=${()=>setMenuOpen(o=>!o)} class="${dark?'text-chalk':'text-ink'} md:hidden p-1" aria-label="Menu">
              ${menuOpen?html`<${XIcon}/>`:html`<${Bars}/>`}
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div class="mobile-menu md:hidden bg-chalk border-t border-ink/10 ${menuOpen?'is-open':''}">
          <div class="px-6 py-4 space-y-1">
            ${navLinks.map(l=>html`
              <button key=${l.page} onClick=${()=>{go(l.page);setMenuOpen(false);}}
                      class="block w-full text-left font-display text-sm tracking-widest uppercase py-3 border-b border-ink/8 hover:text-gold transition-colors ${page===l.page?'text-gold':'text-ink'}">
                ${l.label}
              </button>
            `)}
            <button onClick=${()=>{go('newsletter');setMenuOpen(false);}}
                    class="block w-full text-left font-display text-sm tracking-widest uppercase py-3 border-b border-ink/8 hover:text-gold transition-colors text-ink">
              Newsletter
            </button>
          </div>
        </div>
      </nav>

      <${CartDrawer} open=${cartOpen} onClose=${()=>setCartOpen(false)} go=${go}/>
    </>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   TICKER
   ═══════════════════════════════════════════════════════════════ */
function Ticker() {
  const words = ['Since Day Dot','Built by Eleven','Carried by All','Member-Driven','Community-First','Day One or Never','XI','The Archive','Since Day Dot','Built by Eleven','Carried by All'];
  const track = words.concat(words).map((w,i) => html`
    <span key=${i} class="inline-flex items-center gap-8 px-8">
      <span class="font-display font-black text-sm tracking-[0.2em] uppercase">${w}</span>
      <span class="w-1 h-1 rounded-full bg-gold inline-block flex-shrink-0"/>
    </span>
  `);
  return html`
    <div class="overflow-hidden bg-ink text-chalk py-3">
      <div class="ticker-track">${track}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   BRAND LOGO SVG
   ═══════════════════════════════════════════════════════════════ */
function BrandLogo({ size = 260, light = false }) {
  const c  = light ? '#FAFAF8' : '#0D0D0D';
  const g  = '#C4963A';
  const h  = Math.round(size * 1.18);
  const sw = size / 260;
  return html`
    <svg width=${size} height=${h} viewBox="0 0 260 306" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="258" height="304" stroke=${c} strokeWidth="1.2"/>
      <rect x="8" y="8" width="244" height="290" stroke=${g} strokeWidth="0.4" strokeDasharray="3 5"/>
      <rect x="1" y="1" width="12" height="12" fill=${g}/>
      <rect x="247" y="1" width="12" height="12" fill=${g}/>
      <rect x="1" y="293" width="12" height="12" fill=${g}/>
      <rect x="247" y="293" width="12" height="12" fill=${g}/>
      <text x="130" y="46" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="7.5" fill=${g} letterSpacing="5">EST. DAY ZERO</text>
      <line x1="38" y1="56" x2="222" y2="56" stroke=${c} strokeWidth="0.4" strokeOpacity="0.25"/>
      <text x="130" y="165" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="88" fontWeight="700" fill=${c} letterSpacing="-2">XI</text>
      <line x1="38" y1="188" x2="222" y2="188" stroke=${c} strokeWidth="0.4" strokeOpacity="0.25"/>
      <text x="130" y="218" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="600" fill=${c} letterSpacing="6.5">MEMBERS</text>
      <text x="130" y="236" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="600" fill=${c} letterSpacing="6.5">APPAREL</text>
      <text x="130" y="254" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9.5" fontWeight="600" fill=${c} letterSpacing="3.5">COLLECTIVE</text>
    </svg>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */
function Home({ go }) {
  useReveal();
  useImageFade();

  const testimonials = [
    { name:'Jordan M.', num:'#042', text:'Been here since the first group chat. SDD isn\'t just clothes — it\'s the people.' },
    { name:'Riley S.',  num:'#203', text:'Carrying the XI patch everywhere. This brand hits different when you know the story.' },
    { name:'Alex K.',  num:'#718', text:'Dropped 3 times, copped every time. Quality is unreal for the price point.' },
  ];

  return html`
    <div>
      <!-- HERO -->
      <section class="min-h-screen bg-ink text-chalk flex flex-col justify-between px-6 sm:px-12 pt-24 pb-10">

        <p class="font-mono text-chalk/30 text-[10px] tracking-[0.3em] uppercase">Members Apparel Collective · Toronto</p>

        <div>
          <h1 class="brand-title text-chalk">
            Members<br/>Apparel<br/>Collective
          </h1>
          <div class="flex items-center gap-4 mt-5 mb-4">
            <div class="h-px w-10 bg-gold flex-shrink-0"/>
            <p class="font-mono text-chalk/35 text-[9px] tracking-[0.35em] uppercase">Est. Since Day Dot · Day Zero</p>
          </div>
          <div class="flex flex-wrap items-center gap-4 mt-6">
            <button onClick=${()=>go('shop')}
                    class="border border-chalk/30 text-chalk font-body font-medium tracking-[0.12em] uppercase px-6 py-3 text-xs hover:bg-chalk hover:text-ink transition-colors t-btn">
              Shop Collection
            </button>
            <button onClick=${()=>go('story')}
                    class="text-chalk/50 font-body text-xs tracking-[0.12em] uppercase hover:text-chalk transition-colors">
              Our Story →
            </button>
          </div>
        </div>

        <p class="font-mono text-chalk/20 text-[9px] tracking-[0.25em] uppercase">#${CONFIG.memberSeed}+ Members worldwide</p>

      </section>

      <!-- TICKER -->
      <${Ticker}/>

      <!-- STATS BAR -->
      <div class="bg-chalk border-b border-ink/10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-2 sm:grid-cols-4">
            ${[
              { val:`${CONFIG.memberSeed}+`, label:'Members' },
              { val:'04', label:'Drops Completed' },
              { val:'2023', label:'Est.' },
              { val:'XI', label:'Founders' },
            ].map(({val,label}) => html`
              <div key=${label} class="stat-card">
                <p class="font-display font-black text-3xl sm:text-4xl">${val}</p>
                <p class="font-mono text-[9px] tracking-widest uppercase text-stone mt-0.5">${label}</p>
              </div>
            `)}
          </div>
        </div>
      </div>

      <!-- FEATURED PRODUCTS -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Vol. I — The Collection</p>
            <h2 class="font-display font-semibold text-5xl sm:text-6xl uppercase leading-none reveal reveal-d1">New Arrivals</h2>
          </div>
          <button onClick=${()=>go('shop')} class="hidden sm:block nav-link font-display text-xs tracking-widest uppercase text-stone hover:text-ink transition-colors reveal">
            View All →
          </button>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          ${PRODUCTS.slice(0,3).map((p,i) => html`
            <div key=${p.id} class="product-card reveal reveal-d${i+1}" onClick=${()=>go('product',{product:p})}>
              <div class="card-img-wrap aspect-[3/4] bg-stone/10 mb-3">
                ${p.badge && html`
                  <div class="absolute top-3 left-3 z-10 bg-gold text-chalk font-mono text-[9px] tracking-widest uppercase px-2.5 py-1">
                    ${p.badge}
                  </div>
                `}
                <img src=${p.thumb} alt=${p.name} class="img-fade w-full h-full object-cover"/>
                <div class="quick-add absolute bottom-3 left-3 right-3">
                  <button class="w-full bg-ink/90 text-chalk font-display text-xs tracking-widest uppercase py-2.5 hover:bg-gold transition-colors t-btn">
                    Quick View
                  </button>
                </div>
              </div>
              <p class="font-display text-sm tracking-wide uppercase">${p.name}</p>
              <p class="text-stone text-sm mt-0.5">$${p.price}</p>
            </div>
          `)}
        </div>
        <div class="mt-8 text-center sm:hidden">
          <button onClick=${()=>go('shop')} class="font-display text-xs tracking-widest uppercase border border-ink/20 px-8 py-3 hover:bg-ink hover:text-chalk transition-colors t-btn">
            View All
          </button>
        </div>
      </section>

      <!-- WOMEN'S EXCLUSIVE DROP -->
      <section class="flex flex-col lg:flex-row overflow-hidden">

        <!-- Dark left panel -->
        <div class="bg-ink text-chalk flex flex-col justify-center px-8 sm:px-14 py-20 lg:py-0 relative z-10"
             style=${{flex:'0 0 42%', minHeight:'55svh'}}>
          <div class="hidden lg:block absolute top-0 bottom-0 right-0 w-16 bg-ink z-20"
               style=${{transform:'skewX(-2.5deg) translateX(60%)', transformOrigin:'top center'}}/>
          <div class="max-w-xs">
            <p class="font-mono text-gold/70 text-[9px] tracking-[0.4em] uppercase mb-4 reveal">· Women's Edit ·</p>
            <h2 class="font-display font-extrabold text-chalk uppercase leading-[0.88] reveal reveal-d1"
                style=${{fontSize:'clamp(38px,4.2vw,66px)'}}>
              Built<br/>Different.
            </h2>
            <div class="flex items-center gap-3 my-5 reveal reveal-d2">
              <div class="h-px w-8 bg-gold"/>
              <p class="font-mono text-chalk/30 text-[8px] tracking-[0.25em] uppercase">Coming Soon</p>
            </div>
            <p class="font-body text-chalk/40 text-[13px] leading-relaxed reveal reveal-d2">
              Crafted for women who move with purpose. Exclusively available to Members.
            </p>
            <button class="mt-8 font-mono text-[9px] tracking-[0.28em] uppercase px-5 py-2.5 text-chalk/30 border border-chalk/15 cursor-not-allowed reveal reveal-d3">
              ⌀ Access Pending
            </button>
          </div>
        </div>

        <!-- Pink right panel — sweeps in from right on scroll -->
        <div class="women-panel relative flex-1 overflow-hidden" style=${{minHeight:'80svh'}}>
          <div class="absolute inset-0" style=${{background:'linear-gradient(150deg,#6D2A3F 0%,#A04D68 40%,#C47888 80%,#D4909E 100%)'}}/>
          <div class="absolute inset-0 mix-blend-overlay opacity-25" style=${{
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:'200px 200px'
          }}/>
          <div class="hidden lg:block absolute inset-y-0 left-0 w-24 z-10"
               style=${{background:'linear-gradient(to right,#0D0D0D,transparent)'}}/>

          <!-- Corner ribbon -->
          <div class="absolute top-0 right-0 overflow-hidden z-30" style=${{width:'156px',height:'156px'}}>
            <div class="absolute font-mono font-bold text-ink text-[7.5px] tracking-[0.22em] uppercase text-center"
                 style=${{
                   background:'#C4963A',
                   top:'37px',right:'-48px',
                   transform:'rotate(45deg)',
                   padding:'7px 60px',
                   whiteSpace:'nowrap'
                 }}>
              Members Only
            </div>
          </div>

          <!-- Product cards -->
          <div class="absolute inset-0 flex items-center justify-center px-6 lg:px-10">
            <div class="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
              ${[
                {num:'I',   name:'Gym Set', sub:'Seamless Collection'},
                {num:'II',  name:'Capris',  sub:'Movement Series'},
                {num:'III', name:'Sets',    sub:'Complete Look'},
              ].map(({num,name,sub},i) => html`
                <div key=${i} class="relative overflow-hidden"
                     style=${{
                       aspectRatio:'9/14',
                       background:'rgba(0,0,0,0.32)',
                       backdropFilter:'blur(10px)',
                       border:'1px solid rgba(255,255,255,0.13)',
                     }}>
                  <div class="absolute inset-[1px]" style=${{border:'1px solid rgba(255,255,255,0.05)'}}/>
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <p class="font-mono font-bold leading-none"
                       style=${{fontSize:'clamp(22px,4.2vw,44px)',color:'rgba(255,255,255,0.18)'}}>${num}</p>
                    <div style=${{width:'18px',height:'1px',background:'rgba(196,150,58,0.45)',margin:'10px auto'}}/>
                    <p class="font-display font-bold text-chalk uppercase text-[9px] sm:text-[11px] tracking-widest leading-tight">${name}</p>
                    <p class="font-mono text-[6.5px] sm:text-[7.5px] tracking-[0.18em] uppercase mt-1"
                       style=${{color:'rgba(255,255,255,0.28)'}}>${sub}</p>
                  </div>
                  <div class="absolute bottom-2.5 inset-x-0 flex justify-center">
                    <p class="font-mono text-[6px] sm:text-[6.5px] tracking-[0.22em] uppercase"
                       style=${{color:'rgba(255,255,255,0.18)'}}>Reveal Pending</p>
                  </div>
                </div>
              `)}
            </div>
          </div>

          <div class="absolute bottom-5 inset-x-0 flex justify-center z-20">
            <p class="font-mono text-[7.5px] tracking-[0.42em] uppercase"
               style=${{color:'rgba(255,255,255,0.22)'}}>Women's Exclusive · Dropping 2025</p>
          </div>
        </div>

      </section>

      <!-- LOOKBOOK GRID -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Lookbook</p>
        <h2 class="font-display font-semibold text-4xl sm:text-5xl uppercase mb-8 leading-none reveal reveal-d1">How It's Worn</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${[
            { img:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', label:'Day One Hoodie', span:'row-span-2' },
            { img:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80', label:'Carry All Tee', span:'' },
            { img:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', label:'Founder Track Pant', span:'' },
            { img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80', label:'Origin Cap', span:'col-span-2' },
          ].map((t,i) => html`
            <div key=${i} class="lb-tile ${t.span} reveal reveal-d${i+1}" style=${{aspectRatio:t.span.includes('row')?undefined:'1/1'}}>
              <img src=${t.img} alt=${t.label} class="img-fade"/>
              <div class="lb-overlay">
                <div class="lb-label">${t.label}</div>
              </div>
            </div>
          `)}
        </div>
      </section>

      <!-- STORY TEASER -->
      <section class="bg-ink text-chalk py-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-0 items-center">
          <div class="brand-logo-wrap reveal">
            <${BrandLogo} size=${240} light=${true}/>
          </div>
          <div class="flex flex-col justify-center px-0 md:px-14 py-12 md:py-0">
            <p class="font-mono text-gold text-[10px] tracking-[0.3em] uppercase mb-4 reveal">XI — Origin Story</p>
            <h2 class="font-display font-semibold text-4xl sm:text-6xl uppercase leading-[0.95] mb-8 reveal reveal-d1">Eleven People.<br/>One Brand.</h2>
            <p class="text-chalk/60 leading-relaxed mb-4 reveal reveal-d2 text-sm">
              It started in a group chat. Eleven friends, one shared vision: clothing that meant something beyond the label. No investors. No committees. Just eleven people who decided to build something from nothing.
            </p>
            <p class="text-chalk/60 leading-relaxed mb-10 reveal reveal-d3 text-sm">
              Every piece we make carries that origin. The XI crest isn't decoration — it's a reminder that this brand belongs to the people who built it.
            </p>
            <button onClick=${()=>go('story')}
                    class="self-start border border-chalk/30 font-display font-black tracking-[0.18em] uppercase px-8 py-3.5 text-sm hover:bg-chalk hover:text-ink transition-colors t-btn reveal reveal-d4">
              Meet the Eleven →
            </button>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal text-center">Community</p>
        <h2 class="font-display font-semibold text-4xl sm:text-5xl uppercase mb-10 reveal reveal-d1 text-center leading-none">What Members Say</h2>
        <div class="grid md:grid-cols-3 gap-6">
          ${testimonials.map((t,i) => html`
            <div key=${i} class="testi-card reveal reveal-d${i+1}">
              <div class="flex gap-1 text-gold mb-4">${[1,2,3,4,5].map(s=>html`<${Star} key=${s} filled size=${13}/>`)}</div>
              <p class="text-stone leading-relaxed mb-6 text-sm">"${t.text}"</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center font-mono text-xs font-bold">${t.name[0]}</div>
                <div>
                  <p class="font-semibold text-sm">${t.name}</p>
                  <p class="font-mono text-xs text-gold">${t.num}</p>
                </div>
              </div>
            </div>
          `)}
        </div>
      </section>

      <!-- NEWSLETTER BANNER -->
      <section class="bg-gold/10 border-t border-b border-gold/20 py-16">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Stay Close</p>
          <h2 class="font-display font-semibold text-4xl sm:text-5xl uppercase mb-4 reveal reveal-d1 leading-none">Member Drops First</h2>
          <p class="text-stone mb-8 reveal reveal-d2">Get early access to drops, member exclusives, and behind-the-scenes. Day one privilege.</p>
          <button onClick=${()=>go('newsletter')}
                  class="bg-ink text-chalk font-display tracking-widest uppercase px-10 py-4 text-sm hover:bg-gold transition-colors t-btn reveal reveal-d3">
            Join the Inner Circle
          </button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="bg-ink text-chalk/70 pt-16 pb-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <p class="font-display text-chalk text-2xl tracking-widest uppercase mb-0.5">MAC</p>
              <p class="font-mono text-chalk/40 text-[9px] tracking-widest uppercase mb-3">Members Apparel Collective</p>
              <p class="text-sm leading-relaxed mb-6">${CONFIG.tagline}</p>
              <div class="flex gap-4">
                <a href=${CONFIG.instagram} target="_blank" rel="noopener" class="text-chalk/50 hover:text-gold transition-colors" aria-label="Instagram"><${IGIcon}/></a>
                <a href=${CONFIG.tiktok}    target="_blank" rel="noopener" class="text-chalk/50 hover:text-gold transition-colors" aria-label="TikTok"><${TTIcon}/></a>
              </div>
            </div>
            <div>
              <p class="font-display text-chalk text-xs tracking-widest uppercase mb-4">Shop</p>
              <ul class="space-y-2 text-sm">
                ${['All Products','Hoodies','Tees','Bottoms','Accessories'].map(l=>html`
                  <li key=${l}><button onClick=${()=>go('shop')} class="hover:text-chalk transition-colors">${l}</button></li>
                `)}
              </ul>
            </div>
            <div>
              <p class="font-display text-chalk text-xs tracking-widest uppercase mb-4">Community</p>
              <ul class="space-y-2 text-sm">
                ${[['Story','story'],['Members','members'],['Drops','drops'],['Newsletter','newsletter']].map(([l,p])=>html`
                  <li key=${p}><button onClick=${()=>go(p)} class="hover:text-chalk transition-colors">${l}</button></li>
                `)}
              </ul>
            </div>
            <div>
              <p class="font-display text-chalk text-xs tracking-widest uppercase mb-4">Account</p>
              <ul class="space-y-2 text-sm">
                ${[['My Account','account'],['Track Order','account'],['Returns','account']].map(([l,p],i)=>html`
                  <li key=${i}><button onClick=${()=>go(p)} class="hover:text-chalk transition-colors">${l}</button></li>
                `)}
              </ul>
            </div>
          </div>
          <div class="border-t border-chalk/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Since Day Dot. All rights reserved.</p>
            <p class="font-mono text-gold text-[10px] tracking-widest">${CONFIG.memberSeed}+ members and counting</p>
          </div>
        </div>
      </footer>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════════════════ */
function Shop({ go }) {
  useReveal();
  useImageFade();
  const [filter, setFilter] = useState('all');
  const cats = ['all','hoodies','tees','crewnecks','bottoms','accessories'];
  const shown = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <!-- Header -->
        <div class="mb-10">
          <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1">Collection</p>
          <h1 class="font-display font-semibold text-6xl sm:text-7xl uppercase leading-none">Shop</h1>
        </div>

        <!-- Filter tabs -->
        <div class="flex gap-2 flex-wrap mb-10">
          ${cats.map(c => html`
            <button key=${c} onClick=${()=>setFilter(c)}
                    class="font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors t-btn
                           ${filter===c ? 'bg-ink text-chalk border-ink' : 'border-ink/20 text-stone hover:border-ink hover:text-ink'}">
              ${c}
            </button>
          `)}
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          ${shown.map((p,i) => html`
            <div key=${p.id} class="product-card reveal reveal-d${(i%3)+1}" onClick=${()=>go('product',{product:p})}>
              <div class="card-img-wrap aspect-[3/4] bg-stone/10 mb-3">
                ${p.badge && html`
                  <div class="absolute top-3 left-3 z-10 bg-gold text-chalk font-mono text-[9px] tracking-widest uppercase px-2.5 py-1">
                    ${p.badge}
                  </div>
                `}
                <img src=${p.thumb} alt=${p.name} class="img-fade w-full h-full object-cover"/>
                <div class="quick-add absolute bottom-3 left-3 right-3">
                  <button class="w-full bg-ink/90 text-chalk font-display text-xs tracking-widest uppercase py-2.5 hover:bg-gold transition-colors t-btn">
                    Quick View
                  </button>
                </div>
              </div>
              <p class="font-display text-sm tracking-wide uppercase">${p.name}</p>
              <p class="text-stone text-sm mt-0.5">$${p.price}</p>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
   ═══════════════════════════════════════════════════════════════ */
function PDP({ product, go }) {
  useReveal();
  const { addItem } = useContext(CartCtx);
  const [selImg,   setSelImg]   = useState(0);
  const [selColor, setSelColor] = useState(product.colors[0].name);
  const [selSize,  setSelSize]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);
  const [err,      setErr]      = useState('');
  const [accOpen,  setAccOpen]  = useState(null);

  const faqs = [
    { q:'Sizing',      a:'All garments are true-to-size. We recommend sizing up for an oversized fit. Check our size guide in the account area.' },
    { q:'Shipping',    a:`Free shipping on orders over $${CONFIG.freeShipping}. Standard rates $${CONFIG.shipping} otherwise. Ships within 2–4 business days.` },
    { q:'Returns',     a:'30-day returns on unworn, unwashed pieces with original tags attached. Member orders get free return labels.' },
    { q:'Materials',   a:'All fabrics sourced ethically. 100% cotton or cotton-blend construction. Care instructions on inner label.' },
  ];

  function handleAdd() {
    if (!selSize) { setErr('Please select a size.'); return; }
    setErr('');
    addItem(product, selSize, selColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <!-- Back -->
        <button onClick=${()=>go('shop')} class="flex items-center gap-2 text-stone hover:text-ink transition-colors text-sm mb-8 font-display uppercase tracking-widest">
          <${ArrowL}/> Back to Shop
        </button>

        <div class="grid md:grid-cols-2 gap-10 lg:gap-16">
          <!-- Images -->
          <div>
            <div class="aspect-[3/4] bg-stone/10 mb-3 overflow-hidden">
              <img src=${product.imgs[selImg]} alt=${product.name} class="img-fade w-full h-full object-cover transition-opacity duration-300"/>
            </div>
            ${product.imgs.length>1 && html`
              <div class="thumb-strip flex gap-2">
                ${product.imgs.map((img,i) => html`
                  <button key=${i} onClick=${()=>setSelImg(i)}
                          class="w-16 h-20 border-2 overflow-hidden flex-shrink-0 transition-colors ${selImg===i?'border-ink':'border-transparent'}">
                    <img src=${img} alt="" class="w-full h-full object-cover"/>
                  </button>
                `)}
              </div>
            `}
          </div>

          <!-- Info -->
          <div class="reveal">
            ${product.badge && html`<p class="font-mono text-[10px] tracking-widest uppercase text-gold mb-3">${product.badge}</p>`}
            <h1 class="font-display text-3xl sm:text-4xl uppercase mb-2">${product.name}</h1>
            <p class="text-2xl font-semibold mb-6">$${product.price}</p>
            <p class="text-stone leading-relaxed mb-8 text-sm">${product.desc}</p>

            <!-- Colors -->
            <div class="mb-6">
              <p class="font-mono text-[10px] tracking-widest uppercase text-stone mb-3">Colour — <span class="text-ink">${selColor}</span></p>
              <div class="flex gap-2">
                ${product.colors.map(c => html`
                  <button key=${c.name} onClick=${()=>setSelColor(c.name)}
                          class="swatch ${selColor===c.name?'sel':''}"
                          style=${{background:c.label}}
                          aria-label=${c.name}/>
                `)}
              </div>
            </div>

            <!-- Sizes -->
            <div class="mb-6">
              <p class="font-mono text-[10px] tracking-widest uppercase text-stone mb-3">Size</p>
              <div class="flex flex-wrap gap-2">
                ${product.sizes.map(s => {
                  const inStock = (product.stock[s]||0)>0;
                  return html`
                    <button key=${s} onClick=${()=>{if(inStock){setSelSize(s);setErr('');}}}
                            class="sz-pill ${selSize===s?'sel':''} ${!inStock?'out':''}">
                      ${s}
                    </button>
                  `;
                })}
              </div>
              ${err && html`<p class="text-red-600 text-xs mt-2 font-mono">${err}</p>`}
            </div>

            <!-- Qty + ATB -->
            <div class="flex gap-3 mb-6">
              <div class="flex items-center border border-ink/20">
                <button onClick=${()=>setQty(q=>Math.max(1,q-1))} class="qty-btn">−</button>
                <span class="w-10 text-center font-mono text-sm">${qty}</span>
                <button onClick=${()=>setQty(q=>q+1)} class="qty-btn">+</button>
              </div>
              <button onClick=${handleAdd}
                      class="flex-1 font-display tracking-widest uppercase text-sm py-3.5 transition-colors t-btn
                             ${added?'bg-green-700 text-chalk':'bg-ink text-chalk hover:bg-gold'}">
                ${added ? html`<span class="flex items-center justify-center gap-2"><${Check}/> Added</span>` : 'Add to Bag'}
              </button>
            </div>

            <!-- FAQs accordion -->
            <div class="border-t border-ink/10">
              ${faqs.map((f,i) => html`
                <div key=${i} class="border-b border-ink/10">
                  <button onClick=${()=>setAccOpen(accOpen===i?null:i)}
                          class="w-full flex justify-between items-center py-4 text-left font-display text-xs tracking-widest uppercase">
                    ${f.q}
                    <${Chev} down=${accOpen!==i}/>
                  </button>
                  <div class="acc-body ${accOpen===i?'is-open':''}">
                    <p class="text-stone text-sm pb-4 leading-relaxed">${f.a}</p>
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>

        <!-- Related products -->
        <div class="mt-20">
          <h2 class="font-display text-3xl uppercase mb-8 reveal">You May Also Like</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${PRODUCTS.filter(p=>p.id!==product.id).slice(0,4).map((p,i) => html`
              <div key=${p.id} class="product-card reveal reveal-d${i+1}" onClick=${()=>go('product',{product:p})}>
                <div class="card-img-wrap aspect-[3/4] bg-stone/10 mb-2">
                  <img src=${p.thumb} alt=${p.name} class="img-fade w-full h-full object-cover"/>
                </div>
                <p class="font-display text-xs tracking-wide uppercase">${p.name}</p>
                <p class="text-stone text-xs mt-0.5">$${p.price}</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   STORY PAGE
   ═══════════════════════════════════════════════════════════════ */
function StoryPage({ go }) {
  useReveal();
  useImageFade();

  return html`
    <div class="min-h-screen pt-20">
      <!-- Hero -->
      <div class="hero-wrap" style=${{minHeight:'60svh'}}>
        <img src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1400&q=85" alt="The eleven" class="hero-img img-fade"/>
        <div class="hero-overlay"/>
        <div class="absolute inset-0 z-10 flex flex-col">
          <div class="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 flex flex-col justify-between pt-24 pb-12">
            <p class="font-mono text-chalk/40 text-[10px] tracking-[0.3em] uppercase reveal">Est. 2023</p>
            <h1 class="font-display font-black text-chalk text-7xl sm:text-9xl lg:text-[13vw] uppercase leading-[0.87] reveal reveal-d1">Our Story</h1>
          </div>
        </div>
      </div>

      <!-- Origin -->
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <p class="font-display font-black text-4xl sm:text-5xl uppercase text-gold mb-8 reveal leading-none">It started in a group chat.</p>
        <div class="space-y-6 text-stone leading-relaxed">
          <p class="reveal">Eleven friends. One shared obsession with clothing that actually meant something. No investors sitting at the table. No committees. Just eleven people who'd been tight since day one, deciding to build a brand from nothing.</p>
          <p class="reveal reveal-d1">We pooled what we had — skills, time, and enough conviction to fill a room. Marcus handled creative. Zara mapped out the brand. Devon drove product. The rest of us filled every gap we could find. That's what Since Day Dot is: a brand built by its own people, from the jump.</p>
          <p class="reveal reveal-d2">The name isn't complicated. Since day dot means from the very beginning. It's a reminder that this brand was never built for an exit or a pitch deck. It was built for the people in that first group chat — and everyone who's carried it forward since.</p>
        </div>
      </section>

      <!-- Timeline -->
      <section class="bg-ink text-chalk py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
          <p class="font-mono text-gold text-[10px] tracking-widest uppercase mb-1 reveal">Timeline</p>
          <h2 class="font-display font-black text-6xl sm:text-7xl uppercase mb-14 reveal reveal-d1 leading-none">How We Got Here</h2>
          ${[
            { year:'2023', event:'Eleven founders agree on the name in a group chat at 2AM.' },
            { year:'Early 2024', event:'First sample run: 50 hoodies. Sold to friends and family in under 48 hours.' },
            { year:'Mid 2024', event:'Website launches. Member count hits 500 in the first month.' },
            { year:'Late 2024', event:'Volume I drop. 6 pieces. Sold out in 72 hours.' },
            { year:'2025', event:'1,000+ members. First collaboration confirmed. XI crest becomes the badge.' },
            { year:'2026', event:'Volume II in production. Community stronger than ever.' },
          ].map((t,i) => html`
            <div key=${i} class="flex gap-6 mb-10 reveal reveal-d${(i%4)+1}">
              <div class="flex flex-col items-center">
                <div class="step-dot bg-gold text-chalk w-8 h-8 text-xs font-mono">${i+1}</div>
                ${i<5 && html`<div class="w-px flex-1 bg-chalk/10 mt-2"/>`}
              </div>
              <div class="pb-10">
                <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">${t.year}</p>
                <p class="text-chalk/80 leading-relaxed">${t.event}</p>
              </div>
            </div>
          `)}
        </div>
      </section>

      <!-- Founders grid -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">The Eleven</p>
        <h2 class="font-display font-semibold text-5xl sm:text-6xl uppercase mb-12 reveal reveal-d1 leading-none">Who Built This</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          ${FOUNDERS.map((f,i) => html`
            <div key=${f.num} class="founder-card reveal reveal-d${(i%4)+1}">
              <div class="aspect-square overflow-hidden mb-3 bg-stone/10">
                <img src=${f.img} alt=${f.name} class="img-fade w-full h-full object-cover"/>
              </div>
              <p class="font-mono text-gold text-[10px] tracking-widest">${f.num}</p>
              <p class="font-display text-sm uppercase tracking-wide mt-0.5">${f.name}</p>
              <p class="text-stone text-xs mt-0.5">${f.role}</p>
            </div>
          `)}
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gold/10 border-t border-gold/20 py-20 text-center">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Your Turn</p>
        <h2 class="font-display font-black text-6xl sm:text-7xl uppercase mb-6 reveal reveal-d1 leading-none">Carry It Forward</h2>
        <p class="text-stone max-w-md mx-auto mb-8 reveal reveal-d2">You're not just buying a hoodie. You're joining the run. Every member number is a piece of the original story.</p>
        <div class="flex justify-center gap-4 flex-wrap reveal reveal-d3">
          <button onClick=${()=>go('shop')} class="bg-ink text-chalk font-display tracking-widest uppercase px-8 py-4 text-sm hover:bg-gold transition-colors t-btn">Shop Now</button>
          <button onClick=${()=>go('members')} class="border border-ink/30 font-display tracking-widest uppercase px-8 py-4 text-sm hover:bg-ink hover:text-chalk transition-colors t-btn">Become a Member</button>
        </div>
      </section>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   MEMBERS PAGE
   ═══════════════════════════════════════════════════════════════ */
function MembersPage({ go }) {
  useReveal();

  return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Community</p>
        <h1 class="font-display font-black text-7xl sm:text-9xl uppercase mb-4 reveal reveal-d1 leading-none">Members</h1>
        <p class="text-stone max-w-xl mb-14 reveal reveal-d2">No gatekeeping. Every member number is a permanent part of the archive. Choose your tier and carry it forward.</p>

        <!-- Tiers -->
        <div class="grid md:grid-cols-3 gap-6 mb-20">
          ${TIERS.map((t,i) => html`
            <div key=${t.name} class="reveal reveal-d${i+1} border ${t.gold?'border-gold bg-gold/5':'border-ink/15 bg-chalk'} p-8 relative">
              ${t.gold && html`
                <div class="absolute top-0 left-0 right-0 bg-gold text-chalk font-mono text-[9px] tracking-widest uppercase text-center py-1.5">
                  Most Popular
                </div>
              `}
              <div class="${t.gold?'mt-6':''}">
                <p class="font-mono text-[10px] tracking-widest uppercase text-stone mb-1">${t.num}</p>
                <h3 class="font-display text-2xl uppercase mb-1">${t.name}</h3>
                <p class="text-2xl font-semibold mb-6 ${t.gold?'text-gold':''}">${t.price}</p>
                <ul class="space-y-3 mb-8">
                  ${t.perks.map(p => html`
                    <li key=${p} class="flex items-start gap-3 text-sm">
                      <span class="text-gold mt-0.5 flex-shrink-0"><${Check} size=${15}/></span>
                      ${p}
                    </li>
                  `)}
                </ul>
                <button onClick=${()=>go('account')}
                        class="w-full font-display tracking-widest uppercase py-3.5 text-sm transition-colors t-btn
                               ${t.gold?'bg-gold text-chalk hover:bg-ink':'bg-ink text-chalk hover:bg-gold'}">
                  Join ${t.name}
                </button>
              </div>
            </div>
          `)}
        </div>

        <!-- Member count -->
        <div class="text-center bg-ink text-chalk py-16 reveal">
          <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">Live Count</p>
          <p class="font-display font-black" style=${{fontSize:'clamp(80px,14vw,180px)',lineHeight:'1'}}>${CONFIG.memberSeed}+</p>
          <p class="text-chalk/60 mt-2 font-mono text-sm tracking-wide">members and counting</p>
          <p class="text-chalk/50 text-xs mt-4 max-w-xs mx-auto">Every member number is permanent. The earlier you join, the lower your number.</p>
        </div>

        <!-- Perks overview -->
        <div class="py-20">
          <h2 class="font-display text-3xl uppercase mb-10 reveal">Why It Matters</h2>
          <div class="grid sm:grid-cols-2 gap-6">
            ${[
              { title:'Early Access',     body:'Drops go live for members first — usually 48 hours before the public.' },
              { title:'Member Exclusives', body:'Colourways and pieces that never hit general sale. Members only, always.' },
              { title:'Permanent Number', body:'Your member number is archived forever. First 100 are certified Day One.' },
              { title:'Community',        body:'IRL events, group chats, behind-the-scenes — the whole inner circle.' },
            ].map((p,i) => html`
              <div key=${i} class="border border-ink/10 p-6 reveal reveal-d${i+1}">
                <h3 class="font-display uppercase tracking-wide mb-2">${p.title}</h3>
                <p class="text-stone text-sm leading-relaxed">${p.body}</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   COUNTDOWN HOOK
   ═══════════════════════════════════════════════════════════════ */
function useCountdown(targetISO) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick   = () => setDiff(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const secs  = Math.floor(diff / 1000);
  const days  = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const mins  = Math.floor((secs % 3600) / 60);
  const sec   = secs % 60;
  return { days, hours, mins, sec, done: diff <= 0 };
}

function CountdownUnit({ value, label }) {
  return html`
    <div class="countdown-unit text-center">
      <div class="text-4xl sm:text-5xl font-bold text-gold">${String(value).padStart(2,'0')}</div>
      <div class="font-mono text-[9px] tracking-widest uppercase text-chalk/50 mt-1">${label}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   DROPS PAGE
   ═══════════════════════════════════════════════════════════════ */
function DropsPage({ go }) {
  useReveal();
  useImageFade();
  const ct1 = useCountdown(DROPS[0].date);
  const ct2 = useCountdown(DROPS[1].date);
  const cts  = [ct1, ct2];

  return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Upcoming</p>
        <h1 class="font-display font-black text-7xl sm:text-9xl uppercase mb-4 reveal reveal-d1 leading-none">Drops</h1>
        <p class="text-stone max-w-md mb-14 reveal reveal-d2">Members get access first. Sign up for the newsletter so you never miss a drop window.</p>

        <div class="space-y-16">
          ${DROPS.map((d,i) => html`
            <div key=${i} class="reveal reveal-d${i+1}">
              <div class="relative aspect-video sm:aspect-[16/6] overflow-hidden mb-8">
                <img src=${d.img} alt=${d.name} class="img-fade w-full h-full object-cover"/>
                <div class="absolute inset-0 bg-black/50"/>
                <div class="absolute top-4 left-4">
                  <span class="font-mono text-[9px] tracking-widest uppercase bg-gold text-chalk px-3 py-1.5">${d.tag}</span>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <h2 class="font-display text-chalk text-2xl sm:text-3xl uppercase mb-6">${d.name}</h2>
                    ${cts[i].done ? html`
                      <p class="font-display text-gold tracking-widest uppercase text-sm">Drop Is Live</p>
                    ` : html`
                      <div class="flex items-center justify-center gap-4 sm:gap-8">
                        <${CountdownUnit} value=${cts[i].days}  label="Days"/>
                        <span class="text-chalk/40 font-mono text-2xl">:</span>
                        <${CountdownUnit} value=${cts[i].hours} label="Hours"/>
                        <span class="text-chalk/40 font-mono text-2xl">:</span>
                        <${CountdownUnit} value=${cts[i].mins}  label="Mins"/>
                        <span class="text-chalk/40 font-mono text-2xl">:</span>
                        <${CountdownUnit} value=${cts[i].sec}   label="Secs"/>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Notify CTA -->
        <div class="bg-gold/10 border border-gold/20 p-10 text-center mt-16 reveal">
          <p class="font-mono text-xs text-gold tracking-widest uppercase mb-2">Be First</p>
          <h2 class="font-display text-3xl uppercase mb-4">Get Drop Alerts</h2>
          <p class="text-stone mb-8 max-w-sm mx-auto text-sm">Join the newsletter and get notified the moment a drop goes live. Members always go first.</p>
          <button onClick=${()=>go('newsletter')}
                  class="bg-ink text-chalk font-display tracking-widest uppercase px-10 py-4 text-sm hover:bg-gold transition-colors t-btn">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER PAGE
   ═══════════════════════════════════════════════════════════════ */
function NewsletterPage() {
  useReveal();
  const [form,    setForm]    = useState({ name:'', email:'', pref:'drops' });
  const [status,  setStatus]  = useState('idle'); // idle | loading | done
  const [scMsg,   setScMsg]   = useState('');

  function set(k,v) { setForm(f=>({...f,[k]:v})); setScMsg(''); }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim())  { setScMsg('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setScMsg('Please enter a valid email.'); return; }
    setStatus('loading');
    setTimeout(() => setStatus('done'), 1400);
  }

  if (status==='done') return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center py-20">
        <div class="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
          <${Mail} size=${28}/>
        </div>
        <h2 class="font-display text-3xl uppercase mb-3">You're In</h2>
        <p class="text-stone mb-2">Welcome to the inner circle, <strong>${form.name}</strong>.</p>
        <p class="text-stone text-sm mb-8">Check <strong>${form.email}</strong> — your welcome email is on the way. Drop alerts go to members first.</p>
        <p class="font-mono text-[10px] text-stone/50 tracking-widest uppercase">(Demo mode — no real email sent)</p>
      </div>
    </div>
  `;

  return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <p class="font-mono text-[10px] text-stone tracking-widest uppercase mb-1 reveal">Inner Circle</p>
        <h1 class="font-display font-semibold text-5xl sm:text-6xl uppercase mb-4 reveal reveal-d1 leading-none">Newsletter</h1>
        <p class="text-stone max-w-md mb-10 reveal reveal-d2">Drop alerts, member exclusives, and behind-the-scenes. No noise. Only signal.</p>

        <form onSubmit=${submit} class="space-y-5 reveal reveal-d3" noValidate>
          <div>
            <label class="f-label" htmlFor="nl-name">Your Name</label>
            <input id="nl-name" class="f-input" type="text" placeholder="First name" value=${form.name} onInput=${e=>set('name',e.target.value)}/>
          </div>
          <div>
            <label class="f-label" htmlFor="nl-email">Email Address</label>
            <input id="nl-email" class="f-input" type="email" placeholder="you@email.com" value=${form.email} onInput=${e=>set('email',e.target.value)}/>
          </div>
          <div>
            <label class="f-label" htmlFor="nl-pref">I mainly want</label>
            <select id="nl-pref" class="f-input f-select" value=${form.pref} onChange=${e=>set('pref',e.target.value)}>
              <option value="drops">Drop alerts (first access)</option>
              <option value="community">Community & events</option>
              <option value="both">Everything</option>
            </select>
          </div>
          ${scMsg && html`<p class="text-red-600 text-xs font-mono">${scMsg}</p>`}
          <button type="submit" disabled=${status==='loading'}
                  class="w-full bg-ink text-chalk font-display tracking-widest uppercase py-4 text-sm hover:bg-gold transition-colors t-btn disabled:opacity-50">
            ${status==='loading'?'Subscribing…':'Subscribe'}
          </button>
          <p class="text-[10px] text-stone/50 font-mono tracking-wide text-center">No spam. Unsubscribe any time. Member emails always go first.</p>
        </form>

        <!-- Perks callout -->
        <div class="grid sm:grid-cols-3 gap-4 mt-16">
          ${[
            { icon:html`<${Mail} size=${22}/>`, title:'Drop Alerts',   body:'First to know, first to cop.' },
            { icon:html`<${Star} filled size=${22}/>`, title:'Exclusives', body:'Content that never goes public.' },
            { icon:html`<${Check} size=${22}/>`, title:'No Spam',      body:'Only what actually matters.' },
          ].map((p,i) => html`
            <div key=${i} class="border border-ink/10 p-5 text-center reveal reveal-d${i+1}">
              <div class="text-gold mb-2 flex justify-center">${p.icon}</div>
              <p class="font-display text-xs uppercase tracking-wide mb-1">${p.title}</p>
              <p class="text-stone text-xs">${p.body}</p>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   ACCOUNT PAGE
   ═══════════════════════════════════════════════════════════════ */
function AccountPage({ go }) {
  useReveal();
  const [user,       setUser]       = useState(safeUser);
  const [view,       setView]       = useState('login'); // login | signup | dashboard | verify
  const [form,       setForm]       = useState({ name:'', email:'', password:'' });
  const [err,        setErr]        = useState('');
  const [loading,    setLoading]    = useState(false);

  function setF(k,v) { setForm(f=>({...f,[k]:v})); setErr(''); }

  function login(e) {
    e.preventDefault();
    setErr('');
    const s = getStored();
    if (!s || s.email !== form.email) { setErr('No account found with that email.'); return; }
    if (s.pw !== hashPw(form.password)) { setErr('Incorrect password.'); return; }
    const { pw: _, ...safe } = s;
    setUser(safe);
    setView('dashboard');
  }

  function signup(e) {
    e.preventDefault();
    setErr('');
    if (!form.name.trim()) { setErr('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email.'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const record = { name: form.name.trim(), email: form.email, pw: hashPw(form.password), verified: false, joined: new Date().toISOString() };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(record));
      const { pw: _, ...safe } = record;
      setUser(safe);
      setView('verify');
      setLoading(false);
    }, 800);
  }

  function simulateVerify() {
    const s = getStored();
    if (!s) return;
    const updated = { ...s, verified: true };
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(updated));
    const { pw: _, ...safe } = updated;
    setUser(safe);
    setView('dashboard');
  }

  function logout() {
    localStorage.removeItem(CONFIG.storageKey);
    setUser(null);
    setView('login');
    setForm({ name:'', email:'', password:'' });
  }

  /* ── VERIFY SCREEN ── */
  if (view==='verify') return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center py-20">
        <div class="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
          <${Mail} size=${28}/>
        </div>
        <h2 class="font-display text-3xl uppercase mb-3">Check Your Email</h2>
        <p class="text-stone mb-2">We sent a verification link to <strong>${user?.email}</strong>.</p>
        <p class="text-stone text-sm mb-8">Click the link in the email to activate your account.</p>
        <button onClick=${simulateVerify}
                class="bg-gold text-chalk font-display tracking-widest uppercase px-8 py-3.5 text-sm hover:bg-ink transition-colors t-btn mb-3 w-full">
          ✓ Simulate Email Click (Demo)
        </button>
        <p class="text-[10px] text-stone/40 font-mono">Real email verification requires a backend service.</p>
      </div>
    </div>
  `;

  /* ── DASHBOARD ── */
  if (user && view==='dashboard') return html`
    <div class="min-h-screen pt-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div class="flex items-start justify-between mb-10">
          <div>
            <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">Member</p>
            <h1 class="font-display text-4xl uppercase">Hey, ${user.name.split(' ')[0]}</h1>
            ${!user.verified && html`
              <p class="text-amber-600 text-xs mt-2 font-mono">⚠ Email not verified — <button onClick=${()=>setView('verify')} class="underline">verify now</button></p>
            `}
          </div>
          <button onClick=${logout} class="font-mono text-xs tracking-widest uppercase text-stone hover:text-ink transition-colors border border-ink/15 px-4 py-2">Logout</button>
        </div>

        <!-- Member card -->
        <div class="bg-ink text-chalk p-8 mb-8 relative overflow-hidden reveal">
          <div class="absolute top-0 right-0 text-chalk/3 font-display font-bold text-[8rem] leading-none select-none">XI</div>
          <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">Since Day Dot</p>
          <p class="font-display text-2xl uppercase mb-1">${user.name}</p>
          <p class="text-chalk/60 text-sm">${user.email}</p>
          <p class="font-mono text-xs text-gold mt-4">
            Member since ${new Date(user.joined).toLocaleDateString('en-CA',{year:'numeric',month:'long'})}
          </p>
          ${user.verified && html`<p class="font-mono text-[9px] text-green-400 tracking-widest uppercase mt-2">✓ Verified</p>`}
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-10 reveal reveal-d1">
          ${[['Orders','0'],['Points','0'],['Tier','Day One']].map(([l,v])=>html`
            <div key=${l} class="border border-ink/10 p-5 text-center">
              <p class="font-display text-2xl">${v}</p>
              <p class="font-mono text-[9px] tracking-widest uppercase text-stone mt-1">${l}</p>
            </div>
          `)}
        </div>

        <!-- Empty orders -->
        <div class="border border-ink/10 p-8 text-center reveal reveal-d2">
          <p class="font-display uppercase tracking-wide text-sm mb-2">No Orders Yet</p>
          <p class="text-stone text-sm mb-5">Your order history will appear here.</p>
          <button onClick=${()=>go('shop')} class="bg-ink text-chalk font-display tracking-widest uppercase px-8 py-3 text-sm hover:bg-gold transition-colors t-btn">
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  `;

  /* ── LOGIN / SIGNUP FORM ── */
  const isLogin = view === 'login';
  return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4">
      <div class="w-full max-w-md py-16">
        <p class="font-mono text-stone text-[10px] tracking-widest uppercase mb-1 text-center">Account</p>
        <h1 class="font-display font-black text-6xl sm:text-7xl uppercase text-center mb-8 leading-none">${isLogin?'Sign In':'Join SDD'}</h1>

        <form onSubmit=${isLogin?login:signup} class="space-y-4" noValidate>
          ${!isLogin && html`
            <div>
              <label class="f-label" htmlFor="ac-name">Full Name</label>
              <input id="ac-name" class="f-input" type="text" placeholder="Your name" value=${form.name} onInput=${e=>setF('name',e.target.value)}/>
            </div>
          `}
          <div>
            <label class="f-label" htmlFor="ac-email">Email</label>
            <input id="ac-email" class="f-input" type="email" placeholder="you@email.com" value=${form.email} onInput=${e=>setF('email',e.target.value)}/>
          </div>
          <div>
            <label class="f-label" htmlFor="ac-pw">Password</label>
            <input id="ac-pw" class="f-input" type="password" placeholder=${isLogin?'Your password':'Min. 6 characters'} value=${form.password} onInput=${e=>setF('password',e.target.value)}/>
          </div>
          ${err && html`<p class="text-red-600 text-xs font-mono">${err}</p>`}
          <button type="submit" disabled=${loading}
                  class="w-full bg-ink text-chalk font-display tracking-widest uppercase py-4 text-sm hover:bg-gold transition-colors t-btn disabled:opacity-50 mt-2">
            ${loading?'Please wait…':(isLogin?'Sign In':'Create Account')}
          </button>
        </form>

        <p class="text-center text-stone text-sm mt-6">
          ${isLogin?'New here?':'Already have an account?'}${' '}
          <button onClick=${()=>{setView(isLogin?'signup':'login');setErr('');}} class="underline hover:text-ink transition-colors">
            ${isLogin?'Create an account':'Sign in'}
          </button>
        </p>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   CHECKOUT
   ═══════════════════════════════════════════════════════════════ */
const PROVINCES = [
  'Alberta','British Columbia','Manitoba','New Brunswick',
  'Newfoundland and Labrador','Nova Scotia','Ontario',
  'Prince Edward Island','Quebec','Saskatchewan',
];

function Checkout({ go, onOrder }) {
  const { items, subtotal, clearCart } = useContext(CartCtx);
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', apt:'', city:'', province:'Ontario', postal:'',
    cardName:'', cardNum:'', expiry:'', cvv:'',
  });
  const [err, setErr] = useState({});

  const shipping = subtotal >= CONFIG.freeShipping ? 0 : CONFIG.shipping;
  const tax      = (subtotal + shipping) * CONFIG.taxRate;
  const total    = subtotal + shipping + tax;

  function setF(k,v) { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:''})); }

  function fmtCard(v)   { return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim(); }
  function fmtExpiry(v) { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2?d.slice(0,2)+'/'+d.slice(2):d; }

  function validateContact() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    return e;
  }

  function validateShipping() {
    const e = {};
    if (!form.address.trim()) e.address  = 'Required';
    if (!form.city.trim())    e.city     = 'Required';
    if (!form.province)       e.province = 'Required';
    if (form.postal.replace(/\s/g,'').length !== 6) e.postal = 'Valid 6-character postal code required';
    return e;
  }

  function validatePayment() {
    const e = {};
    if (!form.cardName.trim())                           e.cardName = 'Required';
    if (form.cardNum.replace(/\s/g,'').length !== 16)    e.cardNum  = 'Valid 16-digit card number required';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))             e.expiry   = 'MM/YY format required';
    if (form.cvv.replace(/\D/g,'').length < 3)           e.cvv      = 'Valid CVV required';
    return e;
  }

  function nextStep() {
    let e = {};
    if (step === 1) e = { ...validateContact(), ...validateShipping() };
    if (step === 2) e = validatePayment();
    if (Object.keys(e).length > 0) { setErr(e); return; }
    setStep(s => s + 1);
  }

  function placeOrder() {
    setLoading(true);
    const snapshot = [...items];
    setTimeout(() => {
      const orderNum = 'SDD-' + Math.floor(100000 + Math.random() * 900000);
      clearCart();
      onOrder({ orderNum, name: form.firstName, email: form.email, items: snapshot, total });
      go('order-confirmed');
    }, 1600);
  }

  if (items.length === 0 && !loading) return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4 text-center">
      <div>
        <h2 class="font-display text-3xl uppercase mb-4">Your Bag Is Empty</h2>
        <button onClick=${()=>go('shop')} class="bg-ink text-chalk font-display tracking-widest uppercase px-8 py-3.5 text-sm hover:bg-gold transition-colors t-btn">
          Back to Shop
        </button>
      </div>
    </div>
  `;

  const stepLabels = ['Contact & Shipping','Payment','Review'];

  return html`
    <div class="min-h-screen pt-20 bg-chalk">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <!-- Steps -->
        <div class="flex items-center gap-3 mb-12">
          ${stepLabels.flatMap((l,i)=>[
            html`<div key=${'s'+i} class="flex items-center gap-2">
              <div class="step-dot ${step>i+1?'bg-gold text-chalk':step===i+1?'bg-ink text-chalk':'bg-ink/10 text-stone'}">
                ${step>i+1?html`<${Check} size=${14}/>`:(i+1)}
              </div>
              <span class="hidden sm:block font-mono text-[9px] tracking-widest uppercase ${step===i+1?'text-ink':'text-stone'}">${l}</span>
            </div>`,
            i<2 ? html`<div key=${'d'+i} class="flex-1 h-px ${step>i+1?'bg-gold':'bg-ink/10'}"/>` : null,
          ]).filter(Boolean)}
        </div>

        <div class="grid lg:grid-cols-[1fr_360px] gap-10">
          <!-- Form area -->
          <div>
            ${step===1 && html`
              <div class="space-y-6">
                <h2 class="font-display text-2xl uppercase">Contact</h2>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="f-label" htmlFor="ch-fn">First Name</label>
                    <input id="ch-fn" class="f-input ${err.firstName?'border-red-500':''}" type="text" value=${form.firstName} onInput=${e=>setF('firstName',e.target.value)}/>
                    ${err.firstName&&html`<p class="text-red-500 text-xs mt-1">${err.firstName}</p>`}
                  </div>
                  <div>
                    <label class="f-label" htmlFor="ch-ln">Last Name</label>
                    <input id="ch-ln" class="f-input ${err.lastName?'border-red-500':''}" type="text" value=${form.lastName} onInput=${e=>setF('lastName',e.target.value)}/>
                    ${err.lastName&&html`<p class="text-red-500 text-xs mt-1">${err.lastName}</p>`}
                  </div>
                </div>
                <div>
                  <label class="f-label" htmlFor="ch-em">Email</label>
                  <input id="ch-em" class="f-input ${err.email?'border-red-500':''}" type="email" value=${form.email} onInput=${e=>setF('email',e.target.value)}/>
                  ${err.email&&html`<p class="text-red-500 text-xs mt-1">${err.email}</p>`}
                </div>
                <div>
                  <label class="f-label" htmlFor="ch-ph">Phone (optional)</label>
                  <input id="ch-ph" class="f-input" type="tel" value=${form.phone} onInput=${e=>setF('phone',e.target.value)}/>
                </div>

                <h2 class="font-display text-2xl uppercase pt-4">Shipping</h2>
                <div>
                  <label class="f-label" htmlFor="ch-addr">Address</label>
                  <input id="ch-addr" class="f-input ${err.address?'border-red-500':''}" type="text" placeholder="Street address" value=${form.address} onInput=${e=>setF('address',e.target.value)}/>
                  ${err.address&&html`<p class="text-red-500 text-xs mt-1">${err.address}</p>`}
                </div>
                <div>
                  <label class="f-label" htmlFor="ch-apt">Apt / Suite (optional)</label>
                  <input id="ch-apt" class="f-input" type="text" value=${form.apt} onInput=${e=>setF('apt',e.target.value)}/>
                </div>
                <div class="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label class="f-label" htmlFor="ch-city">City</label>
                    <input id="ch-city" class="f-input ${err.city?'border-red-500':''}" type="text" value=${form.city} onInput=${e=>setF('city',e.target.value)}/>
                    ${err.city&&html`<p class="text-red-500 text-xs mt-1">${err.city}</p>`}
                  </div>
                  <div>
                    <label class="f-label" htmlFor="ch-prov">Province</label>
                    <select id="ch-prov" class="f-input f-select" value=${form.province} onChange=${e=>setF('province',e.target.value)}>
                      ${PROVINCES.map(p=>html`<option key=${p} value=${p}>${p}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label class="f-label" htmlFor="ch-post">Postal Code</label>
                    <input id="ch-post" class="f-input ${err.postal?'border-red-500':''}" type="text" placeholder="A1A 1A1" maxLength="7" value=${form.postal} onInput=${e=>setF('postal',e.target.value)}/>
                    ${err.postal&&html`<p class="text-red-500 text-xs mt-1">${err.postal}</p>`}
                  </div>
                </div>
              </div>
            `}

            ${step===2 && html`
              <div class="space-y-6">
                <h2 class="font-display text-2xl uppercase">Payment</h2>
                <div class="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 font-mono">
                  DEMO MODE — No real payment is processed. Use any card number.
                </div>
                <div>
                  <label class="f-label" htmlFor="ch-cn">Name on Card</label>
                  <input id="ch-cn" class="f-input ${err.cardName?'border-red-500':''}" type="text" value=${form.cardName} onInput=${e=>setF('cardName',e.target.value)}/>
                  ${err.cardName&&html`<p class="text-red-500 text-xs mt-1">${err.cardName}</p>`}
                </div>
                <div>
                  <label class="f-label" htmlFor="ch-cnum">Card Number</label>
                  <input id="ch-cnum" class="f-input f-mono ${err.cardNum?'border-red-500':''}" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength="19"
                         value=${form.cardNum} onInput=${e=>setF('cardNum',fmtCard(e.target.value))}/>
                  ${err.cardNum&&html`<p class="text-red-500 text-xs mt-1">${err.cardNum}</p>`}
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="f-label" htmlFor="ch-exp">Expiry</label>
                    <input id="ch-exp" class="f-input ${err.expiry?'border-red-500':''}" type="text" inputMode="numeric" placeholder="MM/YY" maxLength="5"
                           value=${form.expiry} onInput=${e=>setF('expiry',fmtExpiry(e.target.value))}/>
                    ${err.expiry&&html`<p class="text-red-500 text-xs mt-1">${err.expiry}</p>`}
                  </div>
                  <div>
                    <label class="f-label" htmlFor="ch-cvv">CVV</label>
                    <input id="ch-cvv" class="f-input ${err.cvv?'border-red-500':''}" type="text" inputMode="numeric" placeholder="123" maxLength="4"
                           value=${form.cvv} onInput=${e=>setF('cvv',e.target.value.replace(/\D/g,'').slice(0,4))}/>
                    ${err.cvv&&html`<p class="text-red-500 text-xs mt-1">${err.cvv}</p>`}
                  </div>
                </div>
              </div>
            `}

            ${step===3 && html`
              <div class="space-y-6">
                <h2 class="font-display text-2xl uppercase">Review Order</h2>
                <div class="border border-ink/10 divide-y divide-ink/8">
                  <div class="p-4">
                    <p class="font-mono text-[9px] tracking-widest uppercase text-stone mb-2">Shipping to</p>
                    <p class="text-sm">${form.firstName} ${form.lastName}</p>
                    <p class="text-sm text-stone">${form.address}${form.apt?', '+form.apt:''}, ${form.city}, ${form.province} ${form.postal}</p>
                  </div>
                  <div class="p-4">
                    <p class="font-mono text-[9px] tracking-widest uppercase text-stone mb-2">Payment</p>
                    <p class="text-sm">Card ending in ${form.cardNum.slice(-4)}</p>
                  </div>
                </div>
                ${items.map(item => html`
                  <div key=${item.key} class="flex gap-4 py-3 border-b border-ink/8">
                    <img src=${item.product.thumb} alt=${item.product.name} class="w-16 h-16 object-cover"/>
                    <div class="flex-1">
                      <p class="font-display text-sm uppercase">${item.product.name}</p>
                      <p class="text-xs text-stone">${item.size} · ${item.color} · Qty ${item.qty}</p>
                    </div>
                    <p class="text-sm font-semibold">$${(item.product.price*item.qty).toFixed(2)}</p>
                  </div>
                `)}
              </div>
            `}

            <!-- Nav buttons -->
            <div class="flex gap-4 mt-8">
              ${step>1 && html`
                <button onClick=${()=>setStep(s=>s-1)}
                        class="border border-ink/20 font-display tracking-widest uppercase px-6 py-3.5 text-sm hover:bg-ink hover:text-chalk transition-colors t-btn">
                  Back
                </button>
              `}
              ${step<3 ? html`
                <button onClick=${nextStep}
                        class="flex-1 bg-ink text-chalk font-display tracking-widest uppercase py-3.5 text-sm hover:bg-gold transition-colors t-btn">
                  Continue
                </button>
              ` : html`
                <button onClick=${placeOrder} disabled=${loading}
                        class="flex-1 bg-gold text-chalk font-display tracking-widest uppercase py-3.5 text-sm hover:bg-ink transition-colors t-btn disabled:opacity-60">
                  ${loading ? 'Processing…' : `Place Order — $${total.toFixed(2)}`}
                </button>
              `}
            </div>
          </div>

          <!-- Order summary sidebar -->
          <div class="bg-bone border border-ink/10 p-6 h-fit">
            <h3 class="font-display text-sm uppercase tracking-wide mb-4">Order Summary</h3>
            ${items.map(i=>html`
              <div key=${i.key} class="flex justify-between text-xs py-2 border-b border-ink/8">
                <span class="text-stone">${i.product.name} × ${i.qty}</span>
                <span>$${(i.product.price*i.qty).toFixed(2)}</span>
              </div>
            `)}
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-stone">Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
              <div class="flex justify-between">
                <span class="text-stone">Shipping</span>
                ${shipping===0?html`<span class="text-green-700 font-semibold">Free</span>`:`$${shipping.toFixed(2)}`}
              </div>
              <div class="flex justify-between"><span class="text-stone">HST (13%)</span><span>$${tax.toFixed(2)}</span></div>
              <div class="flex justify-between font-semibold text-base pt-2 border-t border-ink/10">
                <span>Total</span><span>$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   ORDER CONFIRMED
   ═══════════════════════════════════════════════════════════════ */
function OrderConfirmed({ order, go }) {
  if (!order) return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4 text-center">
      <div>
        <h2 class="font-display text-3xl uppercase mb-4">Nothing to show here</h2>
        <button onClick=${()=>go('shop')} class="bg-ink text-chalk font-display tracking-widest uppercase px-8 py-3.5 text-sm hover:bg-gold transition-colors t-btn">
          Back to Shop
        </button>
      </div>
    </div>
  `;

  return html`
    <div class="min-h-screen pt-20 flex items-center justify-center px-4">
      <div class="max-w-lg w-full py-16 text-center">
        <div class="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
          <${Check} size=${28}/>
        </div>
        <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">Confirmed</p>
        <h1 class="font-display text-4xl uppercase mb-3">Order Placed</h1>
        <p class="text-stone mb-1">Thanks, <strong>${order.name}</strong>. Your order is on its way.</p>
        <p class="font-mono text-sm text-gold mb-6">${order.orderNum}</p>

        <div class="border border-ink/10 p-6 mb-8 text-left">
          <p class="font-mono text-[9px] tracking-widest uppercase text-stone mb-3">What you ordered</p>
          ${order.items.map(i => html`
            <div key=${i.key} class="flex justify-between text-sm py-2 border-b border-ink/6 last:border-0">
              <span>${i.product.name} × ${i.qty} <span class="text-stone">(${i.size})</span></span>
              <span>$${(i.product.price*i.qty).toFixed(2)}</span>
            </div>
          `)}
          <div class="flex justify-between font-semibold text-sm pt-3">
            <span>Total</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
        </div>

        <p class="text-stone text-xs mb-8 font-mono">(Demo mode — no real order was placed or charged)</p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick=${()=>go('shop')}
                  class="bg-ink text-chalk font-display tracking-widest uppercase px-8 py-3.5 text-sm hover:bg-gold transition-colors t-btn">
            Continue Shopping
          </button>
          <button onClick=${()=>go('account')}
                  class="border border-ink/20 font-display tracking-widest uppercase px-8 py-3.5 text-sm hover:bg-ink hover:text-chalk transition-colors t-btn">
            My Account
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   APP ROUTER
   ═══════════════════════════════════════════════════════════════ */
function App() {
  const [page,  setPage]  = useState('home');
  const [data,  setData]  = useState({});
  const [order, setOrder] = useState(null);

  function go(target, extra = {}) {
    setData(extra);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const showNav = page !== 'checkout' && page !== 'order-confirmed';

  return html`
    <${CartProvider}>
      ${showNav && html`<${Nav} go=${go} page=${page}/>`}

      ${page === 'home'           && html`<${Home}          go=${go}/>`}
      ${page === 'shop'           && html`<${Shop}          go=${go}/>`}
      ${page === 'product'        && html`<${PDP}           go=${go} product=${data.product || PRODUCTS[0]}/>`}
      ${page === 'story'          && html`<${StoryPage}     go=${go}/>`}
      ${page === 'members'        && html`<${MembersPage}   go=${go}/>`}
      ${page === 'drops'          && html`<${DropsPage}     go=${go}/>`}
      ${page === 'newsletter'     && html`<${NewsletterPage}/>`}
      ${page === 'account'        && html`<${AccountPage}   go=${go}/>`}
      ${page === 'checkout'       && html`<${Checkout}      go=${go} onOrder=${o=>{setOrder(o);}}/>`}
      ${page === 'order-confirmed'&& html`<${OrderConfirmed} go=${go} order=${order}/>`}
    </>
  `;
}

/* ═══════════════════════════════════════════════════════════════
   MOUNT
   ═══════════════════════════════════════════════════════════════ */
createRoot(document.getElementById('root')).render(html`<${App}/>`);
