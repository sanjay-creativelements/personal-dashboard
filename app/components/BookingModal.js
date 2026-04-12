"use client";

import { useState, useEffect } from "react";

const FORMSPREE_URL = "https://formspree.io/f/mkokwnjv";

const INDUSTRIES = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance & Fintech",
  "Education",
  "Real Estate",
  "Media & Entertainment",
  "Hospitality & Travel",
  "Non-profit",
  "Other",
];

const SERVICES = [
  "Full Website Development",
  "Landing Page",
  "Web Application",
  "UI/UX Design",
  "Frontend Development",
  "Full Stack Development",
  "SEO Integration",
  "Website Revamp",
  "Other",
];

const BUDGETS = [
  "Less than $500",
  "$500 – $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Other",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  industry: "",
  industryOther: "",
  service: "",
  serviceOther: "",
  budget: "",
  budgetOther: "",
  description: "",
};

export default function BookingModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | limit | error

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company,
      industry: form.industry === "Other" ? form.industryOther : form.industry,
      service: form.service === "Other" ? form.serviceOther : form.service,
      budget: form.budget === "Other" ? form.budgetOther : form.budget,
      description: form.description,
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) { setStatus("limit"); return; }
      if (!res.ok) { setStatus("error"); return; }
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    setForm(INITIAL_FORM);
    onClose();
  }

  // ── Shared input styles ──────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: "10px",
    padding: "0.65rem 1rem",
    fontSize: "0.875rem",
    color: "#f4f4f5",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#a78bfa",
    marginBottom: "0.4rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const fieldWrap = { display: "flex", flexDirection: "column", gap: "0.4rem" };

  // ── Success state ────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <Backdrop onClose={handleClose}>
        <Panel onClose={handleClose}>
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.75rem" }}>
              Request Received!
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              Thanks for reaching out. I&apos;ll review your project details and get back to you within 24-48 hours.
            </p>
            <button onClick={handleClose} style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", cursor: "pointer", padding: "0.65rem 1.5rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: "600" }}>
              Close
            </button>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Limit reached state ──────────────────────────────────────────────────
  if (status === "limit") {
    return (
      <Backdrop onClose={handleClose}>
        <Panel onClose={handleClose}>
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.75rem" }}>
              Bookings Temporarily Paused
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              The booking form is at capacity right now. Please reach out directly via email and I&apos;ll get back to you just as quickly.
            </p>
            <a
              href="mailto:sanjay@creativelements.org"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", textDecoration: "none", padding: "0.65rem 1.5rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: "600" }}
            >
              Email me directly ↗
            </a>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <Backdrop onClose={handleClose}>
        <Panel onClose={handleClose}>
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>◈</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.75rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              Couldn&apos;t send your request. Please try again or email me directly.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setStatus("idle")} style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa", cursor: "pointer", padding: "0.65rem 1.25rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: "600" }}>
                Try again
              </button>
              <a href="mailto:sanjay@creativelements.org" style={{ display: "inline-flex", alignItems: "center", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", textDecoration: "none", padding: "0.65rem 1.25rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: "600" }}>
                Email me ↗
              </a>
            </div>
          </div>
        </Panel>
      </Backdrop>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <Backdrop onClose={handleClose}>
      <Panel onClose={handleClose}>
        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: "600", color: "#a78bfa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Let&apos;s Build Something
          </p>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", lineHeight: 1.2, margin: 0 }}>
            Book a Project
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#71717a", marginTop: "0.4rem" }}>
            Fill in your details and I&apos;ll get back to you within 48 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          {/* Row 1 — Name + Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="booking-grid">
            <div style={fieldWrap}>
              <label style={labelStyle}>Full Name *</label>
              <input required name="name" value={form.name} onChange={handleChange} placeholder="Your Name" style={inputStyle} disabled={status === "submitting"} />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Email *</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" style={inputStyle} disabled={status === "submitting"} />
            </div>
          </div>

          {/* Company */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Company Name</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Your company (optional)" style={inputStyle} disabled={status === "submitting"} />
          </div>

          {/* Industry */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Industry Type *</label>
            <select required name="industry" value={form.industry} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }} disabled={status === "submitting"}>
              <option value="" disabled style={{ background: "#18181b" }}>Select your industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i} style={{ background: "#18181b" }}>{i}</option>)}
            </select>
            {form.industry === "Other" && (
              <input
                name="industryOther" value={form.industryOther} onChange={handleChange}
                placeholder="Tell us your industry..."
                style={{ ...inputStyle, marginTop: "0.5rem", borderColor: "rgba(167,139,250,0.4)" }}
                disabled={status === "submitting"}
              />
            )}
          </div>

          {/* Service */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Desired Service *</label>
            <select required name="service" value={form.service} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }} disabled={status === "submitting"}>
              <option value="" disabled style={{ background: "#18181b" }}>What do you need built?</option>
              {SERVICES.map((s) => <option key={s} value={s} style={{ background: "#18181b" }}>{s}</option>)}
            </select>
            {form.service === "Other" && (
              <input
                name="serviceOther" value={form.serviceOther} onChange={handleChange}
                placeholder="Describe the service you need..."
                style={{ ...inputStyle, marginTop: "0.5rem", borderColor: "rgba(167,139,250,0.4)" }}
                disabled={status === "submitting"}
              />
            )}
          </div>

          {/* Budget */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Budget Range *</label>
            <select required name="budget" value={form.budget} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }} disabled={status === "submitting"}>
              <option value="" disabled style={{ background: "#18181b" }}>Select your budget</option>
              {BUDGETS.map((b) => <option key={b} value={b} style={{ background: "#18181b" }}>{b}</option>)}
            </select>
            {form.budget === "Other" && (
              <input
                name="budgetOther" value={form.budgetOther} onChange={handleChange}
                placeholder="Enter your budget range..."
                style={{ ...inputStyle, marginTop: "0.5rem", borderColor: "rgba(167,139,250,0.4)" }}
                disabled={status === "submitting"}
              />
            )}
          </div>

          {/* Description */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Project Description *</label>
            <textarea
              required name="description" value={form.description} onChange={handleChange}
              placeholder="In simple words explain what you wanna build, what problem it solves, any specific requirements..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical", minHeight: "100px", lineHeight: 1.6 }}
              disabled={status === "submitting"}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              background: status === "submitting" ? "rgba(109,40,217,0.5)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#ffffff", border: "none", cursor: status === "submitting" ? "not-allowed" : "pointer",
              padding: "0.8rem 1.5rem", borderRadius: "12px",
              fontSize: "0.9rem", fontWeight: "700",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              transition: "opacity 0.2s",
              marginTop: "0.25rem",
            }}
          >
            {status === "submitting" ? (
              <>
                <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Sending...
              </>
            ) : "Send Request ✦"}
          </button>

        </form>
      </Panel>
    </Backdrop>
  );
}

// ── Backdrop ─────────────────────────────────────────────────────────────────
function Backdrop({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────
function Panel({ children, onClose }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()} className="booking-panel" 
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(24,18,43,0.98) 0%, rgba(12,10,20,0.99) 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: "20px",
        padding: "2rem",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 0 0 1px rgba(139,92,246,0.15), 0 24px 60px rgba(0,0,0,0.6)",
        animation: "slideInUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(139,92,246,0.5) transparent",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "1.25rem", right: "1.25rem",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)",
          color: "#a1a1aa", cursor: "pointer",
          width: "32px", height: "32px", borderRadius: "8px",
          fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        ✕
      </button>
      {children}
    </div>
  );
}