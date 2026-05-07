import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

const CATEGORY_CONFIG = {
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

const COMPONENT_CSS = `
  .cc-wrap { padding: clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem); background: #F8F7FF; }
  .cc-header { text-align: center; margin-bottom: 2rem; }
  .cc-eyebrow { font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #5B4BF5; margin-bottom: .8rem; }
  .cc-title { font-family: 'Nunito', sans-serif; font-size: clamp(1.7rem,3.5vw,2.4rem); font-weight: 900; line-height: 1.12; letter-spacing: -.02em; margin-bottom: 0; color: #1A1A2E; }
  .cc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2rem; }
  @media (max-width: 900px) { .cc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) { .cc-grid { grid-template-columns: 1fr; } }
  .cc-card { background: white; border-radius: 20px; border: 2px solid #E8E8F5; padding: 24px; padding-bottom: 36px; cursor: pointer; transition: all .22s; position: relative; overflow: hidden; min-height: 200px; }
  .cc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(91,75,245,.12); border-color: #C8C8F5; }
  .cc-card:hover .cc-hover { opacity: 1; transform: translateY(0); }
  .cc-card:hover .cc-footer { opacity: 0; pointer-events: none; }
  .cc-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .9rem; }
  .cc-badge { font-size: .7rem; font-weight: 800; padding: 4px 11px; border-radius: 100px; text-transform: capitalize; }
  .cc-uses { font-size: .72rem; font-weight: 800; color: #5B4BF5; background: #F0EEFF; padding: 3px 9px; border-radius: 100px; }
  .cc-popular { font-size: .72rem; font-weight: 800; color: white; background: linear-gradient(135deg, #FF6B4A, #FF9F0A); padding: 3px 9px; border-radius: 100px; }
  .cc-card h3 { font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; color: #1A1A2E; margin-bottom: .3rem; line-height: 1.3; }
  .cc-subtitle { font-size: .82rem; font-weight: 600; color: #8A8AAA; margin-bottom: .9rem; }
  .cc-preview { font-size: .82rem; font-weight: 600; color: #4A4A6A; line-height: 1.6; margin-bottom: 1.1rem; font-style: italic; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .cc-footer { display: flex; align-items: center; justify-content: space-between; transition: opacity .18s; }
  .cc-price { font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; color: #1A1A2E; }
  .cc-btn { background: #5B4BF5; color: white; font-family: 'Nunito', sans-serif; font-size: .8rem; font-weight: 800; padding: 7px 16px; border-radius: 100px; border: none; cursor: pointer; transition: all .18s; }
  .cc-btn:hover { background: #4A3AE0; }
  .cc-hover { position: absolute; bottom: 0; left: 0; right: 0; background: white; border-top: 1.5px solid #E8E8F5; padding: 14px 20px; display: flex; flex-direction: column; gap: 7px; opacity: 0; transform: translateY(6px); transition: all .2s; pointer-events: none; }
  .cc-card:hover .cc-hover { pointer-events: auto; }
  .cc-hbtn { width: 100%; padding: 9px 14px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .82rem; font-weight: 800; transition: all .18s; }
  .cc-hbtn-prompt { background: #F0EEFF; color: #5B4BF5; }
  .cc-hbtn-consult { background: #5B4BF5; color: white; box-shadow: 0 4px 12px rgba(91,75,245,.28); }
  .cc-generic { background: linear-gradient(135deg, #5B4BF5 0%, #7C6BFF 100%); border: none; grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 24px 28px; }
  .cc-generic:hover { box-shadow: 0 14px 44px rgba(91,75,245,.32); border-color: transparent; transform: translateY(-3px); }
  .cc-generic h3 { color: white; font-size: 1.1rem; }
  .cc-generic .cc-subtitle { color: rgba(255,255,255,.7); margin: 0; }
  .cc-generic .cc-uses { background: rgba(255,255,255,.18); color: white; }
  .cc-generic-tag { font-size: .72rem; font-weight: 800; background: rgba(255,255,255,.18); color: rgba(255,255,255,.9); padding: 4px 11px; border-radius: 100px; }
  .cc-generic-btn { background: white; color: #5B4BF5; font-family: 'Nunito', sans-serif; font-size: .85rem; font-weight: 800; padding: 10px 20px; border-radius: 100px; border: none; cursor: pointer; white-space: nowrap; }
  .cc-loading { text-align: center; padding: 3rem; color: #8A8AAA; font-weight: 600; }
  .cc-spinner { width: 32px; height: 32px; border: 3px solid #E8E8F5; border-top-color: #5B4BF5; border-radius: 50%; animation: cc-spin .7s linear infinite; margin: 0 auto 1rem; }
  @keyframes cc-spin { to { transform: rotate(360deg); } }
  .cc-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 1000; display: flex; align-items: flex-end; justify-content: center; padding: 0; animation: cc-fadein .2s ease; }
  @media (min-width: 600px) { .cc-modal-overlay { align-items: center; padding: 2rem; } }
  @keyframes cc-fadein { from { opacity: 0 } to { opacity: 1 } }
  .cc-modal { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 28px 24px 32px; }
  @media (min-width: 600px) { .cc-modal { border-radius: 24px; } }
  .cc-modal-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; }
  .cc-modal-close { background: #F0F0F8; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cc-modal h2 { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: #1A1A2E; line-height: 1.2; margin-bottom: .3rem; }
  .cc-modal-sub { font-size: .85rem; color: #8A8AAA; font-weight: 600; }
  .cc-divider { border: none; border-top: 1.5px solid #E8E8F5; margin: 1.25rem 0; }
  .cc-fields-label { font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A8AAA; margin-bottom: 1rem; }
  .cc-field { margin-bottom: 1rem; }
  .cc-field label { display: block; font-size: .85rem; font-weight: 800; color: #1A1A2E; margin-bottom: .4rem; }
  .cc-field input, .cc-field textarea { width: 100%; padding: 11px 14px; border: 1.5px solid #E8E8F5; border-radius: 12px; font-size: .88rem; font-family: 'Nunito', sans-serif; font-weight: 600; color: #1A1A2E; background: #FAFAFF; outline: none; transition: border .18s; resize: vertical; }
  .cc-field input:focus, .cc-field textarea:focus { border-color: #5B4BF5; }
  .cc-modal-cta-label { font-size: .85rem; font-weight: 700; color: #4A4A6A; text-align: center; margin-bottom: 12px; }
  .cc-pay-btn { width: 100%; padding: 14px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .95rem; font-weight: 800; margin-bottom: 8px; transition: all .18s; }
  .cc-pay-prompt { background: #FF6B4A; color: white; box-shadow: 0 4px 16px rgba(255,107,74,.35); }
  .cc-pay-prompt:hover { transform: translateY(-2px); }
  .cc-pay-consult { background: #5B4BF5; color: white; box-shadow: 0 4px 16px rgba(91,75,245,.3); }
  .cc-pay-consult:hover { transform: translateY(-2px); }
  .cc-pay-note { font-size: .75rem; font-weight: 600; color: #8A8AAA; text-align: center; margin-bottom: 6px; }
  .cc-login-note { font-size: .8rem; color: #8A8AAA; text-align: center; margin-top: 8px; }
  .cc-login-note button { background: none; border: none; color: #5B4BF5; font-weight: 800; cursor: pointer; text-decoration: underline; }
`;

export default function CatalogCards({ categoria, titulo, eyebrow }) {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, [categoria]);

  async function fetchPrompts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/catalogo?category=${categoria}`);
      const data = await res.json();
      const all = data.prompts || [];
      // Genérico primero, luego específicos
      const sorted = all.sort((a, b) => {
        const aG = a.slug?.endsWith('-consulta-libre') ? 0 : 1;
        const bG = b.slug?.endsWith('-consulta-libre') ? 0 : 1;
        return aG - bG;
      });
      setPrompts(sorted);
    } catch (e) { console.error(e); }
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

  async function handlePay(type) {
    if (!session) {
      signIn("google", { callbackUrl: window.location.pathname });
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

  const cat = CATEGORY_CONFIG[categoria] || {};
  const fields = selectedPrompt
    ? (typeof selectedPrompt.fields === "string"
        ? JSON.parse(selectedPrompt.fields)
        : selectedPrompt.fields || [])
    : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: COMPONENT_CSS }} />

      <div className="cc-wrap">
        <div className="cc-header">
          {eyebrow && <div className="cc-eyebrow">{eyebrow}</div>}
          {titulo && <h2 className="cc-title">{titulo}</h2>}
        </div>

        {loading ? (
          <div className="cc-loading">
            <div className="cc-spinner" />
            Cargando prompts...
          </div>
        ) : (
          <div className="cc-grid">
            {prompts.map((prompt, i) => {
              const isGeneric = prompt.slug?.endsWith('-consulta-libre');
              const isPopular = prompt.uses_count >= 30;

              if (isGeneric) {
                return (
                  <div key={prompt.id} className="cc-card cc-generic" onClick={() => openModal(prompt)}>
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span className="cc-generic-tag">✦ A tu medida</span>
                        {prompt.uses_count > 0 && <span className="cc-uses">{prompt.uses_count} usos</span>}
                      </div>
                      <h3>{prompt.title}</h3>
                      <p className="cc-subtitle">{prompt.subtitle}</p>
                    </div>
                    <button className="cc-generic-btn" onClick={e => { e.stopPropagation(); openModal(prompt); }}>
                      Cuéntanos tu caso →
                    </button>
                  </div>
                );
              }

              return (
                <div key={prompt.id} className="cc-card" onClick={() => openModal(prompt)}>
                  <div className="cc-card-top">
                    <span className="cc-badge" style={{ background: cat.bg, color: cat.color }}>
                      {cat.emoji} {cat.label}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {isPopular
                        ? <span className="cc-popular">🔥 Popular</span>
                        : prompt.uses_count > 0 && <span className="cc-uses">{prompt.uses_count} usos</span>}
                    </div>
                  </div>
                  <h3>{prompt.title}</h3>
                  <p className="cc-subtitle">{prompt.subtitle}</p>
                  <p className="cc-preview">"{prompt.preview_text}"</p>
                  <div className="cc-footer">
                    <span className="cc-price">Desde 1,99€</span>
                    <button className="cc-btn" onClick={e => { e.stopPropagation(); openModal(prompt); }}>Personalizar →</button>
                  </div>
                  <div className="cc-hover">
                    <button className="cc-hbtn cc-hbtn-prompt" onClick={e => { e.stopPropagation(); openModal(prompt); }}>🔒 Obtener el prompt — 1,99€</button>
                    <button className="cc-hbtn cc-hbtn-consult" onClick={e => { e.stopPropagation(); openModal(prompt); }}>⚡ Consultar directamente — 4,99€</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPrompt && (
        <div className="cc-modal-overlay" onClick={closeModal}>
          <div className="cc-modal" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div>
                <h2>{selectedPrompt.title}</h2>
                <p className="cc-modal-sub">{selectedPrompt.subtitle}</p>
              </div>
              <button className="cc-modal-close" onClick={closeModal}>✕</button>
            </div>
            <hr className="cc-divider" />
            {fields.length > 0 && (
              <>
                <div className="cc-fields-label">Personaliza tu prompt — opcional</div>
                {fields.map(field => (
                  <div className="cc-field" key={field.id}>
                    <label>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(v => ({ ...v, [field.id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(v => ({ ...v, [field.id]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <hr className="cc-divider" />
              </>
            )}
            <p className="cc-modal-cta-label">¿Cómo quieres recibir tu consulta?</p>
            <button className="cc-pay-btn cc-pay-prompt" onClick={() => handlePay("catalog")} disabled={!!paying}>
              {paying === "catalog" ? "Redirigiendo..." : "🔒 Obtener el prompt — 1,99€"}
            </button>
            <p className="cc-pay-note">Para usar en ChatGPT, Claude o Gemini</p>
            <button className="cc-pay-btn cc-pay-consult" onClick={() => handlePay("consultation")} disabled={!!paying}>
              {paying === "consultation" ? "Redirigiendo..." : "⚡ Consultar directamente — 4,99€"}
            </button>
            <p className="cc-pay-note">Recibe la respuesta ahora. Sin salir de aquí.</p>
            {!session && (
              <p className="cc-login-note">
                Necesitas <button onClick={() => signIn("google")}>entrar con Google</button> para comprar
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}