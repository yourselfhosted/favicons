import fetchFaviconUrls from "@/fetchers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  if (!domain) {
    const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/about`;
    return NextResponse.redirect(redirectUrl);
  }

  let faviconUrl = "";
  for (const protocol of ["https", "http"]) {
    try {
      const faviconUrls = await fetchFaviconUrls(`${protocol}://${domain}`);
      if (faviconUrls.length > 0) {
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
