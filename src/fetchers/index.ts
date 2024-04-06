import axios from "axios";
import * as cheerio from "cheerio";

const fetchFaviconUrls = async (url: string): Promise<string[]> => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "user-agent":
          "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
      },
    });

    const html = response.data;
    const redirectedUrl = response.request.res.responseUrl;
    const baseRedirectedUrl = new URL(redirectedUrl).protocol + "//" + new URL(redirectedUrl).host;

    const faviconUrlsFromHtml = getFaviconUrlsFromHtml(html, baseRedirectedUrl);

    return [...faviconUrlsFromHtml, `${baseRedirectedUrl}/favicon.ico`];
  } catch (error) {
    return [];
  }
};

const getFaviconUrlsFromHtml = (html: string, baseUrl: string): string[] => {
  const $ = cheerio.load(html);
  const faviconUrls: string[] = [];
  $('link[rel=icon], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').each((i, icon) => {
    const href = $(icon).attr("href");
    if (href) {
      faviconUrls.push(makeAbsoluteUrl(href, baseUrl));
    }
  });

  $('meta[itemprop="image"]').each((i, icon) => {
    const href = $(icon).attr("content");
    if (href) {
      faviconUrls.push(makeAbsoluteUrl(href, baseUrl));
    }
  });

  return faviconUrls;
};

const makeAbsoluteUrl = (url: string, baseUrl: string): string => {
  const trimmedBaseUrl = baseUrl.replace(/\/$/, "");
  const absolutePattern = /^https?:\/\//i;
  if (absolutePattern.test(url)) {
    return url;
  } else if (url.startsWith("//")) {
    return `https:${url}`;
  } else if (url.startsWith("/")) {
    return `${trimmedBaseUrl}${url}`;
  } else {
    return `${trimmedBaseUrl}/${url}`;
  }
};

export default fetchFaviconUrls;
