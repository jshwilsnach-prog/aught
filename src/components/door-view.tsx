import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { countOnce } from "@/lib/count-once";

type Phase = "entering" | "in" | "error";

export function DoorView() {
  const [phase, setPhase] = useState<Phase>("entering");

  const enter = useCallback(() => {
    setPhase("entering");
    void countOnce()
      .then(() => setPhase("in"))
      .catch(() => setPhase("error"));
  }, []);

  useEffect(() => {
    enter();
  }, [enter]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 text-fg">
      <div className="pointer-events-none absolute inset-0 bg-wash" aria-hidden />

      <Link
        to="/numbers"
        className="absolute top-6 left-6 z-20 flex min-h-11 min-w-11 items-center font-display text-lg tracking-tight text-muted transition-colors duration-quick hover:text-fg sm:top-8 sm:left-8"
      >
        Aught
      </Link>

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <div
          className={`door-ring mb-12 ${phase === "in" ? "is-open" : ""} ${phase === "entering" ? "is-entering" : ""}`}
          aria-hidden
        >
          <span className="door-ring-core" />
        </div>

        <div
          className="flex min-h-40 flex-col items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {phase === "entering" ? (
            <>
              <h1 className="font-display text-4xl leading-tight font-medium tracking-display text-balance sm:text-5xl">
                Entering
              </h1>
              <p className="mt-4 max-w-sm text-pretty text-muted">
                A moment. Then you are only a number.
              </p>
            </>
          ) : null}

          {phase === "in" ? (
            <>
              <h1 className="reveal font-display text-4xl leading-tight font-medium tracking-display text-balance sm:text-5xl">
                You're in.
              </h1>
              <p className="reveal-delay mt-4 max-w-sm text-pretty text-muted">
                Nothing about you was kept. Not a name, not a place, not a
                device. Only the count moved.
              </p>
            </>
          ) : null}

          {phase === "error" ? (
            <>
              <h1 className="font-display text-4xl leading-tight font-medium tracking-display text-balance sm:text-5xl">
                The door stuck
              </h1>
              <p className="mt-4 max-w-sm text-pretty text-muted">
                The count was not recorded. You are still unknown.
              </p>
              <Button className="mt-8" onClick={enter} type="button">
                Try again
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
