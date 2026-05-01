import Head from "next/head";
import { useState, useEffect } from "react";

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Cómo usar ChatGPT para preparar una consulta médica?", "acceptedAnswer": { "@type": "Answer", "text": "Para preparar una consulta médica con ChatGPT necesitas un prompt que incluya tu edad, síntomas concretos, historial relevante, medicación actual y las preguntas específicas que quieres hacerle al médico. promptbien construye ese prompt en 30 segundos." } },
    { "@type": "Question", "name": "¿Puede la IA ayudarme a entender mi diagnóstico?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, con el prompt correcto. La IA puede explicarte un diagnóstico en términos comprensibles, darte contexto sobre opciones de tratamiento y ayudarte a preparar preguntas para tu médico. No sustituye al médico pero te permite llegar a la consulta mucho más informado." } },
    { "@type": "Question", "name": "¿Es seguro consultar temas de salud a ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "ChatGPT puede darte información médica valiosa pero no sustituye a un médico. Es útil para entender diagnósticos, preparar consultas y obtener contexto. promptbien construye prompts que especifican este límite para que la IA responda de forma rigurosa y honesta." } },
    { "@type": "Question", "name": "¿Es gratis el generador de prompts para salud?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, tu primer prompt es completamente gratuito y sin registro. A partir del segundo, cada prompt cuesta 1,99€. Sin suscripción ni compromiso." } }
  ]
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  :root { --indigo: #5B4BF5; --indigo-light: #F0EEFF; --coral: #FF6B4A; --green: #30D158; --amber: #FF9F0A; --text: #1A1A2E; --text-2: #4A4A6A; --text-3: #8A8AAA; --border: #E8E8F5; --bg: #F8F7FF; --r: 24px; --r-sm: 18px; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); height: 66px; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #E8E8F5; }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.45rem; font-weight: 900; color: #1A1A2E; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-link-btn { font-size: .88rem; font-weight: 700; color: #4A4A6A; text-decoration: none; padding: 10px 20px; border-radius: 100px; border: 1.5px solid #E0E0F0; transition: all .2s; background: white; }
  .nav-link-btn:hover { border-color: #5B4BF5; color: #5B4BF5; }
  .nav-cta { background: #FF6B4A; color: white; font-size: .88rem; font-weight: 800; padding: 10px 22px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); }
  .hero { min-height: 85vh; padding: 110px clamp(1.5rem,5vw,4rem) 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: var(--indigo); position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 20%, rgba(48,209,88,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 80% 80%, rgba(255,107,74,0.12) 0%, transparent 55%); pointer-events: none; }
  .hero > * { position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); font-size: .78rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; padding: 8px 20px; border-radius: 100px; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.2); }
  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(2.2rem,5vw,3.8rem); font-weight: 900; line-height: 1.1; letter-spacing: -.025em; max-width: 800px; color: white; margin-bottom: 1.2rem; }
  h1 em { font-style: normal; color: #FFD166; }
  .hero-sub { font-size: clamp(.95rem,2vw,1.15rem); color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.7; font-weight: 600; }
  .btn-coral { background: #FF6B4A; color: white; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; padding: 15px 32px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 6px 22px rgba(255,107,74,.45); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-coral:hover { transform: translateY(-3px); }
  section { padding: clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem); }
  .eyebrow { font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--indigo); margin-bottom: .8rem; }
  h2 { font-family: 'Nunito', sans-serif; font-size: clamp(1.7rem,3.5vw,2.5rem); font-weight: 900; line-height: 1.12; letter-spacing: -.02em; margin-bottom: 1rem; color: var(--text); }
  h3 { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); margin-bottom: .5rem; }
  .lead { font-size: 1rem; font-weight: 600; color: var(--text-2); max-width: 580px; line-height: 1.75; }
  .ctr { text-align: center; }
  .ctr .lead { margin: 0 auto; }
  .problems-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 2.5rem; }
  .prob-card { background: white; border-radius: var(--r); border: 2px solid var(--border); padding: 24px; transition: all .2s; }
  .prob-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,75,245,.1); }
  .prob-icon { font-size: 1.8rem; margin-bottom: .75rem; }
  .prob-desc { font-size: .9rem; font-weight: 600; color: var(--text-2); line-height: 1.6; }
  .solution-tag { display: inline-block; background: #E8FAF0; color: #1a8a3a; font-size: .72rem; font-weight: 800; padding: 3px 10px; border-radius: 100px; margin-top: .6rem; }
  .examples-sec { background: var(--indigo); color: white; }
  .examples-sec h2 { color: white; }
  .examples-sec .lead { color: rgba(255,255,255,.65); }
  .examples-sec .eyebrow { color: #FFD166; }
  .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 2.5rem; }
  .example-card { background: rgba(255,255,255,.07); border: 1.5px solid rgba(255,255,255,.1); border-radius: var(--r); padding: 24px; transition: all .2s; }
  .example-card:hover { background: rgba(255,255,255,.11); }
  .example-emoji { font-size: 1.8rem; margin-bottom: .75rem; display: block; }
  .example-title { font-weight: 800; font-size: .95rem; margin-bottom: .5rem; }
  .example-desc { font-size: .85rem; font-weight: 600; color: rgba(255,255,255,.6); line-height: 1.6; }
  .example-tag { display: inline-block; background: rgba(48,209,88,.2); color: #30D158; font-size: .7rem; font-weight: 800; padding: 3px 10px; border-radius: 100px; margin-top: .6rem; }
  .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 2.5rem; max-width: 900px; margin-left: auto; margin-right: auto; }
  .ba-card { border-radius: var(--r); padding: 26px; border: 2px solid var(--border); }
  .ba-bad { background: white; }
  .ba-good { background: var(--indigo); color: white; box-shadow: 0 8px 30px rgba(91,75,245,.3); border-color: var(--indigo); }
  .ba-label { font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: .75rem; }
  .ba-bad .ba-label { color: var(--text-3); }
  .ba-good .ba-label { color: rgba(255,255,255,.6); }
  .ba-text { font-size: .9rem; font-weight: 600; line-height: 1.7; }
  .ba-bad .ba-text { color: var(--text-2); }
  .ba-good .ba-text { color: rgba(255,255,255,.9); }
  .ba-result { margin-top: .75rem; padding: 10px 14px; border-radius: 12px; font-size: .8rem; font-weight: 700; }
  .ba-bad .ba-result { background: #FFF4E0; color: #b45309; }
  .ba-good .ba-result { background: rgba(255,255,255,.12); color: rgba(255,255,255,.85); }
  .faq-sec { background: white; }
  .faq-list { max-width: 720px; margin: 2.5rem auto 0; }
  .faq-item { background: var(--bg); border-radius: var(--r-sm); border: 2px solid var(--border); margin-bottom: 10px; overflow: hidden; }
  .faq-q { padding: 18px 22px; font-weight: 800; font-size: .95rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; user-select: none; color: var(--text); }
  .faq-icon { width: 26px; height: 26px; border-radius: 50%; background: var(--indigo-light); color: var(--indigo); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 900; flex-shrink: 0; transition: all .2s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--indigo); color: white; }
  .faq-a { max-height: 0; overflow: hidden; transition: max-height .35s ease, padding .35s ease; padding: 0 22px; font-size: .92rem; font-weight: 600; color: var(--text-2); line-height: 1.75; }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 22px 18px; }
  .cta-sec { background: #30D158; text-align: center; padding: clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem); }
  .cta-sec h2 { color: white; }
  .cta-sec .lead { color: rgba(255,255,255,.8); margin: 1rem auto 2rem; }
  .btn-white { background: white; color: #30D158; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; padding: 16px 40px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 8px 28px rgba(0,0,0,.15); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-white:hover { transform: translateY(-3px); }
  .cta-note { font-size: .82rem; font-weight: 600; color: rgba(255,255,255,.55); margin-top: 1rem; }
  footer { background: #1A1A2E; color: rgba(255,255,255,.5); padding: 32px clamp(1.5rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .foot-logo { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: white; }
  .foot-logo span { color: #FF6B4A; }
  .foot-links { display: flex; gap: 1.5rem; font-size: .84rem; font-weight: 700; flex-wrap: wrap; }
  .foot-links a { color: rgba(255,255,255,.55); text-decoration: none; }
  .foot-links a:hover { color: white; }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .reveal.vis { opacity: 1; transform: translateY(0); }
  @media (max-width: 768px) { .ba-grid { grid-template-columns: 1fr; } }
  @media (max-width: 480px) { .nav-link-btn { display: none; } }
`;

export default function Salud() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const faqs = [
    { q: "¿Cómo usar ChatGPT para preparar una consulta médica?", a: "Necesitas un prompt que incluya tu edad, síntomas concretos, historial relevante, medicación actual y las preguntas específicas que quieres hacerle al médico. promptbien construye ese prompt en 30 segundos." },
    { q: "¿Puede la IA ayudarme a entender mi diagnóstico?", a: "Sí, con el prompt correcto. La IA puede explicarte un diagnóstico en términos comprensibles y ayudarte a preparar preguntas para tu médico. No sustituye al médico pero te permite llegar a la consulta mucho más informado." },
    { q: "¿Es seguro consultar temas de salud a ChatGPT?", a: "ChatGPT puede darte información médica valiosa pero no sustituye a un médico. Es útil para entender diagnósticos y preparar consultas. promptbien especifica este límite para que la IA responda de forma rigurosa y honesta." },
    { q: "¿Es gratis el generador de prompts para salud?", a: "Sí, tu primer prompt es completamente gratuito y sin registro. A partir del segundo, cada prompt cuesta 1,99€. Sin suscripción ni compromiso." },
  ];

  return (
    <>
      <Head>
        <title>Prompts para Consultas Médicas con ChatGPT | promptbien.com</title>
        <meta name="description" content="Genera el prompt perfecto para preparar tu consulta médica con ChatGPT, Claude o Gemini. Entiende tu diagnóstico y llega informado al médico. Primer prompt gratis." />
        <meta name="keywords" content="prompt para consulta medica chatgpt, como usar chatgpt para salud, chatgpt diagnostico medico, prompt salud ia, preparar consulta medico con ia, entender diagnostico chatgpt" />
        <link rel="canonical" href="https://www.promptbien.com/salud" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Prompts para Consultas Médicas con ChatGPT · promptbien.com" />
        <meta property="og:description" content="Llega a tu consulta médica bien informado. Genera el prompt perfecto en 30 segundos." />
        <meta property="og:url" content="https://www.promptbien.com/salud" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="/" className="nav-link-btn">← Inicio</a>
          <a href="/generar" className="nav-cta">✨ Generar prompt gratis</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-badge">🩺 Prompts para Salud</div>
        <h1>Llega a tu consulta médica <em>bien informado</em></h1>
        <p className="hero-sub">Genera el prompt perfecto para entender tu diagnóstico, preparar preguntas para el médico y tomar decisiones de salud informadas. Con ChatGPT, Claude o Gemini.</p>
        <a href="/generar" className="btn-coral">✨ Generar mi prompt de salud gratis</a>
      </header>

      <section>
        <div className="eyebrow ctr">El problema</div>
        <h2 className="ctr">¿Por qué la IA no te ayuda bien con temas de salud?</h2>
        <p className="lead ctr">Sin contexto personal, la IA da respuestas de Wikipedia. Con el prompt correcto, actúa como el especialista que necesitas.</p>
        <div className="problems-grid">
          {[
            { icon: "📋", title: "Respuestas de manual médico", desc: "Le preguntas sobre tus síntomas y te da la definición de la enfermedad. Sin tener en cuenta tu edad, historial ni medicación actual.", sol: "promptbien añade todo tu contexto personal" },
            { icon: "🤷", title: "Sin rol de especialista", desc: "Sin indicarle que actúe como un médico especialista concreto, la IA responde como un generalista. La diferencia en calidad es enorme.", sol: "promptbien asigna el especialista correcto" },
            { icon: "❓", title: "No sabe qué preguntar", desc: "Vas al médico sin saber qué preguntar y sales de la consulta con más dudas que antes. La IA puede ayudarte a preparar esas preguntas.", sol: "promptbien genera las preguntas clave" },
            { icon: "😰", title: "Respuestas que dan miedo", desc: "Sin restricciones claras, la IA tiende al catastrofismo. Un prompt bien construido pide respuestas honestas pero calibradas.", sol: "promptbien incluye instrucciones de rigor" },
          ].map((p, i) => (
            <article className="prob-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="prob-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p className="prob-desc">{p.desc}</p>
              <span className="solution-tag">✓ {p.sol}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="examples-sec">
        <div className="eyebrow">Ejemplos de prompts para salud</div>
        <h2>Qué puedes conseguir con el prompt correcto</h2>
        <p className="lead">Desde entender una analítica hasta preparar preguntas para el especialista. La IA puede ser tu mejor aliado antes de la consulta.</p>
        <div className="examples-grid">
          {[
            { emoji: "🔬", title: "Entender tu analítica", desc: "Qué significan tus valores fuera de rango, qué preguntas hacerle al médico y qué cambios de hábito pueden ayudar.", tag: "Análisis clínicos" },
            { emoji: "💊", title: "Colesterol alto a los 48", desc: "Entender si necesitas medicación o puedes bajarlo con dieta, con evidencia científica real y no consejos genéricos.", tag: "Cardiología" },
            { emoji: "😴", title: "Mejorar el sueño", desc: "Hábitos respaldados por evidencia científica para mejorar la calidad del sueño, adaptados a tu situación concreta.", tag: "Bienestar" },
            { emoji: "🦴", title: "Preparar visita al traumatólogo", desc: "Qué preguntar sobre una lesión, opciones de tratamiento disponibles y cómo evaluar si necesitas cirugía.", tag: "Traumatología" },
            { emoji: "🧠", title: "Gestión del estrés", desc: "Técnicas basadas en evidencia para reducir el estrés crónico, con un plan personalizado según tu estilo de vida.", tag: "Salud mental" },
            { emoji: "🩻", title: "Segunda opinión informada", desc: "Cómo preparar una segunda opinión médica con las preguntas correctas y la información relevante organizada.", tag: "Diagnóstico" },
          ].map((e, i) => (
            <article className="example-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="example-emoji">{e.emoji}</span>
              <h3 className="example-title">{e.title}</h3>
              <p className="example-desc">{e.desc}</p>
              <span className="example-tag">{e.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="eyebrow ctr">La diferencia</div>
        <h2 className="ctr">Mismo síntoma. Prompt diferente. Respuesta diferente.</h2>
        <div className="ba-grid reveal">
          <div className="ba-card ba-bad">
            <div className="ba-label">❌ Sin promptbien</div>
            <p className="ba-text">"ChatGPT, tengo el colesterol alto, qué hago"</p>
            <div className="ba-result">⚠️ Lista genérica: come sano, haz ejercicio, evita grasas. La misma respuesta para cualquier persona.</div>
          </div>
          <div className="ba-card ba-good">
            <div className="ba-label">✅ Con promptbien</div>
            <p className="ba-text">"Actúa como médico internista con el rigor de la Clínica Mayo. Tengo 48 años, colesterol LDL 185, no fumo, hago ejercicio moderado. El médico quiere recetarme estatinas. Dame un análisis de si puedo bajarlo con dieta en 3 meses y qué preguntas específicas hacerle al médico."</p>
            <div className="ba-result">✅ Análisis personalizado con protocolo de dieta específico, plazos realistas y lista de preguntas para el médico.</div>
          </div>
        </div>
      </section>

      <section className="faq-sec" id="faq">
        <div className="eyebrow ctr">FAQ</div>
        <h2 className="ctr">Preguntas sobre prompts de salud con IA</h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={"faq-item" + (openFaq === i ? " open" : "")}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a" style={{ maxHeight: openFaq === i ? "300px" : "0", padding: openFaq === i ? "0 22px 18px" : "0 22px" }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-sec">
        <h2>Llega informado a tu próxima consulta</h2>
        <p className="lead">Genera el prompt perfecto para salud en 30 segundos. Gratis, sin registro, sin tarjeta.</p>
        <a href="/generar" className="btn-white">✨ Generar mi prompt de salud gratis</a>
        <p className="cta-note">Primer prompt gratis · 1,99€ por prompt · Sin suscripción</p>
      </section>

      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <div className="foot-links">
          <a href="/">Inicio</a>
          <a href="/generar">Generador</a>
          <a href="/viajes">Viajes</a>
          <a href="/inmobiliario">Inmobiliario</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
        </div>
        <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.35)" }}>© 2026 promptbien.com</div>
      </footer>
    </>
  );
}