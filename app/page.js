"use client";

import { useState, useEffect, useRef } from "react";
import IntroOverlay from "@/app/components/IntroOverlay";
import FloatingOrbs from "@/app/components/FloatingOrbs";
import BookingModal from "@/app/components/BookingModal";

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function Dashboard() {
  const navbarRef = useRef(null);

  const roles = ["Developer", "Designer", "Builder", "Coder"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [fadeRole, setFadeRole] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [navVisible, setNavVisible] = useState(false);
  const [litSymbol, setLitSymbol] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Greeting
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Navbar fade-in — respects whether intro has already played
  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem("introPlayed");
    const delay = alreadyPlayed ? 0 : 4500;
    const t = setTimeout(() => setNavVisible(true), delay);
    return () => clearTimeout(t);
  }, []);

  // Cycling role text
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

  // Cycling lit symbol
  useEffect(() => {
    const interval = setInterval(() => {
      setLitSymbol((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* ── BACKGROUND ORBS ── */}
      <FloatingOrbs />

      {/* ── FLOATING SYMBOLS — home only ── */}
      {activePage === "home" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {[
            {
              icon: "△",
              label: "scale with purpose",
              style: { top: "13%", left: "7%", transform: "rotate(-15deg)" },
            },
            {
              icon: "◈",
              label: "pixel perfect focus",
              style: { bottom: "5%", right: "8%", transform: "rotate(8deg)" },
            },
            {
              icon: "∞",
              label: "infinite\niteration",
              style: { top: "55%", left: "2%", transform: "rotate(-8deg)" },
              pre: true,
            },
            {
              icon: "</>",
              label: "ship clean code",
              style: {
                bottom: "10%",
                left: "28%",
                transform: "rotate(12deg)",
                fontFamily: "monospace",
              },
            },
            {
              icon: "⚡",
              label: "fast load speed",
              style: { top: "12%", right: "6%", transform: "rotate(12deg)" },
            },
          ].map(({ icon, label, style, pre }, i) => (
            <span
              key={i}
              className="symbol"
              style={{
                ...style,
                fontSize: "3rem",
                color:
                  litSymbol === i
                    ? "rgba(220,200,255,0.95)"
                    : "rgba(200,200,220,0.25)",
                transition: "color 1.5s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: "500",
                  color: "#c4b5fd",
                  fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                  whiteSpace: pre ? "pre-line" : "nowrap",
                  textAlign: "center",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: litSymbol === i ? 1 : 0,
                  transition: "opacity 1.5s ease",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>
      )}

      <IntroOverlay />

      {/* ── NAVBAR ── */}
      <nav
        ref={navbarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 49, // below overlay (50), above content
          background:
            "linear-gradient(to bottom, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.85) 70%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: navVisible ? 1 : 0,
          pointerEvents: navVisible ? "auto" : "none",
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          className="flex items-center justify-between py-5"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingBottom: "20px",
          }}
        >
          <span
            style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ffffff" }}
          >
            {greeting} ✦
          </span>

          <div className="desktop-nav">
            {[
              ["About Me", "about"],
              ["Projects", "projects"],
              ["Contact", "contact"],
            ].map(([label, page]) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                style={navLinkStyle(page)}
                onMouseEnter={(e) => {
                  if (activePage !== page) e.target.style.color = "#a78bfa";
                }}
                onMouseLeave={(e) => {
                  if (activePage !== page) e.target.style.color = "#d4d4d8";
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Hamburger — mobile/tablet only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
          >
            {[
              menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              null,
              menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            ].map((transform, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#ffffff",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  transform: transform ?? undefined,
                  opacity: i === 1 && menuOpen ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* ── HOME BUTTON — shown when not on home page ── */}
      {activePage !== "home" && (
        <div
          style={{
            position: "fixed",
            top: "76px",
            left: 0,
            right: 0,
            zIndex: 48,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              paddingLeft: "2rem",
              paddingRight: "2rem",
            }}
          >
            <button
              onClick={() => setActivePage("home")}
              style={{
                pointerEvents: "auto",
                background: "rgba(109,40,217,0.2)",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "#a78bfa",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              ← Home
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU BACKDROP ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 51,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.4)",
          }}
        />
      )}

      {/* ── MOBILE MENU DRAWER ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "260px",
          height: "100vh",
          zIndex: 55,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "3rem 2rem",
          gap: "2rem",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {[
          ["About Me", "about"],
          ["Projects", "projects"],
          ["Contact", "contact"],
        ].map(([label, page], i) => (
          <button
            key={page}
            onClick={() => {
              setActivePage(page);
              setMenuOpen(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ffffff",
              fontSize: "1.75rem",
              fontWeight: "800",
              padding: 0,
              textAlign: "left",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(20px)",
              transition: `opacity 0.3s ease ${i * 0.1 + 0.15}s, transform 0.3s ease ${i * 0.1 + 0.15}s`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── HOME PAGE ── */}
      {activePage === "home" && (
        <div
          style={{
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
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "2rem",
              zIndex: 2,
            }}
          >
            {/* Annotation */}
            <div
              className="home-annotation"
              style={{
                position: "relative",
                marginBottom: "1rem",
                marginLeft: "auto",
                marginRight: "-60px",
                width: "fit-content",
              }}
            >
              <div style={{ lineHeight: 1.2, marginBottom: "0.25rem" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    fontStyle: "italic",
                    fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
                    color: "#c4b5fd",
                    textShadow: "0 0 20px rgba(167,139,250,0.5)",
                  }}
                >
                  Website
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    fontStyle: "italic",
                    fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
                    color: "#ffffff",
                    textShadow: "0 0 20px rgba(255,255,255,0.3)",
                    opacity: fadeRole ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    minWidth: "110px",
                  }}
                >
                  {roles[roleIndex]}
                </p>
              </div>
              <svg
                width="100"
                height="80"
                viewBox="0 0 100 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 10 15 C 10 40, 40 60, 80 62"
                  stroke="#c4b5fd"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 80 62 L 65 62 M 80 62 L 75 52"
                  stroke="#c4b5fd"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#a78bfa",
                margin: "0 0 0.25rem 0",
                letterSpacing: "0.05em",
              }}
            >
              Hello, I&apos;m
            </p>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: 1.0,
                margin: "0 0 0.75rem 0",
              }}
            >
              Sanjay
              <br />
              Waugh
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#71717a",
                margin: "0 0 1.25rem 0",
                lineHeight: 1.6,
              }}
            >
              turning{" "}
              <em
                style={{
                  color: "#a78bfa",
                  fontStyle: "normal",
                  fontWeight: "600",
                }}
              >
                ideas
              </em>{" "}
              into things people{" "}
              <em
                style={{
                  color: "#a78bfa",
                  fontStyle: "italic",
                  fontWeight: "600",
                }}
              >
                actually use.
              </em>
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.75rem",
                marginBottom: "1.25rem",
                flexWrap: "nowrap",
              }}
            >
              <button
                onClick={() => setActivePage("projects")}
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.6rem 1.1rem",
                  borderRadius: "10px",
                  fontSize: "0.825rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                View Projects →
              </button>
              <button
                onClick={() => setBookingOpen(true)}
                style={{
                  border: "1px solid #52525b",
                  color: "#ffffff",
                  padding: "0.6rem 1.1rem",
                  borderRadius: "10px",
                  fontSize: "0.825rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Contact Me
              </button>
            </div>

            <div style={{ display: "flex", gap: "1.25rem" }}>
              <a
                href="https://github.com/sanjay-creativelements"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#71717a" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/sanjay-waugh-50540625b/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#71717a" }}
              >
                <LinkedInIcon />
              </a>
              <a
                href="mailto:sanjay@creativelements.org"
                style={{ color: "#71717a" }}
              >
                <EmailIcon />
              </a>
            </div>
          </div>

          {/* CENTER — Profile image */}
          <div
            className="home-img-col"
            style={{
              position: "relative",
              flex: "0 0 min(500px, 55vw)",
              height: "95vh",
              paddingTop: "60px",
              display: "flex",
              alignItems: "flex-start",
              background: "transparent",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "420px",
                height: "420px",
                background:
                  "radial-gradient(circle, rgba(109,40,217,0.45) 0%, rgba(109,40,217,0.15) 50%, transparent 75%)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
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
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                zIndex: 2,
                pointerEvents: "none",
                background:
                  "linear-gradient(to top, #09090b 0%, #09090b 25%, rgba(9,9,11,0.95) 45%, rgba(9,9,11,0.7) 65%, rgba(9,9,11,0.2) 85%, transparent 100%)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                maskImage:
                  "linear-gradient(to top, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 40%, transparent 100%)",
              }}
            />
          </div>

          {/* RIGHT COLUMN — hidden on smaller screens */}
          <div
            className="hide-on-small"
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "3rem",
              overflow: "hidden",
              minWidth: "0",
            }}
          >
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: "1.75",
                color: "#e4e4e7",
                fontWeight: "400",
                maxWidth: "300px",
                fontStyle: "italic",
              }}
            >
              &ldquo;I don&apos;t just write code &mdash; I build what you
              imagined.
              <br />
              <br />
              You bring the vision. I make it real &mdash;{" "}
              <span style={{ color: "#c4b5fd", fontWeight: "600" }}>
                clean, fast, and built to last.
              </span>{" "}
              No fluff. No half-done features. Just your idea,{" "}
              <span style={{ color: "#ffffff", fontWeight: "600" }}>
                shipped and working.
              </span>
              &rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ── PROJECTS PAGE ── */}
      {activePage === "projects" && (
        <div
          style={{
            animation: "fadeIn 0.4s ease",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem 2rem 4rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              My Works
            </h2>
          </div>

          <div
            className="projects-grid"
            style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}
          >
            {/* Project card */}
            <div
              className="project-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,20,60,0.9) 0%, rgba(15,10,30,0.95) 100%)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: "24px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "380px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "900",
                    color: "#ffffff",
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  SEO
                </span>
              </div>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                rankmob.io
              </h3>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <span
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#a78bfa",
                      opacity: 0.75,
                      animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                    }}
                  />
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#1fac32",
                      display: "inline-block",
                    }}
                  />
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#1fac32",
                    letterSpacing: "0.05em",
                  }}
                >
                  Currently Building
                </span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#a1a1aa", margin: 0 }}>
                AI powered SEO Automation platform
              </p>
              <div
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(139,92,246,0.2)",
                  position: "relative",
                }}
              >
                <img
                  src="/rankmob-preview.png"
                  alt="rankmob.io"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                  }}
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
                >
                  ↗
                </a>
              </div>
            </div>

            {/* Project description */}
            <div
              className="project-desc"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.5rem",
                flex: 1,
                padding: "1rem 2rem",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "999px",
                  padding: "0.35rem 1rem",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#a78bfa",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#a78bfa",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Live Project
                </span>
              </div>
              <h3
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                rankmob.io
              </h3>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#a1a1aa",
                  lineHeight: "1.85",
                  margin: 0,
                  maxWidth: "420px",
                }}
              >
                Most SEO tools just point out what&apos;s broken and leave you
                to fix it yourself.{" "}
                <span style={{ color: "#ffffff", fontWeight: "600" }}>
                  rankmob.io actually does the work.
                </span>{" "}
                It automates the complete SEO workflow right from spotting
                issues to fixing them, so your site climbs Google rankings{" "}
                <span
                  style={{
                    color: "#c4b5fd",
                    fontWeight: "500",
                    fontStyle: "italic",
                  }}
                >
                  without you lifting a finger.
                </span>{" "}
                I'm contributing to the platform — building and refining the
                user-facing experience.
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

      {/* ── ABOUT PAGE ── */}
      {activePage === "about" && (
        <div
          style={{
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
          }}
        >
          {/* Image — desktop only via CSS */}
          <div
            className="about-img-col"
            style={{
              position: "relative",
              width: "500px",
              flexShrink: 0,
              height: "95vh",
              display: "flex",
              alignItems: "flex-start",
              background: "transparent",
              animation:
                "slideToLeft 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "420px",
                height: "420px",
                background:
                  "radial-gradient(circle, rgba(109,40,217,0.45) 0%, rgba(109,40,217,0.15) 50%, transparent 75%)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
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
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                zIndex: 2,
                pointerEvents: "none",
                background:
                  "linear-gradient(to top, #09090b 0%, #09090b 25%, rgba(9,9,11,0.95) 45%, rgba(9,9,11,0.7) 65%, rgba(9,9,11,0.2) 85%, transparent 100%)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                maskImage:
                  "linear-gradient(to top, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 40%, transparent 100%)",
              }}
            />
          </div>

          {/* Text */}
          <div
            className="about-text-col"
            style={{
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
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#a78bfa",
                margin: "0 0 1rem 0",
              }}
            >
              About Me
            </p>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.8rem)",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: 1.15,
                margin: "0 0 1.5rem 0",
                wordBreak: "break-word",
              }}
            >
              Engineer by degree,
              <br />
              <span style={{ color: "#a78bfa" }}>Builder by choice.</span>
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#a1a1aa",
                lineHeight: "1.85",
                margin: "0 0 2rem 0",
                maxWidth: "100%",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              After finishing computer science Engineering, the urge to build
              and create pulled me into web developement. My goal isn&apos;t
              just delivery — it&apos;s to envision beyond what you ask for and
              ship something that outlasts the brief.
            </p>
            <div
              style={{
                width: "40px",
                height: "3px",
                background: "linear-gradient(to right, #7c3aed, #a78bfa)",
                borderRadius: "999px",
                marginBottom: "1.5rem",
              }}
            />
            <button
              onClick={() => setBookingOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#a78bfa",
                fontSize: "0.9rem",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Let&apos;s work together ↗
            </button>
          </div>
        </div>
      )}

      {/* ── CONTACT PAGE ── */}
      {activePage === "contact" && (
        <div
          style={{
            animation: "fadeIn 0.4s ease",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem 2rem 4rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Get In
            </h2>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                color: "#a78bfa",
                lineHeight: 1.1,
                margin: "0 0 2.5rem",
              }}
            >
              Touch
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Contact
            </p>
            <p className="mt-2 text-sm leading-snug text-zinc-400">
              Got something in mind?
              <br />
              Let&apos;s talk —
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
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
