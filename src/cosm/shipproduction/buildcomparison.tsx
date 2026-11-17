import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { COSM_PREBUILT_BUILDS } from "./data/cosmprebuilts";
import { calculateCxPartsCost } from "./utils/pricing";
import { useGlobalData } from "../../context/globaldatacontext";

interface BuildComparisonProps {
	isMobile: boolean;
	onSelectBuild: (buildId: string) => void;
}

const headerStyle = {
	color: "rgba(255,255,255,0.55)",
	fontWeight: "bold",
	fontSize: "11px",
	textTransform: "uppercase" as const,
	borderBottom: "1px solid rgba(255,255,255,0.08)",
	whiteSpace: "nowrap" as const,
};

const cellStyle = {
	color: "white",
	fontSize: "12.5px",
	borderBottom: "1px solid rgba(255,255,255,0.04)",
};

const BuildComparison: React.FC<BuildComparisonProps> = ({
	isMobile,
	onSelectBuild,
}) => {
	const { marketData } = useGlobalData();
	const [cxUpdatedAt, setCxUpdatedAt] = useState<number | null>(null);

	useEffect(() => {
		if (marketData && Object.keys(marketData).length > 0) {
			setCxUpdatedAt(Date.now());
		}
	}, [marketData]);

	const rows = useMemo(
		() =>
			COSM_PREBUILT_BUILDS.map((build) => {
				const cx = calculateCxPartsCost(
					build.parts,
					marketData,
					build.hullPlatesExcluded ? ["LHP"] : [],
				);
				return { build, cx: Math.round(cx.total) };
			}),
		[marketData],
	);

	const formatDiff = (diff: number, cx: number) => {
		const sign = diff < 0 ? "−" : "+";
		const pct = cx > 0 ? Math.abs((diff / cx) * 100) : 0;
		return `${sign}₳${Math.abs(diff).toLocaleString()} (${pct.toFixed(0)}%)`;
	};

	const cxLabel = cxUpdatedAt
		? `CX prices updated ${new Date(cxUpdatedAt).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`
		: "CX prices not loaded yet";

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
				gap: 1,
			}}
		>
			<Typography
				variant="caption"
				sx={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}
			>
				Click a build to open it in the Ship Builder. Negative differences mean
				COSM is cheaper than buying the parts on the CX.
			</Typography>

			<Paper
				sx={{
					flexGrow: 1,
					minHeight: 0,
					background: "rgba(30, 29, 45, 0.4)",
					borderRadius: "12px",
					border: "1px solid rgba(255,255,255,0.08)",
					overflow: "hidden",
				}}
			>
				<TableContainer sx={{ maxHeight: "100%", overflow: "auto" }}>
					<Table
						size="small"
						stickyHeader
						sx={{ minWidth: isMobile ? 760 : 0 }}
					>
						<TableHead>
							<TableRow>
								<TableCell sx={headerStyle}>Build</TableCell>
								<TableCell sx={{ ...headerStyle, textAlign: "right" }}>
									Public
								</TableCell>
								<TableCell sx={{ ...headerStyle, textAlign: "right" }}>
									Corp
								</TableCell>
								<TableCell sx={{ ...headerStyle, textAlign: "right" }}>
									CX now
								</TableCell>
								<TableCell sx={{ ...headerStyle, textAlign: "right" }}>
									Public − CX
								</TableCell>
								<TableCell sx={{ ...headerStyle, textAlign: "right" }}>
									Corp − CX
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(({ build, cx }) => {
								const corpPrice = build.priceCorp ?? build.price;
								const publicDiff = build.price - cx;
								const corpDiff = corpPrice - cx;

								return (
									<TableRow
										key={build.id}
										hover
										onClick={() => onSelectBuild(build.id)}
										sx={{ cursor: "pointer" }}
									>
										<TableCell sx={cellStyle}>
											{build.name}
											{build.hullPlatesExcluded && (
												<>
													<Typography
														component="span"
														sx={{
															ml: 0.5,
															fontSize: "10px",
															color: "rgba(255,255,255,0.4)",
														}}
													>
														(no hull plates)
													</Typography>
													<Typography
														component="div"
														sx={{
															fontSize: "10px",
															color: "#ff9800",
															mt: 0.2,
														}}
													>
														Kit contents — reuses starter components
													</Typography>
												</>
											)}
										</TableCell>
										<TableCell
											sx={{
												...cellStyle,
												textAlign: "right",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											₳{build.price.toLocaleString()}
										</TableCell>
										<TableCell
											sx={{
												...cellStyle,
												textAlign: "right",
												fontWeight: "bold",
												color: "#4caf50",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											₳{corpPrice.toLocaleString()}
										</TableCell>
										<TableCell
											sx={{
												...cellStyle,
												textAlign: "right",
												color: "#2196f3",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											₳{cx.toLocaleString()}
										</TableCell>
										<TableCell
											sx={{
												...cellStyle,
												textAlign: "right",
												color: publicDiff <= 0 ? "#10b981" : "#ff9800",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{formatDiff(publicDiff, cx)}
										</TableCell>
										<TableCell
											sx={{
												...cellStyle,
												textAlign: "right",
												color: corpDiff <= 0 ? "#10b981" : "#ff9800",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{formatDiff(corpDiff, cx)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			<Typography
				variant="caption"
				sx={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}
			>
				{cxLabel}. CX is the live IC1 parts cost; it excludes build time and
				logistics. The Starter row is the kit contents; the finished ship reuses
				the starter's existing components.
			</Typography>
		</Box>
	);
};

export default BuildComparison;
