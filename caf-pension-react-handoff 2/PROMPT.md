# Build brief: CAF Pension Application — React frontend

You are recreating the **frontend only** of a 10-screen online pension application (concept for the Canadian Armed Forces Pension Centre). No backend, no real auth, no API calls. Use mock data and local state.

The original wireframes are in `reference/` as `.dc.html` files. They use a custom template format — read them for **layout, copy and styling only**:
- `<x-dc>` = the page root; `<helmet>` = head styles
- `<sc-for list="{{items}}" as="x">` = a `.map()` loop
- `<sc-if value="{{cond}}">` = conditional render
- `{{name}}` = a value computed in the `<script type="text/x-dc">` block at the bottom (`renderVals()` is the render function, `this.state` / `this.setState` work like React class state)
- `<a href="Foo.dc.html">` = navigate to that screen
- `reference/Main.dc.html` is the flow map diagram, not a screen. Do not build it.

Recreate copy **exactly**. Keep placeholders like `[DATE]`, `[$]`, `[Given name]` as-is (put them in a `mockData.ts`).

---

## Stack

- React 18 + TypeScript + Vite
- React Router v6
- Plain CSS Modules or Tailwind (your choice, but use the tokens below as CSS variables / Tailwind theme)
- React Hook Form + Zod for the forms (optional but preferred)
- No UI kit. Build the components below by hand.
- Fonts: Google Fonts **Public Sans** (400/500/600/700) and **IBM Plex Mono** (500, for bank number fields and the cheque diagram)

## Routes

| Route | Screen | Reference file |
|---|---|---|
| `/` | Start page | `Start.dc.html` |
| `/verify` | Confirm it's you | `Verify.dc.html` |
| `/applicant` | Who is applying? | `Applicant.dc.html` |
| `/application` | Application overview (hub) | `Hub.dc.html` |
| `/application/personal` | Step 1 Personal details | `Personal.dc.html` |
| `/application/service` | Step 2 Service and release | `Service.dc.html` |
| `/application/benefit` | Step 3 Benefit option | `Benefit.dc.html` |
| `/application/family` | Step 4 Family and beneficiaries | `Family.dc.html` |
| `/application/deductions` | Step 5 Deductions and tax | `Deductions.dc.html` |
| `/application/deposit` | Step 6 Direct deposit | `Deposit.dc.html` |

Navigation: Start → Verify → Applicant → Hub → Step 1 → … → Step 6. Every step has **Back** (previous step; step 1 goes to Hub), **Save and exit** (to Hub) and **Save and continue** (next step). "Sign out" goes to `/`.

## Design tokens

```css
--color-ink: #14263C;        /* body text, header bg */
--color-ink-2: #2A3442;      /* lead paragraphs */
--color-muted: #4A5565;      /* hints, secondary text */
--color-muted-2: #5B6573;    /* input borders, future-step labels */
--color-bg: #F4F6F8;         /* page background */
--color-surface: #FFFFFF;    /* cards */
--color-border: #D9DEE5;     /* card borders */
--color-divider: #E6EAEF;    /* row dividers */
--color-primary: #0B5CAD;    /* buttons, links, current step */
--color-primary-hover: #08427C;
--color-success: #1F6F4A;    /* completed steps, success panel */
--color-success-bg: #E9F5EE;
--color-error: #B42318;
--color-warning-bg: #FFF4E5;
--color-warning-border: #E6B87A;
--color-info-bg: #E8F0FA;
--color-info-border: #A9C3E3;
--color-accent: #B4480C;     /* account number highlight, deadlines */
--color-header-sub: #C9D6E6;

--font-sans: 'Public Sans', system-ui, sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
--text-base: 17px;  line-height: 1.5;
--h1: 34px (Start page: 40px);  --h2-card: 20–24px;  --h2-aside: 18px;
--radius-card: 8px;  --radius-input: 6px;  --radius-pill: 999px;
--container: 1120px (form-only pages: 720px); side padding 24px
```

## Shared components

1. **`AppHeader`** — dark bar (`--color-ink`). Left: "CAF Pension Centre" (700, 18px), "Online pension application" (15px, `--color-header-sub`), a "CONCEPT" pill (12px, outlined). Right: "Français" link, "Sign out" link (hide Sign out on Start page).
2. **`ProgressStepper`** — white bar under the header on steps 1–6 only. Top line: "**Step N of 6** · {title}" left, "All changes saved" right. Below: a 6-column grid; each cell = a 6px rounded bar + label "N. Name". Bar colour: completed `--color-success`, current `--color-primary`, future `--color-border`. Current label is bold; future labels are `--color-muted-2`. Include visually hidden text "(completed / current step / not started)" per item. Use `<nav aria-label="Application progress"><ol>`.
   Step names: Personal details, Service & release, Benefit option, Family, Deductions & tax, Direct deposit.
3. **`StepLayout`** — two columns with `flex-wrap`: main (`flex: 999 1 560px`) and aside (`flex: 1 1 260px`, 32px gap). The aside stacks under the main column on narrow screens.
4. **`HelpCard`** — white card, 20px padding, h2 18px, 15px body.
5. **`Card` / `Section`** — white, 1px `--color-border`, radius 8, padding 24–28.
6. **`Button`** — primary (filled blue, white text, 600, min-height 48px, radius 6), secondary (white, 2px blue border, blue text), text link.
7. **`StepFooter`** — top border, 36px margin-top: Back (secondary) left; "Save and exit" link + primary "Save and continue" right. Wraps on mobile.
8. **`RadioCard`** — full-width selectable card: radio (24px, `accent-color: primary`) + bold title + muted hint. Selected: 2px primary border + 1px primary outer ring. Disabled variant: dashed border, grey bg, `not-allowed` cursor.
9. **`RadioGroup`**, **`TextField`**, **`SelectField`**, **`Checkbox`** — label above (600), optional hint (15px muted), input 48px tall, 2px `--color-muted-2` border, radius 6. Error state: 3px `--color-error` border + "Error: …" message above the input.
10. **`Callout`** — variants `warning`, `info`, `success`, `error`.
11. **`SummaryList`** — `<dl>` rows in a card: label | value | "Change" link (with hidden "full name" etc. for screen readers) or muted "From service record".
12. **`ErrorSummary`** — box with 3px red border at the top of the page, `role="alert"`, heading + list of links that jump to each invalid field.

## Screen notes (anything not obvious from the reference files)

- **Applicant**: three RadioCards (member / power of attorney / survivor-estate). Member (default) shows a follow-up radio group "Which force were you in when you released?". Power of attorney shows a warning callout. Survivor shows an info callout with a link.
- **Hub**: Options Statement summary (3-column grid: Release date, Pensionable service, "Choose your option by" in accent colour), then a section list of the 6 steps, each a link + hint + "Not started" pill. Primary "Start application" → step 1.
- **Benefit**: four RadioCards with title + right-aligned amount + description + note. "Immediate annuity" is disabled. Default selected: Deferred annuity. Warning callout above ("This choice is final once payments start…"). Confirm checkbox below.
- **Deductions**: includes a `$`-prefixed amount input and a small deductions `<table>`.
- **Deposit** (the most important screen):
  - "Where is your bank?" In Canada / Outside Canada.
  - **Cheque diagram**: beige box (`#F7F4EC`, border `#D8D0BC`) with name + cheque no., a rule, then a mono MICR line: `0123` then three outlined boxes with labels underneath — `12345` "Transit (5)" in primary, `003` "Institution (3)" in success green, `1234567` "Account (7 to 12)" in accent orange.
  - Fields: Account holder name (prefilled), Transit (5 digits), Institution (3 digits), then an **accent-bordered panel** containing Account number (7–12 digits) and "Enter your account number again". Bank number inputs use the mono font, 20px, letter-spacing 0.08em, 52px tall.
  - Strip non-digits as the user types.
  - On "Save and review": validate — transit `^\d{5}$`, institution `^\d{3}$`, account `^\d{7,12}$`, confirm must match. If invalid: show ErrorSummary at top + inline errors. If valid: show success callout "Bank details look right. Branch {transit} at institution {institution}, account ending {last 4}. Next you'll review and sign your whole application."
  - Optional file upload (styled dashed button with a visually hidden `<input type="file">`) and an authorization checkbox.

## State

Keep all answers in one `ApplicationContext` (or Zustand store) so values survive navigation between steps. Persist to `sessionStorage` to mimic "All changes saved". No network calls.

## Accessibility (must)

WCAG 2.1 AA. Real `<button>`, `<a>`, `<label for>`, `<fieldset>/<legend>` for every radio group. Touch targets ≥ 44px. Visible focus rings (2px primary outline, 2px offset). Text contrast ≥ 4.5:1 — the tokens above already pass. Page `<title>` per route. Move focus to the ErrorSummary when validation fails.

## Responsive

Works from 360px to 1440px. Asides stack below main content. Two-column field grids become one column below 640px. The stepper keeps 6 columns but labels can drop to 12px; hide labels below 480px and keep only the bars plus the "Step N of 6" line.

## Done when

- All 10 routes render and match the reference layouts and copy.
- Click-through works end to end.
- Deposit validation behaves as described.
- `npm run dev` runs with no console errors; `npm run build` passes type-check.
