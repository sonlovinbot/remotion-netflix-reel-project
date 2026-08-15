import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionWord} from './caption-data';
import {WORDS} from './caption-data';

/**
 * Karaoke captions — shows only the current phrase (2–3 words),
 * highlighted word by word. Clean and minimal.
 */

export const Captions: React.FC<{words?: CaptionWord[]}> = ({
	words = WORDS,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const timeSec = frame / fps;

	const activeIdx = words.findIndex(
		(w) => timeSec >= w.start && timeSec < w.end,
	);

	if (activeIdx < 0) return null;

	const active = words[activeIdx];

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 140,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				padding: '0 60px',
				fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
				fontSize: 56,
				fontWeight: 900,
				textTransform: 'uppercase',
				textAlign: 'center',
				color: '#f6c445',
				textShadow:
					'0 0 24px rgba(246,196,69,0.5), 0 4px 20px rgba(0,0,0,0.85)',
			}}
		>
			{active.word}
		</div>
	);
};
