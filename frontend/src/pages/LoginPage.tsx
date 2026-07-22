import AuthCard from "../components/auth/AuthCard";
import AuthHero from "../components/auth/AuthHero";
import AuthLayout from "../components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthHero />
      <AuthCard />
    </AuthLayout>
  );
}