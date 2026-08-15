import {AbsoluteFill, Img, interpolate, spring, useVideoConfig} from 'remotion';
import {scene5, scene6} from '../assets';
import {useAuthoredFrame, useBoil} from '../engine';
import {useReelLanguage} from '../language';

/**
 * Scene 5 — merged finale covering two VO lines:
 *   "Today, Netflix drives $45 billion a year in revenue, the biggest
 *    paid streaming service on Earth."
 *   "This was the most expensive 'no' in history."
 *
 * Part A (f0–160): globe + Reed triumph + headline stagger
 * Part B (f160–280): cross-fade to rich-man desk shot + final text
 *
 * 280 authored frames → 324 actual (10.8s).
 */

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

export const Scene5: React.FC = () => {
	const isVietnamese = useReelLanguage() === 'vi';
	const frame = useAuthoredFrame(280);
	const {fps} = useVideoConfig();
	const boil = useBoil('s5-reed', 0.5, 0.1);

	// ═══════════════════════════════════════════════════════════════
	// PART A — globe + Reed (f0–160)
	// ═══════════════════════════════════════════════════════════════

	const partAOpacity = interpolate(frame, [150, 168], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Camera focus-hunt
	const camScale =
		frame <= 21
			? interpolate(frame, [0, 21], [0.88, 1.0], {
					easing: easeOutQuad,
					extrapolateRight: 'clamp',
				})
			: interpolate(frame, [21, 160], [1.0, 1.06], {extrapolateRight: 'clamp'});

	const focusBlur1 = interpolate(frame, [0, 21], [10, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const focusBlur2 = interpolate(frame, [43, 53, 58, 63], [0, 6, 6, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const focusBlur = Math.max(focusBlur1, focusBlur2);

	const globeBloom = focusBlur > 0.5 ? 1 + focusBlur * 0.15 : 1;

	// Reed entrance
	const reedRise = spring({
		frame: frame - 12,
		fps,
		config: {stiffness: 60, damping: 14},
	});
	const reedY = interpolate(reedRise, [0, 1], [400, 0]);

	// Cash highlight flicker
	const cashOn =
		(frame >= 23 && frame < 29) ||
		(frame >= 32 && frame < 62) ||
		(frame >= 64 && frame < 72);

	// Headline A: "Forty five / billion / dollars in revenue"
	const headlinesA = isVietnamese
		? [
				{text: 'Bốn mươi lăm', start: 9},
				{text: 'tỷ đô', start: 22},
				{text: 'doanh thu mỗi năm', start: 38},
			]
		: [
				{text: 'Forty five', start: 9},
				{text: 'billion', start: 22},
				{text: 'dollars in revenue', start: 38},
			];

	// Pencil oval around "billion"
	const ovalDraw = interpolate(frame, [31, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// ═══════════════════════════════════════════════════════════════
	// PART B — rich desk shot + "the most expensive no" (f160–280)
	// ═══════════════════════════════════════════════════════════════

	const partBOpacity = interpolate(frame, [155, 170], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const bgBScale = interpolate(frame, [160, 280], [1.0, 1.1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: easeOutQuad,
	});

	const focusBlurB = interpolate(frame, [160, 172], [6, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Text B
	const lineB1 = interpolate(frame, [175, 185], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const lineB2 = interpolate(frame, [185, 195], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const lineB3 = interpolate(frame, [220, 230], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Grade
	const gradeA = 'saturate(0.82) contrast(1.06) sepia(0.14) brightness(0.93)';
	const gradeB = 'saturate(0.62) contrast(1.12) sepia(0.06) brightness(0.94)';

	const vignette =
		'radial-gradient(ellipse 68% 60% at 50% 44%, transparent 30%, rgba(0,0,0,0.72) 100%)';

	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
			{/* ── PART A: globe + Reed ── */}
			{partAOpacity > 0.01 && (
				<AbsoluteFill style={{opacity: partAOpacity, filter: gradeA}}>
					<AbsoluteFill
						style={{
							transform: `scale(${camScale})`,
							filter: focusBlur > 0.1 ? `blur(${focusBlur}px)` : undefined,
						}}
					>
						<Img
							src={scene5.globe}
							style={{
								position: 'absolute',
								width: '120%',
								height: '120%',
								left: '-10%',
								top: '-5%',
								objectFit: 'contain',
								mixBlendMode: 'screen',
								transform: `scale(${globeBloom})`,
								opacity: 0.7,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								width: 600,
								height: 600,
								left: 240,
								top: 80,
								borderRadius: '50%',
								background:
									'radial-gradient(circle, rgba(255,240,200,0.25) 0%, rgba(255,200,100,0.08) 40%, transparent 70%)',
								mixBlendMode: 'screen',
							}}
						/>
						<Img
							src={scene5.reedTriumph}
							style={{
								position: 'absolute',
								height: '72%',
								bottom: 0,
								left: '50%',
								transformOrigin: 'bottom center',
								transform: [
									'translateX(-50%)',
									`translateY(${reedY + boil.y}px)`,
									`rotate(${boil.rotate}deg)`,
								].join(' '),
								opacity: interpolate(reedRise, [0, 0.3], [0, 1], {
									extrapolateRight: 'clamp',
								}),
								filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.6))',
							}}
						/>
						{cashOn && (
							<Img
								src={scene5.globe}
								style={{
									position: 'absolute',
									width: '120%',
									height: '120%',
									left: '-10%',
									top: '-5%',
									objectFit: 'contain',
									mixBlendMode: 'screen',
									filter: 'sepia(1) saturate(5) hue-rotate(18deg)',
									opacity: 0.3,
								}}
							/>
						)}
					</AbsoluteFill>

					{/* Headline A */}
					<AbsoluteFill
						style={{
							justifyContent: 'flex-start',
							alignItems: 'center',
							paddingTop: 280,
						}}
					>
						<div
							style={{
								textAlign: 'center',
								fontFamily: 'Georgia, "Times New Roman", serif',
								fontStyle: 'italic',
								fontSize: 74,
								color: '#f6f1e7',
								lineHeight: 1.3,
								textShadow: '0 6px 30px rgba(0,0,0,0.85)',
							}}
						>
							{headlinesA.map((h, i) => {
								const op = interpolate(frame, [h.start, h.start + 12], [0, 1], {
									extrapolateLeft: 'clamp',
									extrapolateRight: 'clamp',
								});
								const slideY = interpolate(
									frame,
									[h.start, h.start + 12],
									[30, 0],
									{
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
										easing: easeOutQuad,
									},
								);
								return (
									<div
										key={i}
										style={{
											opacity: op,
											transform: `translateY(${slideY}px)`,
											position: 'relative',
											display: 'inline-block',
											width: '100%',
										}}
									>
										{h.text}
										{i === 1 && ovalDraw > 0 && (
											<svg
												width="380"
												height="100"
												style={{
													position: 'absolute',
													left: '50%',
													top: '50%',
													transform: 'translate(-50%, -50%)',
													overflow: 'visible',
												}}
											>
												<ellipse
													cx={190}
													cy={50}
													rx={175}
													ry={42}
													fill="none"
													stroke="#f6c445"
													strokeWidth={3.5}
													strokeLinecap="round"
													strokeDasharray={`${ovalDraw * 1100} 1100`}
													transform="rotate(-2 190 50)"
												/>
											</svg>
										)}
									</div>
								);
							})}
						</div>
					</AbsoluteFill>
				</AbsoluteFill>
			)}

			{/* ── PART B: rich desk + final text ── */}
			{partBOpacity > 0.01 && (
				<AbsoluteFill style={{opacity: partBOpacity, filter: gradeB}}>
					<AbsoluteFill
						style={{
							transform: `scale(${bgBScale})`,
							filter: focusBlurB > 0.1 ? `blur(${focusBlurB}px)` : undefined,
						}}
					>
						<Img
							src={scene6.reedRich}
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
					</AbsoluteFill>

					<AbsoluteFill style={{backgroundImage: vignette}} />

					<div
						style={{
							position: 'absolute',
							left: 70,
							top: 320,
							fontFamily: 'Georgia, "Times New Roman", serif',
							fontStyle: 'italic',
							fontSize: 76,
							color: '#f6f1e7',
							lineHeight: 1.25,
							textShadow:
								'0 4px 28px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
						}}
					>
						<div style={{opacity: lineB1}}>
							{isVietnamese ? 'Lời từ chối' : 'The most'}
						</div>
						<div style={{opacity: lineB2}}>
							{isVietnamese ? 'đắt giá nhất' : 'expensive'}
						</div>
						<div
							style={{
								opacity: lineB3,
								marginTop: 20,
								fontSize: 68,
								color: '#f6c445',
							}}
						>
							{isVietnamese ? 'trong lịch sử.' : 'in history.'}
						</div>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
