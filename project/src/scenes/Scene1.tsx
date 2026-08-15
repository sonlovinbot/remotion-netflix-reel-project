import {AbsoluteFill, Img, interpolate, useVideoConfig} from 'remotion';
import {scene1, shared} from '../assets';
import {HEIGHT, WIDTH, posterizeTime, useAuthoredFrame} from '../engine';
import {useReelLanguage} from '../language';

/**
 * Scene 1 — "In 2000, a small startup called Netflix pitched Blockbuster to buy them out."
 *
 * A black-and-white framed photo hangs on a paper wall: Reed standing outside
 * the store he is about to walk into. A slow push becomes a zoom that flies
 * THROUGH the frame — the gilt frame accelerates out past the edges while the
 * photo detaches, settles to full-bleed, and blooms from black-and-white into
 * colour.
 *
 * The camera move reads the RAW frame, not the stepped one: acceleration has
 * to be smooth or it registers as chop instead of speed. Only the character
 * boil is snapped to 12fps — that is the one thing meant to stutter.
 *
 * Geometry: the photo is a full-bleed 1080x1920 stage that gets scaled DOWN to
 * sit inside the frame, rather than a small picture that grows. That way
 * "settled" is exactly scale 1 and the shot fills the reel with no leftover
 * arithmetic. The frame is then sized around the stage so its opening lands on
 * the stage edges — which only works because the opening is 0.567 and the reel
 * is 0.5625.
 */

/** How much of the wall the hanging picture occupies. */
const WELD = 0.369;

/**
 * The mat board and its shadow, in stage pixels — i.e. as measured on the
 * full-bleed 1080x1920 stage, before the weld scales everything down.
 *
 * At the welded scale of 0.369 these land at roughly 15px of border and a
 * 26/22px shadow offset on screen, which is the Vox-explainer look: a hard
 * offset to the lower right with a soft bloom under it, no blur on the key
 * edge. Because they live on an element that shares the stage's scale, they
 * shrink and grow with the picture instead of drifting out of proportion.
 */
const MAT = {border: 96, shadowX: 78, shadowY: 62};

const easeInCubic = (t: number) => t * t * t;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

export const Scene1: React.FC = () => {
	const isVietnamese = useReelLanguage() === 'vi';
	// Authored against 150 frames; useAuthoredFrame rescales to the
	// length the voiceover actually gives this scene.
	const frame = useAuthoredFrame(150);
	const {fps} = useVideoConfig();
	const stepped = posterizeTime(frame, fps);

	// --- camera: slow push, then fly-through --------------------------------
	const wallScale =
		frame <= 46
			? interpolate(frame, [0, 46], [1, 1.16], {extrapolateLeft: 'clamp'})
			: interpolate(frame, [46, 76], [1.16, 6.8], {
					easing: easeInCubic,
					extrapolateRight: 'clamp',
				});

	// --- weld / detach ------------------------------------------------------
	// Until frame 62 the photo and frame are one rigid object. If they ever
	// ease apart before the detach, the illusion of flying into a real
	// photograph collapses — so both read this single value.
	const welded = wallScale * WELD;

	const photoScale =
		frame <= 62
			? welded
			: interpolate(frame, [62, 72], [0.75, 1], {
					easing: easeOutQuad,
					extrapolateRight: 'clamp',
				});

	// The mat never settles: it keeps accelerating out past the edges.
	const matOpacity = interpolate(frame, [62, 76], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const colour = interpolate(frame, [62, 74], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- blur ---------------------------------------------------------------
	const motionBlur = interpolate(frame, [54, 61, 72], [0, 9, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const wallBlur = interpolate(frame, [52, 72], [0, 8], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const wallOpacity = interpolate(frame, [52, 72], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- drifting clouds ----------------------------------------------------
	const cloud1X = interpolate(frame, [0, 150], [0, -525]);
	const cloud2X = cloud1X * 0.6;

	// --- character boil (stepped to 12fps) ----------------------------------
	const boilScale = 1 + Math.sin((stepped / fps) * 2.2) * 0.002;
	const boilRotate = Math.sin((stepped / 140) * Math.PI * 2) * 0.2;

	// --- captions -----------------------------------------------------------
	// Captions synced to VO: "a small startup" @1.44s, "called Netflix" @2.28s
	// In authored time (150f / 5.73s): f38 and f60
	const cap1 = interpolate(frame, [38, 44, 56, 60], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const cap2 = interpolate(frame, [58, 64], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#0E0E0E'}}>
			<AbsoluteFill
				style={{
					filter: motionBlur > 0.01 ? `blur(${motionBlur}px)` : undefined,
				}}
			>
				{/* the museum wall, with the plaque under the picture */}
				<AbsoluteFill
					style={{
						transform: `scale(${wallScale})`,
						filter: wallBlur > 0.01 ? `blur(${wallBlur}px)` : undefined,
						opacity: wallOpacity,
					}}
				>
					<Img
						src={shared.paper}
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: '72%',
							textAlign: 'center',
							fontFamily: 'Georgia, "Times New Roman", serif',
							fontSize: 96,
							letterSpacing: 14,
							color: '#463c30',
						}}
					>
						{isVietnamese ? 'NĂM 2000' : 'In 2000'}
					</div>
				</AbsoluteFill>

				{/* mat board + offset shadow, sitting exactly under the stage */}
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<div
						style={{
							// Sized larger than the stage rather than given a `border`:
							// box-sizing is border-box here, so a border would sit
							// inside the box and the photo would cover it exactly.
							width: WIDTH + MAT.border * 2,
							height: HEIGHT + MAT.border * 2,
							// The mat is taller than the composition, so without this
							// flex shrinks it back to 1920 and the top and bottom of
							// the border vanish.
							flexShrink: 0,
							transform: `scale(${welded})`,
							backgroundColor: '#f4efe4',
							boxShadow: [
								`${MAT.shadowX}px ${MAT.shadowY}px 0 rgba(20,14,8,0.42)`,
								`${MAT.shadowX * 1.4}px ${MAT.shadowY * 1.4}px 90px rgba(20,14,8,0.5)`,
							].join(', '),
							opacity: matOpacity,
						}}
					/>
				</AbsoluteFill>

				{/* the photograph — a full-bleed stage scaled down into the frame */}
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<div
						style={{
							width: WIDTH,
							height: HEIGHT,
							overflow: 'hidden',
							transform: `scale(${photoScale})`,
							filter: `grayscale(${1 - colour}) saturate(${0.35 + colour * 0.65})`,
							backgroundColor: '#070a10',
						}}
					>
						<Img
							src={scene1.cloud2}
							style={{
								position: 'absolute',
								width: '150%',
								top: '2%',
								left: cloud2X,
								mixBlendMode: 'screen',
								opacity: 0.4,
							}}
						/>
						<Img
							src={scene1.cloud1}
							style={{
								position: 'absolute',
								width: '170%',
								top: '-6%',
								left: cloud1X,
								mixBlendMode: 'screen',
								opacity: 0.55,
							}}
						/>
						<Img
							src={scene1.store}
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
						{/* Reed at 46% of frame height — he reads clearly, and still
						    sits small against the building, which is the point. */}
						<Img
							src={scene1.reedYoung}
							style={{
								position: 'absolute',
								height: '46%',
								bottom: '3%',
								left: '50%',
								transformOrigin: 'bottom center',
								transform: `translateX(-50%) scale(${boilScale}) rotate(${boilRotate}deg)`,
								filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.6))',
							}}
						/>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>

			{/* serif-italic captions over the settled building */}
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 340,
					fontFamily: 'Georgia, "Times New Roman", serif',
					fontStyle: 'italic',
					fontSize: 68,
					color: '#f6f1e7',
					textShadow: '0 6px 30px rgba(0,0,0,0.85)',
				}}
			>
				<div style={{position: 'absolute', opacity: cap1}}>
					{isVietnamese ? 'một startup nhỏ' : 'a small startup'}
				</div>
				<div style={{position: 'absolute', opacity: cap2}}>
					{isVietnamese ? 'mang tên Netflix' : 'called Netflix'}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
