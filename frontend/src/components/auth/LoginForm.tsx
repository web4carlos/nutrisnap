import axios from "axios";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password, remember);
      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      if (axios.isAxiosError(caughtError)) {
        const detail = caughtError.response?.data?.detail;
        setError(typeof detail === "string" ? detail : t("auth.invalidCredentials"));
      } else setError(t("auth.invalidCredentials"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label><span>{t("auth.email")}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
        <label><span>{t("auth.password")}</span><div className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" minLength={8} required /><button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? t("auth.hide") : t("auth.show")}</button></div></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <div className="auth-form-options">
          <label className="remember-me"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>{t("auth.rememberMe")}</span></label>
          <button className="link-button" type="button" onClick={() => setShowReset(true)}>{t("auth.forgotPassword")}</button>
        </div>
        <button className="primary-auth-button" type="submit" disabled={submitting}>{submitting ? t("auth.signingIn") : t("auth.login")}</button>
      </form>
      {showReset && <ForgotPasswordDialog initialEmail={email} onClose={() => setShowReset(false)} />}
    </>
  );
}
