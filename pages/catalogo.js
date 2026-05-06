import Head from "next/head";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const CATEGORY_CONFIG = {
  todos: { label: "Todos", emoji: "✦" },
  salud: { label: "Salud", emoji: "🩺", bg: "rgba(48,209,88,0.15)", color: "#30D158" },
  viajes: { label: "Viajes", emoji: "✈️", bg: "rgba(10,132,255,0.15)", color: "#0A84FF" },
  inmobiliario: { label: "Inmobiliario", emoji: "🏠", bg: "rgba(255,159,10,0.15)", color: "#FF9F0A" },
  finanzas: { label: "Finanzas", emoji: "💰", bg: "rgba(191,90,242,0.15)", color: "#BF5AF2" },
  trabajo: { label: "Trabajo", emoji: "💼", bg: "rgba(255,107,74,0.15)", color: "#FF6B4A" },
  familia: { label: "Familia", emoji: "👨‍👩‍👧", bg: "rgba(255,214,10,0.15)", color: "#FFD60A" },
  legal: { label: "Legal", emoji: "⚖️", bg: "rgba(100,210,255,0.15)", color: "#64D2FF" },
  bienestar: { label: "Bienestar", emoji: "🌿", bg: "rgba(48,209,88,0.15)", color: "#30D158" },
  emprender: { label: "Emprender", emoji: "🚀", bg: "rgba(255,107,74,0.15)", color: "#FF6B4A" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: #F8F7FF; color: #1A1A2E; overflow-x: hidden; }

  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); height: 66px; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #E8E8F5; }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.45rem; font-weight: 900; color: #1A1A2E; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-link { font-size: .88rem; font-weight: 700; color: #4A4A6A; text-decoration: none; padding: 10px 20px; border-radius: 100px; border: 1.5px solid #E0E0F0; background: white; transition: all .2s; }
  .nav-link:hover { border-color: #5B4BF5; color: #5B4BF5; }
  .nav-cta { background: #FF6B4A; color: white; font-size: .88rem; font-weight: 800; padding: 10px 22px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); }

  .hero { background: #5B4BF5; padding: 100px clamp(1.5rem,5vw,4rem) 60px; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 30%, rgba(255,107,74,0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 80% 70%, rgba(48,209,88,0.1) 0%, transparent 55%); pointer-events: none; }
  .hero > * { position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); font-size: .78rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; padding: 8px 20px; border-radius: 100px; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.2); }
  .hero h1 { font-family: 'Nunito', sans-serif; font-size: clamp(2rem,5vw,3.2rem); font-weight: 900; color: white; line-height: 1.1; letter-spacing: -.025em; margin-bottom: .8rem; }
  .hero h1 em { font-style: normal; color: #FFD166; }
  .hero-sub { font-size: 1rem; color: rgba(255,255,255,.7); max-width: 520px; margin: 0 auto 2rem; line-height: 1.7; font-weight: 600; }
  .hero-stats { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
  .hero-stat { text-align: center; }
  .hero-stat-n { font-family: 'Nunito', sans-serif; font-size: 1.6rem; font-weight: 900; color: #FFD166; }
  .hero-stat-l { font-size: .75rem; font-weight: 600; color: rgba(255,255,255,.5); margin-top: 2px; }

  .main { max-width: 1200px; margin: 0 auto; padding: 3rem clamp(1.5rem,5vw,4rem) 6rem; }

  .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .filter-pill { padding: 9px 20px; border-radius: 100px; border: 1.5px solid #E0E0F0; background: white; font-family: 'Nunito', sans-serif; font-size: .88rem; font-weight: 700; color: #4A4A6A; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 6px; }
  .filter-pill:hover { border-color: #5B4BF5; color: #5B4BF5; }
  .filter-pill.active { background: #5B4BF5; border-color: #5B4BF5; color: white; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

  .card { background: white; border-radius: 24px; border: 2px solid #E8E8F5; padding: 28px; padding-bottom: 32px; cursor: pointer; transition: all .25s; position: relative; overflow: hidden; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(91,75,245,.12); border-color: #C8C8F5; }
  .card:hover .card-hover-prices { opacity: 1; transform: translateY(0); }
  .card:hover .card-footer { opacity: 0; pointer-events: none; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
  .card-badge { font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; text-transform: capitalize; letter-spacing: .03em; }
  .card-uses { font-size: .75rem; font-weight: 800; color: #5B4BF5; background: #F0EEFF; padding: 3px 10px; border-radius: 100px; }
  .card-popular { font-size: .72rem; font-weight: 800; color: white; background: linear-gradient(135deg, #FF6B4A, #FF9F0A); padding: 3px 10px; border-radius: 100px; }
  .card h3 { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: #1A1A2E; margin-bottom: .4rem; line-height: 1.3; letter-spacing: -.01em; }
  .card-subtitle { font-size: .85rem; font-weight: 600; color: #8A8AAA; margin-bottom: 1rem; }
  .card-preview { font-size: .85rem; font-weight: 600; color: #4A4A6A; line-height: 1.6; margin-bottom: 1.25rem; font-style: italic; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; transition: opacity .2s; }
  .card-price { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: #1A1A2E; }
  .card-btn { background: #5B4BF5; color: white; font-family: 'Nunito', sans-serif; font-size: .82rem; font-weight: 800; padding: 8px 18px; border-radius: 100px; border: none; cursor: pointer; transition: all .2s; }
  .card-btn:hover { background: #4A3AE0; transform: translateY(-1px); }

  /* HOVER PRICES — aparecen al hover */
  .card-hover-prices { position: absolute; bottom: 0; left: 0; right: 0; background: white; border-top: 1.5px solid #E8E8F5; padding: 16px 28px; display: flex; flex-direction: column; gap: 8px; opacity: 0; transform: translateY(8px); transition: all .22s ease; pointer-events: none; }
  .card:hover .card-hover-prices { pointer-events: auto; }
  .hover-btn { width: 100%; padding: 10px 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .85rem; font-weight: 800; transition: all .2s; text-align: center; }
  .hover-btn-prompt { background: #F0EEFF; color: #5B4BF5; }
  .hover-btn-prompt:hover { background: #E0DCFF; }
  .hover-btn-consult { background: #5B4BF5; color: white; box-shadow: 0 4px 14px rgba(91,75,245,.3); }
  .hover-btn-consult:hover { background: #4A3AE0; transform: translateY(-1px); }

  /* GENERIC CARD — ancho completo, estilo especial */
  .card-generic { background: linear-gradient(135deg, #5B4BF5 0%, #7C6BFF 100%); border: none; color: white; grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding: 28px 32px; }
  .card-generic:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(91,75,245,.35); border-color: transparent; }
  .card-generic:hover .card-hover-prices { background: rgba(255,255,255,.08); border-top-color: rgba(255,255,255,.15); }
  .card-generic:hover .hover-btn-prompt { background: rgba(255,255,255,.15); color: white; }
  .card-generic:hover .hover-btn-consult { background: #FF6B4A; box-shadow: 0 4px 14px rgba(255,107,74,.4); }
  .card-generic h3 { color: white; font-size: 1.2rem; }
  .card-generic .card-subtitle { color: rgba(255,255,255,.7); margin-bottom: 0; }
  .card-generic .card-badge { background: rgba(255,255,255,.15); color: white; }
  .card-generic .card-uses { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); }
  .card-generic .card-price { color: white; }
  .card-generic .card-preview { color: rgba(255,255,255,.75); }
  .card-generic .card-btn { background: white; color: #5B4BF5; }
  .card-generic-left { flex: 1; min-width: 240px; }
  .card-generic-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .card-generic-tag { font-size: .75rem; font-weight: 800; background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); padding: 4px 12px; border-radius: 100px; letter-spacing: .04em; }

  .empty { text-align: center; padding: 4rem 2rem; color: #8A8AAA; }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: white; border-radius: 28px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 36px; position: relative; }
  .modal::-webkit-scrollbar { width: 4px; }
  .modal::-webkit-scrollbar-thumb { background: #E8E8F5; border-radius: 4px; }
  .modal-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: none; background: #F8F7FF; color: #8A8AAA; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
  .modal-close:hover { background: #E8E8F5; color: #1A1A2E; }
  .modal-badge { display: inline-block; font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; margin-bottom: 1rem; }
  .modal h2 { font-family: 'Nunito', sans-serif; font-size: 1.5rem; font-weight: 900; color: #1A1A2E; margin-bottom: .4rem; letter-spacing: -.02em; line-height: 1.2; }
  .modal-subtitle { font-size: .9rem; font-weight: 600; color: #8A8AAA; margin-bottom: 1.75rem; }
  .modal-divider { height: 1px; background: #E8E8F5; margin: 1.5rem 0; }
  .fields-title { font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A8AAA; margin-bottom: 1rem; }
  .field-group { margin-bottom: 16px; }
  .field-label { display: block; font-size: .82rem; font-weight: 700; color: #4A4A6A; margin-bottom: 6px; }
  .field-input, .field-textarea { width: 100%; padding: 12px 16px; border: 1.5px solid #E8E8F5; border-radius: 14px; font-family: 'Nunito', sans-serif; font-size: .92rem; font-weight: 600; color: #1A1A2E; background: #F8F7FF; outline: none; transition: border .2s; }
  .field-input:focus, .field-textarea:focus { border-color: #5B4BF5; background: white; }
  .field-textarea { resize: none; min-height: 80px; line-height: 1.6; }
  .field-input::placeholder, .field-textarea::placeholder { color: #C0C0D0; }
  .modal-footer { margin-top: 1.75rem; }
  .modal-price-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .modal-price { font-family: 'Nunito', sans-serif; font-size: 1.6rem; font-weight: 900; color: #1A1A2E; }
  .modal-price-note { font-size: .78rem; font-weight: 600; color: #8A8AAA; }
  .btn-pay { width: 100%; padding: 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; background: #FF6B4A; color: white; box-shadow: 0 6px 24px rgba(255,107,74,.4); transition: all .25s; }
  .btn-pay:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,74,.5); }
  .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .login-note { text-align: center; font-size: .82rem; font-weight: 600; color: #8A8AAA; margin-top: 12px; }
  .login-note button { background: none; border: none; color: #5B4BF5; font-weight: 700; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .82rem; }

  footer { background: #1A1A2E; color: rgba(255,255,255,.5); padding: 32px clamp(1.5rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .foot-logo { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: white; }
  .foot-logo span { color: #FF6B4A; }
  .foot-links { display: flex; gap: 1.5rem; font-size: .84rem; font-weight: 700; flex-wrap: wrap; }
  .foot-links a { color: rgba(255,255,255,.55); text-decoration: none; }
  .foot-links a:hover { color: white; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeUp .3s ease both; }

  @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .nav-link { display: none; } }
  @media (max-width: 480px) { .modal { padding: 24px 20px; } .hero-stats { gap: 1.5rem; } }
`;

export default function Catalogo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, [activeCategory]);

  async function fetchPrompts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/catalogo${activeCategory !== "todos" ? `?category=${activeCategory}` : ""}`);
      const data = await res.json();
      const all = data.prompts || [];
      // En "todos" ocultamos los genéricos — solo aparecen dentro de su categoría
      const filtered = activeCategory === "todos"
        ? all.filter(p => !p.slug?.endsWith('-consulta-libre'))
        : all.sort((a, b) => {
            const aG = a.slug?.endsWith('-consulta-libre') ? 0 : 1;
            const bG = b.slug?.endsWith('-consulta-libre') ? 0 : 1;
            return aG - bG;
          });
      setPrompts(filtered);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function openModal(prompt) {
    setSelectedPrompt(prompt);
    setFieldValues({});
  }

  function closeModal() {
    setSelectedPrompt(null);
    setFieldValues({});
    setPaying(null);
  }

  async function handlePay(type = "catalog") {
    if (!session) {
      signIn("google", { callbackUrl: `/catalogo` });
      return;
    }
    setPaying(type);
    try {
      const res = await fetch("/api/catalog-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedPrompt.slug, fields: fieldValues, type }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setPaying(null);
    }
  }

  const catConfig = CATEGORY_CONFIG[selectedPrompt?.category] || {};
  const totalUses = prompts.reduce((acc, p) => acc + (p.uses_count || 0), 0);

  return (
    <>
      <Head>
        <title>Catálogo de Prompts | promptbien.com</title>
        <meta name="description" content="Prompts premium para ChatGPT, Claude y Gemini — o recibe la respuesta del experto directamente aquí. Elige tu caso y personaliza en 30 segundos." />
        <link rel="canonical" href="https://www.promptbien.com/catalogo" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="/generar" className="nav-link">Generador</a>
          <a href="/mis-prompts" className="nav-link">Mis prompts</a>
          <a href="/generar" className="nav-cta">✨ Nuevo prompt</a>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-badge">✦ Prompts Premium</div>
        <h1>El prompt exacto — o la respuesta directa. Tú eliges.</h1>
        <p className="hero-sub">Casos concretos ya resueltos. Personaliza en 30 segundos y llévate el prompt — o recibe la respuesta del experto aquí mismo.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-n">{prompts.length || "6"}+</div>
            <div className="hero-stat-l">prompts disponibles</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-n">{totalUses || "0"}</div>
            <div className="hero-stat-l">veces usados</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-n">Desde 1,99€</div>
            <div className="hero-stat-l">por consulta</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="filters">
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              className={`filter-pill ${activeCategory === key ? "active" : ""}`}
              onClick={() => setActiveCategory(key)}
            >
              {cfg.emoji} {cfg.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#F0EEFF", border: "1.5px solid #C8C8F5", borderRadius: 16, padding: "16px 20px", marginBottom: 24, fontSize: ".9rem", fontWeight: 600, color: "#4A4A6A", lineHeight: 1.65 }}>
          Al personalizar cualquier prompt tienes dos opciones:<br />
          <strong style={{ color: "#1A1A2E" }}>🔒 Obtener el prompt para tu IA — 1,99€.</strong> Lo copias y lo usas en ChatGPT, Claude o Gemini.<br />
          <strong style={{ color: "#1A1A2E" }}>⚡ Consultar directamente aquí — 4,99€.</strong> Recibes la respuesta del experto en pantalla en menos de 30 segundos. Sin abrir ninguna otra app.
        </div>

        {loading ? (          <div style={{ textAlign: "center", padding: "4rem", color: "#8A8AAA" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #E8E8F5", borderTopColor: "#5B4BF5", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            Cargando prompts...
          </div>
        ) : prompts.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p>No hay prompts en esta categoría todavía.<br />Pronto añadimos más.</p>
          </div>
        ) : (
          <div className="grid">
            {prompts.map((prompt, i) => {
              const cat = CATEGORY_CONFIG[prompt.category] || {};
              const isGeneric = prompt.slug?.endsWith('-consulta-libre');
              const isPopular = prompt.uses_count >= 30;

              if (isGeneric) {
                return (
                  <div
                    key={prompt.id}
                    className="card card-generic fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => openModal(prompt)}
                  >
                    <div className="card-generic-left">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".75rem" }}>
                        <span className="card-generic-tag">✦ A tu medida</span>
                        {prompt.uses_count > 0 && <span className="card-uses">{prompt.uses_count} usos</span>}
                      </div>
                      <h3>{prompt.title}</h3>
                      <p className="card-subtitle">{prompt.subtitle}</p>
                    </div>
                    <div className="card-generic-right">
                      <button className="card-btn" onClick={e => { e.stopPropagation(); openModal(prompt); }}>
                        Cuéntanos tu caso →
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={prompt.id}
                  className="card fade-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => openModal(prompt)}
                >
                  <div className="card-top">
                    <span className="card-badge" style={{ background: cat.bg, color: cat.color }}>
                      {cat.emoji} {prompt.category}
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {isPopular && <span className="card-popular">🔥 Popular</span>}
                      {!isPopular && prompt.uses_count > 0 && <span className="card-uses">{prompt.uses_count} usos</span>}
                    </div>
                  </div>
                  <h3>{prompt.title}</h3>
                  <p className="card-subtitle">{prompt.subtitle}</p>
                  <p className="card-preview">"{prompt.preview_text}"</p>
                  <div className="card-footer">
                    <span className="card-price">Desde 1,99€</span>
                    <button className="card-btn" onClick={e => { e.stopPropagation(); openModal(prompt); }}>
                      Personalizar →
                    </button>
                  </div>
                  <div className="card-hover-prices">
                    <button className="hover-btn hover-btn-prompt" onClick={e => { e.stopPropagation(); openModal(prompt); }}>
                      🔒 Obtener el prompt — 1,99€
                    </button>
                    <button className="hover-btn hover-btn-consult" onClick={e => { e.stopPropagation(); openModal(prompt); }}>
                      ⚡ Consultar directamente — 4,99€
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPrompt && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            <span
              className="modal-badge"
              style={{ background: catConfig.bg, color: catConfig.color }}
            >
              {catConfig.emoji} {selectedPrompt.category}
            </span>

            <h2>{selectedPrompt.title}</h2>
            <p className="modal-subtitle">{selectedPrompt.subtitle}</p>

            {selectedPrompt.fields && selectedPrompt.fields.length > 0 && (
              <>
                <div className="modal-divider" />
                <div className="fields-title">Personaliza tu prompt — opcional</div>
                {selectedPrompt.fields.map(field => (
                  <div key={field.id} className="field-group">
                    <label className="field-label">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="field-textarea"
                        placeholder={field.placeholder}
                        rows={3}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        className="field-input"
                        type="text"
                        placeholder={field.placeholder}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            <div className="modal-divider" />
            <div className="modal-footer">
              <p style={{ fontSize: ".88rem", fontWeight: 700, color: "#4A4A6A", textAlign: "center", marginBottom: 14 }}>¿Cómo quieres recibir tu consulta?</p>
              <button className="btn-pay" onClick={() => handlePay("catalog")} disabled={paying}>
                {paying === "catalog" ? "Redirigiendo..." : "🔒 Obtener el prompt — 1,99€"}
              </button>
              <div className="modal-price-note" style={{ textAlign: "center", margin: "6px 0" }}>Para usar en ChatGPT, Claude o Gemini</div>

              <button className="btn-pay btn-consultation" onClick={() => handlePay("consultation")} disabled={paying} style={{ marginTop: 10, background: "#5B4BF5" }}>
                {paying === "consultation" ? "Redirigiendo..." : "⚡ Consultar directamente — 4,99€"}
              </button>
              <div className="modal-price-note" style={{ textAlign: "center", margin: "6px 0" }}>Recibe la respuesta ahora. Sin salir de aquí.</div>

              {!session && (
                <p className="login-note">
                  Necesitas <button onClick={() => signIn("google")}>entrar con Google</button> para comprar
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <div className="foot-links">
          <a href="/">Inicio</a>
          <a href="/generar">Generador</a>
          <a href="/catalogo">Catálogo</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
        </div>
        <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.35)" }}>© 2026 promptbien.com</div>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}