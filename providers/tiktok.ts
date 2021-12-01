import { request, VideoOembed } from "../oembed.ts";
import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { BasicOembedProvider } from "./base.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts";

const endpoint = "https://www.tiktok.com/oembed";
const regex = /https:\/\/vt\.tiktok\.com\/([A-z0-9_]+)/g;

export class Tiktok extends BasicOembedProvider {
  hasUrl(str: string) {
    // clear 'g' flag before test
    return (new RegExp(regex, "")).test(str);
  }
  getUrls(str: string) {
    return str.match(regex) as string[];
  }
  async getEmbed(url: string) {
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    const location = response.headers.get("location") as string;
    const data = await request<VideoOembed>(endpoint, { url: location });
    const document = new DOMParser().parseFromString(data.html, "text/html");
    const contentUrl =
      document?.querySelector("blockquote")?.getAttribute("cite") ?? undefined;
    return {
      title: data.provider_name,
      description: data.title,
      url: contentUrl,
      image: {
        url: data.thumbnail_url,
        width: data.thumbnail_width,
        height: data.thumbnail_height,
      },
      author: { name: data.author_name, url: data.author_url },
    };
  }
}

// test
Deno.test("TikTok oEmbed test", async () => {
  const tiktok = new Tiktok();
  const embed = await tiktok.getEmbed("https://vt.tiktok.com/ZSJvYnyT4/");
  assertStringIncludes(
    embed.image.url as string,
    "https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/5f2f7c9cf5bc4d7ba64b773db6942543_1624617121",
  );
  assertEquals(
    embed.url,
    "https://www.tiktok.com/@ouchigokko/video/6977677364025167105",
  );
});
