import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@13.0.0/mod.ts";

const bot = createBot({
  // @ts-ignore: Not actually undefined
  token: Deno.env.get("DISCORD_TOKEN"),
  intents: Intents.Guilds | Intents.GuildMessages,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(bot, message) {
      console.log(message);
    },
  },

});

await startBot(bot);