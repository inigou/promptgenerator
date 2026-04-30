import Head from "next/head";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #5B4BF5; color: white; min-height: 100vh; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 55% 45% at 15% 10%, rgba(255,107,74,0.2) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 85% 85%, rgba(48,209,88,0.15) 0%, transparent 55%); pointer-events: none; z-index: 0; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.25rem,5vw,2.5rem); height: 62px; background: rgba(91,75,245,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; }
  .nav-logo span { color: #FF6B4A; }
  .wrap { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 1.5rem; }
  .card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 32px; padding: 48px 40px; max-width: 520px; width: 100%; text-align: center; }
  .emoji { font-size: 4rem; margin-bottom: 1.5rem; display: block; animation: bounce .6s ease; }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  h1 { font-family: 'Nunito', sans-serif; font-size: clamp(1.8rem,4vw,2.4rem); font-weight: 900; letter-spacing: -.025em; margin-bottom: .75rem; line-height: 1.15; }
  .sub { font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 2rem; }
  .coffee { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,159,10,0.15); border: 1px solid rgba(255,159,10,0.3); color: #FF9F0A; font-size: .85rem; font-weight: 800; padding: 8px 18px; border-radius: 100px; margin-bottom: 2.5rem; }
  .features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 2.5rem; text-align: left; }
  .feature { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.06); border-radius: 16px; padding: 14px 18px; font-size: .93rem; font-weight: 600; color: rgba(255,255,255,0.85); }
  .feature-icon { font-size: 1.2rem; flex-shrink: 0; }
  .check { color: #30D158; font-weight: 900; font-size: 1rem; flex-shrink: 0; }
  .btn-main { display: block; width: 100%; padding: 17px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1.05rem; font-weight: 900; background: #FF6B4A; color: white; box-shadow: 0 6px 24px rgba(255,107,74,0.45); text-decoration: none; transition: all .25s; }
  .btn-main:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,107,74,0.55); }
  .footer-note { font-size: .78rem; font-weight: 600; color: rgba(255,255,255,0.3); margin-top: 1.5rem; line-height: 1.6; }
  .confetti { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .dot { position: absolute; border-radius: 50%; animation: fall linear forwards; }
  @keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
`;

function Confetti() {
  const colors = ["#FF6B4A", "#30D158", "#FF9F0A", "#5B4BF5", "#FFD166", "#FFFFFF"];
  const dots = Array.from({ length: 40 }, (_, i) => ({
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
        <div key={d.id} className="dot" style={{
          left: d.left, width: d.width, height: d.width,
          background: d.color,
          animationDelay: d.delay,
          animationDuration: d.duration,
          top: "-20px",
        }} />
      ))}
    </div>
  );
}

export default function PagoExitoso() {
  const { data: session } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

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
          <h1>¡Tu prompt está listo para generarse!</h1>
          <p className="sub">
            Hemos recibido tu pago correctamente. Ya tienes un crédito disponible para generar tu próximo prompt personalizado.
          </p>
          <div className="coffee">☕ Has invertido menos que un café</div>

          <div className="features">
            <div className="feature">
              <span className="check">✓</span>
              <span className="feature-icon">⚡</span>
              <span>1 crédito añadido a tu cuenta</span>
            </div>
            <div className="feature">
              <span className="check">✓</span>
              <span className="feature-icon">🎯</span>
              <span>Prompt con experto de primer nivel incluido</span>
            </div>
            <div className="feature">
              <span className="check">✓</span>
              <span className="feature-icon">🤖</span>
              <span>Adaptado a ChatGPT, Claude o Gemini</span>
            </div>
            <div className="feature">
              <span className="check">✓</span>
              <span className="feature-icon">📋</span>
              <span>Listo para copiar y pegar al instante</span>
            </div>
          </div>

          <a href="/generar" className="btn-main">
            ✨ Generar mi prompt ahora
          </a>

          <p className="footer-note">
            {session?.user?.email && `Cuenta: ${session.user.email}`}<br />
            Si tienes algún problema escríbenos a fab.workcorner@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}