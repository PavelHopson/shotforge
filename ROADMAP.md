# Shotforge roadmap

## Current release slice

- [x] Produce deterministic release storyboards for Eclipse Media.
- [x] Import strict `eclipse.reference-board.v1` metadata with rights, consent and provenance checks.
- [x] Build a preview-first `eclipse.video-ad-plan.v1` with hook, proof and action scenes.
- [x] Require manual claims/reference review before plan export; render and publish remain separate actions.

## Next

- [ ] Support multi-board scene assignment without embedding image data.
- [ ] Add provider-neutral render estimates after a separate pricing and privacy review.

## Changelog

- 2026-08-20: added the Reference Board → video ad workflow with local import, loading/empty/error/success/
  disabled states, strict provenance origin allowlist and explicit preview approval before export.
- 2026-08-20: completed real Edge/Playwright acceptance at 1440x900 and 390x844 for board import,
  three-scene preview and manual export approval. Added an explicit keyboard-focus treatment; reduced
  motion, responsive overflow and console/page/request error checks pass.

- 2026-08-22: assigned the `editorial-spatial` profile with restrained gold atmosphere and shallow pointer-only depth. Regenerated and integrity-stamped the pinned Tailwind output; typecheck, tests, CSS integrity and production build pass. Rendering, claims and publication gates are unchanged.
