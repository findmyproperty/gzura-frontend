# GZURA client documentation

These two files match the same style as The YBDC user guide and feature status:

| File | Purpose |
|------|---------|
| [GZURA-User-Manual.md](./GZURA-User-Manual.md) | How to use the site (chapters by role and journey) |
| [GZURA-Feature-Status-Report.md](./GZURA-Feature-Status-Report.md) | What is delivered, partial, not yet, and differences from the client’s seven requirements |
| [GZURA-Client-Questions.md](./GZURA-Client-Questions.md) | Questions to send the client for blocked Drive QA items (logo, INR prices, FAQ, map, etc.) |

PDFs for email:

- `GZURA-User-Manual.pdf`
- `GZURA-Feature-Status-Report.pdf`

Regenerate after editing the markdown:

```bash
npx --yes md-to-pdf GZURA-User-Manual.md GZURA-Feature-Status-Report.md
```
