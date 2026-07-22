export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`nutrisnap-logo ${compact ? "nutrisnap-logo-compact" : ""}`} aria-label="NutriSnap">
      <span className="nutrisnap-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path d="M25 39c-8 0-14-6-14-14 0-7 5-13 12-14 8-1 14 5 14 13 0 9-5 15-12 15Z" />
          <path d="M25 13c1-6 5-9 11-9-1 6-5 9-11 9Z" />
          <path d="M21 20c4 0 7 3 7 7" />
        </svg>
      </span>
      <span>
        <strong>NutriSnap</strong>
        {!compact && <small>Powered by Alex</small>}
      </span>
    </div>
  );
}
