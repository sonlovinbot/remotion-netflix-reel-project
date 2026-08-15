---
name: remotion-video
description: Prepare, inspect, preview, edit, review, render, or create beginner-friendly Remotion video projects in this repository. Use when a learner asks to set up the machine, open Project 1, diagnose Remotion, change a scene or caption, render a composition, or create a new video based on the included workflow.
---

# Remotion Video

Guide a non-technical learner through this repository. Speak Vietnamese plainly, perform technical work for the learner, and return links or files instead of asking them to use a terminal.

## Choose the mode

Interpret the first argument or the request:

- `setup`: inspect the machine, report findings, wait for approval, install only approved items, verify Project 1, then open `ReelVI`.
- `preview`: verify dependencies and open Remotion Studio without changing content.
- `doctor`: diagnose only. Do not install or edit until the learner approves the proposed fix.
- `edit`: change only the requested scene, caption, asset, audio, or timing. Preserve all unrelated scenes.
- `new-project`: create a new folder from `templates/new-project`; never overwrite `project`.
- `review`: check facts, spelling, asset consistency, audio, caption timing, important frames, and CTA.
- `render`: render only an approved composition, verify the output, and report the file path.

If no mode is supplied, infer it. For the first conversation in a fresh clone, default to `setup`.

## Setup workflow

1. Read `project-manifest.json`, `AGENTS.md`, and `agent-kit/references/setup-workflow.md`.
2. Run the read-only doctor with the first available runtime:
   - `bun agent-kit/scripts/doctor.mjs`
   - `node agent-kit/scripts/doctor.mjs`
3. If neither Bun nor Node exists, inspect the operating system and report that the project runtime is missing.
4. Present a short readiness report with: ready items, missing items, estimated download, planned actions, and risks.
5. Stop and ask for explicit approval before installing software, downloading dependencies, or changing system configuration.
6. After approval, follow `agent-kit/references/setup-workflow.md`. Prefer local, user-level installation and avoid administrator access when possible.
7. Run `agent-kit/scripts/verify-project.mjs`, project lint, and the Remotion composition listing.
8. Start Remotion Studio on an available local port and return the complete URL for `ReelVI`.
9. Report what was installed, verification results, and three safe next actions.

## Editing and rendering

Read `agent-kit/references/video-workflow.md` before editing or creating video code. Follow these invariants:

- Treat voice-over as the timeline spine. Measure new audio before changing scene lengths or captions.
- Keep assets under `project/public/assets` and reference them with `staticFile()`.
- Keep scene durations in the shared timing source, not duplicated across files.
- Use Remotion frame-based motion. Do not use CSS animations or wall-clock timers.
- Preview scenes independently and render representative frames before a full video.
- Do not commit MP4, MOV, WebM, caches, dependencies, or secrets.

For Project 1 details, read only the map needed:

- Assets: `workflow/asset-map.json`
- Scenes and timing: `workflow/scene-map.json`
- Prompts: `workflow/prompt-index.json`
- Full project metadata: `project-manifest.json`

## New project workflow

1. Read `agent-kit/references/new-project-workflow.md`.
2. Ask the learner for the seven plain-language inputs listed there.
3. Create a slug under `projects/`. Refuse to use `project`, `project-01`, or an existing folder.
4. Run `agent-kit/scripts/create-project.mjs <slug> --title "<title>"` only after the learner approves the brief.
5. Complete the brief, script, beat map, asset map, prompt index, and review checklist before writing scene code.
6. Build and approve one scene at a time. Render the full video only after review.

## Safety gates

- Read-only inspection never needs confirmation.
- Installation, system configuration, large downloads, overwrites, deletions, and full renders require confirmation.
- State the exact target and impact before each gated action.
- Never expose credentials or copy environment files into Git.
- Do not silently repair unrelated files.

## Resources

- Machine and installation decisions: `agent-kit/references/setup-workflow.md`
- Video construction and Remotion rules: `agent-kit/references/video-workflow.md`
- Project 2 creation flow: `agent-kit/references/new-project-workflow.md`
- Troubleshooting: `agent-kit/references/troubleshooting.md`
- Read-only machine report: `agent-kit/scripts/doctor.mjs`
- Repository verification: `agent-kit/scripts/verify-project.mjs`
- Safe project scaffolder: `agent-kit/scripts/create-project.mjs`
