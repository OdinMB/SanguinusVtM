# SanguinusVtM
A Discord bot for Vampire: The Masquerade V20 games.
Created with Node.js and MongoDB.

## v0.2
Alpha version.
Test build for chronicle https://www.sanguinus.org/.

## Functionality
- **Rolls**: Can perform rolls according to V20 mechanics, including stat specialties and initiative rolls. Regular rolls can be saved and then performed more quickly.
- **Character management**: Can create characters and character profiles.
- **Character sheets**: Can set attribute and ability stats. Can perform rolls based on these stats ("!rs str bra" would be turned into "!roll 7").

## Commands
DM means that you have to send the command to me via direct message.

- **char-all** (allchars) 
DM. Shows a list of all active (and paused) characters.
- **char-my** (mychars) 
DM. Shows a list of your characters.
- **char-new** (newchar) [name]
DM. Creates a new character.
- **char-profile** (profile, p, show) [name]
Shows the profile of a character.
- **char-select** (select) [name]
DM. Selects one of your characters. Bot commands will be applied to that character.
- **char-setprofile** (setprofile) 
DM. Creates a profile for your active character.
- **help** [command name]
List all of my commands or info about a specific command.
- **roll-delete** [name]
DM. Deletes a saved roll.
- **roll-ini** (ini, init) [ini modifier]
Rolls your initiative. Ini modifier is Dexterity + Wits + unsued Celerity.
- **roll-load** (rl) [roll name]
Performs a previously stored roll.
- **roll-my** (myrolls) 
DM. Shows a list of your stored rolls.
- **roll-save** [name] [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]
DM. Assigns a name to a roll.
- **roll-stats** (rs) [(opt) difficulty] [stat names 1-3] [(opt) "spec"]
Performs a roll based on your character's stats.
- **roll** ( r ) [dice pool] [(opt) difficulty] [(opt) comment] [(opt) "spec"]
Performs a dice roll and shows the result in the channel.
- **sheet-set** (ss) [stat name] [value]
DM. Sets a value on the sheet of your selected character.
- **sheet** 
DM. Displays the sheet of your currently selected character.

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