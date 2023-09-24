import {
  Bot,
  Message,
  sendMessage,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { makeNormRoll, makeRoll } from "./dice.ts";

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
  } else {
    const capture = /^\.([0-9]{1,2})d([0-9]{1,2})\ *((\+|-)\ *([0-9]+))?/.exec(
      message.content,
    );
    console.log(capture);
    if (capture) {
      const count = capture[1];
      const sides = capture[2];
      let mod = 0;
      let total = 0;
      let rollmsg = `<@${message.member?.id}> just rolled [`;
      const rolled = makeNormRoll({count: +count, sides: +sides});

      if(capture[4]) {
        mod = +capture[5];
      }

      for await (const i of rolled) {
        rollmsg += `${i},`;
      }

      rollmsg = rollmsg.slice(0, -1);
      total = rolled.reduce((total, x) => total + x);

      if(mod) {
        if(capture[4] == '-') {
          mod = -mod;
        }
        rollmsg += `] ${total} ${capture[4]} ${Math.abs(mod)} = ${total + mod}`;
      } else {
        rollmsg += `] = ${total}`;
      }
      sendMessage(bot, message.channelId, {content: rollmsg});
    }

  }
}
