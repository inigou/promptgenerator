import { useState } from "react";
import Head from "next/head";

const TEMAS = [
  { id: "viajes", label: "✈️ Viajes", desc: "Itinerarios, destinos, planificación" },
  { id: "salud", label: "🩺 Salud", desc: "Consultas médicas, diagnósticos, hábitos" },
  { id: "inmobiliario", label: "🏠 Inmobiliario", desc: "Compra, venta, hipoteca, inversión" },
  { id: "otro", label: "💬 Otro tema", desc: "Cualquier consulta que tengas" },
];

const IAS = [
  { id: "ChatGPT", color: "#10a37f" },
  { id: "Claude", color: "#c96a30" },
  { id: "Gemini", color: "#4285f4" },
];

const PLACEHOLDERS = {
  viajes: {
    situacion: "Ej: Quiero ir a Japón con mi pareja en octubre, tenemos 12 días, nos gusta la gastronomía y la cultura pero odiamos las masas de turistas...",
    objetivo: "Ej: Que me haga un itinerario día a día realista con alojamiento, transporte y restaurantes imprescindibles",
  },
  salud: {
    situacion: "Ej: Me han dicho que tengo el colesterol a 240 y el médico quiere recetarme estatinas, no fumo, tengo 48 años...",
    objetivo: "Ej: Entender si realmente necesito medicación o puedo bajarlo con dieta y ejercicio",
  },
  inmobiliario: {
    situacion: "Ej: Tengo un piso en propiedad con hipoteca, me queda el 40% por pagar y estoy pensando en comprar otro para alquilar...",
    objetivo: "Ej: Entender si me compensa amortizar la hipoteca actual o usar ese dinero para la entrada del segundo piso",
  },
  otro: {
    situacion: "Describe tu situación con todo el detalle que puedas...",
    objetivo: "Qué quieres conseguir exactamente",
  },
};

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAFAF8; color: #0F0F0F; }
  .nav {
    position: fixed; top: 0; left: 0; right: 0; height: 60px;
    background: rgba(250,250,248,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid #EBEBEB;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; z-index: 100;
  }
  .nav-logo { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; text-decoration: none; color: #0F0F0F; }
  .nav-logo span { color: #FF6B4A; }
  .nav-back { font-size: .85rem; color: #8A8A8A; text-decoration: none; }
  .nav-back:hover { color: #FF6B4A; }
  .wrap { max-width: 580px; margin: 0 auto; padding: 90px 1.5rem 80px; }
  .progress { display: flex; margin-bottom: 2.5rem; border-bottom: 1px solid #EBEBEB; }
  .prog-item {
    flex: 1; padding: 10px 0; text-align: center;
    font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
    font-weight: 600; color: #BBBBBB; border-bottom: 2px solid transparent; transition: all .2s;
  }
  .prog-item.active { color: #FF6B4A; border-bottom-color: #FF6B4A; }
  .prog-item.done { color: #10a37f; }
  h1 { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; letter-spacing: -.02em; margin-bottom: .6rem; line-height: 1.15; }
  .sub { font-size: .95rem; color: #4A4A4A; margin-bottom: 2rem; line-height: 1.6; }
  .back-btn { background: none; border: none; color: #8A8A8A; font-size: .85rem; cursor: pointer; margin-bottom: 1.2rem; padding: 0; font-family: inherit; }
  .back-btn:hover { color: #FF6B4A; }
  .tema-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.5rem; }
  .tema-card { padding: 20px 18px; border: 1.5px solid #EBEBEB; border-radius: 20px; cursor: pointer; background: white; transition: all .2s; text-align: left; }
  .tema-card:hover { border-color: #FF6B4A; background: #FFF0ED; }
  .tema-card.active { border-color: #FF6B4A; background: #FFF0ED; box-shadow: 0 4px 16px rgba(255,107,74,.12); }
  .tema-emoji { font-size: 1.8rem; margin-bottom: 6px; }
  .tema-name { font-weight: 700; font-size: .95rem; margin-bottom: 2px; }
  .tema-desc { font-size: .78rem; color: #8A8A8A; }
  .ia-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem; }
  .ia-btn {
    padding: 18px 22px; border: 1.5px solid #EBEBEB; border-radius: 20px;
    cursor: pointer; background: white; transition: all .2s;
    display: flex; align-items: center; gap: 12px; font-family: inherit; width: 100%;
  }
  .ia-btn:hover { border-color: #FF6B4A; }
  .ia-btn.active { border-color: #FF6B4A; background: #FFF0ED; }
  .ia-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .ia-name { font-weight: 700; font-size: 1rem; }
  .field { margin-bottom: 1.2rem; }
  .field label { display: block; font-size: .78rem; font-weight: 700; color: #4A4A4A; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px; }
  .field textarea {
    width: 100%; padding: 14px 16px; border: 1.5px solid #EBEBEB; border-radius: 16px;
    font-size: .93rem; font-family: inherit; line-height: 1.6; resize: vertical;
    background: white; outline: none; transition: border .2s; color: #0F0F0F;
  }
  .field textarea:focus { border-color: #FF6B4A; }
  .field textarea::placeholder { color: #BBBBBB; }
  .btn-main {
    width: 100%; padding: 15px; background: #FF6B4A; color: white;
    border: none; border-radius: 100px; font-size: 1rem; font-weight: 700;
    font-family: inherit; cursor: pointer; transition: all .2s;
    box-shadow: 0 6px 20px rgba(255,107,74,.35);
  }
  .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,107,74,.4); }
  .btn-main:disabled { background: #D4C9B0; box-shadow: none; cursor: not-allowed; }
  .btn-outline {
    width: 100%; padding: 14px; background: transparent; color: #FF6B4A;
    border: 1.5px solid #FF6B4A; border-radius: 100px; font-size: .95rem;
    font-weight: 700; font-family: inherit; cursor: pointer; transition: all .2s; margin-top: 10px;
  }
  .btn-outline:hover { background: #FFF0ED; }
  .loading-text { text-align: center; font-size: .85rem; color: #8A8A8A; font-style: italic; margin-top: 12px; }
  .error-box { background: #FFF0F0; border: 1px solid #FFD0CC; border-radius: 12px; padding: 12px 16px; font-size: .88rem; color: #CC3300; margin-bottom: 1rem; }
  .result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
  .result-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; }
  .result-badge { background: #D4EDDA; color: #276535; border-radius: 20px; padding: 4px 12px; font-size: .75rem; font-weight: 700; }
  .result-box {
    background: white; border: 1.5px solid #EBEBEB; border-radius: 20px;
    padding: 24px; font-size: .9rem; line-height: 1.8; color: #2A2A2A;
    max-height: 420px; overflow-y: auto; margin-bottom: 14px; white-space: pre-wrap;
  }
  .copy-btn {
    width: 100%; padding: 15px; background: #0F0F0F; color: white;
    border: none; border-radius: 100px; font-size: 1rem; font-weight: 700;
    font-family: inherit; cursor: pointer; transition: all .2s;
  }
  .copy-btn.copied { background: #276535; }
  .copy-btn:hover { transform: translateY(-2px); }
  .tip-box { background: #FFF8E6; border: 1px solid #FFE08A; border-radius: 14px; padding: 14px 18px; font-size: .83rem; color: #7A5800; line-height: 1.6; margin-top: 12px; }
  @media (max-width: 480px) { .tema-grid { grid-template-columns: 1fr; } h1 { font-size: 1.6rem; } }
`;

export default function Generar() {
  const [step, setStep] = useState(1);
  const [tema, setTema] = useState("");
  const [ia, setIa] = useState("");
  const [situacion, setSituacion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const ph = PLACEHOLDERS[tema] || PLACEHOLDERS.otro;
  const canStep2 = tema !== "";
  const canStep3 = ia !== "";
  const canGenerate = situacion.trim().length > 20 && objetivo.trim().length > 10;

  async function generatePrompt() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ia, tema, situacion, objetivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando el prompt");
      setResultado(data.prompt);
      setStep(4);
    } catch (e) {
      setError(e.message || "Algo fue mal. Inténtalo de nuevo.");
    }
    setLoading(false);
  }

  function copyPrompt() {
    const match = resultado.match(/TU PROMPT PERSONALIZADO\n---\n\n([\s\S]+?)\n\n---/);
    const text = match ? match[1].trim() : resultado;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setStep(1); setTema(""); setIa("");
    setSituacion(""); setObjetivo(""); setResultado(""); setError("");
  }

  return (
    <>
      <Head>
        <title>Generador de Prompts | promptbien.com</title>
        <meta name="description" content="Genera el prompt perfecto para ChatGPT, Claude o Gemini en 30 segundos. Gratis." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <style>{styles}</style>
      </Head>

      <nav className="nav">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <a href="/" className="nav-back">← Volver al inicio</a>
      </nav>

      <div className="wrap">
        {step < 4 && (
          <div className="progress">
            {["Tema", "Tu IA", "Tu caso", "Prompt"].map((label, i) => (
              <div key={i} className={`prog-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                {step > i + 1 ? "✓ " : ""}{label}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <h1>¿Sobre qué quieres consultar?</h1>
            <p className="sub">Elige el área y te generamos el prompt perfecto con el experto adecuado.</p>
            <div className="tema-grid">
              {TEMAS.map(t => (
                <div key={t.id} className={`tema-card ${tema === t.id ? "active" : ""}`} onClick={() => setTema(t.id)}>
                  <div className="tema-emoji">{t.label.split(" ")[0]}</div>
                  <div className="tema-name">{t.label.split(" ").slice(1).join(" ")}</div>
                  <div className="tema-desc">{t.desc}</div>
                </div>
              ))}
            </div>
            <button className="btn-main" disabled={!canStep2} onClick={() => setStep(2)}>Continuar →</button>
          </>
        )}

        {step === 2 && (
          <>
            <button className="back-btn" onClick={() => setStep(1)}>← Volver</button>
            <h1>¿En qué IA vas a usarlo?</h1>
            <p className="sub">Lo adaptamos para sacarle el máximo partido a cada una.</p>
            <div className="ia-list">
              {IAS.map(i => (
                <button key={i.id} className={`ia-btn ${ia === i.id ? "active" : ""}`} onClick={() => setIa(i.id)}>
                  <div className="ia-dot" style={{ background: ia === i.id ? i.color : "#D4D4D4" }} />
                  <span className="ia-name">{i.id}</span>
                </button>
              ))}
            </div>
            <button className="btn-main" disabled={!canStep3} onClick={() => setStep(3)}>Continuar →</button>
          </>
        )}

        {step === 3 && (
          <>
            <button className="back-btn" onClick={() => setStep(2)}>← Volver</button>
            <h1>Cuéntanos tu caso</h1>
            <p className="sub">Cuanto más detalle des, mejor será el prompt que recibas.</p>
            <div className="field">
              <label>Tu situación</label>
              <textarea rows={4} value={situacion} onChange={e => setSituacion(e.target.value)} placeholder={ph.situacion} />
            </div>
            <div className="field">
              <label>¿Qué quieres conseguir?</label>
              <textarea rows={3} value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder={ph.objetivo} />
            </div>
            {error && <div className="error-box">{error}</div>}
            <button className="btn-main" disabled={!canGenerate || loading} onClick={generatePrompt}>
              {loading ? "Generando tu prompt..." : "✨ Generar mi prompt"}
            </button>
            {loading && <p className="loading-text">Construyendo el mejor prompt posible para tu situación...</p>}
          </>
        )}

        {step === 4 && resultado && (
          <>
            <div className="result-header">
              <div className="result-title">Tu prompt está listo</div>
              <div className="result-badge">✓ Generado</div>
            </div>
            <div className="result-box">{resultado}</div>
            <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copyPrompt}>
              {copied ? "✓ ¡Copiado!" : "📋 Copiar prompt"}
            </button>
            <button className="btn-outline" onClick={reset}>Generar otro prompt</button>
            <div className="tip-box">
              💡 Pega el prompt en {ia}. Si la respuesta no es suficientemente específica, responde: <em>"Profundiza más en [el aspecto que más te interese]"</em>
            </div>
          </>
        )}
      </div>
    </>
  );
}