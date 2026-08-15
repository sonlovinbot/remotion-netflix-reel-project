/**
 * Word-level timestamps from Groq Whisper (whisper-large-v3-turbo).
 * Times are in seconds, relative to the start of vo.wav.
 *
 * Used by a `<Captions>` component that highlights the current word
 * based on the global timeline frame.
 */

export interface CaptionWord {
	word: string;
	start: number;
	end: number;
}

export const WORDS: CaptionWord[] = [
	{word: 'In', start: 0.32, end: 0.44},
	{word: '2000,', start: 0.44, end: 1.44},
	{word: 'a', start: 1.44, end: 1.54},
	{word: 'small', start: 1.54, end: 1.88},
	{word: 'startup', start: 1.88, end: 2.28},
	{word: 'called', start: 2.28, end: 2.72},
	{word: 'Netflix', start: 2.72, end: 3.14},
	{word: 'pitched', start: 3.14, end: 3.86},
	{word: 'Blockbuster', start: 3.86, end: 4.44},
	{word: 'to', start: 4.44, end: 4.72},
	{word: 'buy', start: 4.72, end: 4.92},
	{word: 'them', start: 4.92, end: 5.06},
	{word: 'out.', start: 5.06, end: 5.52},
	{word: 'They', start: 5.88, end: 6.08},
	{word: 'asked', start: 6.08, end: 6.48},
	{word: 'for', start: 6.48, end: 6.72},
	{word: '$50', start: 6.72, end: 7.1},
	{word: 'million.', start: 7.1, end: 7.94},
	{word: 'Blockbuster', start: 8.42, end: 9.0},
	{word: 'laughed', start: 9.0, end: 9.44},
	{word: 'them', start: 9.44, end: 9.66},
	{word: 'out', start: 9.66, end: 9.82},
	{word: 'of', start: 9.82, end: 9.94},
	{word: 'the', start: 9.94, end: 10.08},
	{word: 'room.', start: 10.08, end: 10.26},
	{word: 'So', start: 11.16, end: 11.44},
	{word: 'Netflix', start: 11.44, end: 11.98},
	{word: 'built', start: 11.98, end: 12.34},
	{word: 'the', start: 12.34, end: 12.48},
	{word: 'opposite.', start: 12.48, end: 12.82},
	{word: 'No', start: 13.4, end: 13.6},
	{word: 'late', start: 13.6, end: 13.84},
	{word: 'fees,', start: 13.84, end: 14.22},
	{word: 'no', start: 14.22, end: 14.64},
	{word: 'stores,', start: 14.64, end: 15.52},
	{word: 'customer', start: 15.52, end: 15.86},
	{word: 'first.', start: 15.86, end: 16.78},
	{word: 'Ten', start: 17.18, end: 17.34},
	{word: 'years', start: 17.34, end: 17.66},
	{word: 'later,', start: 17.66, end: 18.34},
	{word: 'Blockbuster', start: 18.34, end: 18.82},
	{word: 'closed', start: 18.82, end: 19.18},
	{word: 'down', start: 19.18, end: 19.42},
	{word: '1,000', start: 19.42, end: 19.94},
	{word: 'stores', start: 19.94, end: 20.34},
	{word: 'and', start: 20.34, end: 20.74},
	{word: 'declared', start: 20.74, end: 21.1},
	{word: 'bankruptcy.', start: 21.1, end: 21.58},
	{word: 'Today,', start: 22.48, end: 23.08},
	{word: 'Netflix', start: 23.08, end: 23.5},
	{word: 'drives', start: 23.5, end: 23.86},
	{word: '$45', start: 23.86, end: 24.42},
	{word: 'billion', start: 24.42, end: 24.96},
	{word: 'a', start: 24.96, end: 25.58},
	{word: 'year', start: 25.58, end: 25.86},
	{word: 'in', start: 25.86, end: 26.12},
	{word: 'revenue,', start: 26.12, end: 26.7},
	{word: 'the', start: 26.92, end: 27.06},
	{word: 'biggest', start: 27.06, end: 27.48},
	{word: 'paid', start: 27.48, end: 27.88},
	{word: 'streaming', start: 27.88, end: 28.16},
	{word: 'service', start: 28.16, end: 28.56},
	{word: 'on', start: 28.56, end: 28.84},
	{word: 'Earth.', start: 28.84, end: 29.04},
	{word: 'This', start: 29.86, end: 30.02},
	{word: 'was', start: 30.02, end: 30.4},
	{word: 'the', start: 30.4, end: 30.56},
	{word: 'most', start: 30.56, end: 30.72},
	{word: 'expensive', start: 30.72, end: 31.3},
	{word: 'no', start: 31.3, end: 31.7},
	{word: 'in', start: 31.7, end: 32.14},
	{word: 'history.', start: 32.14, end: 32.54},
];

/**
 * Scene boundaries in seconds (cumulative), matching SCENES in engine.ts.
 * Scene N's words are those with start >= SCENE_BOUNDARIES[N-1] and
 * start < SCENE_BOUNDARIES[N].
 */
export const SCENE_BOUNDARIES = [
	0,        // scene 1 starts
	5.733,    // scene 2 starts (172 / 30)
	10.667,   // scene 3 starts (320 / 30)
	16.700,   // scene 4 starts (501 / 30)
	22.200,   // scene 5 starts (666 / 30) — covers old scenes 5+6
	33.0,     // end
];

/** Get words that belong to a specific scene (1-indexed). */
export const wordsForScene = (scene: number): CaptionWord[] =>
	WORDS.filter(
		(w) => w.start >= SCENE_BOUNDARIES[scene - 1] && w.start < SCENE_BOUNDARIES[scene],
	);
