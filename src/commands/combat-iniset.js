var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-iniset',
	description: 'ADMIN ONLY. Sets the ini of a character/NPC.',
	oneline: true,
	aliases: ['iniset', 'ini-set'],
	usage: '[PC/NPC] [ini] [(opt) ini modifier]',
	wiki: "If no ini modifier is provided, it is set to 0. In case of a tie, characters with a higher ini modifier act first.",
	args: true,
	guildOnly: true,
	adminOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: 'INI'
			});
			if (!combat) {
				return message.reply("there is no combat in the INI phase.");
			}

			// Find combatant
			var combatant = await Combatant.findOne({
				combat: combat._id,
				name: args[0]
			});
			if (!combatant) {
				return message.reply("there is no combatant named " + args[0] + ". (Since this command can target player characters, it's case sensitive.)");
			}

			// Check ini
			if (!args[1] || isNaN(args[1]) || args[1] < 0) {
				return message.reply("Ini modifier needs to be a number. Preferrably a positive one.");
			} else {
				var ini = parseInt(args[1]);
            }

			// Check ini modifier
			var iniModifier = 0;
			if (args[2]) {
				if (isNaN(args[2]) || args[2] < 0) {
					return message.reply("Ini modifier needs to be a number. Preferrably a positive one.");
				} else {
					iniModifier = parseInt(args[2]);
                }
			}

			await message.reply(
				combatant.name + "'s initiative is **" + ini + "**" +
				(iniModifier > 0 ? " (modifier " + iniModifier + ")" : "") +
				"."
			);

			// Write ini and iniModifier into the combat's ini order
			for (var celerityRound of combat.iniOrder) {
				var celerityRoundPosition = combat.iniOrder.indexOf(celerityRound);
				for (var iniEntry of celerityRound) {
					if (iniEntry.combatant.toString() === combatant._id.toString()) {
						var position = celerityRound.indexOf(iniEntry);
						combat.iniOrder[celerityRoundPosition][position].iniModifier = iniModifier;
						combat.iniOrder[celerityRoundPosition][position].ini = ini;
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
			console.log("combat-iniset: " + err);
			return message.channel.send(err.message);
		}
	}
}