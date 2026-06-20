# Release Checklist

Use this checklist before publishing or announcing ActionTaint.

1. Install dependencies with `npm install`.
2. Run `npm run release:check`.
3. Run `bash scripts/validate.sh`.
4. Confirm `npm run package:smoke` includes `src/index.js` and support docs.
5. Review `SECURITY.md` before using the scaffold for production security claims.
