import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  experimental: {},
};

export default withNextIntl(nextConfig);
