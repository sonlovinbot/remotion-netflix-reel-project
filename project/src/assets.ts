import {staticFile} from 'remotion';

/**
 * Every image used by the reel, in one place.
 *
 * Files under `shared/` are used by two or more scenes — reference them from
 * here rather than copying them into a scene folder.
 *
 * Cut-outs are transparent PNGs (already background-removed and tight-cropped);
 * everything else is a full-bleed JPG/PNG that keeps its own background.
 */

export const shared = {
	/** Beige paper texture — scene 1 + 2 backdrop. 5466x3644 */
	paper: staticFile('assets/shared/bg_paper.jpg'),
	/** Black paper texture — scene 4 + 6 backdrop. 5304x8000 */
	black: staticFile('assets/shared/bg_black.jpg'),
	/** Synthetic monochrome film grain, seamlessly tileable. 2048x2048 */
	grain: staticFile('assets/shared/grain.jpg'),
	/** Desaturated peeling-paint wear, for the colour-burn pass. 2048x2048 */
	grunge: staticFile('assets/shared/grunge.jpg'),
	/** Netflix "N" mark, vector. Scene 2 + 3 */
	netflixN: staticFile('assets/shared/logo_netflix_n.svg'),
	/** Netflix wordmark. Scene 5 + 6 end card. 2226x678 */
	netflixWord: staticFile('assets/shared/logo_netflix_word.png'),
	/** Blockbuster logo, vector. Composited onto the blank store sign, and
	 *  tiled 10x10 for the scene 4 lights-out grid. */
	blockbuster: staticFile('assets/shared/logo_blockbuster.svg'),
} as const;

export const scene1 = {
	/** Video store at night. The sign panel is deliberately BLANK — composite
	 *  `shared.blockbuster` onto it rather than looking for a branded photo. */
	store: staticFile('assets/scene1/store.png'),
	/** Reed at 39, before the money. Cut-out, 734x1518 */
	reedYoung: staticFile('assets/scene1/reed-young.png'),
	/**
	 * Ornate gilt frame, white keyed to transparent both outside AND through the
	 * opening, so the photo shows through the middle. Portrait, 1024x1536.
	 *
	 * Measured opening, as a fraction of the PNG: 60.64% wide x 71.35% tall,
	 * centred, aspect 0.567 — near enough to the reel's own 0.5625 that the
	 * photo welds into it with a single uniform scale. `OPENING` in Scene1.tsx
	 * encodes these numbers; re-measure if this file is ever regenerated.
	 */
	goldFrame: staticFile('assets/scene1/gold-frame.png'),
	/** Wispy cirrus on pure black — composite with mixBlendMode screen. */
	cloud1: staticFile('assets/scene1/cloud1.png'),
	/** Denser low cloud on pure black, drifts at 0.6x for parallax. */
	cloud2: staticFile('assets/scene1/cloud2.png'),
} as const;

export const scene2 = {
	/** The exec mid-laugh. Cut-out, 1012x1491 */
	bossLaughing: staticFile('assets/scene2/boss-laughing.png'),
	/** Library-turned-vault. LANDSCAPE 3:2 — do not centre-crop to vertical or
	 *  the money shelves fall outside the frame. Sit it in the upper half and
	 *  run the $50,000,000 counter over the lower half. */
	moneyRoom: staticFile('assets/scene2/money-room.png'),
	/** Open palm entering from the left, empty — the Netflix logo sits on it. Cut-out, 1273x391 */
	handLogo: staticFile('assets/scene2/hand-logo.png'),
	/** Fist gripping a brick of hundreds, entering from the right. Cut-out, 1445x524 */
	handCash: staticFile('assets/scene2/hand-cash.png'),
	/**
	 * Cigar smoke plume on pure black. A still, not the smoke.mp4 the brief
	 * asked for — composite with mixBlendMode screen so the black drops out,
	 * then rise, drift and dissipation are animated in code.
	 */
	smoke: staticFile('assets/scene2/smoke.png'),
} as const;

export const scene3 = {
	/** Front pages. Cut-outs, ~1000x1500 each. Same masthead on all three so the
	 *  run reads as one manifesto rather than three separate news reactions. */
	newsLateFees: staticFile('assets/scene3/news-late-fees.png'),
	newsNoStores: staticFile('assets/scene3/news-no-stores.png'),
	newsCustomerFirst: staticFile('assets/scene3/news-customer-first.png'),
	/** Wooden desk the papers land on. 3264x4896 */
	desk: staticFile('assets/scene3/desk.jpg'),
} as const;

export const scene4 = {
	/** The same exec from scene 2, ten years on. Cut-out, 870x1467 */
	bossDefeated: staticFile('assets/scene4/boss-defeated.png'),
	closedSign: staticFile('assets/scene4/closed-sign.jpg'),
	chainLock: staticFile('assets/scene4/chain-lock.jpg'),
} as const;

export const scene5 = {
	/** The same Reed from scene 1, ten years on. Cut-out, 846x1490 */
	reedTriumph: staticFile('assets/scene5/reed-triumph.png'),
	/** Red dot-globe already on pure black — composite additively, no key needed. */
	globe: staticFile('assets/scene5/globe.png'),
} as const;

export const scene6 = {
	/** Man at luxurious desk with money — the payoff shot. Full scene, not cut-out. */
	reedRich: staticFile('assets/scene6/reed-rich-v2.png'),
} as const;

export const sceneCTA = {
	/** Sơn in the recording studio. Landscape source, used as card and portrait crop. */
	sonStudio: staticFile('assets/cta/son-studio.jpeg'),
} as const;

/** Scene 6 is typography over `shared.black` plus `shared.netflixWord`. */
export const assets = {
	shared,
	scene1,
	scene2,
	scene3,
	scene4,
	scene5,
	sceneCTA,
} as const;
