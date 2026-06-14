// ByteSavior Consent Manager — injected on every page
// Handles GDPR, CCPA, COPPA, ePrivacy, fingerprinting disclosure
(function() {
  'use strict';

  const CONSENT_KEY  = 'bs_consent_v1';
  const CONSENT_VER  = 1;

  // ── Read stored consent ───────────────────────────────────────────────────
  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (obj.version !== CONSENT_VER) return null;
      return obj;
    } catch(e) { return null; }
  }

  function saveConsent(granted) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        version:   CONSENT_VER,
        granted:   granted,
        timestamp: new Date().toISOString(),
        ua:        navigator.userAgent.slice(0, 80),
      }));
    } catch(e) {}
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.BSConsent = {
    hasConsent:    () => getConsent()?.granted === true,
    hasDenied:     () => getConsent()?.granted === false,
    hasDecided:    () => getConsent() !== null,
    getRecord:     () => getConsent(),
    revokeConsent: () => { localStorage.removeItem(CONSENT_KEY); location.reload(); },
  };

  // ── Inject banner CSS ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #bs-consent-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      z-index: 99999;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0 0 0 0;
      font-family: 'DM Sans', system-ui, sans-serif;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: bsConsentFade 0.3s ease;
    }
    @keyframes bsConsentFade { from{opacity:0;} to{opacity:1;} }

    #bs-consent-banner {
      background: #16161a;
      border: 1px solid #2a2a35;
      border-bottom: none;
      border-radius: 14px 14px 0 0;
      max-width: 820px;
      width: 100%;
      box-shadow: 0 -8px 48px rgba(0,0,0,0.6);
      animation: bsConsentSlide 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes bsConsentSlide { from{transform:translateY(100%);} to{transform:translateY(0);} }

    #bs-consent-banner .bs-c-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 0;
    }
    #bs-consent-banner .bs-c-icon {
      width: 36px; height: 36px;
      border-radius: 8px;
      background: rgba(0,191,255,0.1);
      border: 1px solid rgba(0,191,255,0.25);
      display: flex; align-items: center; justify-content: center;
      color: #00bfff;
      font-size: 1rem;
      flex-shrink: 0;
    }
    #bs-consent-banner .bs-c-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #e8e8f0;
      margin-bottom: 2px;
    }
    #bs-consent-banner .bs-c-sub {
      font-size: 0.72rem;
      color: #606070;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.06em;
    }

    #bs-consent-banner .bs-c-body {
      padding: 16px 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    @media (max-width: 580px) {
      #bs-consent-banner .bs-c-body { grid-template-columns: 1fr; }
    }

    .bs-c-item {
      display: flex;
      gap: 10px;
      background: #1c1c22;
      border: 1px solid #22222a;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .bs-c-item-icon {
      font-size: 0.85rem;
      color: #00bfff;
      opacity: 0.75;
      padding-top: 1px;
      flex-shrink: 0;
      width: 14px;
      text-align: center;
    }
    .bs-c-item-text {}
    .bs-c-item-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #e8e8f0;
      margin-bottom: 2px;
    }
    .bs-c-item-desc {
      font-size: 0.72rem;
      color: #8888a0;
      line-height: 1.5;
    }

    #bs-consent-banner .bs-c-legal {
      padding: 0 24px 14px;
      font-size: 0.7rem;
      color: #505060;
      line-height: 1.6;
      border-top: 1px solid #22222a;
      padding-top: 12px;
    }
    #bs-consent-banner .bs-c-legal a { color: #00bfff; text-decoration: none; }
    #bs-consent-banner .bs-c-legal a:hover { text-decoration: underline; }

    #bs-consent-banner .bs-c-actions {
      padding: 0 24px 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .bs-c-btn-accept {
      background: #00bfff;
      color: #001a26;
      border: none;
      border-radius: 6px;
      padding: 10px 24px;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.16s;
      letter-spacing: 0.02em;
    }
    .bs-c-btn-accept:hover { background: #1ac8ff; }
    .bs-c-btn-decline {
      background: transparent;
      color: #8888a0;
      border: 1px solid #2a2a35;
      border-radius: 6px;
      padding: 10px 20px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.16s, color 0.16s;
    }
    .bs-c-btn-decline:hover { background: #1c1c22; color: #e8e8f0; }
    .bs-c-btn-manage {
      background: transparent;
      color: #505060;
      border: none;
      padding: 10px 8px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      text-decoration: underline;
      transition: color 0.16s;
      margin-left: auto;
    }
    .bs-c-btn-manage:hover { color: #8888a0; }

    .bs-c-age-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 24px 12px;
      background: rgba(251,191,36,0.07);
      border: 1px solid rgba(251,191,36,0.2);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.7rem;
      color: #a0906a;
    }
    .bs-c-age-notice i { color: #fbbf24; flex-shrink: 0; }
  `;
  document.head.appendChild(style);

  // ── Build banner HTML ──────────────────────────────────────────────────────
  function buildBanner() {
    const overlay = document.createElement('div');
    overlay.id = 'bs-consent-overlay';

    overlay.innerHTML = `
      <div id="bs-consent-banner" role="dialog" aria-modal="true" aria-label="Privacy & Consent Notice">

        <div class="bs-c-header">
          <div class="bs-c-icon"><i class="fas fa-shield-halved"></i></div>
          <div>
            <div class="bs-c-title">Before you continue — a quick privacy notice</div>
            <div class="bs-c-sub">GDPR · CCPA · COPPA · ePrivacy compliance</div>
          </div>
        </div>

        <div class="bs-c-body">
          <div class="bs-c-item">
            <div class="bs-c-item-icon"><i class="fas fa-user-circle"></i></div>
            <div class="bs-c-item-text">
              <div class="bs-c-item-label">Account & Score Data</div>
              <div class="bs-c-item-desc">If you sign in, your email address, display name, and diagnostic score are stored in Firebase (Google) to power the leaderboard. You can delete this at any time.</div>
            </div>
          </div>
          <div class="bs-c-item">
            <div class="bs-c-item-icon"><i class="fas fa-microchip"></i></div>
            <div class="bs-c-item-text">
              <div class="bs-c-item-label">Device Fingerprinting</div>
              <div class="bs-c-item-desc">The Diagnostics tool reads CPU cores, GPU renderer, screen resolution, memory, browser UA, and canvas performance. This data stays in your browser and is only submitted to the leaderboard if you are signed in.</div>
            </div>
          </div>
          <div class="bs-c-item">
            <div class="bs-c-item-icon"><i class="fas fa-database"></i></div>
            <div class="bs-c-item-text">
              <div class="bs-c-item-label">Local Storage</div>
              <div class="bs-c-item-desc"><code>localStorage</code> is used to store your consent choice and benchmark comparison data. No tracking cookies are set. No third-party ad networks are used.</div>
            </div>
          </div>
          <div class="bs-c-item">
            <div class="bs-c-item-icon"><i class="fas fa-wifi"></i></div>
            <div class="bs-c-item-text">
              <div class="bs-c-item-label">Network Speed Test</div>
              <div class="bs-c-item-desc">Diagnostics fetches a few files from public CDNs to estimate your download speed. These requests may expose your IP address to Cloudflare and CDNJS servers.</div>
            </div>
          </div>
        </div>

        <div class="bs-c-age-notice">
          <i class="fas fa-triangle-exclamation"></i>
          <span><strong>Age requirement:</strong> This site is not directed at children under 13 (US) or 16 (EU). By continuing, you confirm you meet the minimum age requirement in your region.</span>
        </div>

        <div class="bs-c-legal">
          <strong style="color:#a0a0b0">Your rights:</strong>
          Under GDPR you have the right to access, rectify, port, and erase your personal data. Under CCPA you have the right to know, delete, and opt out of sale (we do not sell data).
          To request deletion of your account data, contact&nbsp;<a href="mailto:bytesavior@proton.me">bytesavior@proton.me</a>.
          Declining will prevent sign-in and leaderboard features but you can still use all guides and the diagnostics tool locally.
          View our full <a href="#" onclick="return false;" style="color:#00bfff">Privacy Policy</a>.
        </div>

        <div class="bs-c-actions">
          <button class="bs-c-btn-accept" onclick="BSConsentBanner.accept()">
            <i class="fas fa-check"></i>&nbsp; Accept &amp; Continue
          </button>
          <button class="bs-c-btn-decline" onclick="BSConsentBanner.decline()">
            Decline non-essential
          </button>
          <button class="bs-c-btn-manage" onclick="BSConsentBanner.showDetails()">
            What exactly is collected?
          </button>
        </div>

      </div>`;

    return overlay;
  }

  // ── Banner controller ──────────────────────────────────────────────────────
  window.BSConsentBanner = {
    accept() {
      saveConsent(true);
      document.getElementById('bs-consent-overlay')?.remove();
      // Fire any queued post-consent actions
      window.dispatchEvent(new CustomEvent('bs-consent-granted'));
    },

    decline() {
      saveConsent(false);
      document.getElementById('bs-consent-overlay')?.remove();
      // Disable Firebase auth so no data is stored
      window.dispatchEvent(new CustomEvent('bs-consent-denied'));
    },

    showDetails() {
      const body = document.querySelector('#bs-consent-banner .bs-c-legal');
      if (body) {
        body.style.color = '#a0a0b0';
        body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    // Call this to re-show (e.g. from a Privacy Settings link)
    show() {
      if (!document.getElementById('bs-consent-overlay')) {
        document.body.appendChild(buildBanner());
      }
    },
  };

  // ── Show on page load if not decided ──────────────────────────────────────
  function init() {
    if (!window.BSConsent.hasDecided()) {
      document.body.appendChild(buildBanner());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
