// Legacy alias — routes/imports now use ./MarketplaceDashboard/index.jsx for the full system
// and ./ExternalSystem.jsx for the federated placeholder export.
export { MarketplaceDashboard, MarketplaceAdmin } from './ExternalSystem';
// Note: the new modular Marketplace Dashboard pages are imported directly from
// './MarketplaceDashboard' in App.jsx — no need to re-export them here.
