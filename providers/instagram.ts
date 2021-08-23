import { request, RichOembed } from "../oembed.ts";
import { assertStringIncludes } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { BasicOembedProvider } from "./base.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts";

const endpoint = "https://api.instagram.com/oembed";
const regex = /https?:\/\/(www\.)?instagram\.com\/p\/([0-9A-z]+)\/?/g;

export class Instagram extends BasicOembedProvider {
  hasUrl(str: string) {
    // clear 'g' flag before test
    return (new RegExp(regex, "")).test(str);
  }
  getUrls(str: string) {
    return str.match(regex) as string[];
  }
  async getEmbed(url: string) {
    const data = await request<RichOembed>(endpoint, { url: url });
    const document = new DOMParser().parseFromString(data.html, "text/html");
    const contentUrl = document?.querySelector("blockquote")?.getAttribute(
      "data-instgrm-permalink",
    ) ?? undefined;
    return {
      title: data.provider_name,
      url: contentUrl,
      description: data.title,
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
Deno.test("Instagram oEmbed test", async () => {
  const instagram = new Instagram();
  const embed = await instagram.getEmbed(
    "https://www.instagram.com/p/CSn6xK1ln0d/",
  );
  assertStringIncludes(
    embed.image.url as string,
    "https://instagram.fitm1-1.fna.fbcdn.net/v/t51.2885-15/e35/s480x480/237378146_852157725410631_1135845236952775157_n.jpg",
  );
  assertStringIncludes(
    embed.url as string,
    "https://www.instagram.com/p/CSn6xK1ln0d/",
  );
});
