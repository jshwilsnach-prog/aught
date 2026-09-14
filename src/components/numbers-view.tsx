import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WeekChart } from "@/components/week-chart";
import { Button } from "@/components/ui/button";
import { getTally } from "@/lib/tally";
import { formatCount, rangeDays, sumHits } from "@/lib/tally-format";

const KEPT = ["A UTC date", "A whole number for that date"];
const NEVER = [
  "IP address",
  "Location",
  "Device or browser",
  "Name or account",
  "Cookies on the server",
  "Fingerprints",
  "Referrer or source",
  "Wallet address or viewing key",
  "ENS",
  "Tip total",
  "Seed",
];

export function NumbersView() {
  const tally = useQuery({
    queryKey: ["tally"],
    queryFn: () => getTally(),
    refetchInterval: 8_000,
  });
  const [copied, setCopied] = useState(false);
  const [doorUrl, setDoorUrl] = useState("");

  useEffect(() => {
    setDoorUrl(new URL("/", window.location.origin).toString());
  }, []);

  const days28 = useMemo(
    () => (tally.data ? rangeDays(tally.data.today, 28, tally.data.days) : []),
    [tally.data],
  );
  const days7 = days28.slice(-7);
  const todayHits = days28.at(-1)?.hits ?? 0;
  const weekHits = sumHits(days7);
  const monthHits = sumHits(days28);

  async function copyDoor() {
    if (!doorUrl) return;
    try {
      await navigator.clipboard.writeText(doorUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bg px-5 py-10 text-fg sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex min-h-11 w-fit items-center font-display text-lg tracking-tight text-muted transition-colors duration-quick hover:text-fg"
          >
            Aught
          </Link>
          <h1 className="font-display text-4xl leading-tight font-medium tracking-display text-balance sm:text-5xl">
            The count. Not the who.
          </h1>
          <p className="max-w-lg text-pretty text-muted">
            Entries through the door. Your own visits count too — we cannot
            tell you apart, and we do not try.
          </p>
        </header>

        {tally.isError ? (
          <section className="rounded-xl bg-surface p-6 shadow-border">
            <p className="text-pretty text-muted">
              The tally could not be read. Nothing about visitors was exposed
              by the failure.
            </p>
            <Button className="mt-5" type="button" onClick={() => tally.refetch()}>
              Try again
            </Button>
          </section>
        ) : (
          <>
            <section className="rounded-xl bg-surface p-6 sm:p-8">
              <p className="text-sm font-medium tracking-wide text-muted uppercase">
                All entries
              </p>
              {tally.isPending ? (
                <div className="mt-3 h-20 w-40 animate-pulse rounded-md bg-bg" />
              ) : (
                <p className="mt-2 font-display text-6xl leading-none tracking-display tabular-nums sm:text-7xl">
                  {formatCount(tally.data?.total ?? 0)}
                </p>
              )}
              <p className="mt-3 text-sm text-muted">
                {tally.data?.total === 1 ? "person, as a number" : "people, as numbers"}
              </p>
            </section>

            <section className="grid grid-cols-3 gap-3">
              <Stat label="Today" value={tally.isPending ? null : todayHits} />
              <Stat label="7 days" value={tally.isPending ? null : weekHits} />
              <Stat label="28 days" value={tally.isPending ? null : monthHits} />
            </section>

            <section className="rounded-xl bg-surface p-5 sm:p-6">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
                  Last 28 days
                </h2>
                <p className="text-xs text-muted">UTC days</p>
              </div>
              {tally.isPending ? (
                <div className="h-44 animate-pulse rounded-lg bg-bg" />
              ) : (
                <WeekChart days={days28} />
              )}
            </section>
          </>
        )}

        <section className="rounded-xl bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
            The door
          </h2>
          <p className="mt-2 text-pretty text-sm text-muted">
            Share this link. Bookmark this page for the numbers.
          </p>
          <p className="mt-4 break-all font-mono text-sm text-fg">{doorUrl || "…"}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" type="button" onClick={copyDoor}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy the door link"}
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">Open the door</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-xl p-6 shadow-border sm:p-7">
          <h2 className="font-display text-2xl tracking-tight">Anonymity first</h2>
          <p className="mt-3 max-w-lg text-pretty text-muted">
            The server never sees a who. A visit is a plus-one on a date. If a
            choice ever appears between a richer number and privacy, privacy
            wins.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <List title="Kept" items={KEPT} />
            <List title="Never kept" items={NEVER} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-4 sm:px-4">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      {value === null ? (
        <div className="mt-2 h-7 w-10 animate-pulse rounded bg-bg" />
      ) : (
        <p className="mt-1 font-display text-2xl tracking-tight tabular-nums sm:text-3xl">
          {formatCount(value)}
        </p>
      )}
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-fg">{title}</h3>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
