import type { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}