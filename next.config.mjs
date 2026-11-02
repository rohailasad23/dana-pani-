/** @type {import('next').NextConfig} */
const isStaticPreview = process.env.STATIC_PREVIEW === "1";

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"], unoptimized: isStaticPreview },
  // `STATIC_PREVIEW=1 npm run build` produces a plain static copy in /out (used for previews)
  ...(isStaticPreview ? { output: "export", assetPrefix: "/__ap" } : {}),
};
export default nextConfig;
