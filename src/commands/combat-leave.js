var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-leave',
	description: 'Leave combat with your selected character or with an NPC.',
	oneline: true,
	aliases: ['leave'],
	usage: '[(opt) NPC]',
	wiki: "ASDF" +
		"Examples: \n- " + process.env.PREFIX + "combat-leave",
	// args: true,
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			var player = await Player.getPlayerAsync(message);

			// Leave with selected character
			if (args.length === 0) {
				character = await Character.findById(player.selectedCharacter)
				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					character: character._id,
				});
				if (!existingCombatant) {
					return message.reply(character.name + " is not part of this combat.");
				}
			} // Leave with NPC
			else {
				// Normalizing NPC names to Bob (vs bob, bOB, BOB, etc.)
				args[0] = Combat.normalizeNPCName(args[0]);

				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					name: args[0],
				});
				if (!existingCombatant) {
					return message.reply("in this combat, there is no NPC " + args[0] + ".");
				}
			}

			var combatantsTurn = false;

			if (combat.state === "DECLARING" || combat.state === "RESOLVING") {
				combatantsTurn =
					combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].combatant.toString() ===
					existingCombatant._id.toString();

				// If it's the combatant's in declaring phase: move ini pointer
				// Not necessary in RESOLVING phase, as the next player will move
				// to existingCombatant's position once it's deleted from the iniOrder
				if (combatantsTurn && combat.state === "DECLARING") {
					combat.iniCurrentPosition--;
				}
			}


			// Remove combatant from the combat's ini order
			for (var celerityRound of combat.iniOrder) {
				const celerityRoundPosition = combat.iniOrder.indexOf(celerityRound);
				for (var iniEntry of celerityRound) {
					if (iniEntry.combatant.toString() === existingCombatant._id.toString()) {
						const position = celerityRound.indexOf(iniEntry);
						combat.iniOrder[celerityRoundPosition].splice(position, 1);
					}
				}
			}
			combat.markModified('iniOrder');
			await combat.save();

			// Remove the combatant itself
			await existingCombatant.remove();

			await message.reply(existingCombatant.name + " left combat.");

			if (combatantsTurn || combat.state === "INI") {
				return Combat.checkState(message, combat);
			}
		} catch (err) {
			console.log("combat-leave: " + err);
			return message.channel.send(err.message);
		}
	}
}