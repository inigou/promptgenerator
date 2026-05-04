import Head from "next/head";
import { useState, useEffect } from "react";

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Puede ChatGPT ayudarme con problemas familiares?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, con el prompt correcto. ChatGPT puede ayudarte a preparar conversaciones difíciles, entender dinámicas familiares y encontrar perspectivas que no ves desde dentro. No sustituye a un terapeuta pero puede ser un primer paso muy útil." } },
    { "@type": "Question", "name": "¿Cómo usar la IA para comunicarme mejor con mi hijo adolescente?", "acceptedAnswer": { "@type": "Answer", "text": "Un buen prompt para este tema incluye la edad del hijo, el punto concreto de conflicto, cómo está la comunicación ahora y qué has intentado. Sin ese contexto, la IA te dará consejos genéricos de crianza que ya conoces." } },
    { "@type": "Question", "name": "¿Puede ChatGPT ayudarme a preparar el proceso de divorcio?", "acceptedAnswer": { "@type": "Answer", "text": "Puede ayudarte a entender el proceso, los pasos legales y las preguntas que debes hacerle a un abogado. No sustituye al asesoramiento legal pero te permite llegar mucho más preparado a esa primera consulta." } },
    { "@type": "Question", "name": "¿Es gratis el generador de prompts para temas de familia?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, tu primer prompt es completamente gratuito y sin registro. A partir del segundo, cada prompt cuesta 1,99€. Sin suscripción ni compromiso." } }
  ]
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  :root { --indigo: #5B4BF5; --indigo-light: #F0EEFF; --coral: #FF6B4A; --green: #30D158; --amber: #FF9F0A; --yellow: #FFD60A; --text: #1A1A2E; --text-2: #4A4A6A; --text-3: #8A8AAA; --border: #E8E8F5; --bg: #F8F7FF; --r: 24px; --r-sm: 18px; }
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
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255,214,10,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 80% 80%, rgba(255,107,74,0.12) 0%, transparent 55%); pointer-events: none; }
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
  .example-tag { display: inline-block; background: rgba(255,214,10,.2); color: #FFD60A; font-size: .7rem; font-weight: 800; padding: 3px 10px; border-radius: 100px; margin-top: .6rem; }
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
  .faq-a { max-height: 0; overflow: hidden; transition: max-height .35s ease; padding: 0 22px; font-size: .92rem; font-weight: 600; color: var(--text-2); line-height: 1.75; }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 22px 18px; }
  .cta-sec { background: #FFD60A; text-align: center; padding: clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem); }
  .cta-sec h2 { color: #1A1A2E; }
  .cta-sec .lead { color: rgba(26,26,46,.65); margin: 1rem auto 2rem; }
  .btn-dark { background: #1A1A2E; color: white; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; padding: 16px 40px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 8px 28px rgba(0,0,0,.2); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-dark:hover { transform: translateY(-3px); }
  .cta-note { font-size: .82rem; font-weight: 600; color: rgba(26,26,46,.45); margin-top: 1rem; }
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

export default function Familia() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const faqs = [
    { q: "¿Puede ChatGPT ayudarme con problemas familiares?", a: "Sí, con el prompt correcto. ChatGPT puede ayudarte a preparar conversaciones difíciles, entender dinámicas familiares y encontrar perspectivas que no ves desde dentro. No sustituye a un terapeuta pero puede ser un primer paso muy útil." },
    { q: "¿Cómo usar la IA para comunicarme mejor con mi hijo adolescente?", a: "Un buen prompt incluye la edad del hijo, el punto concreto de conflicto, cómo está la comunicación ahora y qué has intentado. Sin ese contexto, la IA te dará consejos genéricos de crianza que ya conoces." },
    { q: "¿Puede ChatGPT ayudarme a preparar el proceso de divorcio?", a: "Puede ayudarte a entender el proceso, los pasos legales y las preguntas que debes hacerle a un abogado. No sustituye al asesoramiento legal pero te permite llegar mucho más preparado a esa primera consulta." },
    { q: "¿Es gratis el generador de prompts para temas de familia?", a: "Sí, tu primer prompt es completamente gratuito y sin registro. A partir del segundo, cada prompt cuesta 1,99€. Sin suscripción ni compromiso." },
  ];

  return (
    <>
      <Head>
        <title>Prompts para Temas de Familia con ChatGPT | promptbien.com</title>
        <meta name="description" content="Genera el prompt perfecto para gestionar conflictos familiares, divorcio, adolescentes o cuidado de padres mayores con ChatGPT, Claude o Gemini. Primer prompt gratis." />
        <meta name="keywords" content="prompt familia chatgpt, como usar ia para problemas familiares, chatgpt divorcio, prompt adolescentes ia, cuidar padres mayores chatgpt, prompt herencia chatgpt" />
        <link rel="canonical" href="https://www.promptbien.com/familia" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Prompts para Temas de Familia con ChatGPT · promptbien.com" />
        <meta property="og:description" content="Navega los momentos familiares más difíciles con la perspectiva que la IA puede darte." />
        <meta property="og:url" content="https://www.promptbien.com/familia" />
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
        <div className="hero-badge">👨‍👩‍👧 Prompts para Familia</div>
        <h1>Los momentos familiares difíciles <em>merecen perspectiva</em></h1>
        <p className="hero-sub">Genera el prompt perfecto para navegar un divorcio, reconectar con un hijo adolescente, gestionar una herencia o cuidar a tus padres. Con ChatGPT, Claude o Gemini.</p>
        <a href="/generar" className="btn-coral">✨ Generar mi prompt familiar gratis</a>
      </header>

      <section>
        <div className="eyebrow ctr">El problema</div>
        <h2 className="ctr">¿Por qué la IA no te ayuda bien con temas de familia?</h2>
        <p className="lead ctr">Los problemas familiares son los más personales. Sin tu contexto real, la IA da consejos de manual. Con el prompt correcto, actúa como el consejero que te da perspectiva honesta.</p>
        <div className="problems-grid">
          {[
            { icon: "👶", title: "Consejos de manual de crianza", desc: "Le preguntas por tu hijo adolescente y te da los 5 consejos clásicos. Sin conocer la edad, el conflicto concreto ni lo que ya has intentado.", sol: "promptbien incluye el contexto familiar real" },
            { icon: "⚖️", title: "Información legal sin tu caso", desc: "Le preguntas sobre el divorcio y te explica el proceso genérico. Sin saber si hay hijos, bienes o qué tipo de relación hay entre vosotros.", sol: "promptbien detalla tu situación específica" },
            { icon: "💔", title: "Sin empatía ni perspectiva", desc: "Los problemas de pareja o familia requieren perspectiva psicológica real. Un prompt sin rol de especialista da respuestas superficiales.", sol: "promptbien asigna el experto correcto" },
            { icon: "🏠", title: "Herencias sin contexto legal", desc: "Sin saber qué bienes hay, cuántos herederos ni si hay testamento, la IA no puede orientarte sobre los pasos reales a dar.", sol: "promptbien incluye todos los detalles relevantes" },
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
        <div className="eyebrow">Ejemplos de prompts para familia</div>
        <h2>Qué puedes conseguir con el prompt correcto</h2>
        <p className="lead">Desde preparar una conversación difícil hasta entender tus derechos en un divorcio.</p>
        <div className="examples-grid">
          {[
            { emoji: "💬", title: "Hablar con un hijo adolescente", desc: "Cómo iniciar una conversación real sin que acabe en discusión y qué hay detrás del comportamiento.", tag: "Comunicación" },
            { emoji: "⚖️", title: "Entender el proceso de divorcio", desc: "Qué decide un convenio regulador, qué es negociable y qué errores evitar antes de hablar con el abogado.", tag: "Legal" },
            { emoji: "🏠", title: "Gestionar una herencia sin conflicto", desc: "Pasos legales, plazos que no puedes perder y cómo resolver desacuerdos entre herederos sin llegar a juicio.", tag: "Herencia" },
            { emoji: "👴", title: "Organizar el cuidado de padres mayores", desc: "Residencia, cuidador en casa o familiar: cómo evaluar opciones, costes y el sistema de dependencia en España.", tag: "Mayores" },
            { emoji: "💑", title: "Afrontar una crisis de pareja", desc: "Qué distingue una crisis superable de una relación que ha llegado a su fin. Perspectiva honesta.", tag: "Pareja" },
            { emoji: "🎓", title: "Ayudar a elegir carrera universitaria", desc: "Cómo orientar sin imponer y con información real del mercado laboral 2025-2030.", tag: "Educación" },
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
        <h2 className="ctr">Mismo problema. Prompt diferente. Perspectiva diferente.</h2>
        <div className="ba-grid reveal">
          <div className="ba-card ba-bad">
            <div className="ba-label">❌ Sin promptbien</div>
            <p className="ba-text">"ChatGPT, mi hijo adolescente ya no me habla. ¿Qué hago?"</p>
            <div className="ba-result">⚠️ Los 5 consejos clásicos: escúchale sin juzgar, pasa tiempo de calidad, respeta su espacio... Lo mismo que en cualquier blog de crianza.</div>
          </div>
          <div className="ba-card ba-good">
            <div className="ba-label">✅ Con promptbien</div>
            <p className="ba-text">"Actúa como psicólogo familiar especializado en adolescencia. Mi hijo de 16 años lleva 6 meses prácticamente sin hablarme desde que me separé. Solo monosílabos. He intentado hablar tranquilamente pero siempre acaba en tensión. Dame 3 cosas concretas que pueda hacer esta semana y dime qué errores cometo sin darme cuenta que empeoran la situación."</p>
            <div className="ba-result">✅ Análisis específico de la dinámica, errores concretos del padre y 3 acciones aplicables esta semana adaptadas a la situación del divorcio.</div>
          </div>
        </div>
      </section>

      <section className="faq-sec" id="faq">
        <div className="eyebrow ctr">FAQ</div>
        <h2 className="ctr">Preguntas sobre prompts de familia con IA</h2>
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
        <h2>La perspectiva que necesitas te espera</h2>
        <p className="lead">Genera el prompt perfecto para tu situación familiar en 30 segundos. Gratis, sin registro.</p>
        <a href="/generar" className="btn-dark">✨ Generar mi prompt familiar gratis</a>
        <p className="cta-note">Primer prompt gratis · 1,99€ por prompt · Sin suscripción</p>
      </section>

      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <div className="foot-links">
          <a href="/">Inicio</a>
          <a href="/generar">Generador</a>
          <a href="/salud">Salud</a>
          <a href="/inmobiliario">Inmobiliario</a>
          <a href="/emprender">Emprender</a>
          <a href="/finanzas">Finanzas</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
        </div>
        <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.35)" }}>© 2026 promptbien.com</div>
      </footer>
    </>
  );
}