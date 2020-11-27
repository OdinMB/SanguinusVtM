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
				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					name: args[0],
				});
				if (!existingCombatant) {
					return message.reply("in this combat, there is no NPC " + args[0] + ".");
				}
			}

			// Remove combatant from the combat's ini order
			const position = combat.iniOrder.indexOf(existingCombatant);
			combat.iniOrder.splice(position, 1);
			await combat.save();

			// Remove the combatant itself
			await existingCombatant.remove();

			return message.reply(existingCombatant.name + " left combat.");
		} catch (err) {
			console.log("combat-leave: " + err);
			return message.channel.send(err.message);
		}
	}
}