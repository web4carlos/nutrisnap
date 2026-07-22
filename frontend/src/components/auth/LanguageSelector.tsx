import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      className="language-selector"
      value={language}
      onChange={(event) =>
        setLanguage(event.target.value as "en" | "es")
      }
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}