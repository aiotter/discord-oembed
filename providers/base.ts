import { Embed } from "https://deno.land/x/discordeno@12.0.1/mod.ts";

export abstract class BasicOembedProvider {
  abstract hasUrl(str: string): boolean;
  abstract getUrls(str: string): string[];
  abstract getEmbed(url: string): Promise<Embed>;

  getEmbeds(str: string): Promise<Embed[]> {
    return Promise.all(this.getUrls(str).map(this.getEmbed));
  }
}
