/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['jsx'],
  images: {
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID + '.supabase.co',
    ],
  },
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  // Add custom webpack config if needed
  webpack(config) {
    return config;
  },
}

module.exports = nextConfig
