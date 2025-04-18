import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        ROOT: process.env.ROOT,
    },
};
export default nextConfig;
