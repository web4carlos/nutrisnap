import { useTranslation } from "react-i18next";

type AuthMode = "login" | "register";

export default function AuthTabs({ mode, onChange }: { mode: AuthMode; onChange: (mode: AuthMode) => void }) {
  const { t } = useTranslation();
  return (
    <div className="auth-tabs" role="tablist" aria-label={t("auth.accountAccess")}> 
      <button className={`auth-tab ${mode === "login" ? "auth-tab-active" : ""}`} type="button" onClick={() => onChange("login")} role="tab" aria-selected={mode === "login"}>
        {t("auth.login")}
      </button>
      <button className={`auth-tab ${mode === "register" ? "auth-tab-active" : ""}`} type="button" onClick={() => onChange("register")} role="tab" aria-selected={mode === "register"}>
        {t("auth.register")}
      </button>
    </div>
  );
}
