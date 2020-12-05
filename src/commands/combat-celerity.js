var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-celerity',
	description: 'Grants an extra action to your selected character or an NPC.',
	oneline: true,
	aliases: ['celerity'],
	usage: '[(opt) NPC]',
	wiki: "ASDF" +
		"Examples: \n- " + process.env.PREFIX + "combat-celerity",
	// args: true,
	guildOnly: true,
	cooldown: 1,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: 'INI'
			});
			if (!combat) {
				return message.reply("there is no combat in the INI stage right now.");
			}

			var player = await Player.getPlayerAsync(message);

			// Check: does combatant exist?
			// selected character
			if (!args || args.length === 0) {
				character = await Character.findById(player.selectedCharacter)
				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					player: player._id,
					character: character._id
				});
			} // NPC
			else {
				args[0] = Combat.normalizeNPCName(args[0]);

				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					player: player._id,
					name: args[0]
				});
			}
			if (!existingCombatant) {
				return message.reply("the indicated character has not joined this combat yet.");
			}

			var newCelerityRound = 1;

			// Get combatant's ini and iniModifier
			// Find out in which celerity round the new iniEntry needs to be added
			for (const celerityPhase of combat.iniOrder) {
				const celerityPhasePosition = combat.iniOrder.indexOf(celerityPhase);
				for (const iniEntry of celerityPhase) {
					if (iniEntry.combatant.toString() === existingCombatant._id.toString()) {
						if (celerityPhasePosition === 0) {
							var ini = iniEntry.ini;
							var iniModifier = iniEntry.iniModifier;
						}
						if (celerityPhasePosition >= newCelerityRound) {
							newCelerityRound = celerityPhasePosition + 1;
                        }
                    }
				}
			}

			var iniOrderElement = {
				ini: ini,
				iniModifier: iniModifier,
				combatant: existingCombatant._id,
				action: "",
			};
			console.log(iniOrderElement);
			console.log("newCelerityRound: " + newCelerityRound);
			if (!combat.iniOrder[newCelerityRound]) {
				combat.iniOrder[newCelerityRound] = [];
            }
			combat.iniOrder[newCelerityRound].push(iniOrderElement);
			combat.iniOrder[newCelerityRound].sort(Combat.compareIniEntries);
			console.log(combat);
			combat.markModified('iniOrder');
			await combat.save();

			message.reply(existingCombatant.name + " has an additional action in Celerity Round " + newCelerityRound + ".");

		} catch (err) {
			console.log("combat-celerity: " + err);
			return message.channel.send(err.message);
		}
	}
}