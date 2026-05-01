import Head from "next/head";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #5B4BF5; color: white; min-height: 100vh; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 55% 45% at 15% 10%, rgba(255,107,74,0.2) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 85% 85%, rgba(48,209,88,0.15) 0%, transparent 55%); pointer-events: none; z-index: 0; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.25rem,5vw,2.5rem); height: 62px; background: rgba(91,75,245,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; }
  .nav-logo span { color: #FF6B4A; }
  .wrap { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 1.5rem; }
  .card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 32px; padding: 40px 36px; max-width: 600px; width: 100%; text-align: center; }
  .emoji { font-size: 3.5rem; margin-bottom: 1.25rem; display: block; animation: bounce .6s ease; }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(1.6rem,4vw,2.2rem); font-weight: 900; letter-spacing: -.025em; margin-bottom: .6rem; line-height: 1.15; }
  .sub { font-size: .95rem; font-weight: 600; color: rgba(255,255,255,.65); line-height: 1.7; margin-bottom: 2rem; }
  .coffee { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,159,10,0.15); border: 1px solid rgba(255,159,10,0.3); color: #FF9F0A; font-size: .82rem; font-weight: 800; padding: 6px 16px; border-radius: 100px; margin-bottom: 2rem; }
  .features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; text-align: left; }
  .feature { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.06); border-radius: 14px; padding: 12px 16px; font-size: .88rem; font-weight: 600; color: rgba(255,255,255,.82); }
  .check { color: #30D158; font-weight: 900; flex-shrink: 0; }

  /* PROMPT RESULTADO */
  .prompt-result { background: rgba(0,0,0,.25); border: 1.5px solid rgba(255,255,255,.1); border-radius: 20px; padding: 22px; margin-bottom: 1.5rem; text-align: left; }
  .prompt-result-label { font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.35); margin-bottom: 12px; }
  .prompt-result-text { font-size: .88rem; font-weight: 600; color: rgba(255,255,255,.82); line-height: 1.75; white-space: pre-wrap; max-height: 280px; overflow-y: auto; }
  .prompt-result-text::-webkit-scrollbar { width: 4px; }
  .prompt-result-text::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 4px; }

  .btn-main { display: block; width: 100%; padding: 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; background: white; color: #5B4BF5; transition: all .25s; text-decoration: none; text-align: center; margin-bottom: 10px; }
  .btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,.15); }
  .btn-main.copied { background: #30D158; color: white; }
  .btn-outline { display: block; width: 100%; padding: 14px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,.2); background: transparent; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .92rem; font-weight: 700; color: rgba(255,255,255,.6); transition: all .2s; text-decoration: none; text-align: center; }
  .btn-outline:hover { border-color: rgba(255,255,255,.35); color: white; }
  .footer-note { font-size: .75rem; font-weight: 600; color: rgba(255,255,255,.3); margin-top: 1.25rem; line-height: 1.6; }

  .confetti { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .dot { position: absolute; border-radius: 50%; animation: fall linear forwards; }
  @keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
  @media (max-width: 480px) { .card { padding: 28px 20px; } }
`;

function Confetti() {
  const colors = ["#FF6B4A", "#30D158", "#FF9F0A", "#5B4BF5", "#FFD166", "#FFFFFF"];
  const dots = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 10 + 6}px`,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: `${Math.random() * 2}s`,
    duration: `${Math.random() * 2 + 2}s`,
  }));
  return (
    <div className="confetti">
      {dots.map(d => (
        <div key={d.id} className="dot" style={{ left: d.left, width: d.width, height: d.width, background: d.color, animationDelay: d.delay, animationDuration: d.duration, top: "-20px" }} />
      ))}
    </div>
  );
}

function buildPrompt(promptBody, fields, fieldValues) {
  if (!promptBody || !fields) return promptBody;
  let result = promptBody;
  fields.forEach(field => {
    const value = fieldValues[field.id];
    if (value) {
      const placeholder = `[${field.id.toUpperCase()}]`;
      result = result.replaceAll(placeholder, value);
    }
  });
  return result;
}

export default function PagoExitoso() {
  const { data: session } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [catalogPrompt, setCatalogPrompt] = useState(null);
  const [builtPrompt, setBuiltPrompt] = useState(null);
  const isCatalog = router.query.type === "catalog";

  useEffect(() => {
    setTimeout(() => setReady(true), 100);

    // Evento GA4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        currency: "EUR",
        value: 1.99,
        items: [{ item_name: isCatalog ? "Prompt catálogo" : "Prompt adicional", price: 1.99, quantity: 1 }]
      });
    }

    // Si es catálogo, carga el prompt y construye el resultado
    if (router.query.slug) {
      loadCatalogPrompt(router.query.slug, router.query.fields);
    }
  }, [router.query]);

  async function loadCatalogPrompt(slug, fieldsParam) {
    try {
      const res = await fetch(`/api/catalogo-slug?slug=${slug}`);
      const data = await res.json();
      if (data.prompt) {
        setCatalogPrompt(data.prompt);
        const fieldValues = fieldsParam ? JSON.parse(decodeURIComponent(fieldsParam)) : {};
        const built = buildPrompt(data.prompt.prompt_body, data.prompt.fields, fieldValues);
        setBuiltPrompt(built);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function copyPrompt() {
    const text = builtPrompt || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <Head>
        <title>¡Pago completado! | promptbien.com</title>
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      {ready && <Confetti />}

      <nav className="nav">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
      </nav>

      <div className="wrap">
        <div className="card">
          <span className="emoji">🎉</span>

          {isCatalog && catalogPrompt ? (
            <>
              <h1>Tu prompt está listo</h1>
              <p className="sub">Aquí tienes tu prompt personalizado, listo para copiar en ChatGPT, Claude o Gemini.</p>
              <div className="prompt-result">
                <div className="prompt-result-label">Tu prompt personalizado</div>
                <div className="prompt-result-text">{builtPrompt}</div>
              </div>
              <button className={`btn-main ${copied ? "copied" : ""}`} onClick={copyPrompt}>
                {copied ? "✓ ¡Copiado!" : "Copiar prompt"}
              </button>
              <a href="/catalogo" className="btn-outline">Ver más prompts del catálogo</a>
            </>
          ) : (
            <>
              <h1>¡Tu prompt está listo para generarse!</h1>
              <p className="sub">Hemos recibido tu pago correctamente. Ya tienes un crédito disponible para generar tu próximo prompt personalizado.</p>
              <div className="coffee">☕ Has invertido menos que un café</div>
              <div className="features">
                <div className="feature"><span className="check">✓</span><span>⚡ 1 crédito añadido a tu cuenta</span></div>
                <div className="feature"><span className="check">✓</span><span>🎯 Prompt con experto de primer nivel incluido</span></div>
                <div className="feature"><span className="check">✓</span><span>🤖 Adaptado a ChatGPT, Claude o Gemini</span></div>
                <div className="feature"><span className="check">✓</span><span>📋 Listo para copiar y pegar al instante</span></div>
              </div>
              <a href="/generar" className="btn-main">✨ Generar mi prompt ahora</a>
              <a href="/catalogo" className="btn-outline">Ver catálogo de prompts</a>
            </>
          )}

          <p className="footer-note">
            {session?.user?.email && `Cuenta: ${session.user.email}`}<br />
            Si tienes algún problema escríbenos a fab.workcorner@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}