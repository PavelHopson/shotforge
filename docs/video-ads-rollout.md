# AI video ads vertical slice

Shotforge owns planning, not rendering or publishing. `referenceBoardService.ts` validates the
local-only `eclipse.reference-board.v1` handoff. `videoAdPlanService.ts` creates a deterministic
15-second `eclipse.video-ad-plan.v1` with hook, proof, and action scenes.

Every plan keeps `claimsRequireReview` and `publishRequiresApproval` set to `true`. Importing a
board never fetches its files. The next UI slice should provide file import, three-scene preview,
and a separate manual approval control before JSON download.
