var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");
const Discord = require('discord.js');
var Roller = require("../models/roller.js");

// Used to sort iniOrder by the iniEntries' ini values (descending)
// Ranking with highest values shown first
function compareInis(a, b) {
	if (a.ini === b.ini) {
		return 0;
	}
	else {
		return (a.ini < b.ini) ? 1 : -1;
	}
}

module.exports = {
	name: 'combat-ini',
	description: 'Sets the ini of your selected character, or an NPC if a name is provided.',
	oneline: true,
	aliases: [],
	usage: '[ini modifier] [(opt) NPC name]',
	args: true,
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				status: 'ONGOING'
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			var player = await Player.getPlayerAsync(message);

			// Roll for selected character
			if (!args[1] || args[1].length === 0) {
				character = await Character.findById(player.selectedCharacter)
				combatant = await Combatant.findOne({
					combat: combat._id,
					character: character._id,
				});
				if (!combatant) {
					return message.reply("your selected character does not participate in this combat.");
                }
			} // Roll for NPC
			else {
				var combatant = await Combatant.findOne({
					combat: combat._id,
					name: args[1],
					player: player._id,
				});
				if (!combatant) {
					return message.reply("you don't control an NPC called " + args[1] + " in this combat.");
				}
			}

			// Roll ini
			var mod = parseInt(args[0]);
			if (isNaN(mod) || mod < 1) {
				return message.reply("Ini modifier needs to be a number. Preferrably a positive one.");
			}
			die = Roller.die(1, 10);
			var result = die + mod;

			// Displaying the ini result
			const embed = new Discord.MessageEmbed();
			embed.setTitle(combatant.name + "' initiative: " + result);
			embed.setColor('#0099ff');
			embed.setFooter(die + " + " + mod);
			await message.channel.send(embed);

			// Write ini into the combat's ini order
			var allInisSet = true;
			for (var iniEntry of combat.iniOrder) {
				if (iniEntry.combatant.toString() === combatant._id.toString()) {
					var position = combat.iniOrder.indexOf(iniEntry);
					combat.iniOrder[position].ini = result;
                } else if (iniEntry.ini < 0) {
					allInisSet = false;
				}
			}

			// Sort iniOrder by the iniEntries' ini values
			combat.iniOrder.sort(compareInis);
			await combat.save();

			// If all Inis are set, move on to declaring actions
			if (allInisSet) {
				await message.channel.send("All inis are set. Declaring actions.");
				await Combat.promptDeclareAction(message, combat);
			}

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}