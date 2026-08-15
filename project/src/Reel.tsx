import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {WORDS_VI} from './caption-data-vi';
import {Captions} from './Captions';
import {SCENES, SCENES_VI, durationOf, durationOfVI} from './engine';
import {withFilmLook} from './FilmLook';
import {LanguageProvider, type ReelLanguage} from './language';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {CTA_DURATION, SceneCTA} from './scenes/SceneCTA';

/** Same wrapping as Root.tsx, so a scene looks identical solo and in sequence. */
const COMPONENTS = {
	Scene1: withFilmLook(Scene1),
	Scene2: withFilmLook(Scene2),
	Scene3: withFilmLook(Scene3),
	Scene4: withFilmLook(Scene4),
	Scene5: withFilmLook(Scene5),
};

const CTA = withFilmLook(SceneCTA);

/**
 * The main timeline — every scene laid end to end, in the order and at the
 * lengths declared in `SCENES`. Nothing here needs editing when you change a
 * scene's length; change it in `engine.ts` and both the standalone composition
 * and this timeline follow.
 */
const ReelTimeline: React.FC<{
	language: ReelLanguage;
	audio: string;
	vi?: boolean;
}> = ({language, audio, vi = false}) => {
	const scenes = vi ? SCENES_VI : SCENES;
	return (
		<LanguageProvider value={language}>
			<AbsoluteFill style={{backgroundColor: '#0E0E0E'}}>
				{/*
				 * The voiceover runs unbroken under the whole reel — it is the spine
				 * the cuts were measured against, so it must never be re-timed here.
				 * Scene lengths in `SCENES` come from this file's own silence gaps.
				 */}
				<Audio src={staticFile(audio)} />
				<Series>
					{scenes.map(({id}) => {
						const Component = COMPONENTS[id];
						return (
							<Series.Sequence
								key={id}
								durationInFrames={vi ? durationOfVI(id) : durationOf(id)}
							>
								<Component />
							</Series.Sequence>
						);
					})}
					{vi ? (
						<Series.Sequence durationInFrames={CTA_DURATION}>
							<CTA />
						</Series.Sequence>
					) : null}
				</Series>
				<Captions words={vi ? WORDS_VI : undefined} />
			</AbsoluteFill>
		</LanguageProvider>
	);
};

export const Reel: React.FC = () => (
	<ReelTimeline language="en" audio="assets/audio/vo.wav" />
);

export const ReelVI: React.FC = () => (
	<ReelTimeline language="vi" audio="assets/audio/vi-netflix-vo.wav" vi />
);
