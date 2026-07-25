/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Formatting/lint issues shouldn't block production builds.
    // Run `npm run lint` / `npx prettier --write src/` locally to keep code clean.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
