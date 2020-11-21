# SanguinusVtM
A Discord bot for Vampire: The Masquerade V20 games.
Created with Node.js and MongoDB.

## v0.3
Alpha version.
Test build for chronicle https://www.sanguinus.org/.

## Functionality
- **Characters**
-- Create characters and character profiles
-- Manage character sheets (still missing: Backgrounds, Disciplines, Merits/Flaws)
- **Rolls**: Can perform rolls according to V20 mechanics.
-- Dice pools can be given as numbers ('!r 7') or stats ("!rs str bra")
-- Stat specialties can be considered ('!r 7 spec')
-- Initiative rolls
-- Rolls can be saved and then be performed more quickly
-- Luck score indicates how much the dice gods loved you
- **Blood, Willpower, Health**
-- Spend and get BP, get notified if you risk hunger frenzy
-- Spend WP and restore WP once a week (with admin command)
-- Take and heal damage, see wound penalties

## Commands

- **bp-feed** (feed) [(opt) amount]
Gain BP with your selected character. Gains full BP, if no amount is provided.
- **bp-spend** (bp) [(opt) amount] [(opt) comment]
Spends BP with your selected character. Spends 1 BP if no amount is provided.
- **char-all** (allchars): Shows a list of all active (and paused) characters.
- **char-my** (mychars): Shows a list of your characters.
- **char-new** (newchar) [name]: Creates a new character.
- **char-profile** (profile, p, show) [name]: Shows the profile of a character.
- **char-select** (select) [name]: Selects one of your characters.
- **char-setprofile** (setprofile): Creates a profile for your active character.  Via DM only.
- **damage-heal** (heal) [amount] [b/l/a]: Heal damage with your selected character.
- **damage-take** (take) [amount] [b/l/a]: Take damage with your selected character.
- **help**  [(opt) command name]: List all of my commands or info about a specific command.
- **roll-delete**  [name]: Deletes a saved roll for your selected character.
- **roll-ini** (ini, init) [ini modifier]: Rolls your initiative.
- **roll-load** (rl) [roll name]: Performs a previously stored roll for your selected character.
- **roll-my** (myrolls): Shows a list of stored rolls for your selected character.
- **roll-save**  [name] [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]
Saves a roll for your selected character under a name.
- **roll-stats** (rs) [(opt) difficulty] [stat names 1-3] [(opt) "spec"]
Performs a roll based on your character's stats.
- **roll** (r) [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]
Performs a dice roll.
- **sheet-set** (ss) [stat name] [value]: Sets a value on the sheet of your selected character. Via DM only.
- **sheet**: Displays the sheet of your currently selected character.
- **wp-replenish**  [(opt) character name]
ADMIN ONLY. Replenishes 1 WP for all active characters. Needs to be posted in a guild channel.
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
- Since things are still very much in flux, it's recommended to empty the Mongo database before updating the bot on your server.