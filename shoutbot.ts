import {
  createBot,
  Intents,
  sendMessage,
  startBot,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { makeRoll } from "./dice.ts";

const bot = createBot({
  // @ts-ignore: Not actually undefined
  token: Deno.env.get("DISCORD_TOKEN"),
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(bot, message) {
      const capture = /^!([0-9]{1,2})d([0-9]{1,2})(a([8,9]))?(r)?/.exec(
        message.content,
      );
      if (capture) {
        const count = capture[1];
        const sides = capture[2];
        let ex = 10;
        let rote = false;
        let rollmsg = `<@${message.member?.id}> just rolled [`;

        if (capture[4]) {
          ex = +capture[4];
        }

        if (capture[5]) {
          rote = true;
        }
        let successes = 0;
        // Sanity checks
        if (ex > +sides || !sides || !count) {
          return;
        }
        const rolled = makeRoll(+count, +sides, ex, rote);
        for (let i = 0; i < rolled.length; i++) {
          if (rolled[i] >= ex) {
            rollmsg += `\**${rolled[i]}**`;
            successes++;
          } else if (rolled[i] >= 8) {
            rollmsg += `${rolled[i]}`;
            successes++;
          } else {
            rollmsg += `~~${rolled[i]}~~`;
          }
          if (i != rolled.length - 1) {
            rollmsg += ",";
          }
        }
        rollmsg += `] for ${successes} successes.`;
        sendMessage(bot, message.channelId, { content: rollmsg });
      }
    },
  },
});

await startBot(bot);
