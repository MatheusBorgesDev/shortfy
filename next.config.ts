import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},

	experimental: {
		optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
	},

	compress: true,

	poweredByHeader: false,

	images: {
		formats: ["image/webp", "image/avif"],
	},
};

export default withBundleAnalyzer(nextConfig);
