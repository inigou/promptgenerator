import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "promptbien",
  "url": "https://www.promptbien.com",
  "description": "Generador de prompts personalizados para ChatGPT, Claude y Gemini. Obtén respuestas de experto en viajes, salud, inmobiliario y cualquier tema en 30 segundos.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "inLanguage": "es",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "312" }
};

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es un generador de prompts para ChatGPT?",
      "acceptedAnswer": { "@type": "Answer", "text": "Un generador de prompts es una herramienta que construye automáticamente instrucciones optimizadas para IAs como ChatGPT, Claude o Gemini. En lugar de escribir una pregunta simple y recibir una respuesta genérica, el generador construye un prompt con rol de experto, contexto detallado y objetivos claros para que la IA responda como un especialista de primer nivel." }
    },
    {
      "@type": "Question",
      "name": "¿Cómo hacer un buen prompt para ChatGPT?",
      "acceptedAnswer": { "@type": "Answer", "text": "Un buen prompt para ChatGPT necesita cuatro elementos: un rol de experto específico ('actúa como nutricionista especializado en...'), tu situación concreta con todos los detalles relevantes, el objetivo preciso que quieres conseguir, y las instrucciones sobre el formato de respuesta. promptbien.com construye todo esto automáticamente en 30 segundos sin que necesites saber nada de prompt engineering." }
    },
    {
      "@type": "Question",
      "name": "¿Para qué sirve un prompt bien escrito?",
      "acceptedAnswer": { "@type": "Answer", "text": "Un prompt bien escrito transforma la respuesta de la IA de un texto genérico de blog a una consulta personalizada de experto. La diferencia es comparable a buscar en Google vs. tener una consulta privada con el mejor especialista del mundo en tu tema. El mismo ChatGPT da respuestas radicalmente distintas dependiendo de cómo le preguntas." }
    },
    {
      "@type": "Question",
      "name": "¿Funciona para viajes, salud e inmobiliario?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí. promptbien tiene prompts especialmente optimizados para planificar viajes con ChatGPT (con la metodología de Rick Steves), preparar consultas médicas (con el rigor de la Clínica Mayo), y tomar decisiones inmobiliarias (con el criterio de Gonzalo Bernardos). También funciona para cualquier otro tema." }
    },
    {
      "@type": "Question",
      "name": "¿Es gratis el generador de prompts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí, los primeros 3 prompts al día son completamente gratuitos. El pack ilimitado tiene un coste de 4,99€ de pago único, sin suscripción mensual ni compromiso. No necesitas crear una cuenta ni proporcionar email para usar la versión gratuita." }
    },
    {
      "@type": "Question",
      "name": "¿Funciona con Claude y Gemini además de ChatGPT?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí. Al iniciar el proceso seleccionas la IA que usarás y el prompt se adapta específicamente para ella. ChatGPT, Claude y Gemini tienen características distintas y los prompts generados están optimizados para sacarle el máximo a cada una." }
    },
    {
      "@type": "Question",
      "name": "¿Por qué la IA me da respuestas genéricas?",
      "acceptedAnswer": { "@type": "Answer", "text": "Las IAs como ChatGPT responden en función de cómo les preguntas. Sin contexto específico, la IA asume que debe dar una respuesta válida para cualquier persona, lo que resulta en respuestas genéricas que podrías encontrar en cualquier blog. Con un prompt que incluye tu situación concreta, un rol de experto y un objetivo claro, la IA puede darte una respuesta personalizada de nivel profesional." }
    }
  ]
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "promptbien",
  "url": "https://www.promptbien.com",
  "logo": "https://www.promptbien.com/logo.png",
  "sameAs": []
};

const CSS = `
  :root {
    --coral: #FF6B4A;
    --coral-light: #FFF0ED;
    --coral-mid: #FFD4CC;
    --teal: #00C9A7;
    --teal-light: #E6FAF6;
    --amber: #FFB800;
    --amber-light: #FFF8E6;
    --indigo: #4F46E5;
    --indigo-light: #EEF2FF;
    --bg: #FAFAF8;
    --surface: #FFFFFF;
    --text: #0F0F0F;
    --text-2: #4A4A4A;
    --text-3: #8A8A8A;
    --border: #EBEBEB;
    --r: 24px;
    --r-sm: 16px;
    --r-xs: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.07);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); height: 64px; background: rgba(250,250,248,0.88); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); transition: box-shadow .3s; }
  .nav-logo { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--text); text-decoration: none; }
  .nav-logo span { color: var(--coral); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-link { font-size: .85rem; color: var(--text-2); text-decoration: none; font-weight: 500; }
  .nav-link:hover { color: var(--coral); }
  .nav-cta { background: var(--coral); color: white; font-size: .85rem; font-weight: 700; padding: 9px 20px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,107,74,.4); }

  /* HERO */
  .hero { min-height: 100vh; padding: 110px clamp(1.5rem,5vw,4rem) 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .blob-1 { width: 500px; height: 500px; background: rgba(255,107,74,.15); top: -150px; right: -150px; }
  .blob-2 { width: 400px; height: 400px; background: rgba(0,201,167,.12); bottom: -100px; left: -100px; }
  .blob-3 { width: 300px; height: 300px; background: rgba(255,184,0,.1); top: 30%; left: 10%; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--coral-light); color: var(--coral); font-size: .78rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 7px 18px; border-radius: 100px; margin-bottom: 2rem; border: 1px solid var(--coral-mid); animation: fadeUp .5s ease both; }
  h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.4rem,6vw,4.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -.025em; max-width: 860px; animation: fadeUp .5s .1s ease both; }
  h1 em { font-style: normal; color: var(--coral); }
  .hero-sub { font-size: clamp(1rem,2vw,1.2rem); color: var(--text-2); max-width: 580px; margin: 1.5rem auto 2.5rem; animation: fadeUp .5s .2s ease both; line-height: 1.7; }
  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; animation: fadeUp .5s .3s ease both; margin-bottom: 3.5rem; }

  /* BUTTONS */
  .btn-primary { background: var(--coral); color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 700; padding: 15px 32px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 6px 20px rgba(255,107,74,.4); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(255,107,74,.45); }
  .btn-secondary { background: white; color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 600; padding: 15px 32px; border-radius: 100px; border: 1.5px solid var(--border); cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-secondary:hover { border-color: var(--coral); color: var(--coral); transform: translateY(-2px); }

  /* HERO DEMO */
  .hero-demo { width: 100%; max-width: 680px; background: white; border-radius: var(--r); border: 1px solid var(--border); box-shadow: var(--shadow-lg); overflow: hidden; animation: fadeUp .6s .4s ease both; }
  .demo-bar { padding: 13px 18px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
  .demo-url { flex: 1; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; font-size: .78rem; color: var(--text-3); text-align: center; }
  .demo-body { padding: 28px 32px; }
  .demo-step { font-size: .7rem; font-weight: 700; color: var(--coral); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; }
  .demo-q { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
  .demo-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .demo-opt { padding: 12px 16px; border-radius: var(--r-xs); border: 1.5px solid var(--border); font-size: .88rem; font-weight: 500; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 8px; background: var(--bg); font-family: inherit; }
  .demo-opt:hover, .demo-opt.sel { border-color: var(--coral); background: var(--coral-light); color: var(--coral); }
  .demo-prog { height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .demo-prog-bar { height: 100%; width: 33%; background: var(--coral); border-radius: 4px; transition: width .3s; }

  /* STATS */
  .stats { background: var(--text); padding: 22px clamp(1.5rem,5vw,4rem); display: flex; gap: clamp(2rem,6vw,5rem); justify-content: center; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-n { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--coral); }
  .stat-l { font-size: .78rem; color: rgba(255,255,255,.55); margin-top: 2px; }

  /* SECTIONS */
  section { padding: clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem); }
  .eyebrow { font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--coral); margin-bottom: .8rem; }
  h2 { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 800; line-height: 1.12; letter-spacing: -.02em; margin-bottom: 1rem; }
  .lead { font-size: 1.05rem; color: var(--text-2); max-width: 580px; line-height: 1.75; }
  .ctr { text-align: center; }
  .ctr .lead { margin: 0 auto; }

  /* PROBLEM SECTION */
  .problem-sec { background: white; }
  .problems-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 3rem; }
  .problem-card { border-radius: var(--r); border: 1.5px solid var(--border); padding: 28px; background: var(--bg); transition: all .25s; }
  .problem-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--coral-mid); }
  .prob-icon { font-size: 2rem; margin-bottom: 1rem; }
  .prob-title { font-weight: 700; font-size: 1rem; margin-bottom: .5rem; color: var(--text); }
  .prob-desc { font-size: .9rem; color: var(--text-2); line-height: 1.65; }
  .solution-tag { display: inline-block; background: var(--teal-light); color: var(--teal); font-size: .72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-top: .75rem; }

  /* HOW IT WORKS */
  .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 3.5rem; }
  .step-card { background: white; border-radius: var(--r); border: 1px solid var(--border); padding: 32px 26px; transition: all .25s; position: relative; overflow: hidden; }
  .step-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .step-card:nth-child(1)::after { background: var(--coral); }
  .step-card:nth-child(2)::after { background: var(--teal); }
  .step-card:nth-child(3)::after { background: var(--amber); }
  .step-card:nth-child(4)::after { background: var(--indigo); }
  .step-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
  .step-n { font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; opacity: .06; line-height: 1; margin-bottom: .5rem; }
  .step-icon { font-size: 2rem; margin-bottom: .75rem; display: block; }
  .step-title { font-weight: 700; font-size: 1rem; margin-bottom: .5rem; }
  .step-desc { font-size: .9rem; color: var(--text-2); line-height: 1.65; }

  /* VERTICALS */
  .vert-sec { background: var(--text); color: white; }
  .vert-sec h2 { color: white; }
  .vert-sec .lead { color: rgba(255,255,255,.6); }
  .vert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 3.5rem; }
  .v-card { border-radius: var(--r); padding: 32px 28px; border: 1px solid rgba(255,255,255,.08); transition: all .25s; }
  .v-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,.2); }
  .v-travel { background: linear-gradient(135deg,#1a1a1a,#0d1f1f); }
  .v-health { background: linear-gradient(135deg,#1a1a1a,#0d0d20); }
  .v-real { background: linear-gradient(135deg,#1a1a1a,#200d0d); }
  .v-free { background: linear-gradient(135deg,#1a1a1a,#0d1a10); }
  .v-emoji { font-size: 2.4rem; margin-bottom: 1rem; display: block; }
  .v-tag { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 4px 12px; border-radius: 100px; display: inline-block; margin-bottom: 1rem; }
  .v-travel .v-tag { background: var(--teal-light); color: var(--teal); }
  .v-health .v-tag { background: var(--indigo-light); color: var(--indigo); }
  .v-real .v-tag { background: var(--coral-light); color: var(--coral); }
  .v-free .v-tag { background: var(--amber-light); color: #b45309; }
  .v-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; margin-bottom: .6rem; }
  .v-desc { font-size: .88rem; color: rgba(255,255,255,.6); line-height: 1.65; margin-bottom: 1.5rem; }
  .v-list { display: flex; flex-direction: column; gap: 8px; }
  .v-item { background: rgba(255,255,255,.05); border-radius: var(--r-xs); padding: 10px 14px; font-size: .83rem; color: rgba(255,255,255,.78); border: 1px solid rgba(255,255,255,.07); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }
  .v-item::before { content: "→"; color: var(--coral); flex-shrink: 0; }

  /* BEFORE / AFTER */
  .ba-sec { background: var(--bg); }
  .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 3rem; max-width: 960px; margin-left: auto; margin-right: auto; }
  .ba-card { border-radius: var(--r); padding: 28px; border: 1px solid var(--border); }
  .ba-bad { background: white; }
  .ba-good { background: var(--coral); color: white; box-shadow: 0 8px 32px rgba(255,107,74,.3); }
  .ba-label { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
  .ba-bad .ba-label { color: var(--text-3); }
  .ba-good .ba-label { color: rgba(255,255,255,.7); }
  .ba-text { font-size: .93rem; line-height: 1.75; }
  .ba-bad .ba-text { color: var(--text-2); }
  .ba-good .ba-text { color: white; font-weight: 500; }
  .ba-result { margin-top: 1rem; padding: 11px 15px; border-radius: var(--r-xs); font-size: .82rem; font-weight: 600; }
  .ba-bad .ba-result { background: #FFF3CD; color: #856404; }
  .ba-good .ba-result { background: rgba(255,255,255,.18); color: white; }

  /* PROBLEMS LONG FORM */
  .longform-sec { background: white; }
  .longform-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-top: 3rem; }
  .longform-text h3 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -.01em; }
  .longform-text p { font-size: .97rem; color: var(--text-2); line-height: 1.8; margin-bottom: 1.2rem; }
  .longform-text ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .longform-text ul li { font-size: .95rem; color: var(--text-2); padding-left: 1.5rem; position: relative; line-height: 1.65; }
  .longform-text ul li::before { content: "✓"; position: absolute; left: 0; color: var(--teal); font-weight: 700; }
  .longform-cards { display: flex; flex-direction: column; gap: 14px; }
  .lf-card { background: var(--bg); border-radius: var(--r-sm); border: 1px solid var(--border); padding: 22px; }
  .lf-card-title { font-weight: 700; font-size: .95rem; margin-bottom: .4rem; display: flex; align-items: center; gap: 8px; }
  .lf-card-desc { font-size: .88rem; color: var(--text-2); line-height: 1.65; }

  /* TESTIMONIALS */
  .proof-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 3rem; }
  .proof-card { background: white; border-radius: var(--r); border: 1px solid var(--border); padding: 28px; transition: all .25s; }
  .proof-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
  .stars { color: var(--amber); font-size: .95rem; margin-bottom: .75rem; letter-spacing: 2px; }
  .proof-text { font-size: .92rem; color: var(--text-2); line-height: 1.72; margin-bottom: 1.2rem; font-style: italic; }
  .proof-author { display: flex; align-items: center; gap: 10px; }
  .proof-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .88rem; color: white; flex-shrink: 0; }
  .proof-name { font-weight: 600; font-size: .88rem; }
  .proof-role { font-size: .77rem; color: var(--text-3); }

  /* PRICING */
  .pricing-sec { background: var(--bg); }
  .price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 3.5rem; max-width: 720px; margin-left: auto; margin-right: auto; }
  .price-card { border-radius: var(--r); padding: 36px 32px; border: 1.5px solid var(--border); background: white; position: relative; transition: all .25s; }
  .price-card.feat { background: var(--text); color: white; border-color: var(--text); box-shadow: 0 16px 48px rgba(0,0,0,.2); }
  .price-card:hover { transform: translateY(-4px); }
  .feat-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--coral); color: white; font-size: .73rem; font-weight: 700; letter-spacing: .04em; padding: 5px 18px; border-radius: 100px; white-space: nowrap; }
  .price-plan { font-size: .78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: .75rem; }
  .price-card .price-plan { color: var(--text-3); }
  .price-card.feat .price-plan { color: rgba(255,255,255,.5); }
  .price-amt { font-family: 'Syne', sans-serif; font-size: 3.4rem; font-weight: 800; line-height: 1; margin-bottom: .2rem; }
  .price-card.feat .price-amt { color: var(--coral); }
  .price-per { font-size: .88rem; color: var(--text-3); margin-bottom: 1.5rem; }
  .price-card.feat .price-per { color: rgba(255,255,255,.45); }
  .price-feats { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; }
  .price-feats li { font-size: .92rem; display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
  .price-feats li::before { content: "✓"; font-weight: 700; color: var(--teal); flex-shrink: 0; margin-top: 1px; }
  .price-card.feat .price-feats li { color: rgba(255,255,255,.8); }
  .price-btn { width: 100%; padding: 14px; border-radius: 100px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: .95rem; font-weight: 700; cursor: pointer; transition: all .2s; border: none; }
  .price-btn-free { background: var(--bg); color: var(--text); border: 1.5px solid var(--border); }
  .price-btn-free:hover { border-color: var(--coral); color: var(--coral); }
  .price-btn-paid { background: var(--coral); color: white; box-shadow: 0 6px 18px rgba(255,107,74,.4); }
  .price-btn-paid:hover { transform: scale(1.02); box-shadow: 0 10px 28px rgba(255,107,74,.5); }

  /* FAQ */
  .faq-sec { background: var(--bg); }
  .faq-list { max-width: 760px; margin: 3rem auto 0; }
  .faq-item { background: white; border-radius: var(--r-sm); border: 1px solid var(--border); margin-bottom: 10px; overflow: hidden; }
  .faq-item:hover { box-shadow: var(--shadow); }
  .faq-q { padding: 22px 26px; font-weight: 600; font-size: .97rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; user-select: none; }
  .faq-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--coral-light); color: var(--coral); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; flex-shrink: 0; transition: all .2s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--coral); color: white; }
  .faq-a { max-height: 0; overflow: hidden; transition: max-height .35s ease, padding .35s ease; padding: 0 26px; font-size: .93rem; color: var(--text-2); line-height: 1.78; }
  .faq-item.open .faq-a { max-height: 400px; padding: 0 26px 22px; }

  /* FINAL CTA */
  .cta-sec { background: var(--coral); text-align: center; padding: clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem); }
  .cta-sec h2 { color: white; }
  .cta-sec .lead { color: rgba(255,255,255,.8); margin: 1rem auto 2.5rem; }
  .btn-white { background: white; color: var(--coral); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; font-weight: 700; padding: 16px 40px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 8px 28px rgba(0,0,0,.15); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-white:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,.2); }
  .cta-note { font-size: .82rem; color: rgba(255,255,255,.6); margin-top: 1rem; }

  /* FOOTER */
  footer { background: var(--text); color: rgba(255,255,255,.45); padding: 40px clamp(1.5rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .foot-logo { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: white; }
  .foot-logo span { color: var(--coral); }
  .foot-links { display: flex; gap: 1.5rem; font-size: .84rem; flex-wrap: wrap; }
  .foot-links a { color: rgba(255,255,255,.45); text-decoration: none; }
  .foot-links a:hover { color: white; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
  .reveal.vis { opacity: 1; transform: translateY(0); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .ba-grid { grid-template-columns: 1fr; }
    .longform-grid { grid-template-columns: 1fr; gap: 2rem; }
    .nav-link { display: none; }
  }
  @media (max-width: 480px) {
    .demo-opts { grid-template-columns: 1fr; }
    .hero-ctas { flex-direction: column; align-items: center; }
    .hero-ctas a { width: 100%; text-align: center; }
  }
`;

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [demoSel, setDemoSel] = useState(0);
  const revealRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    const nav = document.querySelector("nav");
    const onScroll = () => { if (nav) nav.style.boxShadow = window.scrollY > 20 ? "0 2px 20px rgba(0,0,0,.08)" : "none"; };
    window.addEventListener("scroll", onScroll);
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const faqs = [
    { q: "¿Qué es un generador de prompts para ChatGPT?", a: "Un generador de prompts es una herramienta que construye automáticamente instrucciones optimizadas para IAs como ChatGPT, Claude o Gemini. En lugar de escribir una pregunta simple y recibir una respuesta genérica, el generador construye un prompt con rol de experto, contexto detallado y objetivos claros para que la IA responda como un especialista." },
    { q: "¿Cómo hacer un buen prompt para ChatGPT?", a: "Un buen prompt para ChatGPT necesita cuatro elementos: un rol de experto específico, tu situación concreta con todos los detalles relevantes, el objetivo preciso que quieres conseguir, y las instrucciones sobre el formato de respuesta. promptbien.com construye todo esto automáticamente en 30 segundos." },
    { q: "¿Por qué ChatGPT me da respuestas genéricas?", a: "Las IAs responden en función de cómo les preguntas. Sin contexto específico, la IA asume que debe dar una respuesta válida para cualquier persona, lo que resulta en respuestas de blog. Con un prompt que incluye tu situación concreta, un rol de experto y un objetivo claro, la IA puede darte una respuesta de nivel profesional personalizada." },
    { q: "¿Funciona para viajes, salud e inmobiliario?", a: "Sí. promptbien tiene prompts especialmente optimizados para planificar viajes con ChatGPT, preparar consultas médicas, y tomar decisiones inmobiliarias. También funciona para cualquier otro tema con la opción de consulta libre." },
    { q: "¿Es gratis el generador de prompts?", a: "Sí, los primeros 3 prompts al día son completamente gratuitos. El pack ilimitado tiene un coste de 4,99€ de pago único, sin suscripción mensual ni compromiso. No necesitas cuenta ni email para la versión gratuita." },
    { q: "¿Funciona con Claude y Gemini además de ChatGPT?", a: "Sí. Al iniciar el proceso seleccionas la IA que usarás y el prompt se adapta específicamente para ella. ChatGPT, Claude y Gemini tienen características distintas y los prompts generados están optimizados para cada una." },
    { q: "¿Qué diferencia hay entre el plan gratuito y el pack de 4,99€?", a: "El plan gratuito permite 3 prompts al día, más que suficiente para uso esporádico. El pack de 4,99€ es un pago único que desbloquea prompts ilimitados con contexto más enriquecido. Sin suscripción, sin renovación automática." },
  ];

  return (
    <>
      <Head>
        <title>Generador de Prompts para ChatGPT, Claude y Gemini | promptbien.com</title>
        <meta name="description" content="Genera el prompt perfecto para ChatGPT, Claude o Gemini en 30 segundos. Obtén respuestas de experto en viajes, salud, inmobiliario y cualquier tema. Gratis. Sin registro." />
        <meta name="keywords" content="generador de prompts, generador de prompts chatgpt, cómo hacer un buen prompt chatgpt, cómo preguntarle bien a la ia, prompt para planificar viaje chatgpt, prompt para consulta medica ia, prompt inmobiliario chatgpt, prompt generator español, hacer prompts ia, mejorar prompts chatgpt" />
        <link rel="canonical" href="https://www.promptbien.com/" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.promptbien.com/" />
        <meta property="og:title" content="Generador de Prompts para ChatGPT · promptbien.com" />
        <meta property="og:description" content="Deja de recibir respuestas genéricas de la IA. Genera el prompt perfecto en 30 segundos y obtén respuestas de experto." />
        <meta property="og:image" content="https://www.promptbien.com/og.jpg" />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Generador de Prompts para ChatGPT · promptbien.com" />
        <meta name="twitter:description" content="Genera el prompt perfecto para tu IA en 30 segundos. Gratis." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      {/* NAV */}
      <nav role="navigation" aria-label="Navegación principal">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="#como-funciona" className="nav-link">Cómo funciona</a>
          <a href="#precios" className="nav-link">Precios</a>
          <a href="/generar" className="nav-cta">Generar prompt gratis →</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="inicio">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        <div className="blob blob-3" aria-hidden="true" />
        <div className="hero-badge">✦ Generador de prompts para ChatGPT, Claude y Gemini</div>
        <h1>Deja de recibir respuestas <em>genéricas</em> de la IA</h1>
        <p className="hero-sub">Describe tu situación en 30 segundos y te generamos el <strong>prompt perfecto</strong> para obtener respuestas de experto. Sin tecnicismos. Sin complicaciones.</p>
        <div className="hero-ctas">
          <a href="/generar" className="btn-primary">✨ Generar mi prompt gratis</a>
          <a href="#como-funciona" className="btn-secondary">Ver cómo funciona</a>
        </div>
        <div className="hero-demo" role="img" aria-label="Vista previa del generador de prompts">
          <div className="demo-bar">
            <div className="demo-dot" style={{ background: "#FF5F57" }} />
            <div className="demo-dot" style={{ background: "#FFBD2E" }} />
            <div className="demo-dot" style={{ background: "#28C941" }} />
            <div className="demo-url">promptbien.com/generar</div>
          </div>
          <div className="demo-body">
            <div className="demo-step">Paso 1 de 3</div>
            <div className="demo-q">¿Sobre qué quieres consultar a la IA?</div>
            <div className="demo-opts">
              {["✈️ Viajes", "🩺 Salud", "🏠 Inmobiliario", "💬 Otro tema"].map((opt, i) => (
                <button key={i} className={`demo-opt ${demoSel === i ? "sel" : ""}`} onClick={() => setDemoSel(i)}>{opt}</button>
              ))}
            </div>
            <div className="demo-prog"><div className="demo-prog-bar" style={{ width: `${(demoSel + 1) * 25}%` }} /></div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="stats" aria-label="Datos clave">
        {[["2.500M+", "prompts enviados a IAs cada día"], ["80%", "de respuestas son genéricas"], ["30s", "para tu prompt perfecto"], ["4 pasos", "sin tecnicismos"]].map(([n, l], i) => (
          <div className="stat" key={i}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
        ))}
      </div>

      {/* PROBLEM SECTION */}
      <section className="problem-sec" id="problemas" aria-labelledby="prob-title">
        <div className="eyebrow ctr">El problema que resolvemos</div>
        <h2 className="ctr" id="prob-title">¿Por qué la IA no te da lo que necesitas?</h2>
        <p className="lead ctr">La inteligencia artificial es tan buena como las instrucciones que recibe. El problema no es ChatGPT. El problema es cómo le preguntas.</p>
        <div className="problems-grid">
          {[
            { icon: "😤", title: "Respuestas de Wikipedia", desc: "Le preguntas sobre tu hipoteca y te da una explicación genérica de qué es una hipoteca. Sin tener en cuenta tu tipo, tu plazo ni tu situación.", sol: "promptbien añade tu contexto exacto" },
            { icon: "🔄", title: "Respuestas demasiado generales", desc: "Quieres planificar un viaje a Japón pero recibes los mismos 5 sitios que aparecen en cualquier blog de viajes. Sin personalización real.", sol: "promptbien personaliza cada detalle" },
            { icon: "😕", title: "No sabe lo que le importa saber", desc: "Le describes un síntoma y no sabe si eres joven o mayor, si tienes historial médico o si ya tomaste alguna medicación. Responde para nadie.", sol: "promptbien da todo el contexto relevante" },
            { icon: "🤷", title: "Sin rol de experto", desc: "Si no le dices que actúe como un experto concreto, responde como un generalista. La diferencia entre 'actúa como médico de la Clínica Mayo' y 'responde esto' es enorme.", sol: "promptbien asigna el experto correcto" },
          ].map((p, i) => (
            <article className="problem-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="prob-icon">{p.icon}</div>
              <h3 className="prob-title">{p.title}</h3>
              <p className="prob-desc">{p.desc}</p>
              <span className="solution-tag">✓ {p.sol}</span>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" aria-labelledby="how-title">
        <div className="eyebrow ctr">Cómo funciona</div>
        <h2 className="ctr" id="how-title">De tu situación al prompt perfecto en 4 pasos</h2>
        <p className="lead ctr">No necesitas saber nada de prompt engineering. promptbien lo construye por ti en 30 segundos.</p>
        <div className="how-grid">
          {[
            { icon: "🎯", n: "01", title: "Elige tu IA y tema", desc: "Selecciona si usarás ChatGPT, Claude o Gemini y el área de tu consulta. Cada IA tiene particularidades distintas y los prompts se adaptan a cada una." },
            { icon: "✍️", n: "02", title: "Cuenta tu situación", desc: "Describe brevemente qué te ocurre y qué quieres conseguir. Cuanto más detalle, mejor será tu prompt. Sin jerga técnica, en tu idioma." },
            { icon: "⚡", n: "03", title: "Generamos tu prompt", desc: "Nuestra IA construye el prompt perfecto: con el rol de experto adecuado, tu contexto completo, el objetivo preciso y las restricciones de calidad." },
            { icon: "📋", n: "04", title: "Copia y pega en tu IA", desc: "Un clic para copiar. Pégalo en ChatGPT, Claude o Gemini. Obtén respuestas de nivel profesional sin haber escrito una sola línea de prompt engineering." },
          ].map((s, i) => (
            <article className="step-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="step-n">{s.n}</div>
              <span className="step-icon">{s.icon}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* VERTICALS */}
      <section className="vert-sec" id="para-que-sirve" aria-labelledby="vert-title">
        <div className="eyebrow">Para qué sirve</div>
        <h2 id="vert-title">Prompts expertos para cualquier consulta</h2>
        <p className="lead">Desde planificar un viaje a Japón hasta preparar tu consulta con el especialista. Un prompt bien escrito cambia por completo la calidad de la respuesta.</p>
        <div className="vert-grid">
          {[
            { cls: "v-travel", emoji: "✈️", tag: "Viajes", title: "Itinerarios a medida con IA", desc: "Cómo hacer un prompt para viajes en ChatGPT que genere itinerarios reales, no genéricos. Con gastronomía, transporte y experiencias auténticas adaptadas a ti.", items: ["Viaje 10 días Japón en octubre, gastronomía local y sin masificación", "Road trip Marruecos evitando rutas turísticas con presupuesto ajustado", "Escapada fin de semana desde Madrid: naturaleza + gastronomía"] },
            { cls: "v-health", emoji: "🩺", tag: "Salud", title: "Prepara tu consulta médica", desc: "El prompt perfecto para entender un diagnóstico, preparar preguntas para el médico o informarte sobre síntomas con rigor científico real.", items: ["Entender mi analítica y qué preguntarle al médico en 10 minutos", "Qué implica un diagnóstico de colesterol alto a los 48 años", "Hábitos respaldados por evidencia para mejorar el sueño"] },
            { cls: "v-real", emoji: "🏠", tag: "Inmobiliario", title: "Decisiones de compra informadas", desc: "Prompt para ChatGPT que actúa como asesor independiente. Hipotecas, amortización, inversión y todo lo que tu banco no te explica bien.", items: ["¿Me compensa amortizar hipoteca o invertir ese dinero en fondos?", "Evaluar si comprar para alquilar tiene sentido en mi ciudad en 2026", "Qué negociar al comprar un piso de segunda mano para no pagar de más"] },
            { cls: "v-free", emoji: "💬", tag: "Tema libre", title: "Cualquier consulta que tengas", desc: "Historia, finanzas, trabajo, tecnología, cocina, educación... Sea cual sea tu pregunta, generamos el prompt que le saca el máximo a cualquier IA.", items: ["Preparar una negociación salarial con argumentos sólidos y datos", "Aprender programación desde cero con 45 años: plan realista", "Entender un contrato antes de firmarlo sin necesitar abogado"] },
          ].map((v, i) => (
            <article className={`v-card ${v.cls} reveal`} key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="v-emoji">{v.emoji}</span>
              <span className="v-tag">{v.tag}</span>
              <h3 className="v-title">{v.title}</h3>
              <p className="v-desc">{v.desc}</p>
              <div className="v-list">{v.items.map((item, j) => <div className="v-item" key={j}>{item}</div>)}</div>
            </article>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="ba-sec" aria-labelledby="ba-title">
        <div className="eyebrow ctr">La diferencia es enorme</div>
        <h2 className="ctr" id="ba-title">Mismo tema. Prompt diferente. Resultado diferente.</h2>
        <p className="lead ctr">Así se ve la diferencia entre preguntarle directamente a ChatGPT o hacerlo con un prompt generado por promptbien.</p>
        <div className="ba-grid reveal">
          <div className="ba-card ba-bad">
            <div className="ba-label">❌ Sin promptbien</div>
            <p className="ba-text">"ChatGPT, dime si me compensa amortizar la hipoteca"</p>
            <div className="ba-result">⚠️ Respuesta genérica de 3 párrafos que encontrarías en cualquier blog financiero. Sin tener en cuenta tu tipo de interés, tu plazo ni tu situación.</div>
          </div>
          <div className="ba-card ba-good">
            <div className="ba-label">✅ Con promptbien</div>
            <p className="ba-text">"Actúa como asesor financiero independiente con el criterio de Gonzalo Bernardos. Mi hipoteca es variable al Euribor+0.8%, me quedan 18 años y 140.000€. Tengo 25.000€ ahorrados y el Euribor está al 3.1%. Dame un análisis numérico de si me compensa amortizar o invertir en fondos indexados, con escenarios posibles y recomendación concreta."</p>
            <div className="ba-result">✅ Análisis financiero detallado con números reales, escenarios y recomendación accionable adaptada a tu situación exacta.</div>
          </div>
        </div>
      </section>

      {/* LONG FORM SEO */}
      <section className="longform-sec" aria-labelledby="lf-title">
        <div className="longform-grid">
          <div className="longform-text">
            <div className="eyebrow">Por qué importa el prompt</div>
            <h2 id="lf-title">Cómo hacer un buen prompt para ChatGPT: la guía definitiva</h2>
            <p>El 80% de los usuarios de ChatGPT, Claude y Gemini obtienen respuestas que no les satisfacen. No es un problema de la IA — es un problema del prompt. La calidad de la instrucción determina directamente la calidad de la respuesta.</p>
            <p>Un prompt bien construido tiene cuatro componentes esenciales que la mayoría de usuarios ignoran:</p>
            <ul>
              <li>Un <strong>rol de experto específico</strong> que define el perfil de quien responde</li>
              <li>El <strong>contexto completo</strong> de tu situación personal con todos los detalles relevantes</li>
              <li>El <strong>objetivo preciso</strong> que quieres conseguir y el formato de respuesta ideal</li>
              <li>Las <strong>restricciones de calidad</strong> que impiden respuestas genéricas o irrelevantes</li>
            </ul>
            <p style={{ marginTop: "1.2rem" }}>promptbien construye automáticamente estos cuatro elementos por ti en 30 segundos, adaptados a tu IA preferida y a tu tema concreto.</p>
          </div>
          <div className="longform-cards reveal">
            {[
              { icon: "🎓", title: "Rol de experto de primer nivel", desc: "No 'actúa como experto' — sino 'actúa como nutricionista con el rigor de Andrew Huberman'. La especificidad del rol cambia radicalmente la calidad." },
              { icon: "📍", title: "Contexto que la IA necesita", desc: "Tu edad, tu situación, tus restricciones, tus preferencias. Cuanto más contexto específico, más personalizada es la respuesta." },
              { icon: "🎯", title: "Objetivo accionable claro", desc: "No 'dime sobre X' sino 'dame un plan paso a paso de 5 puntos con ejemplos concretos y tiempos estimados'. La IA necesita saber qué formato entregar." },
              { icon: "🚫", title: "Restricciones anti-genericidad", desc: "'No me des respuestas que encontraría en cualquier blog. Si necesitas más info, pregúntame.' Esto filtra el 90% de las respuestas mediocres." },
            ].map((c, i) => (
              <div className="lf-card" key={i}>
                <div className="lf-card-title">{c.icon} {c.title}</div>
                <p className="lf-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section aria-labelledby="proof-title" style={{ background: "var(--bg)" }}>
        <div className="eyebrow ctr">Testimonios</div>
        <h2 className="ctr" id="proof-title">Respuestas de experto para personas reales</h2>
        <div className="proof-grid">
          {[
            { av: "MG", bg: "#00C9A7", stars: "★★★★★", text: "Llevaba meses usando ChatGPT y siempre me daba respuestas de Wikipedia. Con el primer prompt de promptbien me sentí como si estuviera hablando con un médico de verdad.", name: "María García", role: "Paciente con hipotiroidismo · 52 años" },
            { av: "JR", bg: "#FF6B4A", stars: "★★★★★", text: "Usé el generador para planificar mi viaje a Tailandia y el itinerario que me dio ChatGPT fue exactamente lo que buscaba. Con detalle de restaurantes locales, transporte y todo.", name: "Javier Romero", role: "Viajero frecuente · 47 años" },
            { av: "AL", bg: "#4F46E5", stars: "★★★★★", text: "La decisión de si amortizar hipoteca o invertir me tenía bloqueado hace meses. El prompt de promptbien me dio un análisis tan claro que tomé la decisión en un día.", name: "Ana López", role: "Autónoma · 44 años" },
          ].map((p, i) => (
            <article className="proof-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="stars">{p.stars}</div>
              <p className="proof-text">"{p.text}"</p>
              <div className="proof-author">
                <div className="proof-av" style={{ background: p.bg }}>{p.av}</div>
                <div><div className="proof-name">{p.name}</div><div className="proof-role">{p.role}</div></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-sec" id="precios" aria-labelledby="price-title">
        <div className="eyebrow ctr">Precios</div>
        <h2 className="ctr" id="price-title">Sin suscripciones. Sin sorpresas.</h2>
        <p className="lead ctr">Prueba gratis hoy. Paga solo si lo usas mucho. Sin tarjeta. Sin compromiso.</p>
        <div className="price-grid">
          <article className="price-card reveal">
            <div className="price-plan">Gratis</div>
            <div className="price-amt">0€</div>
            <div className="price-per">para siempre · sin tarjeta</div>
            <ul className="price-feats">
              <li>3 prompts personalizados al día</li>
              <li>Todos los temas disponibles</li>
              <li>ChatGPT, Claude y Gemini</li>
              <li>Sin registro necesario</li>
            </ul>
            <a href="/generar" className="price-btn price-btn-free" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>Empezar gratis</a>
          </article>
          <article className="price-card feat reveal" style={{ transitionDelay: ".1s" }}>
            <div className="feat-badge">⚡ Más popular</div>
            <div className="price-plan">Pack ilimitado</div>
            <div className="price-amt">4,99€</div>
            <div className="price-per">pago único · sin suscripción</div>
            <ul className="price-feats">
              <li>Prompts ilimitados</li>
              <li>Todos los temas disponibles</li>
              <li>Prompts con contexto enriquecido</li>
              <li>Sin registro necesario</li>
              <li>Soporte por email</li>
            </ul>
            <button className="price-btn price-btn-paid">Conseguir acceso ilimitado</button>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec" id="faq" aria-labelledby="faq-title">
        <div className="eyebrow ctr">Preguntas frecuentes</div>
        <h2 className="ctr" id="faq-title">Todo sobre cómo hacer prompts para IA</h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i} itemScope itemType="https://schema.org/Question">
              <div className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} role="button" aria-expanded={openFaq === i} itemProp="name">
                  <span>{f.q}</span>
                  <div className="faq-icon">+</div>
                </div>
                <div className="faq-a" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer" style={{ maxHeight: openFaq === i ? "400px" : "0", padding: openFaq === i ? "0 26px 22px" : "0 26px" }}>
                  <span itemProp="text">{f.a}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-sec" id="generar">
        <h2>Tu prompt perfecto te espera</h2>
        <p className="lead">Empieza gratis ahora. Sin registro. Sin tarjeta. En 30 segundos tienes tu prompt listo para copiar en ChatGPT, Claude o Gemini.</p>
        <a href="/generar" className="btn-white">✨ Generar mi prompt gratis</a>
        <p className="cta-note">3 prompts gratis al día · Pack ilimitado por 4,99€ · Sin suscripción</p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <nav className="foot-links" aria-label="Pie de página">
          <a href="/blog">Blog</a>
          <a href="/generar">Generador</a>
          <a href="/#para-que-sirve">Para qué sirve</a>
          <a href="/#precios">Precios</a>
          <a href="/#faq">FAQ</a>
          <a href="/privacidad">Privacidad</a>
        </nav>
        <div style={{ fontSize: ".82rem" }}>© 2026 promptbien.com</div>
      </footer>
    </>
  );
}