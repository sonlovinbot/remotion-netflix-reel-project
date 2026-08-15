import {AbsoluteFill, Img, interpolate} from 'remotion';
import {scene6} from '../assets';
import {useAuthoredFrame} from '../engine';

/**
 * Scene 6 — "This was the most expensive 'no' in history."
 *
 * The finale. Rich man at desk with money — full scene photo, not cut-out.
 * Grounded parallax push, text stacks, then holds. Sombre grade.
 *
 * 120 authored frames (~4s).
 */

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

export const Scene6: React.FC = () => {
	const frame = useAuthoredFrame(120);

	// --- parallax push ---
	const bgScale = interpolate(frame, [0, 120], [1.0, 1.1], {
		extrapolateRight: 'clamp',
		easing: easeOutQuad,
	});

	// --- focus hunt: slight blur clearing ---
	const focusBlur = interpolate(frame, [0, 12], [6, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- text: "The most / expensive" from f8, "in history." f40-48 ---
	const line1Op = interpolate(frame, [8, 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const line2Op = interpolate(frame, [16, 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const line3Op = interpolate(frame, [40, 48], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// --- vignette ---
	const vignette =
		'radial-gradient(ellipse 68% 60% at 50% 44%, transparent 30%, rgba(0,0,0,0.72) 100%)';

	// --- grade ---
	const grade = 'saturate(0.62) contrast(1.12) sepia(0.06) brightness(0.94)';

	return (
		<AbsoluteFill style={{backgroundColor: '#0E0E0E', filter: grade}}>
			{/* Full scene photo with parallax push */}
			<AbsoluteFill
				style={{
					transform: `scale(${bgScale})`,
					filter: focusBlur > 0.1 ? `blur(${focusBlur}px)` : undefined,
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

			{/* Vignette */}
			<AbsoluteFill style={{backgroundImage: vignette}} />

			{/* Text overlay */}
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
					textShadow: '0 4px 28px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
				}}
			>
				<div style={{opacity: line1Op}}>The most</div>
				<div style={{opacity: line2Op}}>expensive</div>
				<div style={{opacity: line3Op, marginTop: 20, fontSize: 68, color: '#f6c445'}}>
					in history.
				</div>
			</div>
		</AbsoluteFill>
	);
};
