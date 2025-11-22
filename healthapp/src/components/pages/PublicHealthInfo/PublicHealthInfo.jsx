// src/components/pages/PublicHealthInfo/PublicHealthInfo.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * PublicHealthInfo.jsx
 * - Static page with general health information and privacy policy
 * - Styled to match the medical dashboard theme (cards, spacing, subtle gradients)
 * - Uses Framer Motion for gentle entrance + hover micro-interactions
 *
 * Drop into: src/components/pages/PublicHealthInfo/PublicHealthInfo.jsx
 * Install framer-motion if needed: npm i framer-motion
 */

const theme = {
  primary: "#0d6efd",
  primaryDark: "#0b5ed7",
  surface: "#f8f9fa",
  muted: "#6c757d",
  cardBg: "#ffffff",
};

const cardHover = { scale: 1.01, boxShadow: "0 10px 30px rgba(13,110,253,0.08)" };

function SectionCard({ title, children, small }) {
  return (
    <motion.article whileHover={cardHover} className="card mb-3" style={{ borderRadius: 12 }}>
      <div className="card-body">
        <h5 className="mb-2" style={{ fontWeight: 700 }}>{title}</h5>
        <div className={`text-muted ${small ? "small" : ""}`}>{children}</div>
      </div>
    </motion.article>
  );
}

export default function PublicHealthInfo() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f4f8fb 0%, #ffffff 60%)" }} className="py-4">
      <div className="container">
        {/* Page header */}
        <header className="d-flex align-items-center gap-3 mb-4">
          <div style={{ width: 64, height: 64, borderRadius: 12, display: "grid", placeItems: "center", background: theme.primary, color: "#fff", fontWeight: 800, fontSize: 20 }}>
            PH
          </div>
          <div>
            <h2 className="mb-0" style={{ fontWeight: 800 }}>Public Health Information</h2>
            <div className="small text-muted">General health guidance, privacy policy, and trusted resources</div>
          </div>
          <div className="ms-auto text-end small text-muted">
            <div>Wellness & Preventive Care</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </header>

        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="mb-3">
          <div className="card shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <h5 style={{ fontWeight: 700 }}>A quick guide to staying healthy</h5>
              <p className="text-muted small mb-0">
                This page provides general public-health guidance and our privacy practices. It is intended for informational
                use only and does not replace professional medical advice. If you have specific health concerns, contact a licensed healthcare provider.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="row g-3">
          {/* Left column: content */}
          <main className="col-12 col-lg-8">
            <SectionCard title="Everyday Health Tips">
              <ul className="mb-0">
                <li>Stay active — aim for at least 150 minutes of moderate activity per week (brisk walking, cycling).</li>
                <li>Eat a balanced diet — include fruits, vegetables, whole grains, and lean proteins.</li>
                <li>Prioritize sleep — 7–9 hours per night for most adults to support immune & cognitive function.</li>
                <li>Stay hydrated — drink water through the day; limit sugary drinks.</li>
                <li>Practice hand hygiene — wash hands thoroughly or use sanitizer when soap isn’t available.</li>
              </ul>
            </SectionCard>

            <SectionCard title="Preventive Screenings & Vaccinations">
              <div className="small text-muted">
                Regular screenings and vaccinations reduce disease risk. Schedule preventive visits as recommended:
                <ul>
                  <li>Blood pressure & cholesterol checks for adults</li>
                  <li>Age-appropriate cancer screenings (breast, cervical, colorectal)</li>
                  <li>Annual flu vaccine and other vaccines as advised by your provider</li>
                </ul>
              </div>
            </SectionCard>

            <SectionCard title="When to Seek Care">
              <div className="small text-muted">
                Seek immediate care or call emergency services for: chest pain, sudden weakness or slurred speech, severe breathing difficulty,
                high fever in infants, or severe uncontrolled bleeding.
                For non-urgent but concerning symptoms, contact your primary care provider.
              </div>
            </SectionCard>

            <SectionCard title="Mental Health & Wellbeing">
              <div className="small text-muted">
                Mental wellbeing is part of health. If you feel persistently anxious, sad, or overwhelmed, reach out to a provider or a crisis
                line. Simple steps that help: maintain social contacts, set routines, move daily, and seek professional help when needed.
              </div>
            </SectionCard>

            {/* Privacy Policy */}
            <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="card mb-3" style={{ borderRadius: 12 }}>
              <div className="card-body">
                <h5 style={{ fontWeight: 700 }}>Privacy Policy (summary)</h5>
                <div className="small text-muted">
                  <p>
                    We respect your privacy. This is a summary of our practices; read the full policy below.
                  </p>

                  <h6 className="mt-3">What we collect</h6>
                  <ul>
                    <li>Basic contact info when you register (name, email)</li>
                    <li>Health data you provide (conditions, medications) — only with your consent</li>
                    <li>Audit logs of actions required for security and compliance</li>
                  </ul>

                  <h6 className="mt-3">How we use data</h6>
                  <ul>
                    <li>To provide and improve care coordination and reminders</li>
                    <li>To send appointment reminders and important updates</li>
                    <li>To comply with legal and audit requirements</li>
                  </ul>

                  <h6 className="mt-3">Sharing & security</h6>
                  <ul>
                    <li>We do not sell personal data</li>
                    <li>Data may be shared with authorized care team members or as required by law</li>
                    <li>We use industry-standard encryption in transit and at rest</li>
                  </ul>

                  <p className="mb-0">For the full policy, continue below or contact support at <a href="mailto:privacy@example.com">privacy@example.com</a>.</p>
                </div>
              </div>
            </motion.section>

            {/* Full privacy policy text (expandable) */}
            <motion.details className="card" style={{ borderRadius: 12 }} open>
              <summary style={{ padding: 16, fontWeight: 700, cursor: "pointer", listStyle: "none" }}>Full Privacy Policy (click to collapse)</summary>
              <div className="card-body small text-muted">
                <p><strong>Introduction.</strong> This privacy policy explains how Wellness & Preventive Care (WPC) collects, uses, and protects personal information.</p>

                <p><strong>Data retention.</strong> We retain health records and audit logs as required by applicable law. Users may request deletion where appropriate; some records may be retained to comply with legal obligations.</p>

                <p><strong>Your rights.</strong> You may request access to your data, correction, or deletion. To submit a request, contact <a href="mailto:privacy@example.com">privacy@example.com</a>. We will respond within applicable legal timeframes.</p>

                <p><strong>Third-party services.</strong> We may use third-party services for analytics or hosting; these partners are bound by processing agreements and may only process data under our instruction.</p>

                <p className="mb-0"><strong>Contact.</strong> For privacy concerns contact our Data Protection Officer at <a href="mailto:dpo@example.com">dpo@example.com</a>.</p>
              </div>
            </motion.details>
          </main>

          {/* Right column: resources & quick actions */}
          <aside className="col-12 col-lg-4">
            <SectionCard title="Trusted Resources">
              <ul className="mb-0 small text-muted">
                <li><a href="https://www.who.int" target="_blank" rel="noreferrer">World Health Organization (WHO)</a></li>
                <li><a href="https://www.cdc.gov" target="_blank" rel="noreferrer">Centers for Disease Control and Prevention (CDC)</a></li>
                <li><a href="https://www.nhp.gov.in" target="_blank" rel="noreferrer">National Health Portal</a> (local resources)</li>
                <li><a href="https://www.who.int/emergencies" target="_blank" rel="noreferrer">Public health emergencies</a></li>
              </ul>
            </SectionCard>

            <SectionCard title="Quick Actions">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => alert("Schedule a screening (demo)")}>Schedule Screening</button>
                <button className="btn btn-outline-secondary" onClick={() => alert("Contact support (demo)")}>Contact Support</button>
                <button className="btn btn-outline-info" onClick={() => window.print()}>Print this page</button>
              </div>
            </SectionCard>

            <SectionCard title="FAQ">
              <div className="small text-muted">
                <strong>Is this medical advice?</strong>
                <div>No — this page is informational and not a substitute for professional advice.</div>
                <hr />
                <strong>How is my health data used?</strong>
                <div>See the privacy summary above. Data is used to deliver care and reminders.</div>
              </div>
            </SectionCard>

            <SectionCard title="Accessibility & Contact" small>
              <div>
                If you need this information in another format, contact <a href="mailto:accessibility@example.com">accessibility@example.com</a>.
              </div>
            </SectionCard>
          </aside>
        </div>

        {/* Footer small */}
        <footer className="mt-4 text-center small text-muted">
          <div>© {new Date().getFullYear()} Wellness & Preventive Care Portal — For informational use only</div>
        </footer>
      </div>
    </div>
  );
}
