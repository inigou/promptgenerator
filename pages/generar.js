import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";

const TEMAS = [
  { id: "viajes", emoji: "✈️", label: "Viajes", desc: "Itinerarios y destinos", color: "#FF6B4A", bg: "rgba(255,107,74,0.15)", border: "rgba(255,107,74,0.4)" },
  { id: "salud", emoji: "🩺", label: "Salud", desc: "Consultas y diagnósticos", color: "#30D158", bg: "rgba(48,209,88,0.15)", border: "rgba(48,209,88,0.4)" },
  { id: "inmobiliario", emoji: "🏠", label: "Inmobiliario", desc: "Compra, venta e hipoteca", color: "#FF9F0A", bg: "rgba(255,159,10,0.15)", border: "rgba(255,159,10,0.4)" },
  { id: "otro", emoji: "💬", label: "Otro tema", desc: "Cualquier consulta", color: "#FFFFFF", bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.35)" },
];

const IAS = [
  { id: "ChatGPT", emoji: "🤖", color: "#30D158", bg: "rgba(48,209,88,0.15)", border: "rgba(48,209,88,0.35)", sub: "OpenAI" },
  { id: "Claude", emoji: "⚡", color: "#FF9F0A", bg: "rgba(255,159,10,0.15)", border: "rgba(255,159,10,0.35)", sub: "Anthropic" },
  { id: "Gemini", emoji: "✦", color: "#FF6B4A", bg: "rgba(255,107,74,0.15)", border: "rgba(255,107,74,0.35)", sub: "Google" },
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

const TIPS = {
  viajes: ["Tu edad y con quién viajas", "Fechas y días disponibles", "Qué odias de los viajes típicos", "Presupuesto aproximado"],
  salud: ["Tu edad y situación general", "Diagnóstico o síntoma concreto", "Medicación o historial relevante", "Qué quieres preguntarle al médico"],
  inmobiliario: ["Tu situación financiera actual", "Tipo de hipoteca y lo que queda", "Zona o presupuesto si es compra", "Qué decisión necesitas tomar"],
  otro: ["Tu contexto y punto de partida", "Lo que ya sabes o has intentado", "A qué nivel quieres la respuesta", "Qué formato te sería más útil"],
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', -apple-system, sans-serif; background: #5B4BF5; color: #FFF; min-height: 100vh; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 55% 45% at 15% 10%, rgba(255,107,74,0.18) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 85% 85%, rgba(48,209,88,0.1) 0%, transparent 55%), radial-gradient(ellipse 50% 55% at 75% 15%, rgba(255,255,255,0.06) 0%, transparent 55%); pointer-events: none; z-index: 0; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.25rem,5vw,2.5rem); height: 62px; background: rgba(91,75,245,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-user { font-size: .82rem; font-weight: 700; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 100px; }
  .nav-back { font-size: .85rem; font-weight: 700; color: rgba(255,255,255,0.6); text-decoration: none; padding: 8px 18px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.2); transition: all .2s; }
  .nav-back:hover { color: white; background: rgba(255,255,255,0.1); }
  .page-layout { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 88px 1.25rem 100px; }
  .wrap { width: 100%; max-width: 520px; flex-shrink: 0; }
  .tips-sidebar { position: fixed; right: calc(50% - 520px - 240px); top: 50%; transform: translateY(-50%); width: 200px; opacity: 0; transition: opacity .5s ease; pointer-events: none; }
  .tips-sidebar.visible { opacity: 1; }
  .tips-label { font-size: .68rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 14px; }
  .tip-line { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px; opacity: 0; transform: translateX(8px); transition: opacity .4s ease, transform .4s ease; }
  .tips-sidebar.visible .tip-line:nth-child(2) { opacity: 1; transform: translateX(0); transition-delay: .1s; }
  .tips-sidebar.visible .tip-line:nth-child(3) { opacity: 1; transform: translateX(0); transition-delay: .2s; }
  .tips-sidebar.visible .tip-line:nth-child(4) { opacity: 1; transform: translateX(0); transition-delay: .3s; }
  .tips-sidebar.visible .tip-line:nth-child(5) { opacity: 1; transform: translateX(0); transition-delay: .4s; }
  .tip-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); flex-shrink: 0; margin-top: 6px; }
  .tip-text { font-size: .82rem; font-weight: 600; color: rgba(255,255,255,0.35); line-height: 1.5; }
  @media (max-width: 1100px) { .tips-sidebar { display: none; } }
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
  .tema-card { padding: 22px 18px; border-radius: 24px; border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.08); cursor: pointer; transition: all .2s; text-align: left; }
  .tema-card:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
  .tema-card.active { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
  .tema-emoji { font-size: 2rem; margin-bottom: 10px; display: block; }
  .tema-name { font-weight: 900; font-size: 1rem; color: white; margin-bottom: 4px; }
  .tema-desc { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,0.45); }
  .ia-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.75rem; }
  .ia-card { padding: 18px 22px; border-radius: 22px; border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.08); cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 14px; font-family: 'Nunito', sans-serif; width: 100%; }
  .ia-card:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
  .ia-card.active { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,0,0,0.18); }
  .ia-emoji { font-size: 1.5rem; }
  .ia-name { font-weight: 900; font-size: 1.05rem; color: white; }
  .ia-sub { font-size: .78rem; font-weight: 700; color: rgba(255,255,255,0.35); margin-left: auto; }
  .ia-check { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .8rem; font-weight: 900; background: rgba(255,255,255,0.1); flex-shrink: 0; transition: all .25s; }
  .field { margin-bottom: 14px; }
  .field-label { display: block; font-size: .75rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
  .field textarea { width: 100%; padding: 16px 18px; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 18px; background: rgba(255,255,255,0.08); font-family: 'Nunito', sans-serif; font-size: .97rem; font-weight: 600; color: white; line-height: 1.6; resize: none; outline: none; transition: all .2s; }
  .field textarea::placeholder { color: rgba(255,255,255,0.22); }
  .field textarea:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.12); }
  .btn-main { width: 100%; padding: 17px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; transition: all .25s; background: #FF6B4A; color: white; box-shadow: 0 6px 24px rgba(255,107,74,0.45); }
  .btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,74,0.55); }
  .btn-main:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-google { width: 100%; padding: 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; transition: all .25s; background: white; color: #1a1a1a; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .btn-google:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }
  .btn-google-icon { width: 20px; height: 20px; }
  .btn-pay { width: 100%; padding: 17px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; transition: all .25s; background: #FF6B4A; color: white; box-shadow: 0 6px 24px rgba(255,107,74,0.45); }
  .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,74,0.55); }
  .btn-outline { width: 100%; padding: 16px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .97rem; font-weight: 700; color: rgba(255,255,255,0.6); margin-top: 10px; transition: all .2s; }
  .btn-outline:hover { border-color: rgba(255,255,255,0.4); color: white; }
  .loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 18px; }
  .loading-spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); border-top-color: rgba(255,255,255,0.7); animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg { font-size: .92rem; font-weight: 700; color: rgba(255,255,255,0.6); text-align: center; line-height: 1.5; }
  .loading-sub { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,0.3); text-align: center; }
  .error-box { background: rgba(255,69,58,0.15); border: 1.5px solid rgba(255,69,58,0.35); border-radius: 16px; padding: 12px 16px; font-size: .9rem; font-weight: 700; color: #FF6B6B; margin-bottom: 14px; }
  .wall { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 28px; padding: 36px 28px; text-align: center; }
  .wall-emoji { font-size: 3rem; margin-bottom: 1rem; display: block; }
  .wall-title { font-family: 'Nunito', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: .6rem; }
  .wall-sub { font-size: .93rem; font-weight: 600; color: rgba(255,255,255,0.55); margin-bottom: 1.5rem; line-height: 1.65; }
  .wall-free-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(48,209,88,0.15); border: 1px solid rgba(48,209,88,0.3); color: #30D158; font-size: .8rem; font-weight: 800; padding: 6px 16px; border-radius: 100px; margin-bottom: 1.5rem; }
  .wall-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; color: rgba(255,255,255,0.25); font-size: .8rem; font-weight: 700; }
  .wall-divider::before, .wall-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
  .pay-wall { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 28px; padding: 36px 28px; text-align: center; }
  .pay-amount { font-family: 'Nunito', sans-serif; font-size: 3.5rem; font-weight: 900; color: #FFD166; line-height: 1; margin-bottom: .2rem; }
  .pay-per { font-size: .88rem; font-weight: 600; color: rgba(255,255,255,0.4); margin-bottom: 2rem; }
  .pay-feats { list-style: none; text-align: left; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 10px; }
  .pay-feats li { font-size: .92rem; font-weight: 600; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 10px; }
  .pay-feats li::before { content: "✓"; color: #30D158; font-weight: 900; flex-shrink: 0; }
  .result-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 1.25rem; }
  .result-title { font-family: 'Nunito', sans-serif; font-size: 1.7rem; font-weight: 900; letter-spacing: -.025em; line-height: 1.15; }
  .result-badge { background: rgba(48,209,88,0.18); border: 1.5px solid rgba(48,209,88,0.4); color: #30D158; border-radius: 100px; padding: 5px 14px; font-size: .75rem; font-weight: 800; white-space: nowrap; flex-shrink: 0; }
  .result-box { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 22px; padding: 22px; font-size: .95rem; font-weight: 600; line-height: 1.8; color: rgba(255,255,255,0.88); max-height: 380px; overflow-y: auto; margin-bottom: 14px; white-space: pre-wrap; }
  .result-box::-webkit-scrollbar { width: 4px; }
  .result-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  .copy-btn { width: 100%; padding: 17px; border-radius: 100px; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; border: none; cursor: pointer; transition: all .25s; background: white; color: #5B4BF5; }
  .copy-btn.copied { background: #30D158; color: white; }
  .copy-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }
  .tip-box { background: rgba(255,159,10,0.12); border: 1.5px solid rgba(255,159,10,0.25); border-radius: 18px; padding: 14px 18px; font-size: .86rem; font-weight: 600; color: rgba(255,255,255,0.6); line-height: 1.65; margin-top: 12px; }
  .tip-box em { color: #FF9F0A; font-style: normal; font-weight: 800; }
  .credits-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(48,209,88,0.15); border: 1px solid rgba(48,209,88,0.3); color: #30D158; font-size: .75rem; font-weight: 800; padding: 5px 12px; border-radius: 100px; margin-bottom: 1rem; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .step-enter { animation: fadeUp .32s ease both; }
  @media (max-width: 480px) { h1 { font-size: 1.7rem; } .page-layout { padding: 76px 1rem 80px; } .tema-grid { gap: 10px; } }
  @media (max-width: 360px) { .tema-grid { grid-template-columns: 1fr; } }
`;

export default function Generar() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [tema, setTema] = useState(null);
  const [ia, setIa] = useState(null);
  const [situacion, setSituacion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [tipsVisible, setTipsVisible] = useState(false);
  const [wall, setWall] = useState(null);

  // Mostrar login wall si no hay sesión (una vez cargado)
  useEffect(() => {
    if (status === "unauthenticated") {
      setWall("login");
    } else if (status === "authenticated") {
      setWall(null);
    }
  }, [status]);

  useEffect(() => {
    if (step === 3 && !wall) {
      const t = setTimeout(() => setTipsVisible(true), 200);
      return () => clearTimeout(t);
    } else {
      setTipsVisible(false);
    }
  }, [step, wall]);

  const ph = PLACEHOLDERS[tema] || PLACEHOLDERS.otro;
  const tips = TIPS[tema] || TIPS.otro;
  const canGenerate = situacion.trim().length > 15 && objetivo.trim().length > 8;

  // prompts_used: 0 = nunca ha generado (prompt gratis disponible)
  const promptsUsed = session?.user?.prompts_used ?? 0;
  const promptsPaid = session?.user?.prompts_paid ?? 0;
  const isFreePromptAvailable = promptsUsed === 0;
  const credits = promptsPaid - Math.max(0, promptsUsed - 1);

  async function generatePrompt() {
    setLoading(true);
    setError("");
    setWall(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ia, tema, situacion, objetivo }),
      });

      const data = await res.json();

      if (res.status === 401) { setWall("login"); setLoading(false); return; }
      if (res.status === 402) { setWall("payment"); setLoading(false); return; }
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
    setSituacion(""); setObjetivo(""); setResultado(""); setError(""); setWall(null);
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
        <div className="nav-right">
          {session && (
            <span className="nav-user">
              {isFreePromptAvailable ? "✨ 1 prompt gratis" : credits > 0 ? `⚡ ${credits} prompt${credits > 1 ? "s" : ""}` : session.user.email?.split("@")[0]}
            </span>
          )}
          <a href="/" className="nav-back">← Inicio</a>
        </div>
      </nav>

      {step === 3 && !wall && (
        <div className={"tips-sidebar" + (tipsVisible ? " visible" : "")}>
          <div className="tips-label">Incluye en tu caso</div>
          {tips.map((tip, i) => (
            <div className="tip-line" key={i}>
              <div className="tip-dot" />
              <span className="tip-text">{tip}</span>
            </div>
          ))}
        </div>
      )}

      <div className="page-layout">
        <div className="wrap">

          {/* LOGIN WALL — aparece si no hay sesión */}
          {wall === "login" && (
            <div className="step-enter">
              <div className="wall">
                <span className="wall-emoji">✨</span>
                <h1 className="wall-title">Genera tu primer prompt gratis</h1>
                <p className="wall-sub">Entra con Google en un clic. Tu primer prompt es completamente gratis — sin tarjeta, sin compromiso.</p>
                <div className="wall-free-badge">✓ Primer prompt gratis incluido</div>
                <button className="btn-google" onClick={() => signIn("google", { callbackUrl: "/generar" })}>
                  <svg className="btn-google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </button>
                <p style={{ fontSize: ".75rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
                  Al continuar aceptas nuestros{" "}
                  <a href="/terminos" style={{ color: "rgba(255,255,255,0.5)" }}>Términos</a>
                  {" "}y{" "}
                  <a href="/privacidad" style={{ color: "rgba(255,255,255,0.5)" }}>Privacidad</a>
                </p>
              </div>
            </div>
          )}

          {/* PAYMENT WALL */}
          {wall === "payment" && (
            <div className="step-enter">
              <div className="pay-wall">
                <span className="wall-emoji">⚡</span>
                <h1 className="wall-title">Genera tu siguiente prompt</h1>
                <div className="pay-amount">1,99€</div>
                <div className="pay-per">por prompt · pago puntual · sin suscripción</div>
                <ul className="pay-feats">
                  <li>Prompt personalizado con experto de primer nivel</li>
                  <li>Adaptado a tu IA — ChatGPT, Claude o Gemini</li>
                  <li>Listo para copiar y pegar al instante</li>
                  <li>Menos que un café, más útil que cualquier búsqueda</li>
                </ul>
                <a
                  href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "#"}
                  className="btn-pay"
                  style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                >
                  Pagar 1,99€ con Stripe
                </a>
                <button className="btn-outline" onClick={() => setWall(null)}>Volver atrás</button>
              </div>
            </div>
          )}

          {/* FLUJO PRINCIPAL — solo si hay sesión y no hay wall */}
          {!wall && status === "authenticated" && (
            <>
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
                  <h1>Sobre qué quieres consultar?</h1>
                  <p className="sub">Elige el área y asignamos el experto adecuado.</p>
                  <div className="tema-grid">
                    {TEMAS.map(t => (
                      <button key={t.id} className={"tema-card" + (tema === t.id ? " active" : "")}
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
                  <h1>En qué IA lo usarás?</h1>
                  <p className="sub">Adaptamos el prompt para sacarle el máximo a cada una.</p>
                  <div className="ia-list">
                    {IAS.map(i => (
                      <button key={i.id} className={"ia-card" + (ia === i.id ? " active" : "")}
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
                  <h1>Cuéntanos tu caso</h1>
                  <p className="sub">Más detalle = prompt más personalizado.</p>
                  {isFreePromptAvailable && (
                    <div className="credits-badge">✨ Tu primer prompt es gratis</div>
                  )}
                  {!isFreePromptAvailable && credits > 0 && (
                    <div className="credits-badge">⚡ {credits} prompt{credits > 1 ? "s" : ""} disponible{credits > 1 ? "s" : ""}</div>
                  )}
                  <div className="field">
                    <label className="field-label">Tu situación</label>
                    <textarea rows={4} value={situacion} onChange={e => setSituacion(e.target.value)} placeholder={ph.situacion} />
                  </div>
                  <div className="field">
                    <label className="field-label">Qué quieres conseguir?</label>
                    <textarea rows={3} value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder={ph.objetivo} />
                  </div>
                  {error && <div className="error-box">{error}</div>}
                  <button className="btn-main" disabled={!canGenerate || loading} onClick={generatePrompt}>
                    {loading ? "Generando tu prompt..." : isFreePromptAvailable ? "Generar mi prompt gratis" : "Generar mi prompt"}
                  </button>
                  {loading && (
                    <div className="loading-wrap">
                      <div className="loading-spinner" />
                      <div className="loading-msg">Construyendo tu prompt personalizado...</div>
                      <div className="loading-sub">Puede tardar hasta 15 segundos. ¡Vale la pena! ☕</div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && resultado && (
                <div className="step-enter">
                  <div className="result-header">
                    <div className="result-title">Tu prompt está listo!</div>
                    <div className="result-badge">✓ Generado</div>
                  </div>
                  <div className="result-box">{resultado}</div>
                  <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copyPrompt}>
                    {copied ? "✓ Copiado!" : "Copiar prompt"}
                  </button>
                  <button className="btn-outline" onClick={reset}>Generar otro prompt</button>
                  <div className="tip-box">
                    Pega el prompt en <em>{ia}</em>. Si la respuesta no es suficientemente específica, responde: <em>"Profundiza más en [el aspecto que más te interese]"</em>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Mini footer legal */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, padding: "10px", zIndex: 50, background: "rgba(91,75,245,0.5)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[["Privacidad", "/privacidad"], ["Términos", "/terminos"], ["Cookies", "/cookies"]].map(([label, href]) => (
          <a key={href} href={href} style={{ fontSize: ".73rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</a>
        ))}
      </div>
    </>
  );
}