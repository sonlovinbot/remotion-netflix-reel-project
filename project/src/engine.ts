import {
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

/**
 * Shared motion engine. Every scene imports from here so the whole reel moves
 * with one vocabulary.
 *
 * The core idea: the reel is meant to look hand-made, not computer-smooth. That
 * comes from `useSteppedFrame` — sampling animation on 12fps steps while the
 * video itself renders at 30fps. Drive your interpolations off the stepped
 * frame and movement judders like stop-motion; drive them off the raw frame and
 * it glides. Most things should judder.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Animation sampling rate. 12fps is the classic "on twos" cartoon cadence. */
export const STEP_FPS = 12;

/**
 * Snap a frame to STEP_FPS steps.
 *
 * At 30fps / 12 steps the stride is 2.5 frames, so this returns fractional
 * frames — which is fine and intentional. `interpolate` and `spring` both take
 * fractional input, and rounding to whole frames instead would make the stutter
 * uneven (2,3,2,3... instead of a steady 2.5).
 */
export const posterizeTime = (frame: number, fps = FPS, stepFps = STEP_FPS) => {
	const stride = fps / stepFps;
	return Math.floor(frame / stride) * stride;
};

/** The current frame, snapped to 12fps steps. Use this for almost everything. */
export const useSteppedFrame = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return posterizeTime(frame, fps);
};

/** Which 12fps step we're on. Handy as a seed so a value holds for a whole step. */
export const useStepIndex = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return Math.floor(frame / (fps / STEP_FPS));
};

export type Boil = {x: number; y: number; rotate: number};

/**
 * Boil — the small random wobble that makes a still cut-out feel alive, like
 * a redrawn animation cel. Deterministic per step, so it renders identically
 * every time.
 *
 * @param seed distinct string per element, or neighbouring elements wobble in
 *   lockstep and the effect reads as a camera shake instead of per-object life.
 * @param amount pixels of travel. 1.5–3 is subtle; above ~6 it reads as shaking.
 * @param rotation degrees of wobble.
 */
export const useBoil = (seed: string, amount = 2, rotation = 0.4): Boil => {
	const step = useStepIndex();
	return {
		x: (random(`${seed}-x-${step}`) - 0.5) * 2 * amount,
		y: (random(`${seed}-y-${step}`) - 0.5) * 2 * amount,
		rotate: (random(`${seed}-r-${step}`) - 0.5) * 2 * rotation,
	};
};

/**
 * Drift — slow constant travel, for backgrounds that should never sit still.
 * Returns pixels moved so far. Deliberately reads the RAW frame, not the
 * stepped one: a drift is the one thing that should glide.
 *
 * @param pxPerSecond negative values drift the other way.
 */
export const useDrift = (pxPerSecond = 12) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (frame / fps) * pxPerSecond;
};

/**
 * Pingpong — a value that eases back and forth between `from` and `to` forever.
 * For breathing scale, swinging props, pulsing glows.
 *
 * @param periodInSeconds one full there-and-back cycle.
 */
export const usePingPong = (from: number, to: number, periodInSeconds = 2) => {
	const frame = useSteppedFrame();
	const {fps} = useVideoConfig();
	const phase = (frame / fps / periodInSeconds) % 1;
	// cosine ease so it slows at both ends instead of bouncing linearly
	return interpolate(Math.cos(phase * Math.PI * 2), [-1, 1], [to, from]);
};

/**
 * Entrance — a spring 0→1 for things popping into place.
 *
 * `stiffness` 120 with damping 14 gives a firm pop with one small overshoot,
 * which is what most of the reel wants. Raise damping toward 200 for a
 * no-overshoot settle (text that must land clean and stay put).
 */
export const useEntrance = ({
	delayInFrames = 0,
	stiffness = 120,
	damping = 14,
	stepped = true,
}: {
	delayInFrames?: number;
	stiffness?: number;
	damping?: number;
	/** Set false for entrances that should glide rather than judder. */
	stepped?: boolean;
} = {}) => {
	const raw = useCurrentFrame();
	const {fps} = useVideoConfig();
	const frame = stepped ? posterizeTime(raw, fps) : raw;
	return spring({
		frame: frame - delayInFrames,
		fps,
		config: {stiffness, damping, mass: 1},
		durationInFrames: undefined,
	});
};

/** Entrance value mapped straight onto a translate + scale pop. */
export const useEntranceTransform = (
	options: Parameters<typeof useEntrance>[0] & {
		/** Pixels it travels in from. Negative comes from above. */
		fromY?: number;
		fromScale?: number;
	} = {},
) => {
	const {fromY = 60, fromScale = 0.92, ...rest} = options;
	const t = useEntrance(rest);
	return {
		progress: t,
		translateY: interpolate(t, [0, 1], [fromY, 0]),
		scale: interpolate(t, [0, 1], [fromScale, 1]),
		opacity: interpolate(t, [0, 1], [0, 1], {extrapolateRight: 'clamp'}),
	};
};

/** Compose a boil + entrance into one CSS transform string. */
export const toTransform = ({
	boil,
	translateY = 0,
	scale = 1,
}: {
	boil?: Boil;
	translateY?: number;
	scale?: number;
}) =>
	[
		`translate(${boil?.x ?? 0}px, ${(boil?.y ?? 0) + translateY}px)`,
		`rotate(${boil?.rotate ?? 0}deg)`,
		`scale(${scale})`,
	].join(' ');

/**
 * Scene lengths, in frames. Single source of truth — `Root.tsx` registers each
 * scene with these, and `Reel.tsx` lays them out on the main timeline in this
 * order, so the two can never drift apart.
 *
 * The voiceover drives these, not the other way round. `frames` is measured
 * from vo.wav: silence detection put the six line boundaries at 5.72s, 10.65s,
 * 16.68s, 22.17s and 29.50s, and each cut sits in the middle of its gap so no
 * scene change lands on a syllable.
 *
 * `authored` is the length each scene's choreography was written against. When
 * the two differ, `useAuthoredFrame` rescales time inside the scene so the
 * beats still land in the same relative places — that way the frame numbers in
 * the scene files stay readable instead of being rewritten every time the
 * voiceover is recut.
 */
export const SCENES = [
	{id: 'Scene1', frames: 172, authored: 150},
	{id: 'Scene2', frames: 148, authored: 180},
	{id: 'Scene3', frames: 181, authored: 150},
	{id: 'Scene4', frames: 165, authored: 150},
	{id: 'Scene5', frames: 324, authored: 280},
] as const;

/** Scene cuts measured from the pauses in vi-netflix-vo.wav. */
export const SCENES_VI = [
	{id: 'Scene1', frames: 168, authored: 150},
	{id: 'Scene2', frames: 190, authored: 180},
	{id: 'Scene3', frames: 255, authored: 150},
	{id: 'Scene4', frames: 155, authored: 150},
	{id: 'Scene5', frames: 286, authored: 280},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

export const durationOf = (id: SceneId) =>
	SCENES.find((s) => s.id === id)?.frames ?? 150;

export const durationOfVI = (id: SceneId) =>
	SCENES_VI.find((s) => s.id === id)?.frames ?? 150;

export const authoredOf = (id: SceneId) =>
	SCENES.find((s) => s.id === id)?.authored ?? 150;

/**
 * The current frame expressed on the scene's authored timeline.
 *
 * A scene written for 180 frames but given 148 runs 1.22x faster; one written
 * for 150 but given 172 runs slower. Beats keep their proportions either way.
 */
export const useAuthoredFrame = (authored: number) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (frame * authored) / durationInFrames;
};

/** 990 frames = 33s, matching vo.wav. */
export const TOTAL_DURATION = SCENES.reduce((n, s) => n + s.frames, 0);

/** 1054 frames = 35.13s, matching vi-netflix-vo.wav before the CTA. */
export const STORY_DURATION_VI = SCENES_VI.reduce((n, s) => n + s.frames, 0);

/** Where each scene starts on the main timeline, in frames. */
export const SCENE_STARTS = SCENES.reduce<number[]>(
	(acc, s, i) => [...acc, (acc[i - 1] ?? 0) + (SCENES[i - 1]?.frames ?? 0)],
	[],
);
