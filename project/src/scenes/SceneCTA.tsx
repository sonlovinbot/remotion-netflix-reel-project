import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {sceneCTA} from '../assets';

/** 19.330958 seconds at 30fps, matching vo-cta.wav. */
export const CTA_DURATION = 580;

const clamp = {
	extrapolateLeft: 'clamp' as const,
	extrapolateRight: 'clamp' as const,
};

const PipelineChip: React.FC<{
	label: string;
	index: number;
	frame: number;
	fps: number;
}> = ({label, index, frame, fps}) => {
	const entrance = spring({
		frame: frame - (4.8 * fps + index * 0.48 * fps),
		fps,
		config: {damping: 15, stiffness: 130, mass: 0.8},
	});

	return (
		<div
			style={{
				opacity: entrance,
				transform: `translateY(${interpolate(entrance, [0, 1], [34, 0])}px) scale(${interpolate(entrance, [0, 1], [0.88, 1])})`,
				padding: '18px 28px',
				border: '2px solid rgba(246,196,69,0.72)',
				borderRadius: 999,
				backgroundColor: 'rgba(12,12,12,0.74)',
				color: index === 3 ? '#171006' : '#f7f0df',
				background: index === 3 ? '#f6c445' : 'rgba(12,12,12,0.78)',
				fontFamily: 'Arial, system-ui, sans-serif',
				fontSize: 28,
				fontWeight: 800,
				letterSpacing: 1.5,
				whiteSpace: 'nowrap',
				boxShadow: '0 12px 34px rgba(0,0,0,0.34)',
			}}
		>
			{label}
		</div>
	);
};

export const SceneCTA: React.FC = () => {
	const rawFrame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	// Choreography was designed on a readable 22-second timeline, then mapped
	// onto the exact CTA audio duration so the beats remain proportional.
	const frame = (rawFrame * 22 * fps) / durationInFrames;

	const cardIn = spring({
		frame: frame - 0.25 * fps,
		fps,
		config: {damping: 17, stiffness: 85, mass: 1},
	});
	const cardOpacity = interpolate(frame, [2.2 * fps, 3.1 * fps], [1, 0], clamp);
	const portraitOpacity = interpolate(
		frame,
		[2.35 * fps, 3.15 * fps],
		[0, 1],
		clamp,
	);
	const portraitScale = interpolate(
		frame,
		[2.3 * fps, 22 * fps],
		[1.09, 1.18],
		clamp,
	);
	const portraitX = interpolate(frame, [2.3 * fps, 22 * fps], [63, 60], clamp);

	const helloIn = spring({
		frame: frame - 1.0 * fps,
		fps,
		config: {damping: 18, stiffness: 100},
	});
	const helloOut = interpolate(frame, [3.8 * fps, 4.35 * fps], [1, 0], clamp);

	const pipelineOpacity = interpolate(
		frame,
		[4.35 * fps, 4.8 * fps, 9.2 * fps, 9.8 * fps],
		[0, 1, 1, 0],
		clamp,
	);
	const lineProgress = interpolate(
		frame,
		[5.1 * fps, 7.1 * fps],
		[0, 1],
		clamp,
	);

	const timeMessageIn = spring({
		frame: frame - 9.55 * fps,
		fps,
		config: {damping: 18, stiffness: 95},
	});
	const timeMessageOut = interpolate(
		frame,
		[14.0 * fps, 14.7 * fps],
		[1, 0],
		clamp,
	);
	const strikeProgress = interpolate(
		frame,
		[11.3 * fps, 12.1 * fps],
		[0, 1],
		clamp,
	);
	const replacementIn = spring({
		frame: frame - 12.05 * fps,
		fps,
		config: {damping: 13, stiffness: 150},
	});

	const ctaShade = interpolate(
		frame,
		[14.1 * fps, 15.1 * fps],
		[0.36, 0.78],
		clamp,
	);
	const ctaIn = spring({
		frame: frame - 14.65 * fps,
		fps,
		config: {damping: 17, stiffness: 92},
	});
	const buttonIn = spring({
		frame: frame - 17.1 * fps,
		fps,
		config: {damping: 12, stiffness: 145, mass: 0.85},
	});
	const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2 * 0.72) * 0.018;
	const ringProgress = interpolate(
		frame,
		[17.7 * fps, 19.0 * fps],
		[0, 1],
		clamp,
	);
	const fadeOut = interpolate(frame, [21.35 * fps, 22 * fps], [1, 0], clamp);

	return (
		<AbsoluteFill
			style={{backgroundColor: '#0b0a09', overflow: 'hidden', opacity: fadeOut}}
		>
			<Audio src={staticFile('assets/cta/vo-cta.wav')} />
			{/* Portrait crop takes over after the opening photo card. */}
			<AbsoluteFill style={{opacity: portraitOpacity}}>
				<Img
					src={sceneCTA.sonStudio}
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: `${portraitX}% center`,
						transform: `scale(${portraitScale})`,
						filter: 'saturate(0.82) contrast(1.05) brightness(0.8)',
					}}
				/>
				<AbsoluteFill
					style={{
						background:
							'linear-gradient(90deg, rgba(5,7,8,0.92) 0%, rgba(5,7,8,0.58) 43%, rgba(5,7,8,0.08) 75%), linear-gradient(0deg, rgba(5,5,5,0.72) 0%, transparent 48%)',
					}}
				/>
			</AbsoluteFill>

			{/* Opening card preserves the landscape photo and the microphone. */}
			<AbsoluteFill
				style={{opacity: cardOpacity, alignItems: 'center', paddingTop: 205}}
			>
				<div
					style={{
						width: 940,
						height: 525,
						overflow: 'hidden',
						border: '12px solid #eee4d2',
						boxShadow:
							'24px 28px 0 rgba(246,196,69,0.22), 0 40px 90px rgba(0,0,0,0.6)',
						transform: `translateY(${interpolate(cardIn, [0, 1], [130, 0])}px) rotate(${interpolate(cardIn, [0, 1], [-3.5, -1])}deg) scale(${interpolate(cardIn, [0, 1], [0.82, 1])})`,
						opacity: cardIn,
					}}
				>
					<Img
						src={sceneCTA.sonStudio}
						style={{width: '100%', height: '100%', objectFit: 'cover'}}
					/>
				</div>
			</AbsoluteFill>

			{/* Personal introduction. */}
			<div
				style={{
					position: 'absolute',
					left: 72,
					top: 850,
					opacity: helloIn * helloOut,
					transform: `translateY(${interpolate(helloIn, [0, 1], [45, 0])}px)`,
					color: '#f7f0df',
					textShadow: '0 8px 30px rgba(0,0,0,0.72)',
				}}
			>
				<div
					style={{
						fontFamily: 'Arial, system-ui, sans-serif',
						fontSize: 28,
						fontWeight: 800,
						letterSpacing: 7,
						color: '#f6c445',
						marginBottom: 18,
					}}
				>
					CHÀO BẠN
				</div>
				<div
					style={{
						fontFamily: 'Georgia, "Times New Roman", serif',
						fontStyle: 'italic',
						fontSize: 92,
						lineHeight: 1.02,
					}}
				>
					Mình là Sơn.
				</div>
			</div>

			{/* AI workflow. */}
			<div
				style={{
					position: 'absolute',
					left: 62,
					right: 62,
					top: 330,
					opacity: pipelineOpacity,
				}}
			>
				<div
					style={{
						fontFamily: 'Georgia, "Times New Roman", serif',
						fontStyle: 'italic',
						fontSize: 66,
						lineHeight: 1.12,
						color: '#f7f0df',
						maxWidth: 750,
						textShadow: '0 6px 30px rgba(0,0,0,0.85)',
					}}
				>
					Video này được tạo hoàn toàn bằng AI
				</div>
				<div
					style={{
						position: 'relative',
						marginTop: 55,
						display: 'flex',
						gap: 16,
					}}
				>
					{['Ý TƯỞNG', 'CHATGPT', 'SKILLS', 'VIDEO'].map((label, index) => (
						<PipelineChip
							key={label}
							label={label}
							index={index}
							frame={frame}
							fps={fps}
						/>
					))}
					<svg
						width="900"
						height="80"
						style={{
							position: 'absolute',
							left: 0,
							top: 50,
							overflow: 'visible',
						}}
					>
						<path
							d="M 28 28 C 210 75, 680 70, 875 26"
							fill="none"
							stroke="#f6c445"
							strokeWidth="4"
							strokeLinecap="round"
							strokeDasharray={`${lineProgress * 1100} 1100`}
						/>
					</svg>
				</div>
			</div>

			{/* Time-saving promise. */}
			<div
				style={{
					position: 'absolute',
					left: 68,
					top: 420,
					opacity: timeMessageIn * timeMessageOut,
					transform: `translateX(${interpolate(timeMessageIn, [0, 1], [-65, 0])}px)`,
					color: '#f7f0df',
					textShadow: '0 6px 30px rgba(0,0,0,0.86)',
				}}
			>
				<div
					style={{
						fontFamily: 'Georgia, serif',
						fontStyle: 'italic',
						fontSize: 70,
					}}
				>
					Không còn phải
				</div>
				<div
					style={{
						position: 'relative',
						display: 'inline-block',
						fontFamily: 'Arial, system-ui, sans-serif',
						fontSize: 66,
						fontWeight: 950,
						marginTop: 18,
						letterSpacing: -2,
					}}
				>
					MẤT NHIỀU THỜI GIAN
					<svg
						width="790"
						height="80"
						style={{
							position: 'absolute',
							left: -8,
							top: 4,
							overflow: 'visible',
						}}
					>
						<path
							d="M 5 46 Q 180 20 390 47 T 780 43"
							fill="none"
							stroke="#d71920"
							strokeWidth="12"
							strokeLinecap="round"
							strokeDasharray={`${strikeProgress * 950} 950`}
						/>
					</svg>
				</div>
				<div
					style={{
						marginTop: 38,
						fontFamily: 'Arial, system-ui, sans-serif',
						fontSize: 54,
						fontWeight: 900,
						color: '#171006',
						backgroundColor: '#f6c445',
						padding: '16px 28px',
						display: 'inline-block',
						transform: `rotate(-1.5deg) scale(${replacementIn})`,
						opacity: replacementIn,
						boxShadow: '12px 14px 0 rgba(0,0,0,0.46)',
					}}
				>
					NHANH HƠN VỚI AI
				</div>
			</div>

			{/* Final CTA. */}
			<AbsoluteFill
				style={{
					backgroundColor: `rgba(4,5,5,${ctaShade})`,
					opacity: interpolate(ctaIn, [0, 0.1, 1], [0, 1, 1]),
					padding: '285px 64px 0',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontFamily: 'Arial, system-ui, sans-serif',
						fontSize: 28,
						fontWeight: 800,
						letterSpacing: 6,
						color: '#f6c445',
						marginBottom: 25,
					}}
				>
					CHƯƠNG TRÌNH SẮP DIỄN RA
				</div>
				<div
					style={{
						fontFamily: 'Georgia, "Times New Roman", serif',
						fontStyle: 'italic',
						fontSize: 78,
						lineHeight: 1.12,
						color: '#f7f0df',
						maxWidth: 920,
						textShadow: '0 7px 38px rgba(0,0,0,0.92)',
						transform: `translateY(${interpolate(ctaIn, [0, 1], [55, 0])}px)`,
					}}
				>
					Bạn muốn tạo video
					<br />
					như thế này?
				</div>

				<div
					style={{
						position: 'relative',
						marginTop: 85,
						transform: `scale(${buttonIn * pulse})`,
						opacity: buttonIn,
					}}
				>
					<div
						style={{
							backgroundColor: '#f6c445',
							color: '#171006',
							borderRadius: 18,
							padding: '30px 54px',
							fontFamily: 'Arial, system-ui, sans-serif',
							fontSize: 43,
							fontWeight: 950,
							letterSpacing: 0.4,
							boxShadow:
								'0 18px 60px rgba(246,196,69,0.3), 14px 16px 0 rgba(0,0,0,0.5)',
						}}
					>
						THAM GIA ZOOM ONLINE
					</div>
					<svg
						width="850"
						height="180"
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%) rotate(-2deg)',
							overflow: 'visible',
							pointerEvents: 'none',
						}}
					>
						<ellipse
							cx="425"
							cy="90"
							rx="405"
							ry="72"
							fill="none"
							stroke="#f7f0df"
							strokeWidth="5"
							strokeLinecap="round"
							strokeDasharray={`${ringProgress * 2700} 2700`}
						/>
					</svg>
				</div>
				<div
					style={{
						marginTop: 60,
						fontFamily: 'Georgia, serif',
						fontStyle: 'italic',
						fontSize: 42,
						color: 'rgba(247,240,223,0.9)',
						opacity: interpolate(
							frame,
							[18.3 * fps, 19.0 * fps],
							[0, 1],
							clamp,
						),
					}}
				>
					Hẹn gặp bạn cùng Sơn!
				</div>
			</AbsoluteFill>

			{/* Projector-like warm reveal carried over from the documentary look. */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					width: 180,
					left: interpolate(frame, [0, 1.05 * fps], [-260, 1220], clamp),
					background:
						'linear-gradient(90deg, transparent, rgba(255,214,135,0.42), transparent)',
					filter: 'blur(20px)',
					transform: 'skewX(-8deg)',
					opacity: interpolate(
						frame,
						[0, 0.15 * fps, 0.95 * fps, 1.15 * fps],
						[0, 1, 1, 0],
						clamp,
					),
					mixBlendMode: 'screen',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
