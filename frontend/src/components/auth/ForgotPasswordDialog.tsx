import axios from "axios";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { requestPasswordReset } from "../../api/auth";

export default function ForgotPasswordDialog({ initialEmail, onClose }: { initialEmail: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (caught) {
      if (axios.isAxiosError(caught) && caught.response?.status === 404) {
        setError(t("auth.resetUnavailable"));
      } else {
        setError(t("auth.resetError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-modal-close" type="button" onClick={onClose} aria-label={t("auth.close")}>×</button>
        <span className="auth-card-eyebrow">NutriSnap</span>
        <h3 id="reset-title">{t("auth.resetTitle")}</h3>
        {sent ? (
          <div className="auth-success" role="status">
            <strong>{t("auth.checkEmail")}</strong>
            <p>{t("auth.resetSent")}</p>
            <button className="primary-auth-button" type="button" onClick={onClose}>{t("auth.backToLogin")}</button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <p className="auth-help">{t("auth.resetDescription")}</p>
            <label>
              <span>{t("auth.email")}</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="primary-auth-button" type="submit" disabled={submitting}>
              {submitting ? t("auth.sending") : t("auth.sendReset")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
