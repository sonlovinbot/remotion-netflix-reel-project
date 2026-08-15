import {AbsoluteFill, Img, interpolate, random} from 'remotion';
import {scene4, shared} from '../assets';
import {useAuthoredFrame, useBoil} from '../engine';
import {useReelLanguage} from '../language';

/**
 * Scene 4 — "Ten years later, Blockbuster closed down a thousand stores and declared bankruptcy."
 *
 * The fall. Defeated boss anchored at ground point x560/y1690. Grounded
 * parallax: building scales slower than the man. Shadow is a flipped,
 * skewed duplicate. Text stacks on left, then man shifts left revealing
 * "declared bankruptcy" on the right with a hand-drawn underline.
 *
 * 150 authored frames. Desaturated grade.
 */

const GROUND = {x: 560, y: 1690};

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

export const Scene4: React.FC = () => {
	const isVietnamese = useReelLanguage() === 'vi';
	const frame = useAuthoredFrame(150);
	const boil = useBoil('s4-man', 0.5, 0.12);

	// --- grounded parallax punch ---
	const bgScale = interpolate(frame, [8, 80], [1.0, 1.12], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: easeOutQuad,
	});
	const manScale = interpolate(frame, [0, 58], [1.0, 1.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: easeOutQuad,
	});

	// --- the shift: man slides left ~235px around f60 ---
	const shiftX = interpolate(frame, [55, 75], [0, -235], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: easeOutQuad,
	});
	const motionBlur = interpolate(frame, [55, 65, 75], [0, 8, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- left line: "closed a / 1000 / stores" stacking from f24 ---
	const leftLines = isVietnamese
		? ['đóng cửa', 'hàng nghìn', 'chi nhánh']
		: ['closed a', '1,000', 'stores'];
	const leftStart = 24;
	const leftFade = interpolate(frame, [55, 65], [1, 0.3], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- right line: "declared bankruptcy" f70-78 ---
	const rightReveal = interpolate(frame, [70, 78], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- hand-drawn underline ---
	const underlineLen = interpolate(frame, [78, 90], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- focus vignette tightens toward right text ---
	const vignetteX = interpolate(frame, [70, 85], [50, 68], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- grade: desaturated and sombre ---
	const grade = 'saturate(0.62) contrast(1.12) sepia(0.06) brightness(0.94)';

	return (
		<AbsoluteFill style={{backgroundColor: '#0E0E0E', filter: grade}}>
			{/* Dark background with parallax push */}
			<AbsoluteFill
				style={{
					transform: `scale(${bgScale})`,
					transformOrigin: `${GROUND.x}px ${GROUND.y}px`,
				}}
			>
				<Img
					src={shared.black}
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</AbsoluteFill>

			{/* The man + shadow, anchored at feet */}
			<div
				style={{
					position: 'absolute',
					left: GROUND.x,
					top: GROUND.y,
					transform: [
						`translate(${shiftX + boil.x}px, ${boil.y}px)`,
						`rotate(${boil.rotate}deg)`,
					].join(' '),
					filter: motionBlur > 0.1 ? `blur(${motionBlur}px)` : undefined,
				}}
			>
				{/* Shadow: flipped, skewed, black */}
				<Img
					src={scene4.bossDefeated}
					style={{
						position: 'absolute',
						height: 1100 * manScale,
						bottom: 0,
						left: '50%',
						transformOrigin: 'bottom center',
						transform: `translateX(-50%) scaleY(-1) skewX(-53deg)`,
						filter: 'brightness(0) blur(7px)',
						opacity: 0.55,
					}}
				/>
				{/* The man */}
				<Img
					src={scene4.bossDefeated}
					style={{
						position: 'absolute',
						height: 1100 * manScale,
						bottom: 0,
						left: '50%',
						transformOrigin: 'bottom center',
						transform: `translateX(-50%)`,
					}}
				/>
			</div>

			{/* Left text: stacking lines */}
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 460,
					fontFamily: 'Georgia, "Times New Roman", serif',
					fontStyle: 'italic',
					fontSize: 72,
					color: '#f6f1e7',
					lineHeight: 1.25,
					opacity: leftFade,
					textShadow: '0 4px 24px rgba(0,0,0,0.8)',
				}}
			>
				{leftLines.map((line, i) => {
					const lineFrame = leftStart + i * 6;
					const lineOp = interpolate(
						frame,
						[lineFrame, lineFrame + 6],
						[0, 1],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						},
					);
					return (
						<div key={i} style={{opacity: lineOp}}>
							{line}
						</div>
					);
				})}
			</div>

			{/* Right text: "declared bankruptcy" */}
			<div
				style={{
					position: 'absolute',
					right: 70,
					top: 520,
					textAlign: 'right',
					opacity: rightReveal,
				}}
			>
				<div
					style={{
						fontFamily: 'Georgia, "Times New Roman", serif',
						fontStyle: 'italic',
						fontSize: 68,
						color: '#f6f1e7',
						textShadow: '0 4px 24px rgba(0,0,0,0.8)',
						lineHeight: 1.3,
					}}
				>
					{isVietnamese ? 'tuyên bố' : 'declared'}
					<br />
					{isVietnamese ? 'phá sản' : 'bankruptcy'}
				</div>
				{/* Hand-drawn yellow underline */}
				<svg
					width="460"
					height="20"
					style={{marginTop: 8, overflow: 'visible'}}
				>
					<path
						d={`M 10 10 Q 115 ${4 + (random('ul-1') - 0.5) * 6} 230 ${10 + (random('ul-2') - 0.5) * 4} Q 345 ${14 + (random('ul-3') - 0.5) * 6} 450 10`}
						fill="none"
						stroke="#f6c445"
						strokeWidth={4}
						strokeLinecap="round"
						strokeDasharray={`${underlineLen * 500} 500`}
					/>
				</svg>
			</div>

			{/* Tightening vignette */}
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(ellipse 60% 55% at ${vignetteX}% 46%, transparent 30%, rgba(0,0,0,0.75) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
