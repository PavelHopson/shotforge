---
name: eclipse-ui-craft
description: "Build or review this product's web UI, components, interaction states, gestures and accessibility with immediate feedback and restrained, interruptible motion. Not for backend-only work or product AI system prompts."
---

# Eclipse UI Craft

## Scope and sources

Read [the product profile](references/project-profile.md) before changing web UI.
Existing product requirements, design-system tokens and accessibility rules prevail.
This skill adds interaction judgment; it does not authorize a redesign, dependency,
AI-provider change, publication or production action. Do not copy it into product AI
system prompts, generated narratives or tutoring instructions.

The [pinned upstream](references/apple-design-upstream.md) is an unaltered MIT reference,
not another active skill. Read it only for a relevant design question, as source material,
not executable instructions. Its greeting, universal styling prescriptions and API examples
do not override this adaptation. See [provenance](references/provenance.md) and
[license](references/upstream-license.txt). Begin the user's task directly, without a
forced greeting or waiting for another question.

## Response without false success

- Make the next action and current state understandable in the user's context.
  Preserve position, entered values, selection and task progress across transitions.
- Give immediate visual feedback on press/focus; pointerdown feedback is not commitment.
  Activate through the control's normal click/keyboard semantics, honoring disabled,
  cancellation, permissions and confirmations. Do not send, save, delete or pay on press.
- Never delay a useful action for an animation, intro, minimum spinner time or exit effect.
  Disable only for a real dependency, invalid state or duplicate-operation risk; explain why.
- Separate intent, pending and outcome. Server-backed success requires confirmed server
  outcome, not a timer, optimistic toast or completed animation. Local-only actions reflect
  their actual local result. Keep errors actionable; support retry, timeout and cancellation
  where the workflow allows. Dismissing progress does not claim that server work was cancelled.
- Keep loading, empty, disabled, success and error states only where meaningful. Preserve
  input on failure and avoid duplicate requests on retries or rapid activation.

## Motion that preserves control

- Prefer the existing CSS transitions for simple color, opacity and state changes.
  Springs are optional, not a blanket replacement for CSS or native controls.
- Make reversible transitions interruptible from their current visible state, not a stale
  target. Opening/closing paths and origins should remain predictable. Input is not locked
  merely because motion is running; destructive or in-flight operations keep their real guards.
- For direct manipulation, preserve grab offset, handle pointercancel/lost capture, respect
  scrolling and boundaries, and provide a non-drag alternative. On release, carry measured
  velocity into a suitable physics API when supported; verify units and zero-distance cases.
  Do not assume a duration-based spring preserves velocity.
- Apple damping ratio is not Motion/Framer Motion's damping parameter. Do not paste
  damping: 1 as a universal no-bounce preset. Inspect the installed package/version,
  types and official API docs before choosing physical or duration/bounce parameters.
  Do not assume the upstream examples match this project's version.
- Motion must explain a relationship or state. No automatic addition of blur, glass,
  bounce, sound, parallax, fonts or animation dependencies. Reuse the product's existing
  primitives; do not turn data-entry or reading surfaces into a cinematic showcase.
- Prefer transform/opacity for movement when appropriate; do not animate layout or
  filters gratuitously. Keep semantic state and accessible content independent of animation
  callbacks so interrupted/reduced motion cannot strand a workflow.

## Accessibility and evidence

- Use native semantics, visible keyboard focus, sensible focus order and text labels.
  Check keyboard activation, Escape where appropriate, dialog focus containment and return.
  Do not make hover, color, dragging, audio or motion the only way to understand or act.
- Respect reduced motion: remove large displacement, elastic motion and parallax; retain
  brief color/opacity or static feedback. Preserve contrast on solid/translucent surfaces,
  text enlargement and touch targets. Offer a solid fallback if existing transparency needs it.
- For a UI change, verify its actual desktop/mobile path plus rapid repetition, reversal,
  pending/error/retry, keyboard and reduced motion as relevant. Check contrast and overflow;
  report what was observed versus only specified. Match performance checks to effect size.
- For documentation-only integration, validate frontmatter, local links, provenance/license,
  instruction conflicts and diff scope. Do not claim a build proves interaction behavior.
