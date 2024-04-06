import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  if (!url) {
    const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/about`;
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const faviconUrl = await getFaviconUrl(url);
    if (!faviconUrl) {
      return new Response("Not Found", {
        status: 404,
      });
    }

    return NextResponse.redirect(faviconUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
};

async function getFaviconUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("link");
    let faviconUrl = "";
    links.each((_, link) => {
      const rel = $(link).attr("rel");
      if (rel && (rel === "icon" || rel === "shortcut icon")) {
        faviconUrl = $(link).attr("href") || "";
        if (!faviconUrl.startsWith("http")) {
          const base = new URL(url);
          faviconUrl = new URL(faviconUrl, base).href;
        }
        return false;
      }
    });
    return faviconUrl;
  } catch (error) {
    return "";
  }
}
