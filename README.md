# Aught

The count. Not the who.

A door. Someone enters. A number moves. That is the entire record.

This room sits **in relation** to [Nekyia](https://github.com/jshwilsnach-prog/nekyia): the walking, and the tally of a door. Same house. The author of the house may be known. The people who enter this door are not.

## The law

If a choice appears between a richer number and privacy, privacy wins. Anonymity overrides anything pseudo-anonymous.

The server stores only:

- a UTC date
- a whole number for that date

The server never stores IP, location, device, browser, name, account, cookies, fingerprints, referrer, or any other who.

A visit is `+1` on a date. The owner's own visits count too. We cannot tell them apart, and we do not try.

`sessionStorage` may remember "already counted" in that one browser tab so a refresh is not another entry. It never leaves the device. It is not an identity.

## Read the ledger

| What | File |
| --- | --- |
| The only write | [`src/lib/tally.ts`](./src/lib/tally.ts) |
| The only table | [`migrations/0002_tally.sql`](./migrations/0002_tally.sql) |
| The door | [`src/components/door-view.tsx`](./src/components/door-view.tsx) |
| The numbers | [`src/components/numbers-view.tsx`](./src/components/numbers-view.tsx) |

`recordVisit` returns `{ ok: true }`. It does not return who. `getTally` returns dates and counts. That is all.

## Take it

MIT, same as the house. Copy, run, modify, give it away. If you add a who, you have left Aught.
