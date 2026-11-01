# GZURA — feature status for clients

**Companion document:** [GZURA-User-Manual.md](./GZURA-User-Manual.md) explains *how to use* the site. This document explains *what is built*, *what differs from your additional website requirements*, and *what is not in this release*.

**Website:** https://www.gzura.com

*Last updated October 2026 against the current frontend and API. References: “GZURA – Additional Website Development Requirements” (seven areas) and Drive folder “Gzura Checks” website corrections. Open questions for the client: [GZURA-Client-Questions.md](./GZURA-Client-Questions.md).*

---

## Table of contents

1. [Summary at a glance](#1-summary-at-a-glance)
2. [Changes from your specification](#2-changes-from-your-specification)
3. [Event booking and payment](#3-event-booking-and-payment)
4. [Admin dashboard and finance](#4-admin-dashboard-and-finance)
5. [Host a course and trainers](#5-host-a-course-and-trainers)
6. [Website content](#6-website-content)
7. [Leads and participants](#7-leads-and-participants)
8. [Trust and credibility](#8-trust-and-credibility)
9. [Not in this release](#9-not-in-this-release)
10. [Suggested next priorities](#10-suggested-next-priorities)
11. [Documents to send](#11-documents-to-send)
12. [Drive corrections (Gzura Checks)](#12-drive-corrections-gzura-checks)

---

## 1. Summary at a glance

| Area | Delivered | Partial | Not yet / not planned |
|------|-----------|---------|------------------------|
| **Account and sign-in** | Email/password, Google, phone OTP, onboarding, profile, password reset | — | — |
| **Events (public)** | List and detail: date, time, venue, price, member price, seats | — | — |
| **Booking and payment** | Free join, Razorpay paid join, unique pass, confirmation email, no duplicate enrollment, capacity limit | Payment states are Free / Pending / Paid, not your four-state model | Manual UPI with admin verify; Verified / Rejected / Refunded; WhatsApp group link on confirmation; guest paid checkout |
| **Member after join** | Digital pass and QR, Google Meet gate, My Learnings, course files, invoices | — | — |
| **Host applications** | Home-page form, staff approve/reject, host can create events | Application is interest + message, not a full qualification pack | Trainer revenue share, earnings, refunds, payouts |
| **Staff admin** | Dashboard, event approval, users, enrolled search, QR check-in, host-request export; email for host apps, pending events, **new registrations**, and **contact messages** (when Resend is configured) | Revenue chart is a simple total; check-in re-scan still shows success; in-app bell only while signed in | Event-wise revenue / refund / attendance Excel; payment verification queue; financial audit log |
| **Website CMS** | Event copy, photos, prices, and course files in admin | Marketing pages (home, blog, testimonials) are still edited by developers; membership prices show “contact us” until INR amounts are confirmed | Site-wide banners, announcements, testimonial approval, preview-before-publish for the whole site |
| **Leads** | Host requests in admin; event participants on each event; contact form saved + admin email alert | Join-page community form only starts sign-up; no contact inbox UI | Contact inbox, duplicate detection, follow-ups, notes, retention tools |
| **Trust** | Terms, privacy, FAQ; event prices from approved records; inflated 5K+/global/$ marketing claims removed or softened | Refund policy is in Terms, not on the payment button; Join plan INR amounts await client confirmation | Admin-verified testimonials workflow; logo / social URLs / map pin await client assets |

### What the labels mean

- **Delivered** — Available on the site today; main flow works.
- **Partial** — The flow works end-to-end, but not every detail from your requirements is matched (often covered in Section 2).
- **Changed from spec** — We built something *different on purpose* or the current product already solves the need another way. See Section 2; this is not always a defect.
- **Not yet** — Expected capability from your document that is not implemented; may be scheduled if you want it in scope.
- **Not planned** — Out of scope unless you ask us to add it.

If something is **Changed from spec**, treat it as an intentional difference unless you tell us to match the original wording exactly. Items under **Not yet** are candidates for a future release if you approve them.

---

## 2. Changes from your specification

Your team shared seven additional requirement areas on top of earlier website corrections. The table lists where the live site **differs**.

| Your document says | What we built | Why / note |
|--------------------|---------------|------------|
| **Payment options including manual UPI** | **Razorpay** checkout only (UPI inside Razorpay is possible when Razorpay enables it; there is no “pay to this UPI id and upload a screenshot” flow) | Same idea of paying online; different process. Manual UPI with staff verification is **not yet** |
| **Payment statuses Pending, Verified, Rejected, Refunded** | **Free**, **Pending**, **Paid** | Razorpay success marks the booking **Paid**. There is no staff verify/reject/refund queue |
| **Unique confirmation plus GZURA WhatsApp group link** | Unique **digital pass** link and QR; confirmation **email** with event details | Pass is the confirmation. WhatsApp group URL is **not yet** on the event or in the email |
| **Admin verify manual payments, with reason and administrator name** | Staff see **Free / Paid** on enrolled users; they do not approve a payment screenshot | **Not yet** — only needed once manual UPI exists |
| **Event-wise revenue, pending, refund, attendance reports in Excel/CSV** | Dashboard charts; **export** on **Host Requests** (trainer applications) to Excel, Word, or PDF | Attendee finance export is **not yet**. Dashboard revenue is a simple sum of event prices, not refunds or member prices |
| **Email for new registrations and pending approvals even when the administrator is logged out** | Email when a **host applies**, an **event is submitted for approval**, a **contact message** arrives, and a **new event registration** is created (requires Resend). In-app bell while staff are signed in | Push / SMS offline alerts are **not yet** |
| **Prevent duplicate attendance entries** | First check-in time is stored; a second scan does not overwrite it | Re-scan can still look successful on screen. Stricter “already checked in” message is **not yet** |
| **Trainer qualifications, proposed fees, request-changes before publish** | Host form (profile-style fields and a message); events go **Pending** then **Approve** or **Reject** | No separate “request changes” status and no qualification file upload. Reject + reason is the current path |
| **Trainer revenue-sharing, earnings, refunds, payouts** | Event **price in INR** set by host/admin | Financial split with trainers is **not yet** |
| **CMS for banners, posters, headings, announcements, testimonials** | Staff edit **events** (text, posters, prices) without a developer. Home, blog, and testimonials are in the website code | Site-wide CMS is **not yet**. Existing event photos stay unless staff delete that event |
| **Preview before publishing, content change history** | Event **draft / pending / published**; **activity log** on the event | No preview of the whole marketing site. No history for home-page copy |
| **Create events and update event and membership prices in admin** | Event and member **event** prices in admin | **Membership** prices on the Join page are still marketing copy in code, not a product catalogue |
| **Lead CRM: source, consent, follow-ups, notes, duplicates, export** | Host applications in admin (search, status, export). Participants on each event. Contact form is stored | No contact inbox, no follow-up assignment, no duplicate merge. The Join-page form does **not** save a lead |
| **Show cancellation/refund policy before payment** | Policy in **Terms** and **FAQ** | Not repeated on the Razorpay button. Can be added on the event page if you want it in scope |
| **Publish only verified testimonials and statistics** | Inflated 5K+/countries/$15M marketing claims removed or replaced with neutral national-level copy; testimonials still curated in code | No admin “verify this quote” workflow. Accuracy remains an editorial process |

---

## 3. Event booking and payment

### Delivered

- Public **Events** list and event page: date, time, venue, online or offline, price, member price, remaining seats when a limit is set.
- **Sign in** required to join or pay.
- **Free join** with confirmation on screen and by email (when email is configured).
- **Razorpay** for paid events; enrollment after successful verify.
- **One booking** per person per event (same email or account).
- **Capacity** — join is refused when the event is full.
- Unique **digital pass** (link and QR).
- Duplicate booking is blocked.

### Partial

- Payment status is **Free / Pending / Paid**, not Verified / Rejected / Refunded.
- UPI can appear **inside Razorpay**; there is no separate manual UPI form.

### Not yet

- Manual UPI to a GZURA id, screenshot or reference, and staff **verify / reject**.
- **Refunded** status and refund processing in admin.
- **WhatsApp group** link on the confirmation.
- Paying without an account.

---

## 4. Admin dashboard and finance

### Delivered

- **Dashboard** with counts, charts, and top events.
- **Events:** search, filter, create, edit, approve, reject, feature.
- Event create/update validation: no past start date (on create), end time after start, max seats **500**, max price **₹1,00,000** (defaults until client confirms).
- **Enrolled users** on each event (search; payment Free or Paid).
- **Users:** roles, block, create and edit.
- **Host Requests:** search, approve, reject, bulk actions, export Excel / Word / PDF.
- **QR check-in** for offline passes (open the scanner page; it is not in the side menu).
- Event **activity log** (submit, approve, reject).
- In-app notifications for pending hosts and events while staff are signed in.
- Email to staff for **new host applications**, **events waiting for approval**, **new event registrations**, and **contact form messages** (when Resend / MAIL_FROM is configured).

### Partial

- Dashboard **revenue** is not a full accounts report (it does not track refunds or always use the amount actually paid).
- Check-in stores one timestamp; the screen does not clearly say “already checked in”.
- Export is for **host applications**, not for every event’s attendance and fees.

### Not yet

- Central list of all payments to verify.
- Event-wise **pending / refund / attendance** download in Excel or CSV.
- Audit trail of **who changed a payment** and why.

---

## 5. Host a course and trainers

### Delivered

- Public **host application** on the home page.
- Staff **approve** or **reject**; approved people work as hosts.
- Hosts create **events/courses** with description, photos, outline, INR price, seats, and (for online) Meet fields.
- Only **approved published** events are public.
- Edits to a live event can wait for staff approval.
- Hosts upload **course materials** for people who enrolled.
- Hosts see **enrolled users** on their own events.

### Partial

- Application fields are name, contact, profession, interest, schedule preference, and a message — not a full CV and certificate pack.
- Staff can reject with a reason; there is no separate **request changes** status.

### Not yet

- Agreed **revenue-share %**, trainer **earnings**, **refunds**, and **payout** records.
- Qualification document upload as a required step.

---

## 6. Website content

### Delivered

- Staff add, edit, and remove **events**, including posters, headings, descriptions, prices, and galleries — without a developer for those items.
- Existing event posts and photos stay unless staff delete that event.
- Legal pages: privacy, terms, cookies, FAQ.

### Partial

- Home, programmes, blog list, success stories, and testimonials are **in the website**, not in an admin CMS.
- Event **activity log** is history for events only.

### Not yet

- Admin panel for banners, announcements, and approved testimonials.
- Preview of the whole site before publish.
- Content history for marketing pages.
- Admin control of **membership** prices on the Join page.
- Individual blog article pages.

---

## 7. Leads and participants

### Delivered

- **Event participants** on each event (name, email, phone, city, profession) with search.
- **Host applications** in admin with status and export.
- **Members** in **Users**.
- **Contact** form is stored with stricter validation (Indian phone, required subject/message) and drafts in the browser.
- Staff receive an **email** when a contact message is submitted (when Resend is configured).

### Partial

- Join-page community form collects interest and consent, then opens **Sign up**. It does not keep a separate enquiry record.
- Contact submissions have **no staff inbox** on the website (email only).

### Not yet

- One CRM for enquiries, members, and participants.
- Duplicate detection, assigned follow-ups, notes, enquiry statuses.
- Consent, retention, and deletion tools beyond normal user/admin edits.

---

## 8. Trust and credibility

### Delivered

- **Terms** state that testimonials are not a promise of the same result.
- Event **price and seats** on the public page come from the approved event.
- Privacy, terms, cookies, FAQ.

### Partial

- Refund and cancellation text lives in **Terms / FAQ**, not on the pay button.
- Membership plan prices on Join show **“Pricing in INR — contact us”** until the client confirms amounts.
- Success stories / testimonials remain curated copy (now India-focused); not admin-verified.

### Not yet

- Workflow so only **verified** testimonials go live.
- Automatic content filter for inappropriate host events (manual pending approval remains).
- Final logo asset, social profile URLs, and Google Maps place pin (waiting on client — see Client Questions).

---

## 9. Not in this release

Do not treat these as defects unless you ask us to add them to scope:

- Manual UPI with staff verification and **Verified / Rejected / Refunded**.
- WhatsApp group link on booking confirmation.
- Trainer revenue share, payouts, and refunds ledger.
- Site-wide CMS (banners, blog articles, testimonial admin, announcements).
- Contact / enquiry CRM (inbox, follow-ups, duplicates).
- Event-wise finance and attendance Excel/CSV.
- Financial change audit log.
- Refund policy shown inside the payment popup.
- Guest checkout for paid events.
- QR scanner link in the admin side menu (the page exists; bookmark it).

---

## 10. Suggested next priorities

If you want the site to match the additional requirements more closely, these are the highest-impact items to confirm with us:

1. **Manual UPI and payment verification** — screenshot or UTR, staff approve/reject with reason, then confirmation and pass.
2. **WhatsApp group link** per event, included in the confirmation after payment is confirmed.
3. **Event attendee export** — Excel/CSV with payment and check-in columns.
4. **Contact and enquiry inbox** — so Contact and Join interest are visible to staff without the database.
5. **Refund / cancellation** text on the event page before pay.
6. **Clearer check-in** message when a pass was already scanned.
7. **CMS for testimonials and banners** — if you need to change the home page without a developer.
8. **Trainer payouts** — only if you are ready to agree percentages and a payout process.

Indicative order (not a contract): payments and WhatsApp first, then reports and CRM, then CMS, then trainer finance.

---

## 11. Documents to send

When sharing materials with testers or stakeholders, we recommend:

| Document | Format | Purpose |
|----------|--------|---------|
| **User manual** | PDF or Word | Step-by-step how to use the site |
| **Feature status** | PDF or Word | This file: done, partial, missing, and **Section 2** differences from your requirements |
| **Client questions** | Markdown / Word | Open questions from Drive QA (logo, INR prices, FAQ, map, socials) |

**Suggested email line:** *“Section 2 of the feature status document lists differences from the additional website requirements you shared; Section 12 covers Drive screenshot corrections. Please answer GZURA-Client-Questions so we can finish blocked items. The user manual is the how-to for members, hosts, and administrators.”*

---

## 12. Drive corrections (Gzura Checks)

| Item | Status |
|------|--------|
| Remove fake 5K+ / global / $ marketing stats | **Done** — neutral / India-focused copy |
| National Level (was Global Impact) | **Done** |
| +91 phone, IST hours, Indian form examples | **Done** |
| Soften false discounts / private community claims | **Done** — “may apply in future” / removed |
| Remove `$` membership prices pending discuss | **Done (default)** — “Pricing in INR — contact us” |
| Hide broken social `#` links | **Done (default)** — icons hidden until URLs provided |
| Event validation (past date, same start/end, 5000 seats, over price) | **Done** — FE + BE caps |
| Contact validation + draft persistence | **Done** |
| Host application draft persistence | **Done** |
| Member menu duplicate links | **Done** |
| Admin email when logged out (contact + new registrations) | **Done** when Resend configured |
| Inappropriate event → pending only | **Documented** — intentional; auto-filter awaits client choice |
| Logo change | **Blocked** — need asset |
| FAQ program / hybrid exact copy | **Blocked** — need client answers |
| Map place pin / exact address | **Blocked** — need place URL or corrected address |
| Screenshots 71 / 86 / 87 | **Left alone** — 71 login only; 86 Razorpay OK; 87 not GZURA |

---

*GZURA – Additional Website Development Requirements + Drive “Gzura Checks” — reference for this status document.*
