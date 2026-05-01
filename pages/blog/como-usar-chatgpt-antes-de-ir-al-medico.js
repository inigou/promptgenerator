import Head from "next/head";
import { useState } from "react";

const schemaArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo usar ChatGPT antes de ir al médico: el prompt que necesitas",
  "description": "El 80% de las consultas médicas duran menos de 10 minutos. Aprende a prepararte con ChatGPT y lleva las preguntas exactas que tu médico necesita escuchar.",
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-01",
  "author": { "@type": "Organization", "name": "promptbien", "url": "https://www.promptbien.com" },
  "publisher": { "@type": "Organization", "name": "promptbien", "url": "https://www.promptbien.com" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.promptbien.com/blog/como-usar-chatgpt-antes-de-ir-al-medico" }
};

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Puede ChatGPT diagnosticarme?", "acceptedAnswer": { "@type": "Answer", "text": "No, y no debería intentarlo. La IA no tiene acceso a tu historial médico completo, no puede explorar físicamente ni interpretar pruebas con el contexto clínico completo que requiere un diagnóstico. Su valor está en prepararte para hablar mejor con tu médico, no en sustituirlo." } },
    { "@type": "Question", "name": "¿Es seguro usar IA para temas de salud?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, si se usa correctamente. Un prompt bien construido que explícitamente indica a la IA que no diagnostique, que use lenguaje comprensible y que sea honesta sobre la incertidumbre, produce respuestas útiles y responsables." } },
    { "@type": "Question", "name": "¿Qué es exactamente un prompt médico?", "acceptedAnswer": { "@type": "Answer", "text": "Es una instrucción estructurada que le das a la IA para que responda como un especialista médico de referencia, adaptada a tu situación concreta. Incluye el perfil de experto, tu contexto médico personal, lo que necesitas conseguir y las restricciones de lo que no quieres que haga." } }
  ]
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: #F8F7FF; color: #1A1A2E; line-height: 1.7; overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); height: 66px; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #E8E8F5; }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.45rem; font-weight: 900; color: #1A1A2E; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-link { font-size: .88rem; font-weight: 700; color: #4A4A6A; text-decoration: none; padding: 10px 20px; border-radius: 100px; border: 1.5px solid #E0E0F0; background: white; transition: all .2s; }
  .nav-link:hover { border-color: #5B4BF5; color: #5B4BF5; }
  .nav-cta { background: #FF6B4A; color: white; font-size: .88rem; font-weight: 800; padding: 10px 22px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); }
  .article-wrap { max-width: 740px; margin: 0 auto; padding: 100px 1.5rem 80px; }
  .article-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .article-tag { background: #F0EEFF; color: #5B4BF5; font-size: .75rem; font-weight: 800; padding: 5px 14px; border-radius: 100px; text-decoration: none; letter-spacing: .04em; text-transform: uppercase; }
  .article-readtime, .article-date { font-size: .82rem; font-weight: 600; color: #8A8AAA; }
  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(1.9rem,4vw,2.8rem); font-weight: 900; line-height: 1.12; letter-spacing: -.025em; color: #1A1A2E; margin-bottom: 1.5rem; }
  .article-intro { font-size: 1.1rem; font-weight: 600; color: #4A4A6A; line-height: 1.8; margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 2px solid #E8E8F5; }
  .article-body h2 { font-family: 'Nunito', sans-serif; font-size: clamp(1.3rem,3vw,1.8rem); font-weight: 900; letter-spacing: -.02em; color: #1A1A2E; margin: 3rem 0 1rem; line-height: 1.2; }
  .article-body h3 { font-family: 'Nunito', sans-serif; font-size: 1.15rem; font-weight: 800; color: #1A1A2E; margin: 2rem 0 .6rem; }
  .article-body p { font-size: .97rem; font-weight: 600; color: #4A4A6A; line-height: 1.85; margin-bottom: 1.2rem; }
  .article-body strong { color: #1A1A2E; font-weight: 800; }
  .article-body em { font-style: italic; }
  .article-body hr { border: none; border-top: 2px solid #E8E8F5; margin: 2.5rem 0; }
  .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
  .article-body ul li, .article-body ol li { font-size: .97rem; font-weight: 600; color: #4A4A6A; line-height: 1.75; margin-bottom: .4rem; }
  .article-body blockquote { background: #F0EEFF; border-left: 4px solid #5B4BF5; border-radius: 0 16px 16px 0; padding: 20px 24px; margin: 1.5rem 0; }
  .article-body blockquote p { color: #3A2A8A; font-size: .93rem; line-height: 1.8; margin: 0; font-style: italic; }
  .prompt-box { background: #1A1A2E; border-radius: 20px; padding: 28px 32px; margin: 2rem 0; }
  .prompt-box p { color: rgba(255,255,255,0.85); font-size: .92rem; line-height: 1.85; margin: 0; font-style: italic; }
  .prompt-box-label { font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 12px; }
  .cta-inline { background: #5B4BF5; border-radius: 20px; padding: 28px 32px; margin: 2.5rem 0; text-align: center; }
  .cta-inline p { color: rgba(255,255,255,.8); font-size: .95rem; font-weight: 600; margin-bottom: 1.25rem; line-height: 1.65; }
  .cta-inline a { display: inline-block; background: #FF6B4A; color: white; font-family: 'Nunito', sans-serif; font-size: .97rem; font-weight: 800; padding: 13px 28px; border-radius: 100px; text-decoration: none; box-shadow: 0 6px 20px rgba(255,107,74,.4); transition: all .2s; }
  .cta-inline a:hover { transform: translateY(-2px); }
  .faq-section { margin-top: 3rem; }
  .faq-item { background: white; border-radius: 16px; border: 2px solid #E8E8F5; padding: 20px 24px; margin-bottom: 12px; }
  .faq-q { font-weight: 800; font-size: .97rem; color: #1A1A2E; margin-bottom: .6rem; }
  .faq-a { font-size: .92rem; font-weight: 600; color: #4A4A6A; line-height: 1.75; }
  .article-footer { margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #E8E8F5; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .article-footer-logo { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: #1A1A2E; text-decoration: none; }
  .article-footer-logo span { color: #FF6B4A; }
  .article-footer-links { display: flex; gap: 1.5rem; font-size: .84rem; font-weight: 700; }
  .article-footer-links a { color: #8A8AAA; text-decoration: none; }
  .article-footer-links a:hover { color: #5B4BF5; }
  footer { background: #1A1A2E; color: rgba(255,255,255,.5); padding: 28px clamp(1.5rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 4rem; }
  .foot-logo { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; color: white; }
  .foot-logo span { color: #FF6B4A; }
  .foot-links { display: flex; gap: 1.5rem; font-size: .84rem; font-weight: 700; flex-wrap: wrap; }
  .foot-links a { color: rgba(255,255,255,.55); text-decoration: none; }
  .foot-links a:hover { color: white; }
  @media (max-width: 480px) { .nav-link { display: none; } .prompt-box { padding: 20px; } .cta-inline { padding: 22px 20px; } }
`;

export default function ArticleSalud() {
  return (
    <>
      <Head>
        <title>ChatGPT antes del médico: el prompt que cambia todo</title>
        <meta name="description" content="El 80% de las consultas médicas duran menos de 10 minutos. Aprende a prepararte con ChatGPT y lleva las preguntas exactas que tu médico necesita escuchar." />
        <link rel="canonical" href="https://www.promptbien.com/blog/como-usar-chatgpt-antes-de-ir-al-medico" />
        <meta property="og:title" content="ChatGPT antes del médico: el prompt que cambia todo" />
        <meta property="og:description" content="El 80% de las consultas médicas duran menos de 10 minutos. Aprende a prepararte con ChatGPT y lleva las preguntas exactas que tu médico necesita escuchar." />
        <meta property="og:url" content="https://www.promptbien.com/blog/como-usar-chatgpt-antes-de-ir-al-medico" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="/blog" className="nav-link">← Blog</a>
          <a href="/salud" className="nav-cta">✨ Generar prompt médico</a>
        </div>
      </nav>

      <article className="article-wrap">
        <header>
          <div className="article-meta">
            <a href="/salud" className="article-tag">🩺 Salud</a>
            <span className="article-readtime">6 min de lectura</span>
            <span className="article-date">1 de mayo de 2026</span>
          </div>
          <h1>Cómo usar ChatGPT antes de ir al médico: el prompt que necesitas</h1>
          <p className="article-intro">
            La consulta media con tu médico de cabecera en España dura <strong>7 minutos</strong>. Siete minutos para explicar lo que llevas semanas pensando. ChatGPT no va a diagnosticarte. Pero puede prepararte para que esos 7 minutos sean los más útiles de tu año.
          </p>
        </header>

        <div className="article-body">

          <h2>El problema no es la IA. Es la pregunta que le haces.</h2>
          <p>Cuando alguien con colesterol alto le pregunta a ChatGPT <em>"tengo el colesterol alto, ¿qué hago?"</em>, recibe exactamente lo que merece esa pregunta: una respuesta genérica de tres párrafos que podría estar en cualquier web de salud de 2015.</p>
          <p>Dieta mediterránea. Ejercicio moderado. Consulta con tu médico. Gracias, muy útil.</p>
          <p>Ahora imagina que en lugar de eso escribes esto:</p>

          <blockquote>
            <p>"Tengo 52 años, me han detectado colesterol total de 240 mg/dL con LDL en 165. No tengo enfermedades cardiovasculares previas, no fumo, camino 30 minutos tres veces por semana. Mi médico ha mencionado la posibilidad de recetarme estatinas. Necesito que me expliques, sin jerga médica, qué significa realmente este valor en mi contexto, cuándo las estatinas están realmente justificadas según la evidencia actual, y qué preguntas concretas debería hacerle a mi médico para tomar una decisión informada."</p>
          </blockquote>

          <p>La respuesta que obtienes no tiene nada que ver. Esa diferencia se llama <strong>prompt</strong>. Y es lo único que separa la IA que decepciona de la IA que funciona.</p>

          <hr />

          <h2>Qué puede hacer ChatGPT con tu salud — y qué no puede hacer nunca</h2>
          <p><strong>Lo que la IA puede hacer por ti:</strong></p>
          <ul>
            <li>Explicarte en lenguaje comprensible qué significa un diagnóstico o un valor de analítica</li>
            <li>Ayudarte a preparar las preguntas exactas para tu médico</li>
            <li>Darte contexto sobre opciones de tratamiento para que puedas discutirlas con criterio</li>
            <li>Resumirte evidencia científica actualizada sobre un tema concreto</li>
            <li>Ayudarte a describir tus síntomas con precisión antes de la consulta</li>
          </ul>
          <p><strong>Lo que la IA no puede hacer bajo ningún concepto:</strong></p>
          <ul>
            <li>Diagnosticarte</li>
            <li>Sustituir una segunda opinión médica real</li>
            <li>Indicarte dosis o pautas de medicación</li>
            <li>Evaluar si algo es una urgencia</li>
            <li>Conocer tu historial completo</li>
          </ul>

          <hr />

          <h2>El prompt que deberías usar antes de tu próxima consulta</h2>
          <p>Un buen prompt médico tiene cuatro partes: el rol que asignas a la IA, tu contexto completo, lo que necesitas exactamente y las restricciones de lo que no quieres que haga.</p>

          <div className="prompt-box">
            <div className="prompt-box-label">Ejemplo de prompt médico bien construido</div>
            <p>
              "Actúa como un médico especialista de referencia con el rigor diagnóstico de la Clínica Mayo, la claridad comunicativa del Dr. Sanjay Gupta y la empatía de un médico de cabecera que me conoce desde hace años.<br /><br />
              Tengo 52 años, colesterol total de 240 mg/dL con LDL en 165. Mi médico ha mencionado estatinas. No tengo enfermedades cardiovasculares previas. No fumo. Camino 30 minutos tres veces por semana.<br /><br />
              Necesito que me expliques en lenguaje claro qué significa este valor en mi perfil; cuándo las estatinas están justificadas según la evidencia actual; y qué preguntas concretas hacerle a mi médico.<br /><br />
              IMPORTANTE: No me hagas un diagnóstico ni me digas si debo tomar la medicación. Esa decisión es de mi médico."
            </p>
          </div>

          <div className="cta-inline">
            <p>Construir un prompt así desde cero lleva tiempo. <strong>promptbien lo genera en 2 minutos</strong>, personalizado para tu caso y adaptado a tu IA.</p>
            <a href="/salud">Genera tu prompt médico personalizado →</a>
          </div>

          <hr />

          <h2>Tres situaciones donde llegar preparado cambia el resultado</h2>
          <h3>"Me han dado los resultados y no entiendo nada"</h3>
          <p>Una analítica puede tener veinte valores. Usar ChatGPT previamente para entender qué significa cada uno en tu contexto te permite llegar con criterio a la consulta y hacer las preguntas correctas.</p>

          <h3>"Mi médico ha mencionado una medicación y quiero entender mis opciones"</h3>
          <p>No para decirte si tomarla o no — eso es territorio de tu médico. Sino para entender qué es ese fármaco, cómo funciona, qué alternativas existen y qué preguntas son razonables hacer antes de decidir.</p>

          <h3>"Llevo meses con algo y no sé cómo explicárselo"</h3>
          <p>Preparar la descripción de tus síntomas con ayuda de la IA — ordenarlos cronológicamente, identificar qué los mejora o empeora — puede ser la diferencia entre una consulta productiva y una que acaba sin dirección clara.</p>

          <hr />

          <h2>Tu próxima consulta puede ser diferente</h2>
          <p>No porque la IA sea tu médico. Sino porque tú llegarás mejor preparado que nunca. Con las preguntas correctas. Con el contexto ordenado. Con la seguridad de quien entiende su situación.</p>
          <p>Siete minutos pueden ser suficientes. Si los aprovechas bien.</p>

          <div className="cta-inline">
            <p>Genera el prompt perfecto para tu próxima consulta médica en 2 minutos. Gratis, sin registro.</p>
            <a href="/salud">Genera tu prompt médico personalizado →</a>
          </div>

          <hr />

          <section className="faq-section">
            <h2>Preguntas frecuentes</h2>
            <div className="faq-item">
              <div className="faq-q">¿Puede ChatGPT diagnosticarme?</div>
              <div className="faq-a">No, y no debería intentarlo. La IA no tiene acceso a tu historial médico completo, no puede explorar físicamente ni interpretar pruebas con el contexto clínico completo que requiere un diagnóstico. Su valor está en prepararte para hablar mejor con tu médico, no en sustituirlo.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">¿Es seguro usar IA para temas de salud?</div>
              <div className="faq-a">Sí, si se usa correctamente. Un prompt bien construido que explícitamente indica a la IA que no diagnostique, que use lenguaje comprensible y que sea honesta sobre la incertidumbre, produce respuestas útiles y responsables.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">¿Qué es exactamente un prompt médico?</div>
              <div className="faq-a">Es una instrucción estructurada que le das a la IA para que responda como un especialista médico de referencia, adaptada a tu situación concreta. Incluye el perfil de experto, tu contexto médico personal, lo que necesitas conseguir y las restricciones de lo que no quieres que haga.</div>
            </div>
          </section>

        </div>

        <div className="article-footer">
          <a href="/" className="article-footer-logo">prompt<span>bien</span></a>
          <div className="article-footer-links">
            <a href="/salud">Prompts para Salud</a>
            <a href="/generar">Generador</a>
          </div>
        </div>
      </article>

      <footer>
        <div className="foot-logo">prompt<span>bien</span></div>
        <div className="foot-links">
          <a href="/">Inicio</a>
          <a href="/generar">Generador</a>
          <a href="/salud">Salud</a>
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