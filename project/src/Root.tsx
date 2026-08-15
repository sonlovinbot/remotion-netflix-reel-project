import {Composition} from 'remotion';
import {
	FPS,
	HEIGHT,
	SCENES,
	STORY_DURATION_VI,
	TOTAL_DURATION,
	WIDTH,
	durationOf,
} from './engine';
import {withFilmLook} from './FilmLook';
import {Reel, ReelVI} from './Reel';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {CTA_DURATION, SceneCTA} from './scenes/SceneCTA';

const TOTAL_DURATION_VI = STORY_DURATION_VI + CTA_DURATION;

/**
 * Each scene is wrapped in the film look here, so previewing a scene on its own
 * shows exactly what lands in the final reel. `Reel` wraps its scenes the same
 * way — the treatment is never applied twice.
 */
const COMPONENTS = {
	Scene1: withFilmLook(Scene1),
	Scene2: withFilmLook(Scene2),
	Scene3: withFilmLook(Scene3),
	Scene4: withFilmLook(Scene4),
	Scene5: withFilmLook(Scene5),
};

/**
 * Seven compositions: one per scene so each can be built and previewed on its
 * own, plus `Reel` — the full 30s timeline.
 */
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Reel"
				component={Reel}
				durationInFrames={TOTAL_DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			<Composition
				id="ReelVI"
				component={ReelVI}
				durationInFrames={TOTAL_DURATION_VI}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			<Composition
				id="CTA"
				component={withFilmLook(SceneCTA)}
				durationInFrames={CTA_DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			{SCENES.map(({id}) => (
				<Composition
					key={id}
					id={id}
					component={COMPONENTS[id]}
					durationInFrames={durationOf(id)}
					fps={FPS}
					width={WIDTH}
					height={HEIGHT}
				/>
			))}
		</>
	);
};
