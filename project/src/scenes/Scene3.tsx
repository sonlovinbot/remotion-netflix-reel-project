import {AbsoluteFill, Img, interpolate, spring, useVideoConfig} from 'remotion';
import {scene3} from '../assets';
import {posterizeTime, useAuthoredFrame, useBoil} from '../engine';
import {useReelLanguage} from '../language';

/**
 * Scene 3 — "So Netflix built the opposite. No late fees. No stores. Customer first."
 *
 * Dark wooden desk fills the frame. Three newspaper front pages drop in one at
 * a time on soft springs — each slides from off-screen, rotates into place, and
 * settles with a small bounce. Papers boil on the 12fps step.
 *
 * 150 authored frames.
 */

const PAPERS: {
	src: string;
	enterFrame: number;
	fromX: number;
	fromY: number;
	fromRotate: number;
	x: number;
	y: number;
	rotate: number;
	seed: string;
}[] = [
	{
		src: 'newsLateFees',
		enterFrame: 20,
		fromX: -900,
		fromY: 400,
		fromRotate: -26,
		x: 240,
		y: 880,
		rotate: -7,
		seed: 'paper1',
	},
	{
		src: 'newsNoStores',
		enterFrame: 60,
		fromX: 1200,
		fromY: -200,
		fromRotate: 18,
		x: 290,
		y: 840,
		rotate: 6,
		seed: 'paper2',
	},
	{
		src: 'newsCustomerFirst',
		enterFrame: 100,
		fromX: 100,
		fromY: 2200,
		fromRotate: 12,
		x: 260,
		y: 900,
		rotate: -3,
		seed: 'paper3',
	},
];

const ASSET_MAP: Record<string, string> = {
	newsLateFees: scene3.newsLateFees,
	newsNoStores: scene3.newsNoStores,
	newsCustomerFirst: scene3.newsCustomerFirst,
};

const Paper: React.FC<{
	p: (typeof PAPERS)[number];
	stepped: number;
	fps: number;
}> = ({p, stepped, fps}) => {
	const t = spring({
		frame: stepped - p.enterFrame,
		fps,
		config: {stiffness: 42, damping: 12, mass: 1.1},
	});
	const scaleSettle = interpolate(t, [0, 1], [1.1, 1]);
	const x = interpolate(t, [0, 1], [p.fromX, p.x]);
	const y = interpolate(t, [0, 1], [p.fromY, p.y]);
	const rot = interpolate(t, [0, 1], [p.fromRotate, p.rotate]);
	const boil = useBoil(p.seed, 0.6, 0.15);

	return (
		<Img
			src={ASSET_MAP[p.src]}
			style={{
				position: 'absolute',
				width: '52%',
				left: 0,
				top: 0,
				transformOrigin: 'center center',
				transform: [
					`translate(${x + boil.x}px, ${y + boil.y}px)`,
					`rotate(${rot + boil.rotate}deg)`,
					`scale(${scaleSettle})`,
				].join(' '),
				opacity: t > 0.01 ? 1 : 0,
				filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.55))',
			}}
		/>
	);
};

export const Scene3: React.FC = () => {
	const isVietnamese = useReelLanguage() === 'vi';
	const frame = useAuthoredFrame(150);
	const {fps} = useVideoConfig();
	const stepped = posterizeTime(frame, fps);

	// Focus-hunt: blur clearing over first ~14 frames
	const focusBlur = interpolate(frame, [0, 14], [12, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Ken-Burns slow push
	const kenBurns = interpolate(frame, [0, 150], [1, 1.08], {
		extrapolateRight: 'clamp',
	});

	// Caption: "built the opposite." — fades in early, out by frame 48
	const captionOpacity = interpolate(frame, [6, 16, 38, 48], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Desk vignette
	const vignette =
		'radial-gradient(ellipse 72% 62% at 50% 48%, transparent 40%, rgba(0,0,0,0.7) 100%)';

	return (
		<AbsoluteFill style={{backgroundColor: '#0E0E0E'}}>
			<AbsoluteFill
				style={{
					transform: `scale(${kenBurns})`,
					filter: focusBlur > 0.1 ? `blur(${focusBlur}px)` : undefined,
				}}
			>
				<Img
					src={scene3.desk}
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>

			{/* Papers */}
			{PAPERS.map((p) => (
				<Paper key={p.seed} p={p} stepped={stepped} fps={fps} />
			))}

			{/* Vignette over desk */}
			<AbsoluteFill style={{backgroundImage: vignette}} />

			{/* Caption */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					paddingTop: 220,
				}}
			>
				<div
					style={{
						fontFamily: 'Georgia, "Times New Roman", serif',
						fontStyle: 'italic',
						fontSize: 64,
						color: '#f6f1e7',
						textShadow: '0 6px 30px rgba(0,0,0,0.85)',
						opacity: captionOpacity,
					}}
				>
					{isVietnamese ? 'một mô hình ngược lại.' : 'built the opposite.'}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
