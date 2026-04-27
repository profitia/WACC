const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  // Na Vercelu: natywny deployment Next.js — BEZ static export i BEZ basePath
  // Na GitHub Pages: static export z basePath /WACC (subdirectory hosting)
  ...(isVercel
    ? {}
    : {
        output: 'export',
        basePath: '/WACC',
        assetPrefix: '/WACC/',
      }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;