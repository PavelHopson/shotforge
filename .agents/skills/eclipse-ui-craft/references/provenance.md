# Provenance — Eclipse UI Craft

- Retrieved: 2026-09-29.
- Source repository: https://github.com/emilkowalski/skills
- Pinned commit: `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128`.
- [Original skill](https://github.com/emilkowalski/skills/blob/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/skills/apple-design/SKILL.md)
  → [unaltered reference](apple-design-upstream.md).
- [Original MIT license](https://github.com/emilkowalski/skills/blob/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/LICENSE)
  → [full license](upstream-license.txt). Copyright (c) 2026 Emil Kowalski.
- Download source: raw.githubusercontent.com at the same pinned commit, not a moving branch.
- SHA-256, upstream Markdown: `77bb63b7043bb93aca2ff4ab040c249484eef35682bb6ff7163433c31d30adc7`.
- SHA-256, license: `4ff5bdb7887ec1435c9cab0e8d1a7caee704d894d65c2a008ccc68b1cc2f260b`.

## Adaptation decisions

The active entrypoint is only [../SKILL.md](../SKILL.md), named eclipse-ui-craft.
The original source keeps its frontmatter byte-for-byte under a non-SKILL.md filename
in references; it is attribution/review material, not a second auto-discovered skill.

Retained: immediate feedback, predictable spatial relationships, interruptible motion,
context preservation, legibility and restraint. Adapted for web and this product:

- Removed the compulsory greeting and wait-for-question behavior.
- Existing product/accessibility rules win; no automatic Apple visual makeover,
  blur/glass, fonts, sound, bounce, dependencies or borrowed system prompts.
- Press feedback is not operation commitment; useful actions never wait for animation.
  Real pending/error/retry/cancel states and server-confirmed success remain distinct.
- CSS transitions are allowed; springs are optional. Velocity handoff needs a compatible
  API and units, not an assumed duration/bounce mapping.
- Apple damping ratio is not the Motion damping force parameter; inspect installed version,
  lockfile/types and official docs instead of copying numeric presets.
- Added keyboard, focus, Escape, reduced motion, contrast and responsive evidence;
  narrowed activation to web UI, not backend-only work or AI system prompts.

Technical cross-check (2026-09-29):
[Motion transitions](https://motion.dev/docs/react-transitions) distinguishes physical
stiffness/damping/mass springs from duration/bounce springs and their velocity behavior.
This does not certify compatibility with the versions in this product.
Apple-specific numerical tables and WWDC claims remain upstream claims, not newly
verified universal requirements.

## Product snapshot and isolation

Profile inspected against `PavelHopson/shotforge`, remote default `main`,
base commit `a4785e0ba13faf0ba5cc7eed642f04dc041c742d`. Branch: `chore/apple-design-foundation`.
Source checkout had unrelated dirty files; this docs-only change uses an isolated
worktree and does not import those changes. Historical CLAUDE.md, where present, was
read as context only; its activation, co-author or automatic push rules were not adopted.
Existing tracked AGENTS.md is preserved with one appended web-UI routing section.

No application, workflow, dependency, prompt, deployment or production configuration
changes are part of this integration. The next small pilot is described in
[project-profile.md](project-profile.md), not implemented.
