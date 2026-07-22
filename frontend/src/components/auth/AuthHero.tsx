import { useTranslation } from "react-i18next";
import BrandLogo from "./BrandLogo";

export default function AuthHero() {
  const { t } = useTranslation();
  return (
    <section className="auth-hero">
      <BrandLogo />
      <div className="auth-hero-content">
        <span className="auth-kicker">{t("auth.heroKicker")}</span>
        <h1>{t("auth.heroTitle")}</h1>
        <p>{t("auth.heroDescription")}</p>
        <div className="auth-feature-grid">
          {[1,2,3].map((n) => <div className="auth-feature-card" key={n}><span className="feature-number">0{n}</span><strong>{t(`auth.feature${n}Title`)}</strong><span>{t(`auth.feature${n}Text`)}</span></div>)}
        </div>
      </div>
      <p className="auth-hero-footer">{t("auth.privateByDesign")}</p>
    </section>
  );
}
