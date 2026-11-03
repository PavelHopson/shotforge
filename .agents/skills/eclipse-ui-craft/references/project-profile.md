# ShotForge — product / editorial studio

The workspace turns concepts into photographic scenes and generated media. The selected
artifact, source imagery, prompt and processing state stay more prominent than chrome.
Preserve scene order, presets, history and the user's current edit.

## Product sources

- [Repository guide](../../../../docs/repository-guide.md)
- [Styles](../../../../styles.css), [Tailwind tokens](../../../../tailwind.config.cjs)
- [Button](../../../../components/Button.tsx)
- [Results gallery](../../../../components/ResultsGallery.tsx)
- [Existing Eclipse icons](../../../../components/icons/EclipseIcons.tsx)
- [Package manifest](../../../../package.json)

Keep bg/sf tokens, blue signal accents, dark surfaces, Inter/Outfit and existing Lucide/Eclipse
icons. Do not replace this studio with a black/gold marketing layout or blanket glass panels.
Generated assets and real progress are not evidence of a completed remote operation until
the relevant result exists. A local preview is not a published/delivered artifact.
No Motion dependency is declared; CSS transitions suffice for the proposed local pilot.
Do not hand-edit generated CSS; respect the repository's CSS integrity workflow.

## One next pilot — proposed, not implemented

[ProgressOverlay](../../../../components/ProgressOverlay.tsx): make its existing step
label and progress understandable without pulse/glow. Review accessible progress semantics
and a stable status announcement, preserving incoming GenerationProgress values.

Acceptance: steps/percentage remain readable with reduced motion, no completion is invented
by a transition, duplicate status announcements are avoided, long preset names fit mobile.
Cancellation/retry may only be offered if real handlers support them; adding job cancellation
is not part of this pilot. No paid generation or external media upload is needed for fixtures.

## Checks and boundaries

Docs-only checks: frontmatter, links, provenance, conflict and diff review.
Future CSS edits must retain css:verify and build workflow from package.json; this PR
does not change CSS or generated integrity assets. Product AI prompts and provider behavior
are outside the UI skill. Never hide a generation error under a finished animation.
