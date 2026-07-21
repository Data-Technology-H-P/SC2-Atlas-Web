import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  distDir: '.next',
  cleanDistDir: true,
  allowedDevOrigins: ['192.168.1.199', 'localhost:3000'],
};

export default withNextIntl(nextConfig);
