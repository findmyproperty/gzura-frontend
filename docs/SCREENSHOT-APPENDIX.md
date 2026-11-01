# GZURA Documentation — Screenshot Appendix

Use this list when converting the User Manual and Feature Status Report to PDF. Store images in a folder such as `docs/screenshots/` with the exact filenames below.

## Naming convention

`{PREFIX}-{NN}-{short-description}.png`

- **PUB** — Public marketing pages  
- **MEM** — Member flows  
- **HOST** — Host (instructor) admin  
- **ADM** — Full administrator  
- **CMS** — Content (event or site)  
- **LEAD** — Leads / forms  
- **TRUST** — Policies / trust  

Prefer **1920×1080** for desktop and **390×844** (or device frame) for mobile.

## Required captures

| ID | Description | Page / URL |
|----|-------------|------------|
| PUB-01-events-list | Events catalog | `/events` |
| PUB-02-event-detail | Event with price and seats | `/events/[slug]` |
| MEM-01-free-join | Success after free join | Event detail (logged in) |
| MEM-02-razorpay | Razorpay modal | Paid event detail |
| MEM-03-email-pass | Confirmation email + pass link | Email client (redact PII) |
| MEM-04-pass-qr | Digital pass | `/pass/[token]` |
| MEM-05-my-learnings | Enrolled courses | `/my-learnings` |
| MEM-06-invoices | Invoice download | `/invoices` |
| HOST-01-apply | Host application submitted | Homepage host section |
| HOST-02-create-event | New event form | `/admin/events/new` |
| ADM-01-dashboard | Dashboard charts | `/admin` |
| ADM-02-enrolled | Enrolled users tab | `/admin/events/[id]` |
| ADM-03-export-host | Export menu on host requests | `/admin/registrations` |
| ADM-04-qr | QR scanner valid result | `/admin/qr-scanner` |
| ADM-05-approve-host | Approved host request | `/admin/registrations` |
| ADM-06-publish | Event approved/published | `/admin/events` |
| CMS-01-event-edit | Rich text event description | `/admin/events/[id]` |
| CMS-02-event-draft | Draft / pending event | `/admin/events` |
| LEAD-01-contact | Contact thank-you | `/contact` |
| LEAD-02-host-list | Host requests table | `/admin/registrations` |
| TRUST-01-terms | Refund-related terms excerpt | `/terms` |

## Redaction

Blur or remove personal emails, phone numbers, and payment IDs in client-facing PDFs.
