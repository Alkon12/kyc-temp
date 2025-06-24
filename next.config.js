// X-CustomHeader,X-Requested-With,If-Modified-Since
const headers = [
  'Accept',
  'Accept-Version',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Version',
  'X-CSRF-Token',
  'X-Requested-With',
  'Authorization',
  'Origin',
  'DNT',
  'Keep-Alive',
  'User-Agent',
  'X-Auth-Token',
  'Cache-Control',
  'Content-Range',
  'Range',
  'x-api-key',
  'x-company-id'
]

const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Comentado para permitir next start
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack(config, _options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      use: [require.resolve('graphql-tag/loader')],
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'false',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: headers.join(', '),
          },
          {
            key: 'Access-Control-Request-Headers',
            value: headers.join(', '),
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tmna.aemassets.toyota.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'web.test.divisionautomotriz.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'web.dev.divisionautomotriz.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'web.autofinrent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.autofinrent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.edmunds.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
