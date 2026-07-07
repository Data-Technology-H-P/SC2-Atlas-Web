import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isIndexingEnabled = process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";

  if (isIndexingEnabled) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
    };
  } else {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
}
