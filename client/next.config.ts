import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                // uploaded product images are served by the API
                source: '/uploads/:path*',
                destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
