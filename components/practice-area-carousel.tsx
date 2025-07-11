import "@glidejs/glide/dist/css/glide.core.min.css";
import { useEffect, useRef } from "react";
import Glide from "@glidejs/glide";

// Remove the component and just export the data
export const practiceAreas = [
	{
		title: "CONSTRUCTION LAW",
		items: [
			"Contract Drafting & Review",
			"Dispute Resolution",
			"Regulatory Compliance",
			"Project Management Legal Support",
			"International Construction Projects",
		],
	},
	{
		title: "CORPORATE LAW",
		items: [
			"Business Formation",
			"Mergers & Acquisitions",
			"Corporate Governance",
			"Compliance & Regulations",
			"International Business Transactions",
		],
	},
	{
		title: "INVESTMENT LAW",
		items: [
			"Foreign Direct Investment",
			"Investment Structuring",
			"Regulatory Compliance",
			"Investment Disputes",
			"Cross-border Transactions",
		],
	},
	{
		title: "LITIGATION",
		items: [
			"Civil Litigation",
			"Commercial Disputes",
			"Arbitration",
			"Mediation",
			"International Dispute Resolution",
		],
	},
	{
		title: "INTELLECTUAL PROPERTY",
		items: [
			"Trademark Registration",
			"Patent Applications",
			"Copyright Protection",
			"IP Litigation",
			"Licensing & Agreements",
		],
	},
];
