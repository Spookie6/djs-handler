const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
	currency: 'USD',
	style: 'currency',
});

const DIVISIONS = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' },
];

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
	notation: 'compact',
});

const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat('en', {
	numeric: 'auto',
});

/* ___________________________ */

const util = {
	randomNumberBetween: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	sleep: (duration) => {
		return new Promise((resolve) => {
			setTimeout(resolve, duration);
		});
	},
	memoize: (cb) => {
		const cache = new Map();
		return (...args) => {
			const key = JSON.stringify(args);
			if (cache.has(key)) return cache.get(key);

			const result = cb(...args);
			cache.set(key, result);
			return result;
		};
	},
	rgbToHex: (r, g, b) => {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	},
	randomHex: () => {
		return `#${Math.floor(Math.random() * 0xffffff)
			.toString(16)
			.padEnd(6, '0')}`;
	},
	dayDif: (date1, date2) => {
		return Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000);
	},
	isWeekday: (date) => {
		return date.getDay() % 6 !== 0;
	},
	celsiusToFahrenheit: (celsius) => {
		return (celsius * 9) / 5 + 32;
	},
	fahrenheitToCelsius: (fahrenheit) => {
		return ((fahrenheit - 32) * 5) / 9;
	},
	timeFromDate: (date) => {
		return date.toTimeString().slice(0, 8);
	},
	stringReverse: (str) => {
		return str.split('').reverse().join('');
	},
	capitalize: (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	dayOfYear: (date) => {
		return Math.floor(
			(date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
		);
	},
	randomBoolean: () => {
		return Math.random() >= 0.5;
	},
	isValidDate: (...val) => {
		return !Number.isNaN(new Date(...val).valueOf());
	},
};

const array = {
	first: (array, n = 1) => {
		if (n === 1) return array[0];
		return array.filter((_, index) => index < n);
	},
	last: (array, n = 1) => {
		if (n === 1) return array[array.length - 1];
		return array.filter((_, index) => array.length - index <= n);
	},
	random: (array) => {
		return array[randomNumberBetween(0, array.length - 1)];
	},
	pluck: (array, key) => {
		return array.map((element) => element[key]);
	},
	groupBy: (array, key) => {
		return array.reduce((group, element) => {
			const keyValue = element[key];
			return { ...group, [keyValue]: [...(group[keyValue] ?? []), element] };
		}, {});
	},
	shuffle: (array) => {
		array.sort(() => 0.5 - Math.random());
	},
	average: (array) => {
		array.reduce((a, b) => a + b) / array.length;
	},
};

const format = {
	currency: (number) => {
		return CURRENCY_FORMATTER.format(number);
	},
	number: (number) => {
		return NUMBER_FORMATTER.format(number);
	},
	compactNumber: (number) => {
		return COMPACT_NUMBER_FORMATTER.format(number);
	},
	relativeDate: (toDate, fromDate = new Date()) => {
		let duration = (toDate - fromDate) / 1000;

		for (let i = 0; i <= DIVISIONS.length; i++) {
			const division = DIVISIONS[i];
			if (Math.abs(duration) < division.amount) {
				return RELATIVE_DATE_FORMATTER.format(
					Math.round(duration),
					division.name
				);
			}
			duration /= division.amount;
		}
	},
};

module.exports = { util, array, format };
