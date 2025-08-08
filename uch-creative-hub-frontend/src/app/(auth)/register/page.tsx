// src/app/(auth)/register/page.tsx
import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20">
        <RegisterForm />
      </div>
    </div>
  );
}