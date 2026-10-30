# Axis & Sage site instructions

## Repository identity

- Required physical repository path: `/Users/tomiwao/Code/axis-and-sage-site`
- Required GitHub repository: `neustackdesign/axis-and-sage-site`
- Legacy HTML reference: `reference/legacy/axisandsage-page.html`
- Canonical design system: `reference/design-system/axis-sage-ds` (from `Axis & Sage Design System.zip`, 28 Oct 2026: Midnight, Cloud, Sunset, Bloom). It supersedes the Paper/Charcoal/Orange system of 5 Oct 2026.
- `uesta.axisandsage.com` is served by this project (`public/uesta/`, host rewrite in `next.config.ts`). Check it after every production deploy.

## Safety

- Do not create another copy of this repository.
- Do not modify Route 53, CloudFront, S3, ACM or Google Workspace DNS records during the rebuild.
- Do not attach the production domain until the Vercel preview has been reviewed and explicitly approved.
- Do not delete the AWS deployment until after the production cutover, rollback period and a second explicit approval.
- Treat the legacy Framer HTML as a visual and content reference, not maintainable application code.
