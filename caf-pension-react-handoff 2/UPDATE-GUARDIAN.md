# Update 1: Guardian handoff

This update adds a second user to the app: a **guardian** (power of attorney, court-appointed guardian, trustee or other legal representative) who finishes the application for the member.

Apply it **on top of** the build from `PROMPT.md`. Every rule in `PROMPT.md` still applies: stack, tokens, components, accessibility, responsive behaviour, frontend only, mock data.

New reference files, in `reference/`:

| File | Screen |
|---|---|
| `GuardianFlow.dc.html` | Flow map in three lanes: member, system, guardian. A diagram only; do not build it. |
| `GMemberDeposit.dc.html` | G1 · Member chooses who gives the bank details |
| `GMemberWaiting.dc.html` | G2 · Member's overview while waiting for the guardian |
| `GInvite.dc.html` | G3 · Invitation email and text message (preview only) |
| `GVerify.dc.html` | G4 · Guardian verifies identity, gives their details, proves authority |
| `GViewStep.dc.html` | G5 · Guardian views a member step, read-only (Step 3 as the example) |
| `GDeposit.dc.html` | G6 · Guardian enters bank details (Step 6) |
| `GReview.dc.html` | G7 · Guardian reviews and submits (Step 7) |
| `GDone.dc.html` | G8 · Submitted confirmation |

---

## The scenario

1. The member completes steps 1–5 as before.
2. At Step 6 the member chooses **"My guardian or legal representative will"**, enters the guardian's details and sends a link.
3. The guardian opens the link, verifies who they are, gives their own details and uploads proof of authority.
4. The guardian sees the **same application UI** with steps 1–5 prefilled and **read-only**.
5. The guardian fills in **Step 6 (direct deposit)** and **Step 7 (review and submit)** only.
6. Both people are notified. The guardian still mails the original authority document.

---

## Changes to existing screens

### 1. The stepper now has 7 steps, for everyone

Step names: Personal details, Service & release, Benefit option, Family, Deductions & tax, Direct deposit, **Review**.

The six original member reference files still show a 6-step bar. Ignore that and use 7 everywhere. Update the overview task list to 7 rows as well.

### 2. A member Review step (Step 7)

No reference file exists for the member's own review. Build it from `GReview.dc.html` with these differences:
- Every section is tagged "Completed by you" and has a "Change" link back to its step.
- Hide the "Proof of authority" section and the "send it back" link.
- Use a single declaration checkbox: "I have reviewed this application and the information is true and complete."
- Keep the typed-name signature.
- Submitting goes to a member version of `GDone.dc.html` without the "mail your proof of authority" item.

Route: `/application/review`. The member's Step 6 "Save and review" button now leads here.

### 3. Step 6 starts with a choice

`/application/deposit` becomes the G1 choice screen.
- **"I will"** goes to the existing bank form, now at `/application/deposit/bank`.
- **"My guardian or legal representative will"** shows the guardian invite form, then goes to `/application` in its waiting state (G2).

### 4. Locking while an invite is open

While an invite's status is `sent`, `opened` or `verified`:
- The member's overview shows the G2 layout.
- Member steps 1–7 can be viewed but not edited. Use the same read-only treatment as the guardian view (below).
- The member can resend the link, change the person (back to G1, prefilled) or cancel. Cancelling sets the status to `cancelled` and sends the member to `/application/deposit/bank`.

---

## New routes

| Route | Screen | Who |
|---|---|---|
| `/application/deposit` | G1 choice + invite form | Member |
| `/application/deposit/bank` | Existing bank form | Member |
| `/application/review` | Member review (see above) | Member |
| `/application` | Overview; waiting state = G2 | Member |
| `/dev/invite-preview` | G3 email + text preview | Dev only |
| `/g/:token` | G4 verify | Guardian |
| `/g/:token/step/:n` (n = 1–5) | G5 read-only step | Guardian |
| `/g/:token/deposit` | G6 bank details | Guardian |
| `/g/:token/review` | G7 review and submit | Guardian |
| `/g/:token/submitted` | G8 confirmation | Guardian |
| `/g/:token/expired` | Link expired or cancelled (new, simple) | Guardian |

Guardian routes other than `/g/:token` redirect to `/g/:token` until the guardian is verified. After submission, every guardian route except `/submitted` redirects to `/g/:token/expired`.

---

## Data model (mock, in the existing store)

```ts
type Actor = 'member' | 'guardian';
type AuthorityType = 'poa' | 'guardian' | 'trustee' | 'other';
type InviteStatus = 'none' | 'sent' | 'opened' | 'verified' | 'submitted' | 'expired' | 'cancelled';

interface Invite {
  token: string;              // mock: 'demo-token'
  status: InviteStatus;
  sentAt: string;
  expiresAt: string;          // sentAt + 14 days
  guardian: {                 // entered by the member in G1
    fullName: string;
    role: AuthorityType;
    email: string;
    mobile: string;
    message?: string;
  };
  memberConsent: boolean;
}

interface GuardianProfile {   // entered by the guardian in G4
  fullName: string;           // prefilled from invite.guardian.fullName
  dateOfBirth: string;
  address: { street: string; city: string; province: string; postalCode: string };
  language: 'en' | 'fr';
  authorityType: AuthorityType; // prefilled from invite.guardian.role
  authorityFile?: { name: string; pages?: number };
  declared: boolean;
}

interface Deposit {
  ownerType?: 'member' | 'joint' | 'trust'; // guardian flow only
  holderName: string;
  transit: string;
  institution: string;
  account: string;
  voidChequeFile?: { name: string };
  authorized: boolean;
}

interface SectionMeta { completedBy: Actor; completedAt: string } // one per step, 1–7
```

The invite, the guardian profile, the deposit and the section metadata all live in the same store as the member's answers. Persist them to `sessionStorage` like the rest.

**Dev switcher.** Since there's no backend, add a small floating panel, visible only in dev, to:
- switch between the member and guardian views
- set the invite status
- jump to any G screen

---

## New shared components

- **`ActingForBanner`** — full-width strip under the header on every guardian screen: light warning background (`--color-warning-bg`), bottom border `--color-warning-border`. Text: "You are acting for **[Member name]** as their [role]".
- **`GuardianStepper`** — the 7-step stepper, but every item is a link. Steps 1–5 show a green bar and the tag "Locked · by member". Step 6 shows "Your turn" or "In progress"; Step 7 shows "Your turn". The step being viewed gets a 2px primary outline. On G5, step 6's bar is `--color-accent` to point to the next task.
- **`ReadOnlyNotice`** — grey callout with a lock icon: "**View only.** [Member name] completed this step on [DATE]. You can check it, but not change it."
- **`readOnly` mode on steps 1–5** — do not build separate read-only pages. Give the existing step components a `readOnly` prop that renders the chosen values as text or summary cards instead of inputs, hides the Change links, and replaces the footer with Previous step / Next step / "Go to bank details". G5 shows how Step 3 looks in this mode.
- **`InviteTracker`** — 4-stage bar on G2: Link sent → Opened → Authority confirmed → Submitted. Done = green bar; the next stage = `--color-warning-border` bar; future = grey.
- **`StatusPill`** — add variants `completed` (green) and `with-guardian` (warning colours).
- **`CompletedByTag`** — pill on G7 section headers: "Completed by [Member name]" (green) or "Completed by you" (warning). The guardian's own section card also gets a 2px `--color-accent` border.
- **`EmailPreview` / `SmsPreview`** — for the dev-only G3 route.
- **`SendBackDialog`** — opened from "Send it back to [Member name] with a note" on G5 and G7. It is a modal with a textarea (required) plus Send and Cancel buttons. Sending changes nothing else; just show a success toast.

---

## Screen notes

**G1 · `/application/deposit`** (member)
- Two RadioCards: "I will" and "My guardian or legal representative will". Guardian is selected by default in the mock.
- Guardian form fields: full name, role (select), email, mobile, optional message.
- Info callout "What happens next" with 4 numbered points, then a consent checkbox.
- The footer's primary button reads **"Send link"**.

**G2 · `/application`, waiting state** (member)
- Warning status banner with a clock icon.
- Invitation card: 2×2 details grid, `InviteTracker`, buttons "Resend link" / "Change person" / "Cancel and do it myself".
- Task list: rows 1–5 "Completed", rows 6–7 "With guardian".
- Aside: link expiry and benefit-option deadline cards.

**G4 · `/g/:token`** (guardian). Three numbered sections, then a declaration:
1. **Your security code** — 6-digit code + the member's date of birth (day / month / year).
2. **Your details** — full name (prefilled), your date of birth, street address, city, province, postal code, language.
3. **Proof you can act for them** — authority type (prefilled), file upload, then a warning callout with the mailing address for the original document.

Declaration checkbox, then primary "Confirm and open the application" (goes to `/g/:token/step/1`), plus link "I'm not the right person".

**G6 · `/g/:token/deposit`** (guardian). Same as the member bank form, plus:
- **"Whose account is this?"** first, with three options: member's own / joint with member / trust or guardianship account.
- The hint under "Account holder name" changes with that choice (see the `hints` object in the reference script).
- The authorization text is written "On behalf of [Member name]…".
- On success, the green panel contains a "Continue to review" button.

**G7 · `/g/:token/review`** (guardian)
- Six section cards with key values. Sections 1–5 have a "View" link to read-only mode; section 6 has a "Change" link back to G6.
- A "Proof of authority" card: uploaded file (green) and "Still needed by mail" (warning).
- Declaration card with a 2px ink border: two checkboxes, the typed-name signature and today's date.
- Primary button: **"Submit application"**.

**G8 · `/g/:token/submitted`** — green success panel with the reference number, 3 numbered next steps, buttons "Download a copy (PDF)" and "Print mailing cover sheet". Both buttons can be non-functional.

---

## Validation

| Screen | Rules |
|---|---|
| G1 | Full name required. Role required. Email valid. Mobile = 10 digits after stripping non-digits. Consent must be ticked. |
| G4 | Code = 6 digits (mock accepts `123456`). Member DOB must match the mock member DOB. Guardian full name, DOB, street, city, province and postal code required; postal code matches `^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$`. Authority file required. Declaration ticked. |
| G6 | Owner type required. Holder name required. Then the same bank rules as `PROMPT.md`: transit 5 digits, institution 3, account 7–12, confirmation matches. Authorization ticked. |
| G7 | Both checkboxes ticked. Signature required and must equal the guardian's full name (ignore case and extra spaces). |

Use the existing `ErrorSummary` + inline error pattern everywhere. On submit, set `invite.status = 'submitted'` and stamp `SectionMeta` for steps 6 and 7 with `completedBy: 'guardian'`.

---

## Done when

- The member can send an invite from Step 6 and sees the G2 waiting state.
- Using the dev switcher, the guardian can go G4 → read-only steps 1–5 → G6 → G7 → G8, with validation working on each form.
- Steps 1–5 can't be edited by the guardian, or by the member while an invite is open.
- After the guardian submits, the member's overview shows all 7 sections completed, with steps 6–7 tagged "Completed by [Guardian name]".
- The member-only path (choosing "I will" at Step 6) still works end to end through the new member Review step.
- `npm run build` passes.
