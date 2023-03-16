import {
  Bot,
  Message,
  sendMessage,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { makeRoll } from "./dice.ts";

export async function handleMessage(bot: Bot, message: Message) {
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
    const rolled = makeRoll({ count: +count, sides: +sides, ex, rote });
    for await (const i of rolled) {
      if (i >= ex) {
        rollmsg += `\**${i}**`;
        successes++;
      } else if (i >= 8) {
        rollmsg += `${i}`;
        successes++;
      } else {
        rollmsg += `~~${i}~~`;
      }
      rollmsg += ",";
    }
    rollmsg = rollmsg.slice(0, -1);
    rollmsg += `] for ${successes} successes.`;

    sendMessage(bot, message.channelId, { content: rollmsg });
  }
}
