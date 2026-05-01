# Verify

Run a full type-check and build to confirm no errors were introduced.

```bash
npm run build
```

Report:
- Whether the build passed or failed
- Any TypeScript errors with file + line number
- Any new warnings that weren't present before (compare against known warnings in docs/TROUBLESHOOTING.md)
- Bundle size of the main JS chunk (should stay near 228KB / gzip 76KB)

If the build fails, identify the root cause and fix it before marking any task complete.
