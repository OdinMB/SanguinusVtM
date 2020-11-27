var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-join',
	description: 'Join combat with your selected character or with an NPC.',
	oneline: true,
	aliases: ['join'],
	usage: '[(opt) NPC name]',
	wiki: "ASDF" +
		"Examples: \n- " + process.env.PREFIX + "combat-join",
	// args: true,
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			var player = await Player.getPlayerAsync(message);
			var combatant = new Combatant({
				_id: new mongoose.Types.ObjectId(),
				combat: combat._id,
				player: player._id,
			});

			// Join with selected character
			if (args.length === 0) {
				character = await Character.findById(player.selectedCharacter)
				combatant.character = character._id;
				combatant.name = character.name;
			} // Join with NPC
			else {
				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					name: args[0],
				});
				if (existingCombatant) {
					return message.reply("there is already a combatant named " + args[0] + ". If you want to duplicate yourself, at least have the decency to extent the name with the suffix '_illegitimate_copy'.");
                }

				combatant.name = args[0];
            }
			await combatant.save();

			// Add combatant in the combat's ini order
			var iniOrderElement = {
				ini: -1,
				combatant: combatant._id,
			};
			await combat.iniOrder.push(iniOrderElement);
			await combat.save();

			message.reply("you joined combat with " + combatant.name + ".");

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}