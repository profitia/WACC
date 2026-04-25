const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  output: 'export',
  // basePath i assetPrefix tylko dla GitHub Pages (subdirectory /WACC)
  // Na Vercelu app żyje w root "/" — bez prefixu
  ...(isVercel
    ? {}
    : {
        basePath: '/WACC',
        assetPrefix: '/WACC/',
      }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;