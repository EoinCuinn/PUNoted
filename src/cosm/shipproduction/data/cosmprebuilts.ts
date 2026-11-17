/**
 * COSM Aerospace Products — standard prebuilt ship templates.
 *
 * `price` is the public COSM price from the Discord shipbuilding channel.
 * `priceCorp` is the current corp-member pricing list.
 * The CX side of the comparison is calculated live from part prices.
 * VCB STL is not on the Discord list, so its public price uses the order form.
 * Bills of materials come from the schematic images on the COSM order form.
 */
export interface CosmPrebuiltPart {
	name: string;
	quantity: number;
}

export interface CosmPrebuiltBuild {
	id: string;
	name: string;
	price: number;
	priceCorp?: number;
	parts: CosmPrebuiltPart[];
	/** Blueprint choices, so the builder's stats and spec panel match the BOM. */
	selections?: Record<string, string>;
	/** The starter kit is sold without hull plates; the buyer supplies BHP or LHP. */
	hullPlatesExcluded?: boolean;
	shipClass: "REGULAR" | "COLONY_SHIP";
}

const makeSelections = (
	overrides: Record<string, string>,
): Record<string, string> => ({
	STL_ENGINE: "STL_ENGINE_STANDARD",
	STL_FUEL_TANK: "STL_FUEL_TANK_SMALL",
	FTL_REACTOR: "NONE",
	FTL_FUEL_TANK: "NONE",
	VORTEX_REACTOR: "NONE",
	VORTEX_FUEL_TANK: "NONE",
	CARGO_BAY: "CARGO_BAY_SMALL",
	HULL_TYPE: "HULL_PLATES_BASIC",
	HEAT_SHIELD: "NONE",
	WHIPPLE_SHIELD: "NONE",
	GRAVITY_SHIELD: "NONE",
	RADIATION_SHIELD: "NONE",
	REPAIR_DRONES: "NONE",
	HIGH_G_SEATS: "NONE",
	...overrides,
});

export const COSM_PREBUILT_BUILDS: CosmPrebuiltBuild[] = [
	{
		id: "cosm-starter-wcb",
		name: "Starter Ship WCB Upgrade",
		price: 1_160_000,
		priceCorp: 900_000,
		shipClass: "REGULAR",
		hullPlatesExcluded: true,
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_STANDARD",
			STL_FUEL_TANK: "STL_FUEL_TANK_MEDIUM",
			FTL_REACTOR: "FTL_REACTOR_STANDARD",
			FTL_FUEL_TANK: "FTL_FUEL_TANK_LARGE",
			CARGO_BAY: "CARGO_BAY_HIGH_LOAD",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		// Kit contents only. The starter ship's existing bridge, crew quarters,
		// engine, FFC, emitters, reactor, and 46 SSC are reused; hull plates are
		// not included. Source: COSM's shipbuilding sheet.
		parts: [
			{ name: "WCB", quantity: 1 },
			{ name: "LFE", quantity: 1 },
			{ name: "LFL", quantity: 1 },
			{ name: "MSL", quantity: 1 },
			{ name: "SSC", quantity: 32 },
		],
	},
	{
		id: "cosm-wcb-stl",
		name: "WCB (STL only)",
		price: 3_050_000,
		priceCorp: 2_350_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			CARGO_BAY: "CARGO_BAY_HIGH_LOAD",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BRS", quantity: 1 },
			{ name: "CQS", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "WCB", quantity: 1 },
			{ name: "LHP", quantity: 60 },
			{ name: "SSC", quantity: 65 },
			{ name: "SSL", quantity: 1 },
		],
	},
	{
		id: "cosm-lcb-stl",
		name: "LCB (STL only)",
		price: 3_450_000,
		priceCorp: 2_650_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			CARGO_BAY: "CARGO_BAY_LARGE",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BRS", quantity: 1 },
			{ name: "CQM", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "LCB", quantity: 1 },
			{ name: "LHP", quantity: 87 },
			{ name: "SSC", quantity: 115 },
			{ name: "SSL", quantity: 1 },
		],
	},
	{
		id: "cosm-vcb-stl",
		name: "VCB (STL only)",
		// Not listed on Discord; public figure from the order form.
		price: 3_850_000,
		priceCorp: 3_050_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			CARGO_BAY: "CARGO_BAY_HIGH_VOLUME",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BRS", quantity: 1 },
			{ name: "CQL", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "VCB", quantity: 1 },
			{ name: "LHP", quantity: 111 },
			{ name: "SSC", quantity: 186 },
			{ name: "SSL", quantity: 1 },
		],
	},
	{
		id: "cosm-wcb-ftl",
		name: "WCB (FTL-equipped)",
		price: 5_100_000,
		priceCorp: 4_000_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			STL_FUEL_TANK: "STL_FUEL_TANK_MEDIUM",
			FTL_REACTOR: "FTL_REACTOR_QUICK_CHARGE",
			FTL_FUEL_TANK: "FTL_FUEL_TANK_LARGE",
			CARGO_BAY: "CARGO_BAY_HIGH_LOAD",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BR1", quantity: 1 },
			{ name: "CQS", quantity: 1 },
			{ name: "FFC", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "LFE", quantity: 1 },
			{ name: "LFL", quantity: 1 },
			{ name: "LHP", quantity: 68 },
			{ name: "MFE", quantity: 2 },
			{ name: "MSL", quantity: 1 },
			{ name: "QCR", quantity: 1 },
			{ name: "SFE", quantity: 1 },
			{ name: "SSC", quantity: 78 },
			{ name: "WCB", quantity: 1 },
		],
	},
	{
		id: "cosm-lcb-ftl",
		name: "LCB (FTL-equipped)",
		price: 5_650_000,
		priceCorp: 4_375_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			STL_FUEL_TANK: "STL_FUEL_TANK_MEDIUM",
			FTL_REACTOR: "FTL_REACTOR_QUICK_CHARGE",
			FTL_FUEL_TANK: "FTL_FUEL_TANK_LARGE",
			CARGO_BAY: "CARGO_BAY_LARGE",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BR1", quantity: 1 },
			{ name: "CQM", quantity: 1 },
			{ name: "FFC", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "LCB", quantity: 1 },
			{ name: "LFE", quantity: 2 },
			{ name: "LFL", quantity: 1 },
			{ name: "LHP", quantity: 94 },
			{ name: "MFE", quantity: 2 },
			{ name: "MSL", quantity: 1 },
			{ name: "QCR", quantity: 1 },
			{ name: "SFE", quantity: 1 },
			{ name: "SSC", quantity: 128 },
		],
	},
	{
		id: "cosm-vcb-ftl",
		name: "VCB (FTL-equipped)",
		price: 6_300_000,
		priceCorp: 4_900_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			STL_FUEL_TANK: "STL_FUEL_TANK_MEDIUM",
			FTL_REACTOR: "FTL_REACTOR_QUICK_CHARGE",
			FTL_FUEL_TANK: "FTL_FUEL_TANK_LARGE",
			CARGO_BAY: "CARGO_BAY_HIGH_VOLUME",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BR1", quantity: 1 },
			{ name: "CQL", quantity: 1 },
			{ name: "FFC", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "VCB", quantity: 1 },
			{ name: "LFE", quantity: 3 },
			{ name: "LFL", quantity: 1 },
			{ name: "LHP", quantity: 117 },
			{ name: "MFE", quantity: 2 },
			{ name: "MSL", quantity: 1 },
			{ name: "QCR", quantity: 1 },
			{ name: "SFE", quantity: 1 },
			{ name: "SSC", quantity: 178 },
		],
	},
	{
		id: "cosm-hcb-ftl",
		name: "HCB (FTL-equipped)",
		price: 10_000_000,
		priceCorp: 7_450_000,
		shipClass: "REGULAR",
		selections: makeSelections({
			STL_ENGINE: "STL_ENGINE_FUEL_SAVING",
			STL_FUEL_TANK: "STL_FUEL_TANK_MEDIUM",
			FTL_REACTOR: "FTL_REACTOR_QUICK_CHARGE",
			FTL_FUEL_TANK: "FTL_FUEL_TANK_LARGE",
			CARGO_BAY: "CARGO_BAY_HUGE",
			HULL_TYPE: "HULL_PLATES_LIGHTWEIGHT",
		}),
		parts: [
			{ name: "BR1", quantity: 1 },
			{ name: "CQL", quantity: 1 },
			{ name: "FFC", quantity: 1 },
			{ name: "FSE", quantity: 1 },
			{ name: "HCB", quantity: 1 },
			{ name: "LFE", quantity: 5 },
			{ name: "LFL", quantity: 1 },
			{ name: "LHP", quantity: 157 },
			{ name: "MFE", quantity: 2 },
			{ name: "MSL", quantity: 1 },
			{ name: "QCR", quantity: 1 },
			{ name: "SFE", quantity: 1 },
			{ name: "SSC", quantity: 278 },
		],
	},
];

/** Match a build to a database preset by hull class and STL/FTL mode. */
export const presetIdentity = (name: string): string => {
	const lower = name.toLowerCase();
	if (lower.includes("starter")) return "starter";
	const hull = lower.match(/\b(wcb|lcb|vcb|hcb)\b/)?.[1] ?? lower;
	const mode = lower.includes("ftl") ? "ftl" : "stl";
	return `${hull}-${mode}`;
};
