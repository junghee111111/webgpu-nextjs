// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wgsl$/,
      use: {
        loader: 'ts-shader-loader',
      },
    });
    return config;
  },
};

export default nextConfig;
