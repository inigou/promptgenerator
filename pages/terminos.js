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

export default function Terminos() {
  return (
    <>
      <Head>
        <title>Términos y Condiciones | promptbien.com</title>
        <meta name="description" content="Términos y condiciones de uso de promptbien.com." />
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav>
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <a href="/" className="nav-back">← Volver</a>
      </nav>

      <div className="wrap">
        <h1 className="page-title">Términos y Condiciones</h1>
        <p className="page-date">Última actualización: 30 de abril de 2026</p>

        <div className="info-box">
          <p>Titular del servicio: Iñigo Fabregas Unzurrunzaga (NIF: 53297514M) · fab.workcorner@gmail.com</p>
        </div>

        <h2>1. Aceptación de los términos</h2>
        <p>Al acceder y utilizar promptbien.com, aceptas quedar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te rogamos que no utilices el servicio.</p>

        <h2>2. Descripción del servicio</h2>
        <p>promptbien.com es una herramienta web que genera prompts personalizados para sistemas de inteligencia artificial como ChatGPT, Claude y Gemini. El servicio funciona de la siguiente manera:</p>
        <ul>
          <li>El primer prompt es completamente gratuito y no requiere registro</li>
          <li>Los prompts adicionales tienen un coste de 1,99€ por prompt</li>
          <li>Para acceder a prompts de pago es necesario registrarse mediante Google</li>
        </ul>

        <h2>3. Registro y cuenta de usuario</h2>
        <p>El registro se realiza mediante autenticación de Google (OAuth 2.0). Al registrarte, garantizas que la información proporcionada es veraz y que eres mayor de 18 años. Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que ocurran en ella.</p>

        <h2>4. Condiciones de pago</h2>
        <p>Los pagos se procesan a través de Stripe, plataforma de pago segura. Al realizar un pago aceptas:</p>
        <ul>
          <li>Que el importe de 1,99€ por prompt se cargará en tu método de pago en el momento de la compra</li>
          <li>Que los créditos adquiridos no tienen fecha de caducidad</li>
          <li>Que los pagos no son reembolsables una vez que el prompt ha sido generado</li>
          <li>Que eres el titular o tienes autorización para usar el método de pago empleado</li>
        </ul>

        <h2>5. Política de reembolsos</h2>
        <p>Dado que los prompts se generan de forma instantánea y digital, no ofrecemos reembolsos una vez que el prompt ha sido generado y entregado. Si experimentas un problema técnico que impida la entrega del prompt, contáctanos en fab.workcorner@gmail.com y lo resolveremos.</p>

        <h2>6. Uso aceptable</h2>
        <p>Te comprometes a utilizar promptbien.com de forma lícita y a no emplearlo para:</p>
        <ul>
          <li>Generar contenido ilegal, difamatorio, obsceno o que vulnere derechos de terceros</li>
          <li>Intentar eludir los sistemas de pago o acceder a funciones de pago sin abonar el precio correspondiente</li>
          <li>Realizar ingeniería inversa, descompilar o intentar extraer el código fuente del servicio</li>
          <li>Utilizar sistemas automatizados o bots para acceder al servicio de forma masiva</li>
          <li>Cualquier actividad que pueda dañar, deshabilitar o sobrecargar la infraestructura del servicio</li>
        </ul>

        <h2>7. Propiedad intelectual</h2>
        <p>El diseño, código y contenidos de promptbien.com son propiedad de Iñigo Fabregas Unzurrunzaga. Los prompts generados para el usuario son de su libre uso. No reclamamos ningún derecho sobre el contenido que introduces para generar tus prompts.</p>

        <h2>8. Limitación de responsabilidad</h2>
        <p>promptbien.com proporciona prompts generados por inteligencia artificial con fines informativos y de ayuda. No garantizamos que los resultados obtenidos al usar estos prompts en herramientas de IA externas sean precisos, completos o adecuados para ningún propósito específico. El usuario es el único responsable del uso que haga de los prompts generados.</p>
        <p>En ningún caso nuestra responsabilidad total hacia el usuario superará el importe pagado por el servicio en los últimos 30 días.</p>

        <h2>9. Modificaciones del servicio</h2>
        <p>Nos reservamos el derecho de modificar, suspender o interrumpir el servicio en cualquier momento, con o sin previo aviso. También podemos modificar estos términos y condiciones, notificándolo a través de la web o por correo electrónico.</p>

        <h2>10. Ley aplicable y jurisdicción</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier controversia derivada del uso del servicio, las partes se someten a los juzgados y tribunales del domicilio del usuario, de acuerdo con la normativa de protección al consumidor.</p>

        <h2>11. Contacto</h2>
        <p>Para cualquier consulta sobre estos términos, puedes contactarnos en: <a href="mailto:fab.workcorner@gmail.com">fab.workcorner@gmail.com</a></p>
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