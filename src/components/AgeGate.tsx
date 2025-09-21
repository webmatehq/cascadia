import { useEffect, useRef, useState } from "react";

const ACCENT = "#D9A566";
const KEY = "ageVerifiedSession";

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const [denied, setDenied] = useState(false);
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = sessionStorage.getItem(KEY);
    if (!ok) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstBtnRef.current?.focus();
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!open) return null;

  const onConfirm = () => {
    sessionStorage.setItem(KEY, "true");
    setOpen(false);
  };

  const onDeny = () => {
    setDenied(true);
  };

  
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200">
        <div className="h-2 w-full rounded-t-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="p-6 md:p-8 text-center">
          {!denied ? (
            <>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                You must be 21 or older <br /> to view our website
              </h2>
              <p className="mt-3 text-gray-600">Are you 21 or older?</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  ref={firstBtnRef}
                  onClick={onConfirm}
                  className="rounded-xl px-4 py-3 font-semibold text-gray-900 shadow-sm border border-transparent transition"
                  style={{ backgroundColor: ACCENT }}
                >
                  Yes, I am 21 or older
                </button>
                <button
                  onClick={onDeny}
                  className="rounded-xl px-4 py-3 font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                  No, I am under 21
                </button>
              </div>
              <p className="mt-5 text-xs text-gray-500">
                By entering this site you agree to our Terms of Use and Privacy Policy.
              </p>
            </>
          ) : (
            <div className="py-6">
              <h2 className="text-xl font-bold text-red-600 mb-3">Sorry! 🚫</h2>
              <p className="text-gray-700">
                Our site is only available for guests who are 21 years or older.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Please visit us again when you’re of legal age 🍻
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
