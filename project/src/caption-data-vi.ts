import type {CaptionWord} from './caption-data';

const timedWords = (
	text: string,
	start: number,
	end: number,
): CaptionWord[] => {
	const words = text.split(' ');
	const weights = words.map((word) =>
		Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, '').length),
	);
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	let cursor = start;

	return words.map((word, index) => {
		const wordStart = cursor;
		const wordEnd =
			index === words.length - 1
				? end
				: cursor + ((end - start) * weights[index]) / totalWeight;
		cursor = wordEnd;
		return {word, start: wordStart, end: wordEnd};
	});
};

/**
 * Vietnamese caption timing follows the spoken phrases and detected pauses in
 * vi-netflix-vo.wav. Words inside a continuous phrase are weighted by length,
 * keeping every scene cut and caption gap aligned with the actual narration.
 */
export const WORDS_VI: CaptionWord[] = [
	...timedWords('Năm 2000,', 0.307, 0.968),
	...timedWords('một startup nhỏ tên Netflix', 1.314, 2.986),
	...timedWords('đã đề nghị Blockbuster mua lại họ.', 3.27, 5.214),
	...timedWords('Mức giá chỉ là 50 triệu đô.', 6.0, 7.852),
	...timedWords('Nhưng Blockbuster đã cười nhạo', 8.48, 10.113),
	...timedWords('và đuổi họ khỏi phòng.', 10.354, 11.616),
	...timedWords('Vì vậy,', 12.269, 12.645),
	...timedWords(
		'Netflix xây dựng một mô hình hoàn toàn ngược lại:',
		12.976,
		15.471,
	),
	...timedWords('không phí trả muộn,', 16.03, 16.939),
	...timedWords('không cửa hàng,', 17.319, 18.018),
	...timedWords('khách hàng là ưu tiên số một.', 18.405, 19.988),
	...timedWords('Mười năm sau,', 20.866, 21.564),
	...timedWords('Blockbuster đóng cửa hàng nghìn chi nhánh', 21.849, 23.905),
	...timedWords('và tuyên bố phá sản.', 24.109, 25.304),
	...timedWords('Ngày nay,', 25.856, 26.297),
	...timedWords('Netflix tạo ra 45 tỷ đô doanh thu mỗi năm,', 26.558, 29.285),
	...timedWords(
		'trở thành nền tảng streaming lớn nhất thế giới.',
		29.631,
		31.762,
	),
	...timedWords(
		'Đó chính là lời từ chối đắt giá nhất trong lịch sử.',
		32.389,
		34.896,
	),
];
