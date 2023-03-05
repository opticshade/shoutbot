import { createBot, Intents, sendMessage, startBot} from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { crypto } from "https://deno.land/std@0.178.0/crypto/mod.ts";

const bot = createBot({
  // @ts-ignore: Not actually undefined
  token: Deno.env.get("DISCORD_TOKEN"),
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(bot, message) {
      const capture = /^!([0-9]{1,3})d([0-9]{1,3})(a([0-9]))?(r)?/.exec(message.content);
      if(capture) {
        const count = capture[1];
        const sides = capture[2];
        let ex = 10;
        let rote = false;
        if(capture[4]){
          ex = +capture[4];
        } else {
          ex = 10;
        }
        if(capture[5]){
          rote = true;
        }
        let successes = 0;
        // Sanity checks
        if(ex > +sides || !sides || !count) {
          return;
        }
        const rolled = makeRoll(+count, +sides, ex, rote);
        for( let i =0; i< rolled.length; i++) {
          if(rolled[i] >= 8) {
            successes++;
          }
        }
        sendMessage(bot, message.channelId,{content:`<@${message.member?.id}> just rolled ${rolled} for ${successes} successes.`});

      }

    },
  },

});


function makeRoll(count: number, sides:number,ex: number, rote: boolean) : Array<number>{
  const rolls: number[] = [];

  for(let i=0;i< count; i++){
    const res = rollDie(sides);
    rolls.push(res);
    if(res >= ex) {
      rolls.push(makeRoll(1, sides, ex, false)[0]);
    }else if(res < 8 && rote) {
      rolls.push(makeRoll(1, sides, ex, false)[0]);
    }
  }
  return rolls;
}

function rollDie(sides: number) : number{
  const roll = new Uint8Array(1);
  crypto.getRandomValues(roll);
  if(roll[0] >= Math.floor(256 / sides) * sides) {
    return rollDie(sides);
  }
  return 1 + (roll[0] % sides);
}

await startBot(bot);