/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ustaw basePath na nazwę repozytorium GitHub, np. '/Kalkulator'
  // basePath: '/Kalkulator',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
