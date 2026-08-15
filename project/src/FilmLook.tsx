import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {shared} from './assets';
import {useBoil, useStepIndex} from './engine';

/**
 * FilmLook — the reusable aged-film wrapper.
 *
 * Wrap any scene in it and the scene reads like it came off a worn print.
 * Written once here so the six scene files never have to think about
 * treatment — they only handle their own choreography.
 *
 * Layer order, top of the stack downward:
 *   1. scan lines
 *   2. grain (multiply)  +  grunge (colour-burn)
 *   3. vignette
 *   4. grade             — a CSS filter on the scene content itself
 *   5. gate weave        — jitter + overscale applied to the whole frame
 *
 * Every layer has its own toggle, so you can switch parts off while debugging
 * a scene and put them back without retyping numbers.
 */

export type GradeProps = {
	saturate?: number;
	contrast?: number;
	sepia?: number;
	brightness?: number;
};

export type FilmLookProps = {
	children: React.ReactNode;
	/** Per-layer toggles. */
	scanLines?: boolean;
	grain?: boolean;
	grunge?: boolean;
	vignette?: boolean;
	grade?: boolean;
	gateWeave?: boolean;
	/**
	 * Colour grade, exposed so a scene can push its own look — Scene 3 wants
	 * less sepia than Scene 1, for instance. Anything you leave out keeps the
	 * default below.
	 */
	gradeSettings?: GradeProps;
	/**
	 * Grain and grunge reposition on every 12fps step so the texture crawls
	 * like real film rather than sitting frozen on top of the picture. Turn
	 * off for a static overlay.
	 */
	animateTexture?: boolean;
};

const DEFAULT_GRADE: Required<GradeProps> = {
	saturate: 0.86,
	contrast: 1.08,
	sepia: 0.16,
	brightness: 0.95,
};

/** 1.6px black line at 16%, repeating every 8px, softened by 0.7px of blur. */
const SCAN_LINES =
	'repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1.6px, rgba(0,0,0,0) 1.6px, rgba(0,0,0,0) 8px)';

/** Clear through the middle, falling to 50% black at the edge. */
const VIGNETTE =
	'radial-gradient(ellipse 92% 82% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)';

const fullBleed: React.CSSProperties = {
	position: 'absolute',
	width: '100%',
	height: '100%',
	objectFit: 'cover',
};

export const FilmLook: React.FC<FilmLookProps> = ({
	children,
	scanLines = true,
	grain = true,
	grunge = true,
	vignette = true,
	grade = true,
	gateWeave = true,
	gradeSettings,
	animateTexture = true,
}) => {
	const g = {...DEFAULT_GRADE, ...gradeSettings};

	// ~5px of total travel, stepped on twos by useBoil. The 1.012 overscale is
	// what stops the jitter ever pulling an empty edge into frame.
	const weave = useBoil('gate-weave', 1.2, 0);
	const step = useStepIndex();

	// Shift the textures by a few pixels each step. Deterministic, so renders
	// are reproducible.
	const textureShift = animateTexture
		? {
				transform: `translate(${(step % 3) * 7 - 7}px, ${(step % 5) * 5 - 10}px) scale(1.05)`,
			}
		: undefined;

	const gradeFilter = grade
		? `saturate(${g.saturate}) contrast(${g.contrast}) sepia(${g.sepia}) brightness(${g.brightness})`
		: undefined;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0E0E0E',
				overflow: 'hidden',
				transform: gateWeave
					? `translate(${weave.x}px, ${weave.y}px) scale(1.012)`
					: undefined,
			}}
		>
			{/* 4. the scene itself, graded */}
			<AbsoluteFill style={{filter: gradeFilter}}>{children}</AbsoluteFill>

			{/* 3. vignette */}
			{vignette ? (
				<AbsoluteFill style={{backgroundImage: VIGNETTE, pointerEvents: 'none'}} />
			) : null}

			{/* 2. texture sandwich — grain first, then grunge on top of it */}
			{grain ? (
				<Img
					src={shared.grain}
					style={{
						...fullBleed,
						...textureShift,
						mixBlendMode: 'multiply',
						filter: 'invert(1) brightness(1.35) contrast(1.02)',
						opacity: 0.55,
						pointerEvents: 'none',
					}}
				/>
			) : null}
			{grunge ? (
				<Img
					src={shared.grunge}
					style={{
						...fullBleed,
						...textureShift,
						mixBlendMode: 'color-burn',
						opacity: 0.16,
						pointerEvents: 'none',
					}}
				/>
			) : null}

			{/* 1. scan lines, topmost */}
			{scanLines ? (
				<AbsoluteFill
					style={{
						backgroundImage: SCAN_LINES,
						filter: 'blur(0.7px)',
						pointerEvents: 'none',
					}}
				/>
			) : null}
		</AbsoluteFill>
	);
};

/**
 * Wrap a scene component in the film look.
 *
 * Used by Root.tsx for both the standalone scene compositions and the main
 * timeline, so what you preview on a single scene is exactly what lands in the
 * final reel — no surprise when you assemble.
 */
export const withFilmLook = <P extends object>(
	Component: React.ComponentType<P>,
	props?: Omit<FilmLookProps, 'children'>,
): React.FC<P> => {
	const Wrapped: React.FC<P> = (componentProps) => (
		<FilmLook {...props}>
			<Component {...componentProps} />
		</FilmLook>
	);
	Wrapped.displayName = `withFilmLook(${Component.displayName ?? Component.name})`;
	return Wrapped;
};
