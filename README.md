# shoutbot

This was going to be a shoutbot but I got distracted and made it a dice roller
for nWoD (New World of Darkness) instead. It handles exploding dice 8/9 again
and rote actions.

# Install

install deno check out the source create a .env file with your DISCORD_TOKEN for
your bot then run deno run -A mod.ts

# Misc

This was just a side project to learn a bit of TypeScript and Deno. I haven't
even done JS in years so its probably not the best. But feel free to use it for
your nWod games!

# Syntax

!<diecount>d<sides>[a<8|9>][r] so to roll 1d10 as a rote action with 9 again you
do !1d10a9r For 1d10 as a rote do !1d10r

For normal non CoD rolling do .<diecount>d<sides>[<+|-><mod>]
.3d6 for example or .3d6+10
