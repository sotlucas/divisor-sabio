/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "/eventos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
