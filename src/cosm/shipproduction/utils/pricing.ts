import { MATERIAL_SPECS } from "./constants";

/**
 * Static fallback prices, keyed by the part ticker used in ship build BOMs.
 * These are the values already embedded in the ship builder; they are only
 * used when the live market feed has no usable price for a ticker.
 */
const FALLBACK_CX_PRICES: Record<string, number> = Object.values(
	MATERIAL_SPECS,
).reduce(
	(acc, spec) => {
		acc[spec.ticker] = spec.cxPrice;
		return acc;
	},
	{} as Record<string, number>,
);

export interface CxUnitPrice {
	price: number;
	source: "live" | "estimate" | "missing";
}

/**
 * Resolve a ticker's CX unit price. Prefers the IC1 ask, then IC1 average,
 * then any exchange's ask/average, then the built-in static estimate.
 */
export const getCxUnitPrice = (
	ticker: string,
	marketData?: Record<string, any>,
): CxUnitPrice => {
	const row = marketData?.[ticker] ?? marketData?.[ticker.toUpperCase()];
	if (row) {
		const ic1Ask = Number(row["IC1-AskPrice"]);
		if (ic1Ask > 0) return { price: ic1Ask, source: "live" };

		const ic1Average = Number(row["IC1-Average"]);
		if (ic1Average > 0) return { price: ic1Average, source: "live" };

		for (const [key, value] of Object.entries(row)) {
			if (/askprice$/i.test(key) && Number(value) > 0) {
				return { price: Number(value), source: "live" };
			}
		}
		for (const [key, value] of Object.entries(row)) {
			if (/average$/i.test(key) && Number(value) > 0) {
				return { price: Number(value), source: "live" };
			}
		}
	}

	const fallback = FALLBACK_CX_PRICES[ticker];
	if (fallback && fallback > 0) {
		return { price: fallback, source: "estimate" };
	}

	return { price: 0, source: "missing" };
};

export interface CxPartsCost {
	total: number;
	estimatedCount: number;
	missingCount: number;
	lines: { ticker: string; quantity: number; unitPrice: number; source: string }[];
}

/**
 * Total the CX cost of a build's bill of materials.
 * `excludedTickers` lets a build omit parts that are not included in its price
 * (for example, the starter kit is sold without hull plates).
 */
export const calculateCxPartsCost = (
	parts: { name: string; quantity: number }[],
	marketData?: Record<string, any>,
	excludedTickers: string[] = [],
): CxPartsCost => {
	let total = 0;
	let estimatedCount = 0;
	let missingCount = 0;
	const lines: CxPartsCost["lines"] = [];

	parts.forEach((part) => {
		if (excludedTickers.includes(part.name)) return;

		const unit = getCxUnitPrice(part.name, marketData);
		if (unit.source === "estimate") estimatedCount += 1;
		if (unit.source === "missing") missingCount += 1;
		total += unit.price * part.quantity;

		lines.push({
			ticker: part.name,
			quantity: part.quantity,
			unitPrice: unit.price,
			source: unit.source,
		});
	});

	return { total, estimatedCount, missingCount, lines };
};
