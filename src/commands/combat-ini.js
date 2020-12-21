var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'combat-ini',
	description: 'Sets the ini of your selected character/NPC.',
	oneline: true,
	aliases: ['ini', 'init'],
	usage: '[ini modifier] [(opt) NPC]',
	wiki: "In case of a tie, characters with a higher ini modifier act first. If ini modifiers are tied as well, the order is decided by a coin fip.",
	args: true,
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: 'INI'
			});
			if (!combat) {
				return message.reply("there is no combat in the INI phase right now. Case of wishful thinking?");
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
				// Normalizing NPC names to Bob (vs bob, bOB, BOB, etc.)
				args[1] = Combat.normalizeNPCName(args[1]);

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
			/*
			const embed = new Discord.MessageEmbed();
			embed.setTitle(combatant.name + "' initiative: " + result);
			embed.setColor('#0099ff');
			embed.setFooter(die + " + " + mod);
			await message.channel.send(embed);
			*/
			await message.reply(
				combatant.name + "'s initiative is **" + result + "**" +
				" (" + die + " + " + mod + ")"
			);

			// Write ini and iniModifier into the combat's ini order
			for (var celerityRound of combat.iniOrder) {
				var celerityRoundPosition = combat.iniOrder.indexOf(celerityRound);
				for (var iniEntry of celerityRound) {
					if (iniEntry.combatant.toString() === combatant._id.toString()) {
						var position = celerityRound.indexOf(iniEntry);
						combat.iniOrder[celerityRoundPosition][position].iniModifier = mod;
						combat.iniOrder[celerityRoundPosition][position].ini = result;
					}
				}
			}

			// Sort iniOrder by the iniEntries' ini values
			for (var celerityRound of combat.iniOrder) {
				var celerityRoundPosition = combat.iniOrder.indexOf(celerityRound);
				combat.iniOrder[celerityRoundPosition].sort(Combat.compareIniEntries);
			}
			combat.markModified('iniOrder');
			await combat.save();

			return Combat.checkState(message, combat);

		} catch (err) {
			console.log("combat-ini: " + err);
			return message.channel.send(err.message);
		}
	}
}