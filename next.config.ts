import type { NextConfig } from "next";

// Maps retired per-letter `letter-<trans>` slugs to the matching key in
// the unified `/dashboard/courses/arabic/alphabet` lesson. The old slugs
// used looser transliterations (jim/haa/dal/...), the unified course
// uses disambiguated keys (jeem/hhaa/daal/...), so a static mapping is
// the only reliable way to forward.
const LEGACY_ALPHABET_REDIRECTS: Array<[legacy: string, unifiedKey: string]> = [
  ["letter-alif", "alif"],
  ["letter-baa", "baa"],
  ["letter-taa", "taa"],
  ["letter-thaa", "thaa"],
  ["letter-jim", "jeem"],
  ["letter-haa", "hhaa"],
  ["letter-khaa", "khaa"],
  ["letter-dal", "daal"],
  ["letter-dhal", "dhaal"],
  ["letter-ra", "raa"],
  ["letter-zay", "zay"],
  ["letter-sin", "seen"],
  ["letter-shin", "sheen"],
  ["letter-sad", "saad"],
  ["letter-dad", "dhaad"],
  ["letter-taa-emphatic", "ttaa"],
  ["letter-zaa", "thhaa"],
  ["letter-ain", "ayn"],
  ["letter-ghain", "ghayn"],
  ["letter-faa", "faa"],
  ["letter-qaf", "qaaf"],
  ["letter-kaf", "kaaf"],
  ["letter-lam", "laam"],
  ["letter-mim", "meem"],
  ["letter-nun", "noon"],
  ["letter-haa-soft", "haa"],
  ["letter-waw", "waaw"],
  ["letter-yaa", "yaa"],
];

const nextConfig: NextConfig = {
  // Security: disable x-powered-by header to avoid revealing tech stack
  poweredByHeader: false,

  // Strict mode for catching potential issues early
  reactStrictMode: true,

  // Only allow images from trusted origins
  images: {
    remotePatterns: [],
  },

  async redirects() {
    return LEGACY_ALPHABET_REDIRECTS.map(([legacy, unifiedKey]) => ({
      source: `/dashboard/courses/arabic/${legacy}`,
      destination: `/dashboard/courses/arabic/alphabet?letter=${unifiedKey}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
