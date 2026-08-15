import {
	AbsoluteFill,
	Img,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {scene2, shared} from '../assets';
import {posterizeTime, useAuthoredFrame} from '../engine';
import {useReelLanguage} from '../language';

/**
 * Scene 2 — "They asked for fifty million dollars — Blockbuster laughed them out of the room."
 *
 * The offer, on a red sunburst. Two hands slide in holding what each side
 * brought to the table; the number lands on a slot-machine slam; the boss
 * rises, punches in and laughs. Then the frame flickers to negative and the
 * light burns out of his eyes.
 *
 * 180 frames (6s) — the beats run to frame 174 and will not fit in 150.
 */

const SUNBURST =
	'radial-gradient(circle at 50% 44%, #a01218 0%, #7c0d12 46%, #58080c 100%)';

/** Faint rays — alternating dark wedges struck from the same centre. */
const RAYS =
	'repeating-conic-gradient(from 0deg at 50% 44%, rgba(0,0,0,0.14) 0deg 5deg, rgba(0,0,0,0) 5deg 14deg)';

/** Values the reel spins past before it slams onto MILLION. */
const REEL_H = 165;

/**
 * A hand-drawn wireframe diamond that draws itself on with a dashed stroke and
 * wobbles on an 8fps boil — deliberately coarser than the engine's 12fps, so
 * the drawn overlay chatters against the footage rather than locking to it.
 */
const Diamond: React.FC<{progress: number; seed: string; size: number}> = ({
	progress,
	seed,
	size,
}) => {
	// The boil reads the real clock, not the authored one: it is a texture, not
	// a beat, so it should chatter at a steady 8fps whatever length the scene
	// gets stretched to.
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const boilStep = Math.floor(frame / (fps / 8));
	const j = (i: number) => (random(`${seed}-${boilStep}-${i}`) - 0.5) * 3;
	const c = size / 2;
	const d =
		`M ${c + j(0)} ${6 + j(1)} ` +
		`L ${size - 6 + j(2)} ${c + j(3)} ` +
		`L ${c + j(4)} ${size - 6 + j(5)} ` +
		`L ${6 + j(6)} ${c + j(7)} Z`;
	const len = size * 3;
	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			style={{position: 'absolute', inset: 0, overflow: 'visible'}}
		>
			<path
				d={d}
				fill="none"
				stroke="#f6d24a"
				strokeWidth={5}
				strokeLinejoin="round"
				strokeDasharray={`${len * progress} ${len}`}
			/>
		</svg>
	);
};

const CaptionBox: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			backgroundColor: '#f6c445',
			color: '#231303',
			padding: '18px 46px',
			fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
			fontSize: 84,
			fontWeight: 900,
			letterSpacing: -1,
			boxShadow: '16px 16px 0 rgba(20,6,2,0.55)',
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);

export const Scene2: React.FC = () => {
	const isVietnamese = useReelLanguage() === 'vi';
	const reel = isVietnamese
		? ['TRIỆU', 'TRIỆU ĐÔ', 'TRIỆU', 'TRIỆU ĐÔ', 'TRIỆU', 'TRIỆU ĐÔ']
		: ['BILLION', 'DOLLARS', 'TRILLION', 'BILLION', 'DOLLARS', 'MILLION'];
	// Authored against 180 frames; useAuthoredFrame rescales to the length the
	// voiceover actually gives this scene (148).
	const frame = useAuthoredFrame(180);
	const {fps} = useVideoConfig();
	const stepped = posterizeTime(frame, fps);

	// --- the two props ------------------------------------------------------
	const logoIn = spring({
		frame: frame - 17,
		fps,
		config: {stiffness: 90, damping: 16},
	});
	const cashIn = spring({
		frame: frame - 47,
		fps,
		config: {stiffness: 90, damping: 16},
	});
	const logoDraw = interpolate(frame, [17, 42], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const cashDraw = interpolate(frame, [47, 72], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- the number ---------------------------------------------------------
	const numberIn = interpolate(frame, [62, 72], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const spin = interpolate(frame, [72, 82], [0, reel.length - 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const reelIndex = Math.min(reel.length - 1, Math.floor(spin));
	const reelOffset = -(spin - reelIndex) * REEL_H;
	// A hard overshoot-and-settle, not an ease-out: the number should land like
	// a lever being thrown, not like a value coming to rest.
	const slam = interpolate(frame, [82, 85, 90], [1.18, 0.96, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- the boss -----------------------------------------------------------
	const rise = spring({
		frame: frame - 84,
		fps,
		config: {stiffness: 70, damping: 15},
	});
	const punch = interpolate(frame, [96, 116], [1, 1.09], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const sway = Math.sin((stepped / fps) * 1.1) * 0.4;
	const bossY = interpolate(rise, [0, 1], [560, 0]);

	// --- cigar smoke --------------------------------------------------------
	const smokeIn = interpolate(frame, [98, 128], [0, 0.6], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const smokeRise = interpolate(frame, [98, 180], [0, -150]);
	const smokeDrift = Math.sin((stepped / fps) * 0.9) * 24;

	// --- yellow captions ----------------------------------------------------
	const cap1 = spring({
		frame: frame - 130,
		fps,
		config: {stiffness: 170, damping: 13},
	});
	const cap1Out = interpolate(frame, [150, 156], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const cap2 = spring({
		frame: frame - 150,
		fps,
		config: {stiffness: 170, damping: 13},
	});
	const cap2Out = interpolate(frame, [163, 170], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- the punctuation ----------------------------------------------------
	// Hold keyframes, not a fade: short bursts that snap in and out.
	const burst =
		(frame >= 165 && frame < 168) ||
		(frame >= 170 && frame < 172) ||
		(frame >= 174 && frame < 176);
	const drain = interpolate(frame, [174, 180], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const eyeGlow = interpolate(frame, [174, 179], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#58080c',
				filter: burst ? 'invert(1) hue-rotate(150deg)' : undefined,
			}}
		>
			<AbsoluteFill style={{backgroundImage: SUNBURST}} />
			<AbsoluteFill style={{backgroundImage: RAYS, opacity: 0.5}} />

			{/* prop 1 — the logo hand, in from the left */}
			<div
				style={{
					position: 'absolute',
					top: 250,
					left: interpolate(logoIn, [0, 1], [-780, 30]),
					width: 600,
					height: 600,
				}}
			>
				<Diamond progress={logoDraw} seed="dia-logo" size={600} />
				<Img
					src={scene2.handLogo}
					style={{position: 'absolute', top: 268, left: -40, width: 560}}
				/>
				<Img
					src={shared.netflixN}
					style={{
						position: 'absolute',
						top: 150,
						left: 268,
						height: 130,
						opacity: logoDraw,
					}}
				/>
			</div>

			{/* prop 2 — the cash hand, in from the right */}
			<div
				style={{
					position: 'absolute',
					top: 700,
					right: interpolate(cashIn, [0, 1], [-820, 10]),
					width: 600,
					height: 600,
				}}
			>
				<Diamond progress={cashDraw} seed="dia-cash" size={600} />
				<Img
					src={scene2.handCash}
					style={{position: 'absolute', top: 232, left: 20, width: 580}}
				/>
			</div>

			{/* the boss — smoke is his child so it stays glued to the cigar */}
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center'}}>
				<div
					style={{
						position: 'relative',
						transform: `translateY(${bossY}px) rotate(${sway}deg) scale(${punch})`,
						transformOrigin: 'bottom center',
					}}
				>
					<Img
						src={scene2.smoke}
						style={{
							position: 'absolute',
							// Anchored to the cigar ember in his raised right hand, not
							// to the middle of the plate — the plume has to read as
							// coming off the tip.
							width: 340,
							left: 96,
							bottom: 1005,
							transform: `translate(${smokeDrift}px, ${smokeRise}px)`,
							opacity: smokeIn,
							// No mixBlendMode here: the boss sits inside a transformed
							// parent, which isolates blending, so a screen blend would
							// leave the plume's black backing visible as a rectangle.
							// The asset carries its own alpha instead (luminance keyed
							// at build time), and the mask just feathers the top so the
							// plume trails off rather than ending on a hard edge.
							maskImage: 'linear-gradient(to top, #000 18%, rgba(0,0,0,0) 90%)',
							WebkitMaskImage:
								'linear-gradient(to top, #000 18%, rgba(0,0,0,0) 90%)',
						}}
					/>
					<Img
						src={scene2.bossLaughing}
						style={{
							height: 1240,
							display: 'block',
							filter: `grayscale(${drain}) contrast(${1 + drain * 0.3})`,
						}}
					/>
					{eyeGlow > 0 ? (
						<div
							style={{
								position: 'absolute',
								top: 232,
								left: 292,
								width: 250,
								height: 56,
								opacity: eyeGlow,
								background:
									'radial-gradient(ellipse at 50% 50%, rgba(255,86,60,0.95) 0%, rgba(255,10,0,0.55) 42%, rgba(255,0,0,0) 74%)',
								filter: 'blur(7px)',
								mixBlendMode: 'screen',
							}}
						/>
					) : null}
				</div>
			</AbsoluteFill>

			{/* "50 MILLION" — the slot reel */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: -300,
					opacity: numberIn,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: 22,
						transform: `scale(${slam})`,
						fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
						fontSize: 128,
						fontWeight: 900,
						color: '#f8f3e6',
						textShadow: '0 10px 40px rgba(0,0,0,0.65)',
					}}
				>
					<span style={{lineHeight: `${REEL_H}px`}}>50</span>
					<div style={{height: REEL_H, overflow: 'hidden'}}>
						<div style={{transform: `translateY(${reelOffset}px)`}}>
							<div style={{height: REEL_H, lineHeight: `${REEL_H}px`}}>
								{reel[reelIndex]}
							</div>
							<div style={{height: REEL_H, lineHeight: `${REEL_H}px`}}>
								{reel[Math.min(reel.length - 1, reelIndex + 1)]}
							</div>
						</div>
					</div>
				</div>
			</AbsoluteFill>

			{/* marigold caption boxes */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 170,
				}}
			>
				<div
					style={{
						position: 'absolute',
						opacity: cap1 * cap1Out,
						transform: `scale(${cap1})`,
					}}
				>
					<CaptionBox>{isVietnamese ? 'cười nhạo' : 'laughed'}</CaptionBox>
				</div>
				<div
					style={{
						position: 'absolute',
						opacity: cap2 * cap2Out,
						transform: `scale(${cap2})`,
					}}
				>
					<CaptionBox>
						{isVietnamese ? 'đuổi khỏi phòng' : 'them out'}
					</CaptionBox>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
