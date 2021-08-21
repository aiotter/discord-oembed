import { startBot } from "https://deno.land/x/discordeno@12.0.1/mod.ts";
import { Instagram } from "./providers/mod.ts";

const instagram = new Instagram();

startBot({
  token: Deno.env.get("TOKEN") as string,
  intents: ["Guilds", "GuildMessages"],
  eventHandlers: {
    ready() {
      console.log("Successfully connected to gateway");
    },

    async messageCreate(message) {
      if (message.isBot) return;
      const embeds = [];

      if (instagram.hasUrl(message.content)) {
        const newEmbeds = await instagram.getEmbeds(message.content);
        embeds.push(...newEmbeds);
      }

      if (embeds.length > 0) {
        message.reply({ embeds: embeds }, false);
      }
    },
  },
});
