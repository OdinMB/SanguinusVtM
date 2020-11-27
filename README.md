# SanguinusVtM
A Discord bot for Vampire: The Masquerade V20 games.
Created with Node.js and MongoDB.

## v0.5
Alpha version.<BR/>
Test build for chronicle https://www.sanguinus.org/.

## Functionality
- **Characters**<br/>
-- Create characters and character profiles<br/>
-- Manage character sheets (still missing: Backgrounds, Disciplines, Merits/Flaws)
- **Rolls**: Can perform rolls according to V20 mechanics.<br/>
-- Dice pools can be given as numbers ('!r 7') or stats ("!rs str bra")<br/>
-- Stat specialties can be considered ('!r 7 spec')<br/>
-- Rolls can be saved and then be performed more quickly<br/>
-- Stat-based rolls and saved rolls can be modified ('!rs str bra -3')<br/>
-- A luck score indicates how much the dice gods loved you by comparing your result to 10,000 other rolls with the same paramters.
- **Blood, Willpower, Health**<br/>
-- Spend and get BP, get notified if you risk hunger frenzy<br/>
-- Spend WP and restore WP once a week (with admin command)<br/>
-- Take and heal damage, see wound penalties
- **Combat**<br/>
-- Follow the combat process through stages: joining, ini, declaring actions, resolving actions<br/>
-- Join with saved characters and NPCs (at the same time, if you want)<br/>
-- Get prompts for declaring and resolving actions automatically<br/>
-- Perform ini rolls and get ini rankings automatically (ties are decided by ini modifiers and then a coin flip)<br/>
-- Manage additional actions from Celerity<br/>
-- Display combat summaries with next steps and ini ranking<br/>
-- Manage several battles in different channels at the same time
- **Blood bonds**<br/>
-- Perform Vaulderies to create vinculums between any number of players<br/>
-- Automatically perform city-wide Vaulderies<br/>
-- Flag Cainites who drank but did not contribute blood

## Commands

- **bp-feed** (feed) [(opt) amount]<br/>Gain BP with your selected character. (Full BP if no amount is provided.)
- **bp-spend** (bp) [(opt) amount] [(opt) comment]<br/>Spends BP with your selected character. Spends 1 BP if no amount is provided.
- **char-all** (allchars): Shows a list of all active (and paused) characters.
- **char-my** (mychars): Shows a list of your characters.
- **char-new** (newchar) [name]: Creates a new character.
- **char-profile** (profile, p, show) [name]: Shows the profile of a character.
- **char-select** (select) [name]: Selects one of your characters.
- **char-setprofile** (setprofile): Creates a profile for your active character.  Via DM only.
- **combat-celerity** (cel) [(opt) NPC]: Grants an ini 0 action to your selected character or an NPC.
- **combat-declare** (declare) [action]: Sets the action of a character in combat.
- **combat-end**: Ends an ongoing combat in a channel.
- **combat-ini** (ini, init) [ini modifier] [(opt) NPC name]<br/>Sets the ini of your selected character or an NPC.
- **combat-join** (join) [(opt) NPC]: Join combat with your selected character or with an NPC.
- **combat-leave** (leave) [(opt) NPC]: Leave combat with your selected character or with an NPC.
- **combat-newround** (round)<br/>Starts a new round in an ongoing combat. Executed to start combat when combatants have joined.
- **combat-resolve** (resolved, resolve): Mark a previously declared combat action as resolved.
- **combat-start** (combat): Starts combat in the channel and invites combatants to join.
- **combat-summary** (summary): Shows the ini ranking and marks the player who has to act next.
- **damage-heal** (heal) [amount] [b/l/a]: Heal damage with your selected character.
- **damage-take** (take) [amount] [b/l/a]: Take damage with your selected character.
- **help**  [(opt) command name]: List all of my commands or info about a specific command.
- **roll-delete**  [name]: Deletes a saved roll for your selected character.
- **roll-ini** [ini modifier]: Rolls your initiative (outside of bot-facilitated combat).
- **roll-load** (rl) [roll name] [(opt) +/- modifier]: Performs a previously stored roll for your selected character.
- **roll-my** (myrolls): Shows a list of stored rolls for your selected character.
- **roll-save**  [name] [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]<br/>Saves a roll for your selected character under a name.
- **roll-stats** (rs) [(opt) difficulty] [stat names 1-3] [(opt) +/- modifier] [(opt) "spec"]<br/>Performs a roll based on your character's stats.
- **roll** (r) [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]<br/>Performs a dice roll.
- **sheet-set** (ss) [stat name] [value]: Sets a value on the sheet of your selected character. Via DM only.
- **sheet**: Displays the sheet of your currently selected character.
- **status** (health): Displays BP, WP, and Health of your selected character.
- **vaulderie** [(opt) city] [character names 1-n]: ADMIN ONLY. Updates the vinculum ratings between characters. Use \'-name\' instead of \'name\' for characters who drank but didn\'t contribute blood.
- **vinculums** (myvincs): Shows the vinculums of the selected character.
- **wp-replenish**  [(opt) character name]<br/>ADMIN ONLY. Replenishes 1 WP for all active characters, or one character if a name is provided.
- **wp** [(opt) comment]: Spends 1 WP with your selected character.

## Installation
- [Obtain Discord bot token](https://www.writebots.com/discord-bot-token/)
- Create .env file
in the project's main folder with the following content:
```
SANGUINUS_VTM_TOKEN=[Discord bot token]
PREFIX=[special character that precedes the bot commands, e.g. !]
MONGO_URL=[Mongo database connection]
```
- Install the app on a Node.js host
- [Add the bot to your Discord server](https://www.writebots.com/discord-bot-token/)

## Update
Since things are still very much in flux, it's recommended to empty the Mongo database before updating the bot on your server.