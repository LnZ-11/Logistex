"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Identifiants incorrects.");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, hsl(var(--p)), transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, hsl(var(--s)), transparent)", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--a)), transparent)" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--bc)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--bc)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect behind card */}
        <div
          className="absolute inset-0 rounded-3xl blur-2xl opacity-20 -z-10 scale-105"
          style={{ background: "linear-gradient(135deg, hsl(var(--p)), hsl(var(--s)))" }}
        />

        <div className="card bg-base-200 shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, hsl(var(--p)), hsl(var(--s)), hsl(var(--a)))" }}
          />

          <div className="card-body p-8 sm:p-10">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="mb-4 relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40 scale-150"
                  style={{ background: "radial-gradient(circle, hsl(var(--p)), transparent)" }}
                />
                <Image
                  src="/LogistexLogoLightNoBG.png"
                  alt="Logistex Logo"
                  width={400}
                  height={400}
                  className="relative drop-shadow-[0px_0px_8px_rgba(255,255,255,0.3)]"
                  priority
                />
              </div>
              <p className="text-base-content/50 text-sm mt-1 tracking-widest uppercase">
                Système de Gestion
              </p>
            </div>

            {/* Divider */}
            <div className="divider text-base-content/20 text-xs my-0 mb-6">Connexion requise</div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID */}
              <div className="form-control">
                <label className="label pb-1" htmlFor="userId">
                  <span className="label-text text-base-content/70 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    Numéro d&apos;utilisateur
                  </span>
                </label>
                <input
                  id="userId"
                  type="text"
                  placeholder="Ex: 001, 042..."
                  className="input input-bordered bg-base-300/50 border-base-content/10 focus:border-primary/60 focus:outline-none transition-all duration-200 placeholder:text-base-content/20"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label pb-1" htmlFor="password">
                  <span className="label-text text-base-content/70 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                    </svg>
                    Mot de passe
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-base-300/50 border-base-content/10 focus:border-primary/60 focus:outline-none transition-all duration-200 pr-12 placeholder:text-base-content/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/70 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577A11.217 11.217 0 0 1 12 3.75c4.5 0 8.336 2.57 10.293 6.356a.75.75 0 0 1 .383.947ZM1.707 12.168C3.664 8.382 7.5 5.81 12 5.81c.832 0 1.638.098 2.41.283L7.94 12.563A5.25 5.25 0 0 0 12 17.25c.648 0 1.268-.118 1.837-.333l-2.117-2.117A3.75 3.75 0 0 1 12 15a3.75 3.75 0 0 1-3.532-5.023L5.01 6.51A11.249 11.249 0 0 0 1.324 10.79a.75.75 0 0 0 0 .957c.089.118.18.235.274.35.089.107.18.213.274.32-.088.109-.173.22-.257.333Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="alert alert-error py-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2 gap-2 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--p)), hsl(var(--pf, var(--p))))",
                  boxShadow: "0 4px 24px -4px hsl(var(--p) / 0.5)",
                }}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.79-.273 1.051l-4.548 4.548a.75.75 0 0 0-.22.53v2.84a.75.75 0 0 0 .278.582l1.5 1.5a.75.75 0 0 0 .47.17h3.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75h-.75V15a.75.75 0 0 0-.75-.75h-.75v-.75a.75.75 0 0 0-.53-.72l-.5-.17a.75.75 0 0 1-.278-.582v-.47l4.548-4.548c.26-.26.66-.34 1.051-.273A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
                    </svg>
                    Se connecter
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-base-content/25 select-none">
              Logistex &copy; {new Date().getFullYear()} — Gestion d&apos;inventaire
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
