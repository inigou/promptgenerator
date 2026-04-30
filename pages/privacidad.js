import Head from "next/head";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #F8F7FF; color: #1A1A2E; line-height: 1.7; }
  .nav { position: fixed; top: 0; left: 0; right: 0; height: 62px; background: rgba(91,75,245,0.95); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.5rem,5vw,4rem); z-index: 100; }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; }
  .nav-logo span { color: #FF6B4A; }
  .nav-back { font-size: .85rem; font-weight: 700; color: rgba(255,255,255,0.7); text-decoration: none; padding: 8px 18px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.25); transition: all .2s; }
  .nav-back:hover { color: white; background: rgba(255,255,255,0.1); }
  .wrap { max-width: 760px; margin: 0 auto; padding: 100px 1.5rem 80px; }
  .page-title { font-family: 'Nunito', sans-serif; font-size: 2.2rem; font-weight: 900; color: #5B4BF5; margin-bottom: .5rem; letter-spacing: -.02em; }
  .page-date { font-size: .85rem; font-weight: 600; color: #8A8AAA; margin-bottom: 3rem; }
  h2 { font-family: 'Nunito', sans-serif; font-size: 1.2rem; font-weight: 900; color: #1A1A2E; margin: 2.5rem 0 .75rem; }
  p { font-size: .97rem; font-weight: 600; color: #4A4A6A; margin-bottom: 1rem; line-height: 1.75; }
  ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  ul li { font-size: .97rem; font-weight: 600; color: #4A4A6A; margin-bottom: .5rem; line-height: 1.65; }
  a { color: #5B4BF5; font-weight: 700; }
  .info-box { background: #F0EEFF; border-left: 4px solid #5B4BF5; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 2rem; }
  .info-box p { margin: 0; color: #3A2A8A; }
  footer { background: #1A1A2E; color: rgba(255,255,255,.4); padding: 28px clamp(1.5rem,5vw,4rem); text-align: center; font-size: .84rem; font-weight: 600; }
  footer a { color: rgba(255,255,255,.5); text-decoration: none; margin: 0 10px; }
`;

export default function Privacidad() {
  return (
    <>
      <Head>
        <title>Política de Privacidad | promptbien.com</title>
        <meta name="description" content="Política de privacidad de promptbien.com. Cómo tratamos tus datos personales." />
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <a href="/" className="nav-back">← Volver</a>
      </nav>

      <div className="wrap">
        <h1 className="page-title">Política de Privacidad</h1>
        <p className="page-date">Última actualización: 30 de abril de 2026</p>

        <div className="info-box">
          <p>Responsable del tratamiento: Iñigo Fabregas Unzurrunzaga (NIF: 53297514M) · fab.workcorner@gmail.com</p>
        </div>

        <h2>1. ¿Quién es el responsable del tratamiento?</h2>
        <p>El responsable del tratamiento de tus datos personales es Iñigo Fabregas Unzurrunzaga, con NIF 53297514M, con domicilio en España y correo electrónico de contacto: fab.workcorner@gmail.com.</p>

        <h2>2. ¿Qué datos recogemos?</h2>
        <p>Cuando te registras en promptbien.com mediante Google, recogemos los siguientes datos:</p>
        <ul>
          <li>Nombre y apellidos (proporcionados por Google)</li>
          <li>Dirección de correo electrónico</li>
          <li>Identificador único de tu cuenta de Google</li>
          <li>Número de prompts generados y créditos disponibles</li>
          <li>Fecha de registro</li>
        </ul>
        <p>No recogemos datos de pago directamente. Los pagos son procesados por Stripe, que tiene su propia política de privacidad.</p>

        <h2>3. ¿Para qué usamos tus datos?</h2>
        <p>Utilizamos tus datos únicamente para:</p>
        <ul>
          <li>Identificarte como usuario registrado del servicio</li>
          <li>Gestionar tu cuenta y el acceso al generador de prompts</li>
          <li>Controlar el número de prompts utilizados y créditos disponibles</li>
          <li>Procesar y verificar los pagos realizados</li>
          <li>Enviarte comunicaciones relacionadas con el servicio si nos das tu consentimiento</li>
        </ul>

        <h2>4. ¿Cuál es la base legal del tratamiento?</h2>
        <p>El tratamiento de tus datos se basa en la ejecución del contrato de prestación del servicio que aceptas al registrarte, de acuerdo con el artículo 6.1.b) del Reglamento General de Protección de Datos (RGPD).</p>

        <h2>5. ¿Con quién compartimos tus datos?</h2>
        <p>Tus datos pueden ser compartidos con los siguientes proveedores de servicios, únicamente en la medida necesaria para prestar el servicio:</p>
        <ul>
          <li><strong>Google LLC</strong> — Autenticación mediante Google OAuth</li>
          <li><strong>Supabase Inc.</strong> — Almacenamiento de datos de usuario (base de datos en servidores de la UE)</li>
          <li><strong>Stripe Inc.</strong> — Procesamiento de pagos</li>
          <li><strong>Anthropic PBC</strong> — Generación de prompts mediante inteligencia artificial (no se envían datos personales, solo el contenido de la consulta)</li>
          <li><strong>Vercel Inc.</strong> — Alojamiento web</li>
        </ul>
        <p>No vendemos ni cedemos tus datos a terceros con fines comerciales o publicitarios.</p>

        <h2>6. ¿Durante cuánto tiempo conservamos tus datos?</h2>
        <p>Conservamos tus datos mientras mantengas una cuenta activa en promptbien.com. Si solicitas la eliminación de tu cuenta, tus datos serán eliminados en un plazo máximo de 30 días, salvo que la ley nos obligue a conservarlos por un período mayor.</p>

        <h2>7. ¿Cuáles son tus derechos?</h2>
        <p>De acuerdo con el RGPD, tienes derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado</li>
          <li><strong>Limitación:</strong> solicitar la restricción del tratamiento</li>
        </ul>
        <p>Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:fab.workcorner@gmail.com">fab.workcorner@gmail.com</a>. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>.</p>

        <h2>8. Seguridad de los datos</h2>
        <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, la pérdida o la destrucción. Toda la comunicación entre tu navegador y nuestros servidores está cifrada mediante HTTPS.</p>

        <h2>9. Cambios en esta política</h2>
        <p>Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio significativo por correo electrónico o mediante un aviso visible en la web.</p>

        <h2>10. Contacto</h2>
        <p>Si tienes cualquier pregunta sobre esta política o sobre el tratamiento de tus datos, puedes contactarnos en: <a href="mailto:fab.workcorner@gmail.com">fab.workcorner@gmail.com</a></p>
      </div>

      <footer>
        <a href="/">promptbien.com</a>
        <a href="/terminos">Términos</a>
        <a href="/cookies">Cookies</a>
        <a href="/privacidad">Privacidad</a>
      </footer>
    </>
  );
}