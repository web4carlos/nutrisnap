import axios from "axios";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const passwordValid = useMemo(() => password.length >= 8, [password]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    if (!passwordValid) return setError(t("auth.passwordRequirements"));
    if (password !== confirmPassword) return setError(t("auth.passwordMismatch"));
    if (!accepted) return setError(t("auth.acceptTermsError"));
    setSubmitting(true);
    try {
      await register({ email, password, first_name: firstName.trim(), last_name: lastName.trim() }, true);
      navigate("/dashboard", { replace: true });
    } catch (caught) {
      if (axios.isAxiosError(caught)) {
        const detail = caught.response?.data?.detail;
        setError(typeof detail === "string" ? detail : t("auth.registerError"));
      } else setError(t("auth.registerError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="name-grid">
        <label><span>{t("auth.firstName")}</span><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required /></label>
        <label><span>{t("auth.lastName")}</span><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required /></label>
      </div>
      <label><span>{t("auth.email")}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
      <label><span>{t("auth.password")}</span><div className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required /><button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? t("auth.hide") : t("auth.show")}</button></div><small className={passwordValid ? "validation-ok" : "auth-hint"}>{t("auth.passwordHint")}</small></label>
      <label><span>{t("auth.confirmPassword")}</span><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required /></label>
      <label className="remember-me terms-check"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /><span>{t("auth.acceptTerms")}</span></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="primary-auth-button" type="submit" disabled={submitting}>{submitting ? t("auth.creatingAccount") : t("auth.register")}</button>
    </form>
  );
}
