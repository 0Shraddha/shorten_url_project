import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --blue-deep: #0A2FFF;
    --blue-mid: #2563EB;
    --blue-light: #DBEAFE;
    --blue-pale: #EFF6FF;
    --ink: #0D1117;
    --muted: #64748B;
    --border: #BFDBFE;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .snip-app {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    color: var(--ink);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .snip-app::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 50% -5%, rgba(10,47,255,0.07) 0%, transparent 65%),
      repeating-linear-gradient(90deg, rgba(10,47,255,0.02) 0px, transparent 1px, transparent 60px, rgba(10,47,255,0.02) 61px),
      repeating-linear-gradient(0deg, rgba(10,47,255,0.02) 0px, transparent 1px, transparent 60px, rgba(10,47,255,0.02) 61px);
    pointer-events: none;
    z-index: 0;
  }

  /* NAV */
  .snip-nav {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.4rem 3.5rem;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(14px);
  }

  .snip-logo {
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--blue-deep);
    letter-spacing: -0.04em;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .logo-pulse {
    width: 9px; height: 9px;
    background: var(--blue-deep);
    border-radius: 50%;
    animation: logoPulse 2.2s ease-in-out infinite;
  }

  @keyframes logoPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.55; }
  }

  .snip-nav-links {
    display: flex;
    gap: 2.2rem;
    list-style: none;
  }

  .snip-nav-links a {
    text-decoration: none;
    color: var(--muted);
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .snip-nav-links a:hover { color: var(--blue-deep); }

  .nav-cta-btn {
    background: var(--blue-deep);
    color: #fff !important;
    padding: 0.5rem 1.2rem;
    border-radius: 7px;
    font-weight: 600 !important;
    transition: background 0.2s, transform 0.1s !important;
  }

  .nav-cta-btn:hover { background: var(--blue-mid) !important; color: #fff !important; }

  /* HERO */
  .snip-hero {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 5rem 2rem 2.5rem;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: var(--blue-light);
    color: var(--blue-deep);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.35rem 1rem;
    border-radius: 999px;
    margin-bottom: 1.6rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    animation: fadeSlideUp 0.6s ease both;
  }

  .hero-h1 {
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    font-size: clamp(2.8rem, 5.5vw, 4.6rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    max-width: 660px;
    margin-bottom: 1.1rem;
    animation: fadeSlideUp 0.6s 0.08s ease both;
  }

  .hero-accent {
    color: var(--blue-deep);
    position: relative;
    display: inline-block;
  }

  .hero-accent::after {
    content: '';
    position: absolute;
    left: 0; bottom: 3px;
    width: 100%; height: 5px;
    background: var(--blue-deep);
    opacity: 0.15;
    border-radius: 3px;
  }

  .hero-sub {
    color: var(--muted);
    font-size: 1.05rem;
    font-weight: 300;
    max-width: 400px;
    line-height: 1.65;
    margin-bottom: 2.8rem;
    animation: fadeSlideUp 0.6s 0.16s ease both;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* CARD */
  .snip-card {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 640px;
    box-shadow: 0 4px 6px rgba(10,47,255,0.04), 0 18px 56px rgba(10,47,255,0.09);
    animation: fadeSlideUp 0.6s 0.24s ease both;
  }

  .input-row {
    display: flex;
    gap: 0.7rem;
    margin-bottom: 0.85rem;
  }

  .url-input {
    flex: 1;
    padding: 0.85rem 1.1rem;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.94rem;
    color: var(--ink);
    outline: none;
    background: var(--blue-pale);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .url-input::placeholder { color: #94A3B8; }

  .url-input:focus {
    border-color: var(--blue-mid);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #fff;
  }

  .url-input.error {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
  }

  .shorten-btn {
    background: var(--blue-deep);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 0.85rem 1.5rem;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.93rem;
    cursor: pointer;
    white-space: nowrap;
    letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
  }

  .shorten-btn:hover {
    background: var(--blue-mid);
    box-shadow: 0 6px 18px rgba(10,47,255,0.25);
  }

  .shorten-btn:active { transform: scale(0.96); }

  .shorten-btn.loading {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .options-row {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .option-label {
    font-size: 0.78rem;
    color: var(--muted);
    font-weight: 500;
    white-space: nowrap;
  }

  .opt-input {
    padding: 0.6rem 0.9rem;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    color: var(--ink);
    background: var(--blue-pale);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    flex: 1;
    min-width: 100px;
  }

  .opt-input:focus { border-color: var(--blue-mid); background: #fff; }

  /* RESULT */
  .result-box {
    margin-top: 1.1rem;
    background: var(--blue-light);
    border: 1.5px solid #BFDBFE;
    border-radius: 12px;
    padding: 0.9rem 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    animation: resultIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes resultIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .result-url {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    color: var(--blue-deep);
    font-size: 1rem;
    letter-spacing: -0.01em;
  }

  .result-actions { display: flex; gap: 0.45rem; }

  .icon-btn {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    width: 36px; height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--blue-mid);
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
  }

  .icon-btn:hover { background: var(--blue-deep); color: #fff; border-color: var(--blue-deep); transform: translateY(-1px); }
  .icon-btn:active { transform: scale(0.92); }

  /* STATS */
  .snip-stats {
    position: relative; z-index: 1;
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: 3rem 2rem 0;
    animation: fadeSlideUp 0.6s 0.38s ease both;
  }

  .stat-card {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 1.1rem 1.6rem;
    text-align: center;
    min-width: 120px;
    cursor: default;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(10,47,255,0.11);
  }

  .stat-num {
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    font-size: 1.65rem;
    color: var(--blue-deep);
    letter-spacing: -0.04em;
  }

  .stat-lbl {
    font-size: 0.76rem;
    color: var(--muted);
    font-weight: 500;
    margin-top: 0.2rem;
  }

  /* TABLE */
  .recent-wrap {
    position: relative; z-index: 1;
    max-width: 760px;
    margin: 3rem auto 4rem;
    padding: 0 2rem;
    animation: fadeSlideUp 0.6s 0.5s ease both;
  }

  .section-hdr {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--ink);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .section-hdr::before {
    content: '';
    width: 4px; height: 18px;
    background: var(--blue-deep);
    border-radius: 2px;
    display: inline-block;
  }

  .links-tbl {
    border: 1.5px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }

  .tbl-head {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 88px;
    padding: 0.7rem 1.2rem;
    background: var(--blue-pale);
    border-bottom: 1.5px solid var(--border);
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .tbl-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 88px;
    padding: 0.95rem 1.2rem;
    border-bottom: 1px solid #F1F5F9;
    align-items: center;
    transition: background 0.15s;
    cursor: default;
  }

  .tbl-row:last-child { border-bottom: none; }
  .tbl-row:hover { background: var(--blue-pale); }

  .orig-url {
    font-size: 0.83rem;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
  }

  .short-link {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.86rem;
    color: var(--blue-deep);
  }

  .clicks-cell { font-size: 0.84rem; color: var(--ink); font-weight: 500; }

  .clicks-bar {
    width: 48px; height: 4px;
    background: var(--blue-light);
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
  }

  .clicks-fill {
    height: 100%;
    background: var(--blue-deep);
    border-radius: 2px;
  }

  .row-actions { display: flex; gap: 0.4rem; }

  .mini-btn {
    width: 28px; height: 28px;
    background: var(--blue-pale);
    border: 1px solid var(--border);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--blue-mid);
    transition: background 0.18s, transform 0.12s;
  }

  .mini-btn:hover { background: var(--blue-light); transform: translateY(-1px); }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 2.2rem;
    left: 50%;
    transform: translateX(-50%) translateY(16px);
    background: var(--ink);
    color: #fff;
    padding: 0.65rem 1.4rem;
    border-radius: 999px;
    font-size: 0.84rem;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    z-index: 999;
    transition: opacity 0.28s, transform 0.28s;
    white-space: nowrap;
  }

  .toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* FOOTER */
  .snip-footer {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border);
    padding: 1.4rem 3.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .snip-footer a { color: var(--blue-mid); text-decoration: none; }
  .snip-footer a:hover { text-decoration: underline; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 620px) {
    .snip-nav { padding: 1rem 1.5rem; }
    .snip-nav-links { display: none; }
    .tbl-head, .tbl-row { grid-template-columns: 1fr 1fr; }
    .tbl-head > *:nth-child(n+3), .tbl-row > *:nth-child(n+3) { display: none; }
    .snip-footer { flex-direction: column; gap: 0.5rem; text-align: center; padding: 1.5rem; }
  }
`;

const SAMPLE_LINKS = [
  { id: 1, original: "https://www.example.com/very/long/path/to/content?ref=email&utm_source=newsletter", short: "snip.io/nl-jan", clicks: 2481, pct: 85 },
  { id: 2, original: "https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit", short: "snip.io/q4slides", clicks: 914, pct: 35 },
  { id: 3, original: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-", short: "snip.io/yt-watch", clicks: 6072, pct: 100 },
  { id: 4, original: "https://stripe.com/dashboard/payments?status=succeeded&created%5Bgte%5D=1700000000&limit=25", short: "snip.io/pay-nov", clicks: 183, pct: 10 },
];

const SLUGS = ["x7k2m", "ab9z1", "lnk42", "qr8w0", "hopin", "go5fast", "zip-it", "fwd99"];

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3"/><path d="M17 17h4"/>
      <path d="M17 21h4"/><path d="M21 14v3"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [links, setLinks] = useState(SAMPLE_LINKS);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  };

  const handleShorten = async () => {
    if (!url.trim()) { setError(true); setTimeout(() => setError(false), 1500); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const slug = alias.trim() || SLUGS[Math.floor(Math.random() * SLUGS.length)];
    const short = `snip.io/${slug}`;
    setResult(short);
    setLinks(prev => [
      { id: Date.now(), original: url, short, clicks: 0, pct: 0 },
      ...prev.slice(0, 3)
    ]);
    setLoading(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(`https://${text}`).catch(() => {});
    showToast("✓ Copied to clipboard");
  };

  return (
    <div className="snip-app">
      {/* NAV */}
      <nav className="snip-nav">
        <div className="snip-logo">
          <span className="logo-pulse" />
          snip
        </div>
        <ul className="snip-nav-links">
          <li><a href="#">Features</a></li>
          <li><a href="#">Analytics</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#" className="nav-cta-btn">Get Started</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="snip-hero">
        <div className="hero-badge">
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
          Lightning fast links
        </div>
        <h1 className="hero-h1">
          Make every URL<br />
          <span className="hero-accent">impossibly short</span>
        </h1>
        <p className="hero-sub">Trim long links in seconds. Track every click. Share anywhere with confidence.</p>

        {/* CARD */}
        <div className="snip-card">
          <div className="input-row">
            <input
              className={`url-input${error ? " error" : ""}`}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleShorten()}
              placeholder="Paste your long URL here…"
            />
            <button className={`shorten-btn${loading ? " loading" : ""}`} onClick={handleShorten} disabled={loading}>
              {loading ? <span className="spinner" /> : "Shorten →"}
            </button>
          </div>

          <div className="options-row">
            <span className="option-label">Custom alias:</span>
            <input
              className="opt-input"
              type="text"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              placeholder="snip.io/your-alias"
            />
            <span className="option-label">Expires:</span>
            <input className="opt-input" type="date" style={{ maxWidth: 140 }} />
          </div>

          {result && (
            <div className="result-box" key={result}>
              <span className="result-url">{result}</span>
              <div className="result-actions">
                <button className="icon-btn" onClick={() => copy(result)} title="Copy"><CopyIcon /></button>
                <button className="icon-btn" onClick={() => showToast("QR code generated!")} title="QR Code"><QrIcon /></button>
                <button className="icon-btn" onClick={() => showToast("Opening analytics…")} title="Analytics"><ChartIcon /></button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <div className="snip-stats">
        {[
          { num: "12.4M", lbl: "Links Shortened" },
          { num: "98.7%", lbl: "Uptime" },
          { num: "180+", lbl: "Countries" },
          { num: "43ms", lbl: "Avg Redirect" },
        ].map(s => (
          <div className="stat-card" key={s.lbl}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* RECENT LINKS */}
      <div className="recent-wrap">
        <div className="section-hdr">Recent Links</div>
        <div className="links-tbl">
          <div className="tbl-head">
            <div>Original URL</div>
            <div>Short Link</div>
            <div>Clicks</div>
            <div>Actions</div>
          </div>
          {links.map(lnk => (
            <div className="tbl-row" key={lnk.id}>
              <div className="orig-url">{lnk.original}</div>
              <div className="short-link">{lnk.short}</div>
              <div className="clicks-cell">
                {lnk.clicks.toLocaleString()}
                <div className="clicks-bar">
                  <div className="clicks-fill" style={{ width: `${lnk.pct}%` }} />
                </div>
              </div>
              <div className="row-actions">
                <div className="mini-btn" onClick={() => copy(lnk.short)} title="Copy"><CopyIcon /></div>
                <div className="mini-btn" onClick={() => showToast("Opening analytics…")} title="Analytics"><ChartIcon /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="snip-footer">
        <span>© 2026 Snip · Built with precision</span>
        <span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">API</a></span>
      </footer>

      {/* TOAST */}
      <div className={`toast${toast.show ? " visible" : ""}`}>{toast.msg}</div>
    </div>
  );
}