// src/app/(auth)/login/page.tsx
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20">
        <LoginForm />
      </div>
    </div>
  );
}