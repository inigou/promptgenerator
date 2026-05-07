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

const CSS = `
  .tp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 0 clamp(1.5rem,5vw,4rem) 2rem; }
  @media (max-width: 900px) { .tp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .tp-grid { grid-template-columns: 1fr; } }
  .tp-card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px; cursor: pointer; transition: all .22s; position: relative; overflow: hidden; }
  .tp-card:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); transform: translateY(-3px); }
  .tp-card:hover .tp-hover { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .tp-card:hover .tp-footer { opacity: 0; pointer-events: none; }
  .tp-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .75rem; }
  .tp-badge { font-size: .68rem; font-weight: 800; padding: 3px 10px; border-radius: 100px; }
  .tp-popular { font-size: .68rem; font-weight: 800; color: white; background: linear-gradient(135deg, #FF6B4A, #FF9F0A); padding: 3px 9px; border-radius: 100px; }
  .tp-uses { font-size: .68rem; font-weight: 800; color: rgba(255,255,255,.8); background: rgba(255,255,255,.15); padding: 3px 9px; border-radius: 100px; }
  .tp-card h3 { font-family: 'Nunito', sans-serif; font-size: .95rem; font-weight: 900; color: white; margin-bottom: .3rem; line-height: 1.3; }
  .tp-subtitle { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,.5); margin-bottom: .9rem; }
  .tp-footer { display: flex; align-items: center; justify-content: space-between; transition: opacity .18s; }
  .tp-price { font-family: 'Nunito', sans-serif; font-size: .95rem; font-weight: 900; color: white; }
  .tp-btn { background: rgba(255,255,255,.15); color: white; font-family: 'Nunito', sans-serif; font-size: .78rem; font-weight: 800; padding: 6px 14px; border-radius: 100px; border: none; cursor: pointer; transition: all .18s; }
  .tp-btn:hover { background: rgba(255,255,255,.25); }
  .tp-hover { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(20,12,60,.97); border-top: 1.5px solid rgba(255,255,255,.1); padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; opacity: 0; transform: translateY(6px); transition: all .2s; pointer-events: none; }
  .tp-hbtn { width: 100%; padding: 8px 12px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .78rem; font-weight: 800; transition: all .18s; }
  .tp-hbtn-prompt { background: rgba(255,255,255,.15); color: white; }
  .tp-hbtn-consult { background: #5B4BF5; color: white; }
  .tp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 1000; display: flex; align-items: flex-end; justify-content: center; }
  @media (min-width: 600px) { .tp-modal-overlay { align-items: center; padding: 2rem; } }
  .tp-modal { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 28px 24px 32px; color: #1A1A2E; }
  @media (min-width: 600px) { .tp-modal { border-radius: 24px; } }
  .tp-modal-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; }
  .tp-modal-close { background: #F0F0F8; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tp-modal h2 { font-family: 'Nunito', sans-serif; font-size: 1.25rem; font-weight: 900; color: #1A1A2E; margin-bottom: .3rem; line-height: 1.2; }
  .tp-modal-sub { font-size: .83rem; color: #8A8AAA; font-weight: 600; }
  .tp-divider { border: none; border-top: 1.5px solid #E8E8F5; margin: 1.25rem 0; }
  .tp-fields-label { font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A8AAA; margin-bottom: 1rem; }
  .tp-field { margin-bottom: 1rem; }
  .tp-field label { display: block; font-size: .83rem; font-weight: 800; color: #1A1A2E; margin-bottom: .4rem; }
  .tp-field input, .tp-field textarea { width: 100%; padding: 10px 13px; border: 1.5px solid #E8E8F5; border-radius: 12px; font-size: .85rem; font-family: 'Nunito', sans-serif; font-weight: 600; color: #1A1A2E; background: #FAFAFF; outline: none; transition: border .18s; resize: vertical; }
  .tp-field input:focus, .tp-field textarea:focus { border-color: #5B4BF5; }
  .tp-cta-label { font-size: .83rem; font-weight: 700; color: #4A4A6A; text-align: center; margin-bottom: 12px; }
  .tp-pay-btn { width: 100%; padding: 13px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .92rem; font-weight: 800; margin-bottom: 7px; transition: all .18s; }
  .tp-pay-prompt { background: #FF6B4A; color: white; box-shadow: 0 4px 14px rgba(255,107,74,.3); }
  .tp-pay-consult { background: #5B4BF5; color: white; box-shadow: 0 4px 14px rgba(91,75,245,.25); }
  .tp-pay-note { font-size: .73rem; font-weight: 600; color: #8A8AAA; text-align: center; margin-bottom: 6px; }
  .tp-spinner { width: 28px; height: 28px; border: 3px solid rgba(255,255,255,.15); border-top-color: white; border-radius: 50%; animation: tp-spin .7s linear infinite; margin: 2rem auto; }
  @keyframes tp-spin { to { transform: rotate(360deg); } }
`;

export default function TopPrompts() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    fetchTopPrompts();
  }, []);

  async function fetchTopPrompts() {
    setLoading(true);
    try {
      const res = await fetch("/api/catalogo");
      const data = await res.json();
      const top = (data.prompts || [])
        .filter(p => !p.slug?.endsWith('-consulta-libre'))
        .sort((a, b) => b.uses_count - a.uses_count)
        .slice(0, 6);
      setPrompts(top);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function openModal(prompt) { setSelectedPrompt(prompt); setFieldValues({}); }
  function closeModal() { setSelectedPrompt(null); setFieldValues({}); setPaying(null); }

  async function handlePay(type) {
    if (!session) { signIn("google"); return; }
    setPaying(type);
    try {
      const res = await fetch("/api/catalog-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedPrompt.slug, fields: fieldValues, type }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) { console.error(e); setPaying(null); }
  }

  const fields = selectedPrompt
    ? (typeof selectedPrompt.fields === "string"
        ? JSON.parse(selectedPrompt.fields)
        : selectedPrompt.fields || [])
    : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {loading ? (
        <div className="tp-spinner" />
      ) : (
        <div className="tp-grid">
          {prompts.map(prompt => {
            const cat = CATEGORY_CONFIG[prompt.category] || {};
            const isPopular = prompt.uses_count >= 30;
            return (
              <div key={prompt.id} className="tp-card" onClick={() => openModal(prompt)}>
                <div className="tp-top">
                  <span className="tp-badge" style={{ background: cat.bg, color: cat.color }}>{cat.emoji} {cat.label}</span>
                  {isPopular
                    ? <span className="tp-popular">🔥 Popular</span>
                    : prompt.uses_count > 0 && <span className="tp-uses">{prompt.uses_count} usos</span>}
                </div>
                <h3>{prompt.title}</h3>
                <p className="tp-subtitle">{prompt.subtitle}</p>
                <div className="tp-footer">
                  <span className="tp-price">Desde 1,99€</span>
                  <button className="tp-btn" onClick={e => { e.stopPropagation(); openModal(prompt); }}>Personalizar →</button>
                </div>
                <div className="tp-hover">
                  <button className="tp-hbtn tp-hbtn-prompt" onClick={e => { e.stopPropagation(); openModal(prompt); }}>🔒 Prompt — 1,99€</button>
                  <button className="tp-hbtn tp-hbtn-consult" onClick={e => { e.stopPropagation(); openModal(prompt); }}>⚡ Consultar — 4,99€</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPrompt && (
        <div className="tp-modal-overlay" onClick={closeModal}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-modal-top">
              <div>
                <h2>{selectedPrompt.title}</h2>
                <p className="tp-modal-sub">{selectedPrompt.subtitle}</p>
              </div>
              <button className="tp-modal-close" onClick={closeModal}>✕</button>
            </div>
            <hr className="tp-divider" />
            {fields.length > 0 && (
              <>
                <div className="tp-fields-label">Personaliza tu prompt — opcional</div>
                {fields.map(field => (
                  <div className="tp-field" key={field.id}>
                    <label>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea rows={3} placeholder={field.placeholder}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(v => ({ ...v, [field.id]: e.target.value }))} />
                    ) : (
                      <input type="text" placeholder={field.placeholder}
                        value={fieldValues[field.id] || ""}
                        onChange={e => setFieldValues(v => ({ ...v, [field.id]: e.target.value }))} />
                    )}
                  </div>
                ))}
                <hr className="tp-divider" />
              </>
            )}
            <p className="tp-cta-label">¿Cómo quieres recibir tu consulta?</p>
            <button className="tp-pay-btn tp-pay-prompt" onClick={() => handlePay("catalog")} disabled={!!paying}>
              {paying === "catalog" ? "Redirigiendo..." : "🔒 Obtener el prompt — 1,99€"}
            </button>
            <p className="tp-pay-note">Para usar en ChatGPT, Claude o Gemini</p>
            <button className="tp-pay-btn tp-pay-consult" onClick={() => handlePay("consultation")} disabled={!!paying}>
              {paying === "consultation" ? "Redirigiendo..." : "⚡ Consultar directamente — 4,99€"}
            </button>
            <p className="tp-pay-note">Recibe la respuesta ahora. Sin salir de aquí.</p>
          </div>
        </div>
      )}
    </>
  );
}