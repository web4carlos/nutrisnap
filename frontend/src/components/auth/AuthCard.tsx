import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthTabs from "./AuthTabs";
import LanguageSelector from "./LanguageSelector";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BrandLogo from "./BrandLogo";

type AuthMode = "login" | "register";

export default function AuthCard() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>("login");
  return (
    <section className="auth-panel">
      <div className="auth-card">
        <div className="mobile-auth-logo"><BrandLogo compact /></div>
        <div className="auth-card-header">
          <div><span className="auth-card-eyebrow">{t("auth.secureAccess")}</span><h2>{mode === "login" ? t("auth.welcome") : t("auth.joinTitle")}</h2><p>{mode === "login" ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}</p></div>
          <LanguageSelector />
        </div>
        <AuthTabs mode={mode} onChange={setMode} />
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </section>
  );
}
