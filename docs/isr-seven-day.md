# Seven-day ISR fallback + immediate editorial refresh

Published Sanity fetches and 31 page/Open Graph routes use a seven-day (604800s) safety TTL. An authenticated Sanity webhook should invalidate the shared `sanity` fetch tag and root layout on each relevant published content event. This includes metadata, referenced documents, slugs, unpublishes and deletes.

## Required Sanity project webhook (verify in Sanity Manage)
- Project: `dltrl1ld`, dataset `production`
- URL: `https://axisandsage.com/api/sanity/revalidate`
- Method: POST; trigger on create/update/delete of published content
- Filter: use `WEBHOOK_FILTER` in `src/sanity/revalidation.ts`
- Projection: use `WEBHOOK_PROJECTION` in the same file
- Secret: the *existing* Vercel `SANITY_REVALIDATE_SECRET` (do not commit or print)
- Sanity signs requests; endpoint verifies signature, project and dataset
- Confirm Sanity delivery history shows HTTP 200, and a harmless published edit appears on the website

## Manual refresh (no redeployment)
Set the same secret in your local secure environment, then:

```bash
curl --fail-with-body -X POST 'https://axisandsage.com/api/revalidate/manual' \
  -H "Authorization: Bearer ${SANITY_REVALIDATE_SECRET}"
```

The manual endpoint invalidates all public content and layouts. It requires the existing secret and rejects unauthenticated requests. It is for recovery or deliberate editorial releases, not routine timer-based refreshes.

**Release safety:** do not treat a Sanity webhook as operational until registration and a signed delivery are verified. Without it, editors must use the manual endpoint or wait up to seven days after the last regeneration.
