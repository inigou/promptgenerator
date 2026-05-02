import Head from "next/head";
import { useState, useEffect } from "react";

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
    { "@type": "Question", "name": "Que es un generador de prompts para ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "Un generador de prompts es una herramienta que construye automaticamente instrucciones optimizadas para IAs como ChatGPT, Claude o Gemini. En lugar de escribir una pregunta simple y recibir una respuesta generica, el generador construye un prompt con rol de experto, contexto detallado y objetivos claros para que la IA responda como un especialista de primer nivel." } },
    { "@type": "Question", "name": "Como hacer un buen prompt para ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "Un buen prompt para ChatGPT necesita cuatro elementos: un rol de experto especifico, tu situacion concreta con todos los detalles relevantes, el objetivo preciso que quieres conseguir, y las instrucciones sobre el formato de respuesta. promptbien.com construye todo esto automaticamente en 30 segundos." } },
    { "@type": "Question", "name": "Para que sirve un prompt bien escrito?", "acceptedAnswer": { "@type": "Answer", "text": "Un prompt bien escrito transforma la respuesta de la IA de un texto generico de blog a una consulta personalizada de experto. La misma IA da respuestas radicalmente distintas dependiendo de como le preguntas." } },
    { "@type": "Question", "name": "Funciona para viajes, salud e inmobiliario?", "acceptedAnswer": { "@type": "Answer", "text": "Si. promptbien tiene prompts especialmente optimizados para planificar viajes con ChatGPT, preparar consultas medicas, y tomar decisiones inmobiliarias. Tambien funciona para cualquier otro tema con la opcion de consulta libre." } },
    { "@type": "Question", "name": "Es gratis el generador de prompts?", "acceptedAnswer": { "@type": "Answer", "text": "Tu primer prompt es completamente gratuito, sin registro. A partir del segundo, cada prompt tiene un coste de 1,99 euros de pago puntual. Sin suscripcion, sin compromiso, sin cuenta necesaria." } },
    { "@type": "Question", "name": "Funciona con Claude y Gemini ademas de ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "Si. Al iniciar el proceso seleccionas la IA que usaras y el prompt se adapta especificamente para ella. ChatGPT, Claude y Gemini tienen caracteristicas distintas y los prompts generados estan optimizados para cada una." } },
    { "@type": "Question", "name": "Como funciona el precio por prompt?", "acceptedAnswer": { "@type": "Answer", "text": "El primer prompt es gratis para que compruebes el valor antes de pagar. A partir del segundo, cada prompt cuesta 1,99 euros — menos que un cafe. Pagas solo cuando lo necesitas, sin suscripcion ni compromiso." } }
  ]
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "promptbien",
  "url": "https://www.promptbien.com"
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  :root {
    --indigo: #5B4BF5; --indigo-dark: #4A3AE0; --indigo-light: #F0EEFF;
    --coral: #FF6B4A; --coral-light: #FFF0ED;
    --green: #30D158; --green-light: #E8FAF0;
    --amber: #FF9F0A; --amber-light: #FFF4E0;
    --white: #FFFFFF; --text: #1A1A2E; --text-2: #4A4A6A; --text-3: #8A8AAA;
    --border: #E8E8F5; --bg: #F8F7FF; --r: 24px; --r-sm: 18px; --r-xs: 12px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); height: 66px; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #E8E8F5; }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.45rem; font-weight: 900; color: #1A1A2E; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-link-btn { font-size: .88rem; font-weight: 700; color: #4A4A6A; text-decoration: none; padding: 10px 20px; border-radius: 100px; border: 1.5px solid #E0E0F0; transition: all .2s; background: white; }
  .nav-link-btn:hover { border-color: #5B4BF5; color: #5B4BF5; }
  .nav-cta { background: #FF6B4A; color: white; font-size: .88rem; font-weight: 800; padding: 10px 22px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(255,107,74,.4); }

  /* HERO */
  .hero { min-height: 100vh; padding: 110px clamp(1.5rem,5vw,4rem) 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: var(--indigo); position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255,107,74,0.2) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 80% 80%, rgba(48,209,88,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 70% 15%, rgba(255,255,255,0.08) 0%, transparent 55%); pointer-events: none; }
  .hero > * { position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); font-size: .78rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; padding: 8px 20px; border-radius: 100px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.2); animation: fadeUp .5s ease both; }
  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(2.4rem,6vw,4.4rem); font-weight: 900; line-height: 1.08; letter-spacing: -.025em; max-width: 860px; color: white; animation: fadeUp .5s .1s ease both; }
  h1 em { font-style: normal; color: #FFD166; }
  .hero-sub { font-size: clamp(1rem,2vw,1.2rem); color: rgba(255,255,255,0.7); max-width: 580px; margin: 1.5rem auto 2.5rem; animation: fadeUp .5s .2s ease both; line-height: 1.7; font-weight: 600; }
  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; animation: fadeUp .5s .3s ease both; margin-bottom: 3.5rem; }
  .btn-coral { background: var(--coral); color: white; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; padding: 15px 32px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 6px 22px rgba(255,107,74,.45); transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-coral:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,107,74,.5); }
  .btn-white-outline { background: rgba(255,255,255,0.1); color: white; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 700; padding: 15px 32px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer; transition: all .2s; text-decoration: none; display: inline-block; }
  .btn-white-outline:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.5); transform: translateY(-2px); }

  /* DEMO */
  .hero-demo { width: 100%; max-width: 680px; background: white; border-radius: var(--r); border: 1px solid var(--border); box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden; animation: fadeUp .6s .4s ease both; }
  .demo-bar { padding: 13px 18px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
  .demo-url { flex: 1; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; font-size: .78rem; color: var(--text-3); text-align: center; font-weight: 600; }
  .demo-body { padding: 28px 32px; }
  .demo-step { font-size: .7rem; font-weight: 800; color: var(--indigo); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; }
  .demo-q { font-size: 1rem; font-weight: 800; margin-bottom: 16px; color: var(--text); }
  .demo-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .demo-opt { padding: 13px 16px; border-radius: 16px; border: 1.5px solid var(--border); font-size: .88rem; font-weight: 700; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 8px; background: var(--bg); font-family: 'Nunito', sans-serif; color: var(--text); }
  .demo-opt:hover, .demo-opt.sel { border-color: var(--indigo); background: var(--indigo-light); color: var(--indigo); }
  .demo-prog { height: 5px; background: var(--border); border-radius: 5px; overflow: hidden; }
  .demo-prog-bar { height: 100%; background: var(--indigo); border-radius: 5px; transition: width .3s; }

  /* STATS */
  .stats { background: var(--text); padding: 22px clamp(1.5rem,5vw,4rem); display: flex; gap: clamp(2rem,6vw,5rem); justify-content: center; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-n { font-family: 'Nunito', sans-serif; font-size: 2rem; font-weight: 900; color: var(--coral); }
  .stat-l { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,.5); margin-top: 2px; }

  /* SECTIONS */
  section { padding: clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem); }
  .eyebrow { font-size: .75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--indigo); margin-bottom: .8rem; }
  h2 { font-family: 'Nunito', sans-serif; font-size: clamp(1.9rem,4vw,2.9rem); font-weight: 900; line-height: 1.1; letter-spacing: -.025em; margin-bottom: 1rem; color: var(--text); }
  .lead { font-size: 1.05rem; font-weight: 600; color: var(--text-2); max-width: 580px; line-height: 1.75; }
  .ctr { text-align: center; }
  .ctr .lead { margin: 0 auto; }

  /* PROBLEMS */
  .problem-sec { background: white; }
  .problems-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; margin-top: 3rem; }
  .problem-card { border-radius: var(--r); border: 2px solid var(--border); padding: 28px; background: var(--bg); transition: all .25s; }
  .problem-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(91,75,245,.1); border-color: var(--indigo-light); }
  .prob-icon { font-size: 2rem; margin-bottom: 1rem; }
  .prob-title { font-weight: 800; font-size: 1rem; margin-bottom: .5rem; color: var(--text); }
  .prob-desc { font-size: .9rem; font-weight: 600; color: var(--text-2); line-height: 1.65; }
  .solution-tag { display: inline-block; background: var(--green-light); color: #1a8a3a; font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; margin-top: .75rem; }

  /* HOW */
  .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-top: 3.5rem; }
  .step-card { background: white; border-radius: var(--r); border: 2px solid var(--border); padding: 32px 26px; transition: all .25s; position: relative; overflow: hidden; }
  .step-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: var(--r) var(--r) 0 0; }
  .step-card:nth-child(1)::after { background: var(--coral); }
  .step-card:nth-child(2)::after { background: var(--indigo); }
  .step-card:nth-child(3)::after { background: var(--green); }
  .step-card:nth-child(4)::after { background: var(--amber); }
  .step-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(91,75,245,.12); }
  .step-n { font-family: 'Nunito', sans-serif; font-size: 3rem; font-weight: 900; opacity: .06; line-height: 1; margin-bottom: .5rem; }
  .step-icon { font-size: 2rem; margin-bottom: .75rem; display: block; }
  .step-title { font-weight: 800; font-size: 1rem; margin-bottom: .5rem; color: var(--text); }
  .step-desc { font-size: .9rem; font-weight: 600; color: var(--text-2); line-height: 1.65; }

  /* VERTICALS */
  .vert-sec { background: var(--indigo); color: white; }
  .vert-sec h2 { color: white; }
  .vert-sec .lead { color: rgba(255,255,255,.65); }
  .vert-sec .eyebrow { color: #FFD166; }
  .vert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 18px; margin-top: 3.5rem; }
  .v-card { border-radius: var(--r); padding: 30px 26px; border: 1.5px solid rgba(255,255,255,.1); background: rgba(255,255,255,.07); transition: all .25s; }
  .v-card:hover { transform: translateY(-5px); background: rgba(255,255,255,.11); border-color: rgba(255,255,255,.2); }
  .v-emoji { font-size: 2.4rem; margin-bottom: 1rem; display: block; }
  .v-tag { font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 4px 14px; border-radius: 100px; display: inline-block; margin-bottom: 1rem; }
  .v-travel .v-tag { background: rgba(255,107,74,.2); color: #FF6B4A; }
  .v-health .v-tag { background: rgba(48,209,88,.2); color: #30D158; }
  .v-real .v-tag { background: rgba(255,159,10,.2); color: #FF9F0A; }
  .v-free .v-tag { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); }
  .v-title { font-family: 'Nunito', sans-serif; font-size: 1.25rem; font-weight: 900; margin-bottom: .6rem; }
  .v-desc { font-size: .88rem; font-weight: 600; color: rgba(255,255,255,.6); line-height: 1.65; margin-bottom: 1.5rem; }
  .v-list { display: flex; flex-direction: column; gap: 8px; }
  .v-item { background: rgba(255,255,255,.06); border-radius: var(--r-xs); padding: 10px 14px; font-size: .83rem; font-weight: 600; color: rgba(255,255,255,.78); border: 1px solid rgba(255,255,255,.07); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }
  .v-item::before { content: "→"; color: var(--coral); flex-shrink: 0; }

  /* BEFORE/AFTER */
  .ba-sec { background: var(--bg); }
  .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 3rem; max-width: 960px; margin-left: auto; margin-right: auto; }
  .ba-card { border-radius: var(--r); padding: 28px; border: 2px solid var(--border); }
  .ba-bad { background: white; }
  .ba-good { background: var(--indigo); color: white; box-shadow: 0 10px 40px rgba(91,75,245,.35); border-color: var(--indigo); }
  .ba-label { font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
  .ba-bad .ba-label { color: var(--text-3); }
  .ba-good .ba-label { color: rgba(255,255,255,.6); }
  .ba-text { font-size: .93rem; font-weight: 600; line-height: 1.75; }
  .ba-bad .ba-text { color: var(--text-2); }
  .ba-good .ba-text { color: rgba(255,255,255,.9); }
  .ba-result { margin-top: 1rem; padding: 11px 15px; border-radius: var(--r-xs); font-size: .82rem; font-weight: 700; }
  .ba-bad .ba-result { background: var(--amber-light); color: #b45309; }
  .ba-good .ba-result { background: rgba(255,255,255,.12); color: rgba(255,255,255,.85); }

  /* LONGFORM */
  .longform-sec { background: white; }
  .longform-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-top: 3rem; }
  .longform-text h3 { font-family: 'Nunito', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -.015em; color: var(--text); }
  .longform-text p { font-size: .97rem; font-weight: 600; color: var(--text-2); line-height: 1.8; margin-bottom: 1.2rem; }
  .longform-text ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .longform-text ul li { font-size: .95rem; font-weight: 600; color: var(--text-2); padding-left: 1.5rem; position: relative; line-height: 1.65; }
  .longform-text ul li::before { content: "✓"; position: absolute; left: 0; color: var(--green); font-weight: 900; }
  .longform-cards { display: flex; flex-direction: column; gap: 14px; }
  .lf-card { background: var(--bg); border-radius: var(--r-sm); border: 2px solid var(--border); padding: 20px; transition: all .2s; }
  .lf-card:hover { border-color: var(--indigo-light); }
  .lf-card-title { font-weight: 800; font-size: .95rem; margin-bottom: .4rem; display: flex; align-items: center; gap: 8px; color: var(--text); }
  .lf-card-desc { font-size: .88rem; font-weight: 600; color: var(--text-2); line-height: 1.65; }

  /* CATALOG SECTION */
  .catalog-sec { background: var(--indigo); color: white; }
  .catalog-sec h2 { color: white; }
  .catalog-sec .lead { color: rgba(255,255,255,.65); }
  .catalog-sec .eyebrow { color: #FFD166; }
  .catalog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 3rem; }
  .catalog-card { background: rgba(255,255,255,.07); border: 1.5px solid rgba(255,255,255,.1); border-radius: var(--r); padding: 26px; transition: all .25s; text-decoration: none; display: block; }
  .catalog-card:hover { background: rgba(255,255,255,.13); transform: translateY(-4px); border-color: rgba(255,255,255,.25); }
  .catalog-card-badge { font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; display: inline-block; margin-bottom: .85rem; }
  .catalog-card h3 { font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; margin-bottom: .4rem; color: white; line-height: 1.3; }
  .catalog-card p { font-size: .83rem; font-weight: 600; color: rgba(255,255,255,.55); line-height: 1.6; margin-bottom: 1rem; }
  .catalog-card-price { font-size: .82rem; font-weight: 800; color: #FFD166; }
  .catalog-cta { text-align: center; margin-top: 2.5rem; }
  .btn-catalog { display: inline-block; background: white; color: var(--indigo); font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; padding: 14px 36px; border-radius: 100px; text-decoration: none; box-shadow: 0 6px 24px rgba(0,0,0,.2); transition: all .2s; }
  .btn-catalog:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,.25); }

  /* PROOF */
  .proof-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 3rem; }
  .proof-card { background: white; border-radius: var(--r); border: 2px solid var(--border); padding: 28px; transition: all .25s; }
  .proof-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(91,75,245,.1); }
  .stars { color: var(--amber); font-size: .95rem; margin-bottom: .75rem; letter-spacing: 2px; }
  .proof-text { font-size: .92rem; font-weight: 600; color: var(--text-2); line-height: 1.72; margin-bottom: 1.2rem; font-style: italic; }
  .proof-author { display: flex; align-items: center; gap: 10px; }
  .proof-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: .88rem; color: white; flex-shrink: 0; }
  .proof-name { font-weight: 800; font-size: .88rem; color: var(--text); }
  .proof-role { font-size: .77rem; font-weight: 600; color: var(--text-3); }

  /* PRICING */
  .pricing-sec { background: var(--bg); }
  .price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 3.5rem; max-width: 720px; margin-left: auto; margin-right: auto; }
  .price-card { border-radius: var(--r); padding: 36px 32px; border: 2px solid var(--border); background: white; position: relative; transition: all .25s; }
  .price-card.feat { background: var(--indigo); color: white; border-color: var(--indigo); box-shadow: 0 16px 50px rgba(91,75,245,.35); }
  .price-card:hover { transform: translateY(-4px); }
  .feat-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--coral); color: white; font-size: .73rem; font-weight: 800; letter-spacing: .04em; padding: 5px 18px; border-radius: 100px; white-space: nowrap; }
  .price-plan { font-size: .78rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: .75rem; color: var(--text-3); }
  .price-card.feat .price-plan { color: rgba(255,255,255,.55); }
  .price-amt { font-family: 'Nunito', sans-serif; font-size: 3.4rem; font-weight: 900; line-height: 1; margin-bottom: .2rem; color: var(--text); }
  .price-card.feat .price-amt { color: #FFD166; }
  .price-per { font-size: .88rem; font-weight: 600; color: var(--text-3); margin-bottom: 1.5rem; }
  .price-card.feat .price-per { color: rgba(255,255,255,.45); }
  .price-feats { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; padding: 0; }
  .price-feats li { font-size: .92rem; font-weight: 600; display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; color: var(--text-2); }
  .price-feats li::before { content: "✓"; font-weight: 900; color: var(--green); flex-shrink: 0; margin-top: 1px; }
  .price-card.feat .price-feats li { color: rgba(255,255,255,.8); }
  .price-btn { width: 100%; padding: 14px; border-radius: 100px; font-family: 'Nunito', sans-serif; font-size: .97rem; font-weight: 800; cursor: pointer; transition: all .2s; border: none; display: block; text-align: center; text-decoration: none; }
  .price-btn-free { background: var(--bg); color: var(--text); border: 2px solid var(--border); }
  .price-btn-free:hover { border-color: var(--indigo); color: var(--indigo); }
  .price-btn-paid { background: var(--coral); color: white; box-shadow: 0 6px 20px rgba(255,107,74,.4); }
  .price-btn-paid:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(255,107,74,.5); }

  /* FAQ */
  .faq-sec { background: white; }
  .faq-list { max-width: 760px; margin: 3rem auto 0; }
  .faq-item { background: var(--bg); border-radius: var(--r-sm); border: 2px solid var(--border); margin-bottom: 10px; overflow: hidden; transition: all .2s; }
  .faq-item:hover { border-color: var(--indigo-light); }
  .faq-q { padding: 20px 24px; font-weight: 800; font-size: .97rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; user-select: none; color: var(--text); }
  .faq-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--indigo-light); color: var(--indigo); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900; flex-shrink: 0; transition: all .2s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--indigo); color: white; }
  .faq-a { max-height: 0; overflow: hidden; transition: max-height .35s ease, padding .35s ease; padding: 0 24px; font-size: .93rem; font-weight: 600; color: var(--text-2); line-height: 1.78; }
  .faq-item.open .faq-a { max-height: 400px; padding: 0 24px 20px; }

  /* CTA */
  .cta-sec { background: var(--indigo); text-align: center; padding: clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem); position: relative; overflow: hidden; }
  .cta-sec::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,74,0.2) 0%, transparent 60%); pointer-events: none; }
  .cta-sec h2 { color: white; position: relative; z-index: 1; }
  .cta-sec .lead { color: rgba(255,255,255,.7); margin: 1rem auto 2.5rem; position: relative; z-index: 1; }
  .btn-cta-white { background: white; color: var(--indigo); font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; padding: 16px 40px; border-radius: 100px; border: none; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,.2); transition: all .2s; text-decoration: none; display: inline-block; position: relative; z-index: 1; }
  .btn-cta-white:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(0,0,0,.25); }
  .cta-note { font-size: .82rem; font-weight: 600; color: rgba(255,255,255,.5); margin-top: 1rem; position: relative; z-index: 1; }

  /* FOOTER */
  footer { background: var(--text); color: rgba(255,255,255,.85); padding: 40px clamp(1.5rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .foot-logo { font-family: 'Nunito', sans-serif; font-size: 1.15rem; font-weight: 900; color: white; }
  .foot-logo span { color: var(--coral); }
  .foot-links { display: flex; gap: 1.5rem; font-size: .84rem; font-weight: 700; flex-wrap: wrap; }
  .foot-links a { color: rgba(255,255,255,.85); text-decoration: none; transition: color .2s; }
  .foot-links a:hover { color: white; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
  .reveal.vis { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) { .ba-grid { grid-template-columns: 1fr; } .longform-grid { grid-template-columns: 1fr; gap: 2rem; } .nav-link-btn { display: none; } }
  @media (max-width: 480px) { .demo-opts { grid-template-columns: 1fr; } .hero-ctas { flex-direction: column; align-items: center; } .hero-ctas a { width: 100%; text-align: center; } }
`;

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [demoSel, setDemoSel] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const faqs = [
    { q: "Que es un generador de prompts para ChatGPT?", a: "Un generador de prompts es una herramienta que construye automaticamente instrucciones optimizadas para IAs como ChatGPT, Claude o Gemini. En lugar de escribir una pregunta simple y recibir una respuesta generica, el generador construye un prompt con rol de experto, contexto detallado y objetivos claros para que la IA responda como un especialista." },
    { q: "Como hacer un buen prompt para ChatGPT?", a: "Un buen prompt para ChatGPT necesita cuatro elementos: un rol de experto especifico, tu situacion concreta con todos los detalles relevantes, el objetivo preciso que quieres conseguir, y las instrucciones sobre el formato de respuesta. promptbien.com construye todo esto automaticamente en 30 segundos." },
    { q: "Por que ChatGPT me da respuestas genericas?", a: "Las IAs responden en funcion de como les preguntas. Sin contexto especifico, la IA asume que debe dar una respuesta valida para cualquier persona. Con un prompt que incluye tu situacion concreta, un rol de experto y un objetivo claro, la IA puede darte una respuesta de nivel profesional personalizada." },
    { q: "Funciona para viajes, salud e inmobiliario?", a: "Si. promptbien tiene prompts especialmente optimizados para planificar viajes con ChatGPT, preparar consultas medicas, y tomar decisiones inmobiliarias. Tambien funciona para cualquier otro tema con la opcion de consulta libre." },
    { q: "Es gratis el generador de prompts?", a: "Tu primer prompt es completamente gratuito, sin registro. A partir del segundo, cada prompt tiene un coste de 1,99 euros de pago puntual. Sin suscripcion, sin compromiso, sin cuenta necesaria." },
    { q: "Funciona con Claude y Gemini ademas de ChatGPT?", a: "Si. Al iniciar el proceso seleccionas la IA que usaras y el prompt se adapta especificamente para ella. ChatGPT, Claude y Gemini tienen caracteristicas distintas y los prompts generados estan optimizados para cada una." },
    { q: "Como funciona el precio por prompt?", a: "El primer prompt es gratis para que compruebes el valor antes de pagar. A partir del segundo, cada prompt cuesta 1,99 euros — menos que un cafe. Pagas solo cuando lo necesitas, sin suscripcion ni compromiso." },
  ];

  const catalogItems = [
    { badge: "✈️ Viajes", bg: "rgba(255,107,74,.2)", color: "#FF6B4A", title: "Itinerario a medida para Japón", desc: "10-14 días, cultura y gastronomía sin multitudes" },
    { badge: "🩺 Salud", bg: "rgba(48,209,88,.2)", color: "#30D158", title: "Entender tu analítica de sangre", desc: "Qué significan tus valores y qué preguntar al médico" },
    { badge: "🏠 Inmobiliario", bg: "rgba(255,159,10,.2)", color: "#FF9F0A", title: "¿Amortizar hipoteca o invertir ese dinero?", desc: "El dilema financiero que más preocupa a propietarios de 40-55 años" },
    { badge: "💼 Trabajo", bg: "rgba(91,75,245,.2)", color: "#5B4BF5", title: "Negociar un aumento de sueldo", desc: "Argumentos, estrategia y cómo tener la conversación difícil" },
    { badge: "💰 Finanzas", bg: "rgba(191,90,242,.2)", color: "#BF5AF2", title: "Cómo empezar a invertir desde cero", desc: "Fondos indexados, ETFs o depósitos: qué elegir según tu perfil" },
    { badge: "✈️ Viajes", bg: "rgba(255,107,74,.2)", color: "#FF6B4A", title: "Viaje diseñado alrededor de la gastronomía", desc: "Comer bien como eje del viaje, no como extra" },
  ];

  return (
    <>
      <Head>
        <title>Generador de Prompts para ChatGPT, Claude y Gemini | promptbien.com</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Genera el prompt perfecto para ChatGPT, Claude o Gemini en 30 segundos. Obtén respuestas de experto en viajes, salud, inmobiliario y cualquier tema. Gratis. Sin registro." />
        <meta name="keywords" content="generador de prompts, generador de prompts chatgpt, cómo hacer un buen prompt chatgpt, prompt para planificar viaje chatgpt, prompt para consulta medica ia, prompt inmobiliario chatgpt, prompt generator español" />
        <link rel="canonical" href="https://www.promptbien.com/" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.promptbien.com/" />
        <meta property="og:title" content="Generador de Prompts para ChatGPT · promptbien.com" />
        <meta property="og:description" content="Deja de recibir respuestas genéricas de la IA. Genera el prompt perfecto en 30 segundos y obtén respuestas de experto." />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      {/* NAV */}
      <nav role="navigation" aria-label="Navegación principal">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="/catalogo" className="nav-link-btn">Catálogo</a>
          <a href="/mis-prompts" className="nav-link-btn">Mis prompts</a>
          <a href="/generar" className="nav-cta">✨ Nuevo prompt</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="inicio">
        <div className="hero-badge">✦ Generador de prompts para ChatGPT, Claude y Gemini</div>
        <h1>Deja de recibir respuestas <em>genéricas</em> de la IA</h1>
        <p className="hero-sub">Describe tu situación en 30 segundos y te generamos el prompt perfecto para obtener respuestas de experto. Sin tecnicismos. Sin complicaciones.</p>
        <div className="hero-ctas">
            <a href="/generar" className="btn-coral">✨ Generar mi prompt gratis</a>
            <a href="#como-funciona" className="btn-white-outline">Ver cómo funciona</a>
        </div>
        <a href="/catalogo" style={{ 
            color: "rgba(255,255,255,0.55)", 
            fontSize: ".85rem", 
            fontWeight: 700, 
            textDecoration: "none",
            marginTop: "1rem",
            display: "block"
        }}>
            ✦ Ver catálogo de prompts →
        </a>
        <div className="hero-demo" role="img" aria-label="Vista previa del generador">
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
                <button key={i} className={"demo-opt" + (demoSel === i ? " sel" : "")} onClick={() => setDemoSel(i)}>{opt}</button>
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

      {/* PROBLEMS */}
      <section className="problem-sec" id="problemas" aria-labelledby="prob-title">
        <div className="eyebrow ctr">El problema que resolvemos</div>
        <h2 className="ctr" id="prob-title">¿Por qué la IA no te da lo que necesitas?</h2>
        <p className="lead ctr">La inteligencia artificial es tan buena como las instrucciones que recibe. El problema no es ChatGPT. El problema es cómo le preguntas.</p>
        <div className="problems-grid">
          {[
            { icon: "😤", title: "Respuestas de Wikipedia", desc: "Le preguntas sobre tu hipoteca y te da una explicación genérica sin tener en cuenta tu tipo, tu plazo ni tu situación.", sol: "promptbien añade tu contexto exacto" },
            { icon: "🔄", title: "Siempre los mismos consejos", desc: "Quieres planificar un viaje a Japón pero recibes los mismos 5 sitios que aparecen en cualquier blog de viajes.", sol: "promptbien personaliza cada detalle" },
            { icon: "😕", title: "No sabe lo que importa saber", desc: "Le describes un síntoma y no sabe tu edad ni historial médico. Responde para nadie en concreto.", sol: "promptbien da todo el contexto relevante" },
            { icon: "🤷", title: "Sin rol de experto", desc: "Si no le dices que actúe como un experto concreto, responde como generalista. La diferencia es enorme.", sol: "promptbien asigna el experto correcto" },
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
            { icon: "🎯", n: "01", title: "Elige tu IA y tema", desc: "Selecciona si usarás ChatGPT, Claude o Gemini y el área de tu consulta. Cada IA tiene particularidades y los prompts se adaptan a cada una." },
            { icon: "✍️", n: "02", title: "Cuenta tu situación", desc: "Describe brevemente qué te ocurre y qué quieres conseguir. Cuanto más detalle, mejor será tu prompt. Sin jerga técnica." },
            { icon: "⚡", n: "03", title: "Generamos tu prompt", desc: "Nuestra IA construye el prompt perfecto con el rol de experto adecuado, tu contexto completo y las restricciones de calidad." },
            { icon: "📋", n: "04", title: "Copia y pega en tu IA", desc: "Un clic para copiar. Pégalo en ChatGPT, Claude o Gemini. Obtén respuestas de nivel profesional al instante." },
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

      {/* CATALOG SECTION */}
      <section className="catalog-sec" id="catalogo" aria-labelledby="catalog-title">
        <div className="eyebrow">Catálogo de prompts</div>
        <h2 id="catalog-title">El prompt exacto para tu caso concreto</h2>
        <p className="lead">No hace falta describir tu situación desde cero. Elige un caso ya resuelto, personaliza 3 campos y tenlo listo en 30 segundos.</p>
        <div className="catalog-grid">
          {catalogItems.map((c, i) => (
            <a key={i} href="/catalogo" className="catalog-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="catalog-card-badge" style={{ background: c.bg, color: c.color }}>{c.badge}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="catalog-card-price">1,99€ · pago único</span>
            </a>
          ))}
        </div>
        <div className="catalog-cta">
          <a href="/catalogo" className="btn-catalog">Ver todos los prompts del catálogo →</a>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="vert-sec" id="para-que-sirve" aria-labelledby="vert-title">
        <div className="eyebrow">Para qué sirve</div>
        <h2 id="vert-title">Prompts expertos para cualquier consulta</h2>
        <p className="lead">Desde planificar un viaje a Japón hasta preparar tu consulta con el especialista. Un prompt bien escrito cambia por completo la calidad de la respuesta.</p>
        <div className="vert-grid">
          {[
            { cls: "v-travel", emoji: "✈️", tag: "Viajes", title: "Itinerarios a medida con IA", desc: "Cómo hacer un prompt para viajes en ChatGPT que genere itinerarios reales, no genéricos. Con gastronomía, transporte y experiencias auténticas.", items: ["Viaje 10 días Japón en octubre, gastronomía local y sin masificación", "Road trip Marruecos evitando rutas turísticas con presupuesto ajustado", "Escapada fin de semana desde Madrid: naturaleza + gastronomía"] },
            { cls: "v-health", emoji: "🩺", tag: "Salud", title: "Prepara tu consulta médica", desc: "El prompt perfecto para entender un diagnóstico, preparar preguntas para el médico o informarte sobre síntomas con rigor científico real.", items: ["Entender mi analítica y qué preguntarle al médico en 10 minutos", "Qué implica un diagnóstico de colesterol alto a los 48 años", "Hábitos respaldados por evidencia para mejorar el sueño"] },
            { cls: "v-real", emoji: "🏠", tag: "Inmobiliario", title: "Decisiones de compra informadas", desc: "Prompt para ChatGPT que actúa como asesor independiente. Hipotecas, amortización, inversión y todo lo que tu banco no te explica bien.", items: ["¿Me compensa amortizar hipoteca o invertir ese dinero en fondos?", "Evaluar si comprar para alquilar tiene sentido en mi ciudad en 2026", "Qué negociar al comprar un piso de segunda mano"] },
            { cls: "v-free", emoji: "💬", tag: "Tema libre", title: "Cualquier consulta que tengas", desc: "Historia, finanzas, trabajo, tecnología, cocina, educación... Sea cual sea tu pregunta, generamos el prompt que le saca el máximo a cualquier IA.", items: ["Preparar una negociación salarial con argumentos sólidos y datos", "Aprender programación desde cero con 45 años: plan realista", "Entender un contrato antes de firmarlo sin necesitar abogado"] },
          ].map((v, i) => (
            <article className={"v-card " + v.cls + " reveal"} key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="v-emoji">{v.emoji}</span>
              <span className="v-tag">{v.tag}</span>
              <h3 className="v-title">{v.title}</h3>
              <p className="v-desc">{v.desc}</p>
              <div className="v-list">{v.items.map((item, j) => <div className="v-item" key={j}>{item}</div>)}</div>
            </article>
          ))}
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="ba-sec" aria-labelledby="ba-title">
        <div className="eyebrow ctr">La diferencia es enorme</div>
        <h2 className="ctr" id="ba-title">Mismo tema. Prompt diferente. Resultado diferente.</h2>
        <p className="lead ctr">Así se ve la diferencia entre preguntarle directamente a ChatGPT o hacerlo con un prompt generado por promptbien.</p>
        <div className="ba-grid reveal">
          <div className="ba-card ba-bad">
            <div className="ba-label">❌ Sin promptbien</div>
            <p className="ba-text">"ChatGPT, dime si me compensa amortizar la hipoteca"</p>
            <div className="ba-result">⚠️ Respuesta genérica de 3 párrafos sin tener en cuenta tu tipo de interés, tu plazo ni tu situación concreta.</div>
          </div>
          <div className="ba-card ba-good">
            <div className="ba-label">✅ Con promptbien</div>
            <p className="ba-text">"Actúa como asesor financiero independiente con el criterio de Gonzalo Bernardos. Mi hipoteca es variable al Euribor+0.8%, me quedan 18 años y 140.000€. Tengo 25.000€ ahorrados. Dame un análisis numérico de si me compensa amortizar o invertir en fondos indexados, con escenarios posibles y recomendación concreta."</p>
            <div className="ba-result">✅ Análisis financiero detallado con números reales, escenarios y recomendación accionable.</div>
          </div>
        </div>
      </section>

      {/* LONGFORM */}
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
              { icon: "🎓", title: "Rol de experto de primer nivel", desc: "No 'actúa como experto' — sino 'actúa como nutricionista con el rigor de Andrew Huberman'. La especificidad cambia radicalmente la calidad." },
              { icon: "📍", title: "Contexto que la IA necesita", desc: "Tu edad, situación, restricciones y preferencias. Cuanto más contexto específico, más personalizada es la respuesta." },
              { icon: "🎯", title: "Objetivo accionable claro", desc: "No 'dime sobre X' sino 'dame un plan paso a paso con ejemplos concretos'. La IA necesita saber qué formato entregar." },
              { icon: "🚫", title: "Restricciones anti-genericidad", desc: "'No me des respuestas que encontraría en cualquier blog.' Esto filtra el 90% de las respuestas mediocres." },
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
            { av: "MG", bg: "#30D158", stars: "★★★★★", text: "Llevaba meses usando ChatGPT y siempre me daba respuestas de Wikipedia. Con el primer prompt de promptbien me sentí como si estuviera hablando con un médico de verdad.", name: "María García", role: "Paciente con hipotiroidismo · 52 años" },
            { av: "JR", bg: "#FF6B4A", stars: "★★★★★", text: "Usé el generador para planificar mi viaje a Tailandia y el itinerario que me dio ChatGPT fue exactamente lo que buscaba. Con detalle de restaurantes locales, transporte y todo.", name: "Javier Romero", role: "Viajero frecuente · 47 años" },
            { av: "AL", bg: "#5B4BF5", stars: "★★★★★", text: "La decisión de si amortizar hipoteca o invertir me tenía bloqueado hace meses. El prompt de promptbien me dio un análisis tan claro que tomé la decisión en un día.", name: "Ana López", role: "Autónoma · 44 años" },
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
        <h2 className="ctr" id="price-title">Prueba gratis. Paga solo lo que uses.</h2>
        <p className="lead ctr">Sin suscripción. Sin compromiso. Tu primer prompt es gratis para que veas el valor antes de pagar.</p>
        <div className="price-grid">
          <article className="price-card reveal">
            <div className="price-plan">Primer prompt</div>
            <div className="price-amt">0€</div>
            <div className="price-per">gratis · sin registro · sin tarjeta</div>
            <ul className="price-feats">
              <li>1 prompt personalizado gratis</li>
              <li>Todos los temas disponibles</li>
              <li>ChatGPT, Claude y Gemini</li>
              <li>Sin registro necesario</li>
            </ul>
            <a href="/generar" className="price-btn price-btn-free">Generar mi primer prompt</a>
          </article>
          <article className="price-card feat reveal" style={{ transitionDelay: ".1s" }}>
            <div className="feat-badge">⚡ Menos que un café</div>
            <div className="price-plan">Prompts adicionales</div>
            <div className="price-amt">1,99€</div>
            <div className="price-per">por prompt · pago puntual · sin suscripción</div>
            <ul className="price-feats">
              <li>Paga solo cuando lo necesitas</li>
              <li>Todos los temas disponibles</li>
              <li>Prompts con contexto enriquecido</li>
              <li>Login con Google en un clic</li>
              <li>Soporte por email</li>
            </ul>
            <a href="/generar" className="price-btn price-btn-paid">Empezar ahora</a>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec" id="faq" aria-labelledby="faq-title">
        <div className="eyebrow ctr">Preguntas frecuentes</div>
        <h2 className="ctr" id="faq-title">Todo sobre cómo hacer prompts para IA</h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={"faq-item" + (openFaq === i ? " open" : "")}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} role="button" aria-expanded={openFaq === i}>
                <span>{f.q}</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a" style={{ maxHeight: openFaq === i ? "400px" : "0", padding: openFaq === i ? "0 24px 20px" : "0 24px" }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" id="generar">
        <h2>Tu prompt perfecto te espera</h2>
        <p className="lead">Empieza gratis ahora. Sin registro. Sin tarjeta. En 30 segundos tienes tu prompt listo para copiar en ChatGPT, Claude o Gemini.</p>
        <a href="/generar" className="btn-cta-white">✨ Generar mi prompt gratis</a>
        <p className="cta-note">Primer prompt gratis · 1,99€ por prompt · Sin suscripción</p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <div className="foot-links">
          <a href="/generar">Generador</a>
          <a href="/catalogo">Catálogo</a>
          <a href="/#como-funciona">Cómo funciona</a>
          <a href="/#precios">Precios</a>
          <a href="/#faq">FAQ</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
          <a href="/cookies">Cookies</a>
        </div>
        <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.4)" }}>© 2026 promptbien.com</div>
      </footer>
    </>
  );
}