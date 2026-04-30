import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import Script from "next/script";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("pb_cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("pb_cookie_consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("pb_cookie_consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#1A1A2E", borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "16px clamp(1rem,4vw,3rem)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <p style={{
        fontSize: ".88rem", fontWeight: 600, color: "rgba(255,255,255,0.65)",
        maxWidth: 600, margin: 0, lineHeight: 1.6,
      }}>
        Usamos cookies necesarias para el funcionamiento del servicio y tu sesión de usuario.{" "}
        <a href="/cookies" style={{ color: "#FF6B4A", fontWeight: 700 }}>Más información</a>
      </p>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={reject} style={{
          padding: "9px 20px", borderRadius: "100px",
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: "transparent", color: "rgba(255,255,255,0.5)",
          fontSize: ".85rem", fontWeight: 700, cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
        }}>
          Rechazar
        </button>
        <button onClick={accept} style={{
          padding: "9px 20px", borderRadius: "100px",
          border: "none", background: "#FF6B4A", color: "white",
          fontSize: ".85rem", fontWeight: 800, cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
          boxShadow: "0 4px 14px rgba(255,107,74,0.4)",
        }}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z6BMLC73FW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z6BMLC73FW');
        `}
      </Script>
      <Component {...pageProps} />
      <CookieBanner />
    </SessionProvider>
  );
}