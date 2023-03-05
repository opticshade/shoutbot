import {
  createBot,
  Intents,
  sendMessage,
  startBot,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { makeRoll } from "./dice.ts";
import { handleMessage } from "./handler.ts";

const bot = createBot({
  // @ts-ignore: Not actually undefined
  token: Deno.env.get("DISCORD_TOKEN"),
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(bot, message) {
      handleMessage(bot, message);
    },
  },
});

await startBot(bot);
