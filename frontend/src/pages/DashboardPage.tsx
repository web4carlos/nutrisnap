import { useTranslation } from "react-i18next";
import BrandLogo from "../components/auth/BrandLogo";
import LanguageSelector from "../components/auth/LanguageSelector";
import { useAuth } from "../context/AuthContext";

const actions = ["logMeal", "scanFood", "addWater", "logWeight"] as const;

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const name = user?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <BrandLogo />
        <nav className="dashboard-nav" aria-label="Main navigation">
          <button className="nav-item active" type="button"><span>⌂</span>{t("dashboard.today")}</button>
          <button className="nav-item" type="button"><span>◎</span>{t("dashboard.timeline")}</button>
          <button className="nav-item" type="button"><span>✦</span>Alex</button>
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          <div><strong>{name}</strong><small>{user?.email}</small></div>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div><p className="dashboard-eyebrow">{t("dashboard.today")}</p><h1>{t("dashboard.greeting")}, {name}.</h1><p>{t("dashboard.subtitle")}</p></div>
          <div className="dashboard-header-actions"><LanguageSelector /><button className="secondary-button" type="button" onClick={() => void logout()}>{t("dashboard.logout")}</button></div>
        </header>

        <div className="dashboard-grid dashboard-top-grid">
          <article className="health-score-card panel">
            <div className="panel-heading"><div><span>{t("dashboard.healthScore")}</span><strong>82</strong></div><span className="score-status">On track</span></div>
            <div className="score-ring" aria-label="Health score 82 out of 100"><span>82</span><small>/ 100</small></div>
            <p>{t("dashboard.demoNote")}</p>
          </article>
          <article className="mission-card panel"><div className="mission-icon">✓</div><div><span className="panel-label">{t("dashboard.mission")}</span><h2>{t("dashboard.missionText")}</h2><button type="button" className="text-action">View plan →</button></div></article>
          <article className="alex-card panel"><span className="alex-badge">A</span><div><span className="panel-label">{t("dashboard.alexInsight")}</span><p>{t("dashboard.alexMessage")}</p></div></article>
        </div>

        <div className="metric-grid">
          <article className="metric-card"><span>{t("dashboard.calories")}</span><strong>1,420</strong><small>580 {t("dashboard.remaining")}</small><div className="progress"><i style={{ width: "71%" }} /></div></article>
          <article className="metric-card"><span>{t("dashboard.protein")}</span><strong>76g</strong><small>76% {t("dashboard.ofGoal")}</small><div className="progress"><i style={{ width: "76%" }} /></div></article>
          <article className="metric-card"><span>{t("dashboard.water")}</span><strong>5</strong><small>/ 8 {t("dashboard.glasses")}</small><div className="progress"><i style={{ width: "62%" }} /></div></article>
          <article className="metric-card"><span>{t("dashboard.weight")}</span><strong>176.4</strong><small>lb · {t("dashboard.stable")}</small><div className="trend-line">⌁</div></article>
        </div>

        <div className="dashboard-grid dashboard-bottom-grid">
          <article className="panel timeline-card"><div className="section-title"><div><span className="panel-label">{t("dashboard.timeline")}</span><h2>{t("dashboard.today")}</h2></div><button className="text-action" type="button">+ {t("dashboard.logMeal")}</button></div><div className="timeline-item complete"><span className="timeline-dot" /><time>8:15 AM</time><div><strong>{t("dashboard.breakfast")}</strong><small>Greek yogurt, berries, almonds · 380 kcal</small></div></div><div className="timeline-item"><span className="timeline-dot" /><time>12:30 PM</time><div><strong>{t("dashboard.lunch")}</strong><small>{t("dashboard.notLogged")}</small></div></div></article>
          <article className="panel quick-card"><div className="section-title"><div><span className="panel-label">{t("dashboard.quickActions")}</span><h2>Move fast</h2></div></div><div className="quick-action-grid">{actions.map((action, index) => <button type="button" key={action}><span>{["＋","▣","◉","↗"][index]}</span>{t(`dashboard.${action}`)}</button>)}</div></article>
        </div>
      </section>
    </main>
  );
}
