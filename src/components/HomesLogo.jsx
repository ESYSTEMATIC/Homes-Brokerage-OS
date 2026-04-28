// Uses the official Homes logo PNGs from /public.
// White logo for dark surfaces (sidebars, login hero).
// Black logo for light surfaces (login card).

// Sidebar logo — full white logo (orange iconmark + white wordmark + tagline) above a small system label.
export const HomesLogoFull = ({ height = 30 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
    <img
      src={`${import.meta.env.BASE_URL}homes-logo-white.png`}
      alt="HOMES — Swipe to Your Next Home"
      style={{ height, width: 'auto', display: 'block', maxWidth: '100%' }}
    />
    <div style={{
      color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: 800,
      letterSpacing: '.14em', textTransform: 'uppercase',
    }}>Backoffice Admin Portal</div>
  </div>
);

export const HomesLogoAgent = ({ height = 30 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
    <img
      src={`${import.meta.env.BASE_URL}homes-logo-white.png`}
      alt="HOMES — Swipe to Your Next Home"
      style={{ height, width: 'auto', display: 'block', maxWidth: '100%' }}
    />
    <div style={{
      color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: 800,
      letterSpacing: '.14em', textTransform: 'uppercase',
    }}>Employee Board</div>
  </div>
);

// Login screen — black logo on white card.
export const HomesLogoBlack = ({ height = 56 }) => (
  <img
    src={`${import.meta.env.BASE_URL}homes-logo-black.png`}
    alt="HOMES — Swipe to Your Next Home"
    style={{ height, width: 'auto', display: 'block', maxWidth: '100%' }}
  />
);

// Backwards-compat — some components might still reference these names.
export const HomesLogo = HomesLogoBlack;
export const HomesIconmark = HomesLogoBlack;
