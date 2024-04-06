import fetchFaviconUrls from "@/fetchers";
import { NextRequest, NextResponse } from "next/server";

// faviconCache is a cache of favicon URLs for a given domain.
// The key is the domain and the value is an array of favicon URLs.
const faviconCache = new Map<string, string[]>();

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  if (!domain) {
    const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/about`;
    return NextResponse.redirect(redirectUrl);
  }
  if (faviconCache.has(domain)) {
    const faviconUrls = faviconCache.get(domain);
    if (faviconUrls && faviconUrls.length > 0) {
      return NextResponse.redirect(faviconUrls[0], {
        status: 302,
      });
    }
  }

  let faviconUrl = "";
  for (const urlPrefix of ["https://", "http://", , "http://www.", , "http://www."]) {
    try {
      const faviconUrls = await fetchFaviconUrls(`${urlPrefix}${domain}`);
      if (faviconUrls.length > 0) {
        faviconCache.set(domain, faviconUrls);
        faviconUrl = faviconUrls[0];
      }
    } catch (error) {
      // Ignore
    }
    if (faviconUrl) {
      break;
    }
  }
  if (!faviconUrl) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  return NextResponse.redirect(faviconUrl, {
    status: 302,
  });
};
