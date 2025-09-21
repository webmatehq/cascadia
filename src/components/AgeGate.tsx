// components/AgeGate.tsx
import { useEffect, useRef, useState } from "react";

const ACCENT = "#D9A566"; // color dorado del sitio

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);

  // Evita problemas con SSR y sólo abre si no está verificado
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = window.localStorage.getItem("ageVerified");
    if (!ok) setOpen(true);
  }, []);

  // Bloquea el scroll de fondo cuando está abierto y enfoca el primer botón
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const onConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    setOpen(false);
  };

  const onDeny = () => {
    // opción 1: sólo muestra mensaje
    alert("Sorry—our site is limited to guests 21+.");
    // opción 2 (alternativa): redirigir a otra página
    // window.location.href = "https://www.responsibility.org/";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Card */}
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200"
        style={{ animation: "fadeIn 120ms ease-out" }}
      >
        {/* Barra superior con el acento dorado */}
        <div className="h-2 w-full rounded-t-2xl" style={{ backgroundColor: ACCENT }} />

        <div className="p-6 md:p-8 text-center">
          <h2
            id="agegate-title"
            className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"
          >
            You must be 21 or older
            <br className="hidden md:block" /> to view our website
          </h2>

          <p className="mt-3 text-gray-600">Are you 21 or older?</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              ref={firstBtnRef}
              onClick={onConfirm}
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold text-gray-900 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-offset-2 transition
                        border border-transparent"
              style={{ backgroundColor: ACCENT }}
            >
              Yes, I am 21 or older
            </button>

            <button
              onClick={onDeny}
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold text-gray-800
                        border border-[color:var(--accent)]/40 hover:bg-gray-50 transition
                        focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={
                {
                  // usa el acento para el borde
                  ["--accent" as any]: ACCENT,
                }
              }
            >
              No, I am under 21
            </button>
          </div>

          <p className="mt-5 text-xs text-gray-500">
            By entering this site you agree to our Terms of Use and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
