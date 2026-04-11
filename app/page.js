"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import IntroOverlay from "@/app/components/IntroOverlay";

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

// Fade-in fires after the intro overlay has mostly cleared.
function useFadeIn(delay = 4600) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem('introPlayed');
    const delay = alreadyPlayed ? 100 : 4600;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);
  return visible;
}

// Per-column animation style — each column fades and lifts in with a stagger.
function fadeStyle(visible, delayS = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s ease ${delayS}s, transform 0.9s ease ${delayS}s`,
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function Dashboard() {
  const visible = useFadeIn(2200);
  const navbarRef = useRef(null);

  const roles = ["Developer", "Designer", "Builder", "Coder"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [fadeRole, setFadeRole] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [navVisible, setNavVisible] = useState(false);
  const [litSymbol, setLitSymbol] = useState(0);

  const symbolData = [
    { icon: "△", label: "scale with purpose" },
    { icon: "◈", label: "pixel perfect focus" },
    { icon: "∞", label: "infinite\niteration" },
    { icon: "</>", label: "ship clean code" },
    { icon: "⚡", label: "fast load speed" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLitSymbol(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
  const alreadyPlayed = sessionStorage.getItem('introPlayed');
  const delay = alreadyPlayed ? 0 : 4500;
  const t = setTimeout(() => setNavVisible(true), delay);
  return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeRole(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setFadeRole(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const rightCol = document.querySelector('.hide-on-small');
      const navbar = document.querySelector('nav');
      const img = document.querySelector('img[alt="Sanjay Waugh"]');
      if (!rightCol || !navbar || !img) return;

      const navbarBottom = navbar.getBoundingClientRect().bottom;
      const imgBottom = img.getBoundingClientRect().bottom;
      const colRect = rightCol.getBoundingClientRect();

      const isLeaking = colRect.top < navbarBottom || colRect.bottom > imgBottom;

      if (isLeaking) {
        rightCol.style.visibility = 'hidden';
        rightCol.style.opacity = '0';
      } else {
        rightCol.style.visibility = 'visible';
        rightCol.style.opacity = '1';
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [activePage]);


  const navLinkStyle = (page) => ({
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: activePage === page ? "#a78bfa" : "#d4d4d8",
    transition: "color 0.2s",
    padding: 0,
  });

  return (
    <div className="bg-zinc-950" style={{ position: "relative" }}>

      {/* ── BACKGROUND ORBS ── fixed, below all content ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>

        {/* Desktop/tablet — left orb, only moves up/down */}
        <div className="desktop-orb" style={{
          position: "absolute",
          top: "25%",
          left: "-10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.6) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbUpDown 8s ease-in-out infinite",
        }} />

        {/* Desktop/tablet — right orb, only moves up/down */}
        <div className="desktop-orb" style={{
          position: "absolute",
          top: "25%",
          right: "-10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.55) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbUpDown 10s ease-in-out infinite",
          animationDelay: "-4s",
        }} />

        {/* Mobile only — free floating orb top */}
        <div className="mobile-orb" style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat 12s ease-in-out infinite",
        }} />

        {/* Mobile only — free floating orb bottom */}
        <div className="mobile-orb" style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat 15s ease-in-out infinite",
          animationDelay: "-6s",
        }} />

        {/* Mobile orb 3 — mid left */}
        <div className="mobile-orb" style={{
          position: "absolute",
          top: "40%",
          left: "-10%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat 10s ease-in-out infinite",
          animationDelay: "-3s",
        }} />

        {/* Mobile orb 4 — mid right */}
        <div className="mobile-orb" style={{
          position: "absolute",
          top: "60%",
          left: "30%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)",
          filter: "blur(55px)",
          animation: "orbFloat 18s ease-in-out infinite",
          animationDelay: "-9s",
        }} />

        {/* ── FLOATING SYMBOLS — home only ── */}
        {activePage === "home" && <>

          {/* △ — index 0 */}
          <span className="symbol" style={{
            top: "13%", left: "7%",
            fontSize: "3rem",
            transform: "rotate(-15deg)",
            color: litSymbol === 0 ? "rgba(220,200,255,0.95)" : "rgba(200,200,220,0.25)",
            transition: "color 1.5s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          }}>
            △
            <span style={{ fontSize: "0.55rem", fontWeight: "500", color: "#c4b5fd", fontFamily: "'Inter', 'SF Pro Display', sans-serif", whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase", opacity: litSymbol === 0 ? 1 : 0, transition: "opacity 1.5s ease", display: "block", marginTop: "4px" }}>
              scale with purpose
            </span>
          </span>

          {/* ◈ — index 1 */}
          <span className="symbol" style={{
            bottom: "5%", right: "8%",
            fontSize: "2.8rem",
            transform: "rotate(8deg)",
            color: litSymbol === 1 ? "rgba(220,200,255,0.95)" : "rgba(200,200,220,0.25)",
            transition: "color 1.5s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          }}>
            ◈
            <span style={{ fontSize: "0.55rem", fontWeight: "500", color: "#c4b5fd", fontFamily: "'Inter', 'SF Pro Display', sans-serif", whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase", opacity: litSymbol === 1 ? 1 : 0, transition: "opacity 1.5s ease", display: "block", marginTop: "4px" }}>
              pixel perfect focus
            </span>
          </span>

          {/* ∞ — index 2 */}
          <span className="symbol" style={{
            top: "55%", left: "2%",
            fontSize: "3.2rem",
            transform: "rotate(-8deg)",
            color: litSymbol === 2 ? "rgba(220,200,255,0.95)" : "rgba(200,200,220,0.25)",
            transition: "color 1.5s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          }}>
            ∞
            <span style={{ fontSize: "0.55rem", fontWeight: "500", color: "#c4b5fd", fontFamily: "'Inter', 'SF Pro Display', sans-serif", whiteSpace: "pre-line", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase", opacity: litSymbol === 2 ? 1 : 0, transition: "opacity 1.5s ease", display: "block", marginTop: "4px" }}>
              {"infinite\niteration"}
            </span>
          </span>

          {/* </> — index 3 */}
          <span className="symbol" style={{
            bottom: "10%", left: "28%",
            fontSize: "2.5rem",
            transform: "rotate(12deg)",
            color: litSymbol === 3 ? "rgba(220,200,255,0.95)" : "rgba(200,200,220,0.25)",
            transition: "color 1.5s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            fontFamily: "monospace",
          }}>
            {"</>"}
            <span style={{ fontSize: "0.55rem", fontWeight: "500", color: "#c4b5fd", fontFamily: "'Inter', 'SF Pro Display', sans-serif", whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase", opacity: litSymbol === 3 ? 1 : 0, transition: "opacity 1.5s ease", display: "block", marginTop: "4px" }}>
              ship clean code
            </span>
          </span>

          {/* ⚡ — index 4 */}
          <span className="symbol" style={{
            top: "12%", right: "6%",
            fontSize: "3rem",
            transform: "rotate(12deg)",
            color: litSymbol === 4 ? "rgba(220,200,255,0.95)" : "rgba(200,200,220,0.25)",
            transition: "color 1.5s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          }}>
            ⚡
            <span style={{ fontSize: "0.55rem", fontWeight: "500", color: "#c4b5fd", fontFamily: "'Inter', 'SF Pro Display', sans-serif", whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase", opacity: litSymbol === 4 ? 1 : 0, transition: "opacity 1.5s ease", display: "block", marginTop: "4px" }}>
              fast load speed
            </span>
          </span>

        </>}

      </div>

      <IntroOverlay />


      {/* ── NAVBAR ── fixed, fully transparent, content capped at 1200px ── */}
      <nav ref={navbarRef} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 49, background: "linear-gradient(to bottom, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.85) 70%, transparent 100%)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", opacity: navVisible ? 1 : 0,
      pointerEvents: navVisible ? "auto" : "none",
      transition: "opacity 0.6s ease",}}>
        <div
          className="flex items-center justify-between py-5"
          style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingLeft: "2rem", paddingRight: "2rem", paddingBottom: "20px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ffffff" }}>
              {greeting} 👋
            </span>
          </div>
          <div className="desktop-nav">
            <button
              onClick={() => setActivePage("about")}
              style={navLinkStyle("about")}
              onMouseEnter={(e) => { if (activePage !== "about") e.target.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { if (activePage !== "about") e.target.style.color = "#d4d4d8"; }}
            >
              About Me
            </button>
            <button
              onClick={() => setActivePage("projects")}
              style={navLinkStyle("projects")}
              onMouseEnter={(e) => { if (activePage !== "projects") e.target.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { if (activePage !== "projects") e.target.style.color = "#d4d4d8"; }}
            >
              Projects
            </button>
            <button
              onClick={() => setActivePage("contact")}
              style={navLinkStyle("contact")}
              onMouseEnter={(e) => { if (activePage !== "contact") e.target.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { if (activePage !== "contact") e.target.style.color = "#d4d4d8"; }}
            >
              Contact
            </button>
          </div>

          {/* Hamburger — tablet/mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column",
              gap: "5px", padding: "4px", zIndex: 60,
            }}
          >
            <span style={{
              display: "block", width: "22px", height: "2px",
              background: "#ffffff", borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <span style={{
              display: "block", width: "22px", height: "2px",
              background: "#ffffff", borderRadius: "2px",
              transition: "all 0.3s ease",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: "22px", height: "2px",
              background: "#ffffff", borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* ── NAVBAR FADE ── soft gradient dissolve below the navbar ── */}
      <div style={{
        position: 'fixed',
        top: '70px',
        left: 0,
        right: 0,
        height: '40px',
        background: 'linear-gradient(to bottom, rgba(9,9,11,0.7) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        zIndex: 48,
        pointerEvents: 'none',
      }} />

      {/* ── HOME BUTTON ── fixed below navbar, only when not on home page ── */}
      {activePage !== 'home' && (
        <button
          onClick={() => setActivePage('home')}
          style={{
            position: 'fixed',
            top: '90px',
            left: '2rem',
            zIndex: 49,
            background: 'rgba(109,40,217,0.2)',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#a78bfa',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          ← Home
        </button>
      )}

      {/* ── MOBILE MENU ───────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 51,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.4)",
          }}
        />
      )}

      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "260px", height: "100vh",
        zIndex: 55,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "3rem 2rem",
        gap: "2rem",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        {[["About Me", "about"], ["Projects", "projects"], ["Contact", "contact"]].map(([label, page], i) => (
          <button
            key={page}
            onClick={() => { setActivePage(page); setMenuOpen(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#ffffff", fontSize: "1.75rem", fontWeight: "800",
              padding: 0, textAlign: "left",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(20px)",
              transition: `opacity 0.3s ease ${i * 0.1 + 0.15}s, transform 0.3s ease ${i * 0.1 + 0.15}s`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── HOME PAGE ─────────────────────────────────────────────────────── */}
      {activePage === "home" && (
        <div style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 3rem",
        }}>

          {/* LEFT COLUMN */}
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "2rem",
            zIndex: 2,
          }}>
            {/* Website/role annotation */}
            <div className="home-annotation" style={{ position: "relative", marginBottom: "1rem", marginLeft: "auto", marginRight: "-60px", width: "fit-content" }}>
              <div style={{ lineHeight: 1.2, marginBottom: "0.25rem" }}>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700",
                  fontStyle: "italic", fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
                  color: "#c4b5fd", textShadow: "0 0 20px rgba(167,139,250,0.5)" }}>Website</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700",
                  fontStyle: "italic", fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
                  color: "#ffffff", textShadow: "0 0 20px rgba(255,255,255,0.3)",
                  opacity: fadeRole ? 1 : 0, transition: "opacity 0.3s ease",
                  minWidth: "110px" }}>{roles[roleIndex]}</p>
              </div>
              <svg width="100" height="80" viewBox="0 0 100 80" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M 10 15 C 10 40, 40 60, 80 62"
                  stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 80 62 L 65 62 M 80 62 L 75 52"
                  stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#a78bfa",
              margin: "0 0 0.25rem 0", letterSpacing: "0.05em" }}>Hello, I&apos;m</p>
            <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: "900",
              color: "#ffffff", lineHeight: 1.0, margin: "0 0 0.75rem 0" }}>
              Sanjay<br />Waugh
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#71717a", margin: "0 0 1.25rem 0",
              lineHeight: 1.6 }}>
              turning <em style={{ color: "#a78bfa", fontStyle: "normal", fontWeight: "600" }}>ideas</em>
              {" "}into things people{" "}
              <em style={{ color: "#a78bfa", fontStyle: "italic", fontWeight: "600" }}>actually use.</em>
            </p>

            <div style={{ display: "flex", flexDirection: "row", gap: "0.75rem",
              marginBottom: "1.25rem", flexWrap: "nowrap" }}>
              <button onClick={() => setActivePage("projects")}
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "#fff", border: "none", cursor: "pointer",
                  padding: "0.6rem 1.1rem", borderRadius: "10px",
                  fontSize: "0.825rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                View Projects →
              </button>
              <a href="mailto:sanjay@creativelements.org"
                style={{ border: "1px solid #52525b", color: "#ffffff",
                  padding: "0.6rem 1.1rem", borderRadius: "10px",
                  fontSize: "0.825rem", fontWeight: "600", whiteSpace: "nowrap",
                  textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Contact Me
              </a>
            </div>

            <div style={{ display: "flex", gap: "1.25rem" }}>
              <a href="https://github.com/sanjay-creativelements" target="_blank"
                rel="noopener noreferrer" style={{ color: "#71717a" }}>
                <GitHubIcon />
              </a>
              <a href="https://www.linkedin.com/in/sanjay-waugh-50540625b/" target="_blank"
                rel="noopener noreferrer" style={{ color: "#71717a" }}>
                <LinkedInIcon />
              </a>
              <a href="mailto:sanjay@creativelements.org" style={{ color: "#71717a" }}>
                <EmailIcon />
              </a>
            </div>
          </div>

          {/* CENTER — Image */}
          <div className="home-img-col" style={{
            position: "relative",
            flex: "0 0 min(500px, 55vw)",
            height: "95vh",
            paddingTop: "60px",
            display: "flex",
            alignItems: "flex-start",
            background: "transparent",
          }}>
            {/* Glow */}
            <div style={{ position: "absolute", bottom: "10%", left: "50%",
              transform: "translateX(-50%)", width: "420px", height: "420px",
              background: "radial-gradient(circle, rgba(109,40,217,0.45) 0%, rgba(109,40,217,0.15) 50%, transparent 75%)",
              zIndex: 0, pointerEvents: "none" }} />
            <img src="/profile.png" alt="Sanjay Waugh"
              style={{ background: "none", position: "relative", zIndex: 1,
                width: "100%", height: "auto", display: "block",
                animation: "float 4s ease-in-out infinite" }} />
            {/* Fade */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
              height: "45%", zIndex: 2, pointerEvents: "none",
              background: "linear-gradient(to top, #09090b 0%, #09090b 25%, rgba(9,9,11,0.95) 45%, rgba(9,9,11,0.7) 65%, rgba(9,9,11,0.2) 85%, transparent 100%)",
              backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
              maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)" }} />
          </div>

          {/* RIGHT COLUMN — hidden on small screens */}
          <div className="hide-on-small" style={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "3rem",
            overflow: "hidden",
            minWidth: "0",
            transition: "opacity 0.3s ease",
          }}>
            <p style={{ fontSize: "1.15rem", lineHeight: "1.75", color: "#e4e4e7",
              fontWeight: "400", maxWidth: "300px", fontStyle: "italic" }}>
              &ldquo;I don&apos;t just write code &mdash; I build what you imagined.
              <br /><br />
              You bring the vision. I make it real &mdash;{" "}
              <span style={{ color: "#c4b5fd", fontWeight: "600" }}>
                clean, fast, and built to last.
              </span>
              {" "}No fluff. No half-done features. Just your idea,{" "}
              <span style={{ color: "#ffffff", fontWeight: "600" }}>
                shipped and working.
              </span>
              &rdquo;
            </p>
          </div>

        </div>
      )}

      {/* ── PROJECTS PAGE ─────────────────────────────────────────────────── */}
      {activePage === "projects" && (
        <div style={{ animation: "fadeIn 0.4s ease", maxWidth: "1200px", margin: "0 auto", padding: "7rem 2rem 4rem", position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "#ffffff", lineHeight: 1.1, margin: 0 }}>
              My Works
            </h2>
          </div>

          <div className="projects-grid" style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 2rem",
          }}>

            {/* LEFT — Square project card, fixed width */}
            <div className="project-card" style={{
              background: "linear-gradient(135deg, rgba(30,20,60,0.9) 0%, rgba(15,10,30,0.95) 100%)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "24px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "380px",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "3.5rem", fontWeight: "900", color: "#ffffff", lineHeight: 1 }}>01</span>
                <span style={{ fontSize: "1rem", fontWeight: "600", color: "#ffffff" }}>SEO</span>
              </div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>rankmob.io</h3>
              <p style={{ fontSize: "0.95rem", color: "#a1a1aa", margin: 0 }}>AI powered SEO Automation platform</p>
              <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(139,92,246,0.2)", position: "relative" }}>
                <img
                  src="/rankmob-preview.png"
                  alt="rankmob.io"
                  style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
                <a
                  href="https://rankmob.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                  }}
                >↗</a>
              </div>
            </div>

            {/* RIGHT — Description panel */}
            <div className="project-desc" style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1.5rem",
              flex: 1,
              padding: "1rem 2rem",
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: "999px",
                padding: "0.35rem 1rem",
                width: "fit-content",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
                <span style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Live Project
                </span>
              </div>

              <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                rankmob.io
              </h3>

              <p style={{ fontSize: "1.05rem", color: "#a1a1aa", lineHeight: "1.85", margin: 0, maxWidth: "420px" }}>
                Most SEO tools just point out what&apos;s broken and leave you to fix it yourself.{" "}
                <span style={{ color: "#ffffff", fontWeight: "600" }}>rankmob.io actually does the work.</span>
                {" "}It automates the complete SEO workflow — from spotting issues to fixing them —
                so your site climbs Google rankings{" "}
                <span style={{ color: "#c4b5fd", fontWeight: "500", fontStyle: "italic" }}>
                  without you lifting a finger.
                </span>
              </p>

              <a
                href="https://rankmob.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  color: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                Visit Site ↗
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ── ABOUT PAGE ────────────────────────────────────────────────────── */}
      {activePage === "about" && (
        <div style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
          animation: "fadeIn 0.4s ease",
          boxSizing: "border-box",
          width: "100%",
        }}>

          {/* IMAGE — desktop only via CSS class */}
          <div className="about-img-col" style={{
            position: "relative",
            width: "500px",
            flexShrink: 0,
            height: "95vh",
            paddingTop: navbarRef.current ? (navbarRef.current.offsetHeight + 10) + 'px' : '110px',
            display: "flex",
            alignItems: "flex-start",
            background: "transparent",
            animation: "slideToLeft 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
          }}>
            <div style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "420px",
              height: "420px",
              background: "radial-gradient(circle, rgba(109,40,217,0.45) 0%, rgba(109,40,217,0.15) 50%, transparent 75%)",
              zIndex: 0,
              pointerEvents: "none",
            }} />
            <img
              src="/profile.png"
              alt="Sanjay Waugh"
              style={{
                background: "none",
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "auto",
                display: "block",
                animation: "float 4s ease-in-out infinite",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "45%",
              zIndex: 2,
              pointerEvents: "none",
              background: "linear-gradient(to top, #09090b 0%, #09090b 25%, rgba(9,9,11,0.95) 45%, rgba(9,9,11,0.7) 65%, rgba(9,9,11,0.2) 85%, transparent 100%)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            }} />
          </div>

          {/* TEXT */}
          <div className="about-text-col" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "2rem",
            paddingRight: "1.5rem",
            overflow: "hidden",
            width: "100%",
            boxSizing: "border-box",
            animation: "fadeIn 0.6s ease 0.3s both",
          }}>
            <p style={{
              fontSize: "0.75rem", fontWeight: "600",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#a78bfa", margin: "0 0 1rem 0",
            }}>About Me</p>

            <h2 style={{
              fontSize: "clamp(1.5rem, 5vw, 2.8rem)", fontWeight: "900",
              color: "#ffffff", lineHeight: 1.15, margin: "0 0 1.5rem 0",
              wordBreak: "break-word",
            }}>
              Engineer by degree,<br />
              <span style={{ color: "#a78bfa" }}>Builder by choice.</span>
            </h2>

            <p style={{
              fontSize: "1.05rem", color: "#a1a1aa",
              lineHeight: "1.85", margin: "0 0 2rem 0", maxWidth: "100%",
              overflow: "hidden", wordBreak: "break-word",
            }}>
              Finished computer science, the urge to build and
              create pulled me into web dev. My goal isn&apos;t just
              delivery — it&apos;s to envision beyond what you ask for
              and ship something that outlasts the brief.
            </p>

            <div style={{
              width: "40px", height: "3px",
              background: "linear-gradient(to right, #7c3aed, #a78bfa)",
              borderRadius: "999px", marginBottom: "1.5rem",
            }} />

            <a href="mailto:sanjay@creativelements.org" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              color: "#a78bfa", fontSize: "0.9rem", fontWeight: "600",
              textDecoration: "none",
            }}>
              Let&apos;s work together ↗
            </a>
          </div>

        </div>
      )}

      {/* ── CONTACT PAGE ──────────────────────────────────────────────────── */}
      {activePage === "contact" && (
        <div style={{ animation: "fadeIn 0.4s ease", maxWidth: "1200px", margin: "0 auto", padding: "7rem 2rem 4rem", position: "relative", zIndex: 1 }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "#ffffff", lineHeight: 1.1, margin: 0 }}>
              Get In
            </h2>
            <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "#a78bfa", lineHeight: 1.1, margin: "0 0 2.5rem" }}>
              Touch
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Contact</p>
            <p className="mt-2 text-sm leading-snug text-zinc-400">
              Got something in mind?<br />Let&apos;s talk —
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:sanjay@creativelements.org"
                className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-violet-500 hover:bg-violet-950/20 hover:text-violet-300"
              >
                <EmailIcon />
                Email me
              </a>
              <a
                href="https://www.linkedin.com/in/sanjay-waugh-50540625b/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-violet-500 hover:bg-violet-950/20 hover:text-violet-300"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
