# Axis & Sage site instructions

## Repository identity

- Required physical repository path: `/Users/tomiwao/Code/axis-and-sage-site`
- Required GitHub repository: `neustackdesign/axis-and-sage-site`
- Legacy HTML reference: `reference/legacy/axisandsage-page.html`

## Safety

- Do not create another copy of this repository.
- Do not modify Route 53, CloudFront, S3, ACM or Google Workspace DNS records during the rebuild.
- Do not attach the production domain until the Vercel preview has been reviewed and explicitly approved.
- Do not delete the AWS deployment until after the production cutover, rollback period and a second explicit approval.
- Treat the legacy Framer HTML as a visual and content reference, not maintainable application code.
