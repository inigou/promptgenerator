import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const TEMA_EMOJI = {
  viajes: "✈️", salud: "🩺", inmobiliario: "🏠", otro: "💬"
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #5B4BF5; color: white; min-height: 100vh; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 55% 45% at 15% 10%, rgba(255,107,74,0.18) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 85% 85%, rgba(48,209,88,0.1) 0%, transparent 55%); pointer-events: none; z-index: 0; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1.25rem,5vw,2.5rem); height: 62px; background: rgba(91,75,245,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .nav-logo { font-family: 'Nunito', sans-serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; letter-spacing: -.02em; }
  .nav-logo span { color: #FF6B4A; }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-btn { font-size: .85rem; font-weight: 700; color: rgba(255,255,255,0.6); text-decoration: none; padding: 8px 18px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.2); transition: all .2s; background: none; cursor: pointer; font-family: inherit; }
  .nav-btn:hover { color: white; background: rgba(255,255,255,0.1); }
  .nav-cta { font-size: .85rem; font-weight: 800; color: white; text-decoration: none; padding: 9px 20px; border-radius: 100px; background: #FF6B4A; box-shadow: 0 4px 14px rgba(255,107,74,.35); transition: all .2s; }
  .nav-cta:hover { transform: translateY(-2px); }
  .wrap { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; padding: 88px 1.25rem 100px; }

  .login-wall { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 28px; padding: 48px 36px; text-align: center; }
  .wall-emoji { font-size: 3rem; margin-bottom: 1.2rem; display: block; }
  .wall-title { font-family: 'Nunito', sans-serif; font-size: 1.6rem; font-weight: 900; margin-bottom: .6rem; }
  .wall-sub { font-size: .95rem; font-weight: 600; color: rgba(255,255,255,0.55); margin-bottom: 2rem; line-height: 1.65; }
  .btn-google { width: 100%; padding: 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; background: white; color: #1a1a1a; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .2s; }
  .btn-google:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }

  .profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 1.5rem; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; background: #FF6B4A; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; color: white; flex-shrink: 0; overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .profile-name { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 900; margin-bottom: 2px; }
  .profile-email { font-size: .82rem; font-weight: 600; color: rgba(255,255,255,0.45); }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 1.5rem; }
  .stat-card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px 16px; text-align: center; }
  .stat-value { font-family: 'Nunito', sans-serif; font-size: 2rem; font-weight: 900; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: .75rem; font-weight: 700; color: rgba(255,255,255,0.45); letter-spacing: .04em; text-transform: uppercase; }
  .stat-green .stat-value { color: #30D158; }
  .stat-amber .stat-value { color: #FF9F0A; }
  .stat-blue .stat-value { color: #0A84FF; }

  .credits-card { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 22px; padding: 24px; margin-bottom: 14px; }
  .credits-title { font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
  .credits-row { display: flex; align-items: center; justify-content: space-between; }
  .credits-amount { font-family: 'Nunito', sans-serif; font-size: 2.2rem; font-weight: 900; }
  .credits-sub { font-size: .85rem; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 2px; }
  .credits-badge { background: rgba(48,209,88,0.15); border: 1px solid rgba(48,209,88,0.3); color: #30D158; font-size: .78rem; font-weight: 800; padding: 6px 14px; border-radius: 100px; }
  .credits-badge.empty { background: rgba(255,107,74,0.15); border-color: rgba(255,107,74,0.3); color: #FF6B4A; }

  .btn-main { width: 100%; padding: 16px; border-radius: 100px; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900; background: #FF6B4A; color: white; box-shadow: 0 6px 24px rgba(255,107,74,0.4); text-decoration: none; display: block; text-align: center; margin-bottom: 10px; transition: all .2s; }
  .btn-main:hover { transform: translateY(-2px); }
  .btn-outline { width: 100%; padding: 15px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.15); background: transparent; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .95rem; font-weight: 700; color: rgba(255,255,255,0.55); transition: all .2s; text-decoration: none; display: block; text-align: center; margin-bottom: 10px; }
  .btn-outline:hover { border-color: rgba(255,255,255,0.3); color: white; }
  .btn-signout { width: 100%; padding: 14px; border-radius: 100px; border: 1.5px solid rgba(255,69,58,0.25); background: rgba(255,69,58,0.08); cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .88rem; font-weight: 700; color: rgba(255,69,58,0.7); transition: all .2s; margin-top: 8px; }
  .btn-signout:hover { border-color: rgba(255,69,58,0.5); color: #FF453A; }

  .free-banner { background: rgba(48,209,88,0.12); border: 1.5px solid rgba(48,209,88,0.25); border-radius: 18px; padding: 16px 20px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
  .free-banner-icon { font-size: 1.4rem; flex-shrink: 0; }
  .free-banner-text { font-size: .9rem; font-weight: 700; color: rgba(255,255,255,0.8); line-height: 1.5; }
  .free-banner-text span { color: #30D158; }

  .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 20px 0; }
  .section-title { font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 12px; }

  /* HISTORIAL */
  .history-empty { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 32px; text-align: center; }
  .history-empty-icon { font-size: 2rem; margin-bottom: .75rem; display: block; }
  .history-empty-text { font-size: .9rem; font-weight: 600; color: rgba(255,255,255,0.4); line-height: 1.6; }

  .history-item { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 18px 20px; margin-bottom: 10px; transition: all .2s; }
  .history-item:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.15); }
  .history-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 10px; }
  .history-item-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .history-tema { font-size: .78rem; font-weight: 800; background: rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 100px; text-transform: capitalize; }
  .history-ia { font-size: .75rem; font-weight: 700; color: rgba(255,255,255,0.45); }
  .history-date { font-size: .72rem; font-weight: 600; color: rgba(255,255,255,0.3); }
  .history-situacion { font-size: .85rem; font-weight: 600; color: rgba(255,255,255,0.6); line-height: 1.5; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-actions { display: flex; gap: 8px; }
  .btn-copy-small { padding: 7px 16px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.15); background: transparent; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .78rem; font-weight: 700; color: rgba(255,255,255,0.6); transition: all .2s; }
  .btn-copy-small:hover { border-color: rgba(255,255,255,0.3); color: white; }
  .btn-copy-small.copied { background: rgba(48,209,88,0.15); border-color: rgba(48,209,88,0.4); color: #30D158; }
  .btn-expand { padding: 7px 16px; border-radius: 100px; border: none; background: rgba(255,255,255,0.08); cursor: pointer; font-family: 'Nunito', sans-serif; font-size: .78rem; font-weight: 700; color: rgba(255,255,255,0.5); transition: all .2s; }
  .btn-expand:hover { background: rgba(255,255,255,0.12); color: white; }

  .history-resultado { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 14px 16px; margin-top: 12px; font-size: .82rem; font-weight: 600; color: rgba(255,255,255,0.7); line-height: 1.7; white-space: pre-wrap; max-height: 200px; overflow-y: auto; }
  .history-resultado::-webkit-scrollbar { width: 4px; }
  .history-resultado::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

  .loading-spinner { width: 28px; height: 28px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); border-top-color: rgba(255,255,255,0.6); animation: spin 0.8s linear infinite; margin: 0 auto; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeUp .35s ease both; }

  @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; } .wrap { padding: 76px 1rem 80px; } }
`;

export default function MisPrompts() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (session) {
      loadHistory();
    }
  }, [session]);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/prompts-history");
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch (e) {
      console.error(e);
    }
    setLoadingHistory(false);
  }

  function copyPrompt(item) {
    const match = item.resultado?.match(/TU PROMPT PERSONALIZADO\n---\n\n([\s\S]+?)\n\n---/);
    const text = match ? match[1].trim() : item.resultado;
    navigator.clipboard.writeText(text || "");
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  }

  const promptsUsed = session?.user?.prompts_used ?? 0;
  const promptsPaid = session?.user?.prompts_paid ?? 0;
  const isFreeAvailable = promptsUsed === 0;
  const credits = Math.max(0, promptsPaid - Math.max(0, promptsUsed - 1));

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <Head>
        <title>Mis prompts | promptbien.com</title>
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <nav className="nav">
        <a href="/" className="nav-logo">prompt<span>bien</span></a>
        <div className="nav-right">
          <a href="/generar" className="nav-cta">✨ Nuevo prompt</a>
        </div>
      </nav>

      <div className="wrap">

        {status === "unauthenticated" && (
          <div className="login-wall fade-in">
            <span className="wall-emoji">🔐</span>
            <h1 className="wall-title">Accede a tu cuenta</h1>
            <p className="wall-sub">Entra con Google para ver tus prompts y créditos disponibles.</p>
            <button className="btn-google" onClick={() => signIn("google", { callbackUrl: "/mis-prompts" })}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        )}

        {status === "authenticated" && session && (
          <div className="fade-in">

            <div className="profile-header">
              <div className="avatar">
                {session.user.image ? <img src={session.user.image} alt={session.user.name} /> : initials}
              </div>
              <div>
                <div className="profile-name">{session.user.name || "Usuario"}</div>
                <div className="profile-email">{session.user.email}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card stat-amber">
                <div className="stat-value">{promptsUsed}</div>
                <div className="stat-label">Generados</div>
              </div>
              <div className="stat-card stat-blue">
                <div className="stat-value">{credits}</div>
                <div className="stat-label">Créditos</div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-value">{isFreeAvailable ? "1" : "0"}</div>
                <div className="stat-label">Gratis</div>
              </div>
            </div>

            {isFreeAvailable && (
              <div className="free-banner">
                <span className="free-banner-icon">✨</span>
                <div className="free-banner-text">Tienes <span>1 prompt gratis</span> disponible.</div>
              </div>
            )}

            <div className="credits-card">
              <div className="credits-title">Créditos disponibles</div>
              <div className="credits-row">
                <div>
                  <div className="credits-amount">{credits}</div>
                  <div className="credits-sub">{credits === 0 ? "Sin créditos — compra para seguir" : `Puedes generar ${credits} prompt${credits > 1 ? "s" : ""} más`}</div>
                </div>
                <div className={`credits-badge ${credits === 0 ? "empty" : ""}`}>
                  {credits === 0 ? "Sin créditos" : `${credits} disponible${credits > 1 ? "s" : ""}`}
                </div>
              </div>
            </div>

            <a href="/generar" className="btn-main">
              ✨ {isFreeAvailable ? "Generar mi prompt gratis" : credits > 0 ? "Generar nuevo prompt" : "Ir al generador"}
            </a>

            {credits === 0 && !isFreeAvailable && (
              <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "#"} className="btn-outline">
                ⚡ Comprar prompt — 1,99€
              </a>
            )}

            <div className="divider" />

            {/* HISTORIAL */}
            <div className="section-title">Historial de prompts</div>

            {loadingHistory && (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <div className="loading-spinner" />
              </div>
            )}

            {!loadingHistory && history.length === 0 && (
              <div className="history-empty">
                <span className="history-empty-icon">📋</span>
                <p className="history-empty-text">Aún no has generado ningún prompt.<br />Tu historial aparecerá aquí.</p>
              </div>
            )}

            {!loadingHistory && history.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-item-header">
                  <div className="history-item-meta">
                    <span className="history-tema">{TEMA_EMOJI[item.tema] || "💬"} {item.tema}</span>
                    <span className="history-ia">{item.ia}</span>
                  </div>
                  <span className="history-date">{formatDate(item.created_at)}</span>
                </div>
                <div className="history-situacion">{item.situacion}</div>
                <div className="history-actions">
                  <button
                    className={`btn-copy-small ${copiedId === item.id ? "copied" : ""}`}
                    onClick={() => copyPrompt(item)}
                  >
                    {copiedId === item.id ? "✓ Copiado" : "Copiar prompt"}
                  </button>
                  <button
                    className="btn-expand"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    {expandedId === item.id ? "Ocultar" : "Ver prompt"}
                  </button>
                </div>
                {expandedId === item.id && (
                  <div className="history-resultado">{item.resultado}</div>
                )}
              </div>
            ))}

            <div className="divider" />
            <button className="btn-signout" onClick={() => signOut({ callbackUrl: "/" })}>
              Cerrar sesión
            </button>

          </div>
        )}

      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, padding: "10px", zIndex: 50, background: "rgba(91,75,245,0.5)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[["Privacidad", "/privacidad"], ["Términos", "/terminos"], ["Cookies", "/cookies"]].map(([label, href]) => (
          <a key={href} href={href} style={{ fontSize: ".73rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</a>
        ))}
      </div>
    </>
  );
}