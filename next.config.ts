import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  distDir: '.next',
  cleanDistDir: true,
};

export default withNextIntl(nextConfig);
