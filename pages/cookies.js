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
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: .9rem; }
  th { background: #5B4BF5; color: white; padding: 10px 14px; text-align: left; font-weight: 800; }
  td { padding: 10px 14px; border-bottom: 1px solid #E8E8F5; color: #4A4A6A; font-weight: 600; vertical-align: top; }
  tr:nth-child(even) td { background: #F0EEFF; }
  a { color: #5B4BF5; font-weight: 700; }
  .info-box { background: #F0EEFF; border-left: 4px solid #5B4BF5; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 2rem; }
  .info-box p { margin: 0; color: #3A2A8A; }
  footer { background: #1A1A2E; color: rgba(255,255,255,.4); padding: 28px clamp(1.5rem,5vw,4rem); text-align: center; font-size: .84rem; font-weight: 600; }
  footer a { color: rgba(255,255,255,.5); text-decoration: none; margin: 0 10px; }
`;

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Política de Cookies | promptbien.com</title>
        <meta name="description" content="Política de cookies de promptbien.com." />
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <a href="/" className="nav-back">← Volver</a>
      </nav>

      <div className="wrap">
        <h1 className="page-title">Política de Cookies</h1>
        <p className="page-date">Última actualización: 30 de abril de 2026</p>

        <div className="info-box">
          <p>Titular del servicio: Iñigo Fabregas Unzurrunzaga · fab.workcorner@gmail.com</p>
        </div>

        <h2>¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para recordar tus preferencias, mantener tu sesión activa y analizar cómo se usa el servicio.</p>

        <h2>Cookies que utilizamos</h2>

        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>next-auth.session-token</td>
              <td>Necesaria</td>
              <td>Mantiene tu sesión de usuario activa tras el login con Google</td>
              <td>30 días</td>
            </tr>
            <tr>
              <td>next-auth.csrf-token</td>
              <td>Necesaria</td>
              <td>Protección contra ataques CSRF en el proceso de autenticación</td>
              <td>Sesión</td>
            </tr>
            <tr>
              <td>next-auth.callback-url</td>
              <td>Necesaria</td>
              <td>Recuerda la página de destino tras el login</td>
              <td>Sesión</td>
            </tr>
            <tr>
              <td>pb_free_used</td>
              <td>Funcional</td>
              <td>Registra si ya has utilizado tu prompt gratuito</td>
              <td>Persistente</td>
            </tr>
            <tr>
              <td>pb_cookie_consent</td>
              <td>Necesaria</td>
              <td>Recuerda tu elección sobre el uso de cookies</td>
              <td>1 año</td>
            </tr>
          </tbody>
        </table>

        <h2>Cookies de terceros</h2>
        <p>Algunos de nuestros proveedores pueden establecer sus propias cookies:</p>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Finalidad</th>
              <th>Más información</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google</td>
              <td>Autenticación con Google OAuth</td>
              <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de Google</a></td>
            </tr>
            <tr>
              <td>Stripe</td>
              <td>Procesamiento seguro de pagos</td>
              <td><a href="https://stripe.com/es/privacy" target="_blank" rel="noopener">Política de Stripe</a></td>
            </tr>
          </tbody>
        </table>

        <h2>¿Cómo gestionar las cookies?</h2>
        <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Ten en cuenta que si deshabilitas las cookies necesarias, algunas funciones del servicio pueden dejar de funcionar correctamente (como mantener tu sesión iniciada).</p>
        <p>Instrucciones para los principales navegadores:</p>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
          <li style={{ marginBottom: ".5rem" }}><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a></li>
          <li style={{ marginBottom: ".5rem" }}><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener">Mozilla Firefox</a></li>
          <li style={{ marginBottom: ".5rem" }}><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
        </ul>

        <h2>Actualizaciones de esta política</h2>
        <p>Podemos actualizar esta política de cookies cuando sea necesario. Te recomendamos revisarla periódicamente. La fecha de última actualización siempre aparecerá al inicio del documento.</p>

        <h2>Contacto</h2>
        <p>Para cualquier consulta sobre el uso de cookies, puedes contactarnos en: <a href="mailto:fab.workcorner@gmail.com">fab.workcorner@gmail.com</a></p>
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