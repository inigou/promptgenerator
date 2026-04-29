import { useState } from "react";
import Head from "next/head";

const TEMAS = [
  { id: "viajes", emoji: "✈️", label: "Viajes", desc: "Itinerarios y destinos", color: "#FF6B4A", bg: "rgba(255,107,74,0.15)", border: "rgba(255,107,74,0.4)" },
  { id: "salud", emoji: "🩺", label: "Salud", desc: "Consultas y diagnósticos", color: "#30D158", bg: "rgba(48,209,88,0.15)", border: "rgba(48,209,88,0.4)" },
  { id: "inmobiliario", emoji: "🏠", label: "Inmobiliario", desc: "Compra, venta e hipoteca", color: "#FF9F0A", bg: "rgba(255,159,10,0.15)", border: "rgba(255,159,10,0.4)" },
  { id: "otro", emoji: "💬", label: "Otro tema", desc: "Cualquier consulta", color: "#FFFFFF", bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.35)" },
];

const IAS = [
  { id: "ChatGPT", emoji: "🤖", color: "#30D158", bg: "rgba(48,209,88,0.15)", border: "rgba(48,209,88,0.4)", sub: "OpenAI" },
  { id: "Claude", emoji: "⚡", color: "#FF9F0A", bg: "rgba(255,159,10,0.15)", border: "rgba(255,159,10,0.4)", sub: "Anthropic" },
  { id: "Gemini", emoji: "✦", color: "#FF6B4A", bg: "rgba(255,107,74,0.15)", border: "rgba(255,107,74,0.4)", sub: "Google" },
];

const PLACEHOLDERS = {
  viajes: {
    situacion: "Ej: Quiero ir a Japón con mi pareja en octubre, 12 días, nos gusta la gastronomía y la cultura pero odiamos las masas...",
    objetivo: "Ej: Un itinerario día a día con alojamiento, transporte y restaurantes imprescindibles",
  },
  salud: {
    situacion: "Ej: Me han dicho que tengo el colesterol a 240 y el médico quiere recetarme estatinas, no fumo, tengo 48 años...",
    objetivo: "Ej: Entender si necesito medicación o puedo bajarlo con dieta y qué preguntarle al médico",
  },
  inmobiliario: {
    situacion: "Ej: Tengo hipoteca variable, me queda el 40% por pagar y tengo 25.000 euros ahorrados...",
    objetivo: "Ej: Saber si me compensa amortizar o invertir ese dinero, con números reales",
  },
  otro: {
    situacion: "Describe tu situación con todo el detalle que puedas...",
    objetivo: "Qué quieres conseguir exactamente",
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Nunito', -apple-system, sans-serif;
    background: #5B4BF5;
    color: #FFFFFF;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 15% 10%, rgba(255,107,74,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 45% 40% at 85% 85%, rgba(48,209,88,0.1) 0%, transparent 55%),
      radial-gradient(ellipse 50% 55% at 75% 15%, rgba(255,255,255,0.06) 0%, transparent 55%);
    pointer-events: none; z-index: 0;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1.25rem,5vw,2.5rem); height: 62px;
    background: rgba(91,75,245,0.6);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-back { font-size: .85rem; font-weight: 700; color: rgba(255,255,255,0.6); text-decoration: none; padding: 8px 18px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.2); transition: all .2s; }
  .nav-back:hover { color: white; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.35); }

  .wrap {
    position: relative; z-index: 1;
    max-width: 520px; margin: 0 auto;
    padding: 88px 1.25rem 100px;
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
  }

  .progress { display: flex; gap: 6px; margin-bottom: 2.5rem; }
  .prog-bar { height: 5px; border-radius: 5px; flex: 1; background: rgba(255,255,255,0.15); transition: background .4s; }
  .prog-bar.done { background: #30D158; }
  .prog-bar.active { background: rgba(255,255,255,0.6); }

  .step-chip { display: inline-flex; align-items: center; gap: 6px; font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: .9rem; }
  .step-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(1.8rem,5vw,2.3rem); font-weight: 900; line-height: 1.12; letter-spacing: -.025em; margin-bottom: .6rem; color: white; }
  .sub { font-size: .97rem; font-weight: 600; color: rgba(255,255,255,0.55); margin-bottom: 2rem; line-height: 1.65; }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .88rem; font-weight: 700; color: rgba(255,255,255,0.45); margin-bottom: 1.5rem; padding: 0; transition: color .2s; }
  .back-btn:hover { color: white; }

  .tema-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.75rem; }
  .tema-card {
    padding: 22px 18px; border-radius: 24px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.08);
    cursor: pointer; transition: all .2s; text-align: left;
  }
  .tema-card:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
  .tema-card.active { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
  .tema-emoji { font-size: 2rem; margin-bottom: 10px; display: block; }
  .tema-name { font-weight: 900; font-size: 1rem; color: white; margin-bottom: 4px; }
  .tema-desc { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,0.45); }

  .ia-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.75rem; }
  .ia-card {
    padding: 18px 22px; border-radius: 22px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.08);
    cursor: pointer; transition: all .2s;
    display: flex; align-items: center; gap: 14px;
    font-family: 'Nunito', sans-serif; width: 100%;
  }
  .ia-card:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
  .ia-card.active { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,0,0,0.18); }
  .ia-emoji { font-size: 1.5rem; }
  .ia-name { font-weight: 900; font-size: 1.05rem; color: white; }
  .ia-sub { font-size: .78rem; font-weight: 700; color: rgba(255,255,255,0.35); margin-left: auto; }
  .ia-check {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .8rem; font-weight: 900;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0; transition: all .25s;
  }

  .field { margin-bottom: 14px; }
  .field-label { display: block; font-size: .75rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
  .field textarea {
    width: 100%; padding: 16px 18px;
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    background: rgba(255,255,255,0.08);
    font-family: 'Nunito', sans-serif;
    font-size: .97rem; font-weight: 600;
    color: white; line-height: 1.6; resize: none; outline: none; transition: all .2s;
  }
  .field textarea::placeholder { color: rgba(255,255,255,0.22); }
  .field textarea:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.12); }

  .btn-main {
    width: 100%; padding: 17px; border-radius: 100px; border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900;
    transition: all .25s; letter-spacing: -.01em;
    background: #FF6B4A; color: white;
    box-shadow: 0 6px 24px rgba(255,107,74,0.45);
  }
  .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,74,0.55); }
  .btn-main:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-outline {
    width: 100%; padding: 16px; border-radius: 100px;
    border: 1.5px solid rgba(255,255,255,0.2);
    background: transparent; cursor: pointer;
    font-family: 'Nunito', sans-serif; font-size: .97rem; font-weight: 700;
    color: rgba(255,255,255,0.6); margin-top: 10px; transition: all .2s;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.4); color: white; }

  .loading-text { text-align: center; font-size: .85rem; font-weight: 600; color: rgba(255,255,255,0.4); margin-top: 14px; font-style: italic; }

  .error-box { background: rgba(255,69,58,0.15); border: 1.5px solid rgba(255,69,58,0.35); border-radius: 16px; padding: 12px 16px; font-size: .9rem; font-weight: 700; color: #FF6B6B; margin-bottom: 14px; }

  .result-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 1.25rem; }
  .result-title { font-family: 'Nunito', sans-serif; font-size: 1.7rem; font-weight: 900; letter-spacing: -.025em; line-height: 1.15; }
  .result-badge {
    background: rgba(48,209,88,0.18); border: 1.5px solid rgba(48,209,88,0.4);
    color: #30D158; border-radius: 100px; padding: 5px 14px;
    font-size: .75rem; font-weight: 800; white-space: nowrap; flex-shrink: 0;
  }

  .result-box {
    background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 22px; padding: 22px; font-size: .95rem; font-weight: 600;
    line-height: 1.8; color: rgba(255,255,255,0.88);
    max-height: 380px; overflow-y: auto; margin-bottom: 14px; white-space: pre-wrap;
  }
  .result-box::-webkit-scrollbar { width: 4px; }
  .result-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

  .copy-btn {
    width: 100%; padding: 17px; border-radius: 100px;
    font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900;
    border: none; cursor: pointer; transition: all .25s;
    background: white; color: #5B4BF5; letter-spacing: -.01em;
  }
  .copy-btn.copied { background: #30D158; color: white; }
  .copy-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }

  .tip-box {
    background: rgba(255,159,10,0.12); border: 1.5px solid rgba(255,159,10,0.25);
    border-radius: 18px; padding: 14px 18px; font-size: .86rem; font-weight: 600;
    color: rgba(255,255,255,0.6); line-height: 1.65; margin-top: 12px;
  }
  .tip-box em { color: #FF9F0A; font-style: normal; font-weight: 800; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .step-enter { animation: fadeUp .32s ease both; }

  @media (max-width: 480px) { h1 { font-size: 1.7rem; } .wrap { padding: 76px 1rem 80px; } .tema-grid { gap: 10px; } }
  @media (max-width: 360px) { .tema-grid { grid-template-columns: 1fr; } }
`;

export default function Generar() {
  const [step, setStep] = useState(1);
  const [tema, setTema] = useState(null);
  const [ia, setIa] = useState(null);
  const [situacion, setSituacion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const ph = PLACEHOLDERS[tema] || PLACEHOLDERS.otro;
  const canGenerate = situacion.trim().length > 15 && objetivo.trim().length > 8;

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
      setError(e.message || "Algo fue mal. Intentalo de nuevo.");
    }
    setLoading(false);
  }

  function copyPrompt() {
    const match = resultado.match(/TU PROMPT PERSONALIZADO\n---\n\n([\s\S]+?)\n\n---/);
    const text = match ? match[1].trim() : resultado;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function reset() {
    setStep(1); setTema(null); setIa(null);
    setSituacion(""); setObjetivo(""); setResultado(""); setError("");
  }

  return (
    <>
      <Head>
        <title>Generador de Prompts | promptbien.com</title>
        <meta name="description" content="Genera el prompt perfecto para ChatGPT, Claude o Gemini en 30 segundos. Gratis." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav className="nav">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <a href="/" className="nav-back">← Inicio</a>
      </nav>

      <div className="wrap">
        {step < 4 && (
          <div className="progress">
            {["Tema", "IA", "Caso", "Prompt"].map((_, i) => (
              <div key={i} className={"prog-bar" + (step > i + 1 ? " done" : step === i + 1 ? " active" : "")} />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="step-enter">
            <div className="step-chip"><div className="step-dot" />Paso 1 de 3</div>
            <h1>Sobre que quieres consultar?</h1>
            <p className="sub">Elige el area y asignamos el experto adecuado.</p>
            <div className="tema-grid">
              {TEMAS.map(t => (
                <button key={t.id}
                  className={"tema-card" + (tema === t.id ? " active" : "")}
                  onClick={() => { setTema(t.id); setTimeout(() => setStep(2), 150); }}
                  style={tema === t.id ? { borderColor: t.border, background: t.bg } : {}}>
                  <span className="tema-emoji">{t.emoji}</span>
                  <div className="tema-name">{t.label}</div>
                  <div className="tema-desc">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-enter">
            <button className="back-btn" onClick={() => setStep(1)}>← Volver</button>
            <div className="step-chip"><div className="step-dot" />Paso 2 de 3</div>
            <h1>En que IA lo usaras?</h1>
            <p className="sub">Adaptamos el prompt para sacarle el maximo a cada una.</p>
            <div className="ia-list">
              {IAS.map(i => (
                <button key={i.id}
                  className={"ia-card" + (ia === i.id ? " active" : "")}
                  onClick={() => { setIa(i.id); setTimeout(() => setStep(3), 150); }}
                  style={ia === i.id ? { borderColor: i.border, background: i.bg } : {}}>
                  <span className="ia-emoji">{i.emoji}</span>
                  <span className="ia-name">{i.id}</span>
                  <span className="ia-sub">{i.sub}</span>
                  <div className="ia-check" style={ia === i.id ? { background: i.color, color: "white" } : {}}>
                    {ia === i.id ? "✓" : ""}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-enter">
            <button className="back-btn" onClick={() => setStep(2)}>← Volver</button>
            <div className="step-chip"><div className="step-dot" />Paso 3 de 3</div>
            <h1>Cuentanos tu caso</h1>
            <p className="sub">Mas detalle = prompt mas personalizado.</p>
            <div className="field">
              <label className="field-label">Tu situacion</label>
              <textarea rows={4} value={situacion} onChange={e => setSituacion(e.target.value)} placeholder={ph.situacion} />
            </div>
            <div className="field">
              <label className="field-label">Que quieres conseguir?</label>
              <textarea rows={3} value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder={ph.objetivo} />
            </div>
            {error && <div className="error-box">{error}</div>}
            <button className="btn-main" disabled={!canGenerate || loading} onClick={generatePrompt}>
              {loading ? "Generando tu prompt..." : "Generar mi prompt"}
            </button>
            {loading && <p className="loading-text">Construyendo el mejor prompt para tu situacion...</p>}
          </div>
        )}

        {step === 4 && resultado && (
          <div className="step-enter">
            <div className="result-header">
              <div className="result-title">Tu prompt esta listo!</div>
              <div className="result-badge">Generado</div>
            </div>
            <div className="result-box">{resultado}</div>
            <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copyPrompt}>
              {copied ? "Copiado!" : "Copiar prompt"}
            </button>
            <button className="btn-outline" onClick={reset}>Generar otro prompt</button>
            <div className="tip-box">
              Pega el prompt en <em>{ia}</em>. Si la respuesta no es suficientemente especifica, responde: <em>Profundiza mas en el aspecto que mas te interese</em>
            </div>
          </div>
        )}
      </div>
    </>
  );
}