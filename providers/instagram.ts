import { request, RichOembed } from "../oembed.ts";
import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { BasicOembedProvider } from "./base.ts";

const endpoint = "https://api.instagram.com/oembed";
const regex = /https?:\/\/(www\.)?instagram\.com\/p\/([0-9A-z]+)\/?/g;

export class Instagram extends BasicOembedProvider {
  hasUrl(str: string) {
    // clear 'g' flag before test
    return (new RegExp(regex, '')).test(str)
  }
  getUrls(str: string) {
    return str.match(regex) as string[]
  }
  async getEmbed(url: string) {
    const data = await request<RichOembed>(endpoint, {url: url});
    return {
      description: data.title,
      image: {url: data.thumbnail_url, width: data.thumbnail_width, height: data.thumbnail_height},
      author: {name: data.author_name, url: data.author_url},
    }
  }
}

// test
Deno.test("Instagram oEmbed test", async () => {
  const data = await request(endpoint, {
    url: "https://www.instagram.com/p/CSn6xK1ln0d/",
  });
  assertEquals(
    data.thumbnail_url,
    "https://instagram.fitm1-1.fna.fbcdn.net/v/t51.2885-15/e35/s480x480/237378146_852157725410631_1135845236952775157_n.jpg?_nc_ht=instagram.fitm1-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=LKVhCGB94GwAX9HLQs0&edm=ALY_pVYBAAAA&ccb=7-4&oh=6de409953074faa46c412f69c586790c&oe=61288345&_nc_sid=1ffb93",
  );
});
