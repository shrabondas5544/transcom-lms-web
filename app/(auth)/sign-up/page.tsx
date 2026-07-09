"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: "", color: "" },
    1: { label: "Weak", color: "strength-weak" },
    2: { label: "Fair", color: "strength-fair" },
    3: { label: "Good", color: "strength-good" },
    4: { label: "Strong", color: "strength-strong" },
  };
  return { score, ...map[Math.min(score, 4)] };
}

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Step 1: Employee ID check, Step 2: Email & Password
  const [step, setStep] = useState<1 | 2>(1);
  const [idStatus, setIdStatus] = useState<null | { exists: boolean; accountCreated: boolean; name: string; message: string }>(null);

  const [form, setForm] = useState({
    employeeCode: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const strength = getStrength(form.password);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";

  const handleCheckId = async () => {
    const code = form.employeeCode.trim();
    if (!code) {
      alert("Please enter your Employee ID.");
      return;
    }

    setIsChecking(true);
    setIdStatus(null);
    try {
      const res = await fetch(`http://localhost:5276/api/Auth/check-id/${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        setIdStatus(data);
        if (data.exists && !data.accountCreated) {
          setStep(2);
        }
      } else {
        alert("Failed to check Employee ID. Make sure the API server is running.");
      }
    } catch (err) {
      console.error(err);
      alert("A connection error occurred. Make sure the API server is running.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeCode || !form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5276/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeCode: form.employeeCode.trim(),
          email: form.email,
          password: form.password
        })
      });

      if (res.ok) {
        alert("Account created successfully! Redirecting to sign in.");
        router.push("/sign-in");
      } else {
        const errMsg = await res.text();
        alert(errMsg || "Registration failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("A connection error occurred. Make sure the API server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-[440px]">

        {/* Card */}
        <div className="auth-card p-6 sm:p-8 animate-fade-in-up animate-delay-100">
          <div className="mb-5 sm:mb-6">
            <h1
              className="text-xl sm:text-2xl font-bold text-slate-900 mb-1"
              style={{ fontFamily: "var(--font-plus-jakarta), var(--font-inter), sans-serif" }}
            >
              Create your account
            </h1>
            <p className="text-sm text-slate-500">
              Enter your Employee ID to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Employee ID */}
            <div>
              <label htmlFor="employeeCode" className="block text-sm font-medium text-slate-700 mb-1.5">
                Employee ID
              </label>
              <div className="flex gap-2">
                <div className="form-input-group flex-1">
                  <span className="form-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  <input
                    id="employeeCode"
                    type="text"
                    className="form-input with-icon"
                    placeholder="e.g. 1060"
                    autoComplete="off"
                    value={form.employeeCode}
                    onChange={(e) => {
                      setForm({ ...form, employeeCode: e.target.value });
                      setIdStatus(null);
                      if (step === 2) setStep(1);
                    }}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckId}
                  disabled={isChecking || !form.employeeCode.trim()}
                  className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isChecking ? (
                    <svg className="animate-spin mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : "Check"}
                </button>
              </div>

              {/* ID Status Feedback */}
              {idStatus && (
                <div className={`mt-2.5 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  idStatus.exists && !idStatus.accountCreated
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {idStatus.exists && !idStatus.accountCreated ? (
                      <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                    ) : (
                      <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                    )}
                  </svg>
                  <div>
                    <p>{idStatus.message}</p>
                    {idStatus.exists && !idStatus.accountCreated && idStatus.name && (
                      <p className="mt-1 text-emerald-600">Welcome, <strong>{idStatus.name}</strong>!</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Email & Password (visible after successful ID check) */}
            {step === 2 && (
              <>
                {/* Email */}
                <div className="animate-fade-in-up">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Work Email
                  </label>
                  <div className="form-input-group">
                    <span className="form-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      className="form-input with-icon"
                      placeholder="john@transcom.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="animate-fade-in-up">
                  <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="form-input-group">
                    <span className="form-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      className="form-input with-icon"
                      style={{ paddingRight: "2.75rem" }}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`strength-bar flex-1 ${
                              i <= strength.score ? strength.color : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${
                        strength.score === 1 ? "text-red-500" :
                        strength.score === 2 ? "text-orange-500" :
                        strength.score === 3 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="animate-fade-in-up">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="form-input-group">
                    <span className="form-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.59 0 4.93 1.1 6.59 2.86" />
                      </svg>
                    </span>
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      className={`form-input with-icon ${
                        form.confirmPassword
                          ? passwordsMatch
                            ? ""
                            : "error"
                          : ""
                      }`}
                      style={{ paddingRight: "2.75rem" }}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {form.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none animate-fade-in-up">
                  <input
                    type="checkbox"
                    className="checkbox-custom mt-0.5"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-slate-600">
                    I agree to Transcom&apos;s{" "}
                    <a href="#" className="text-red-600 hover:underline font-medium">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-red-600 hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  id="sign-up-submit"
                  className="btn-primary mt-2"
                  disabled={isLoading || !form.agree}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </>
            )}
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6 animate-fade-in-up animate-delay-200">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
