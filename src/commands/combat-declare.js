var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

// https://www.w3resource.com/javascript-exercises/javascript-string-exercise-16.php
text_truncate = function (str, length, ending) {
	if (length == null) {
		length = 50;
	}
	if (ending == null) {
		ending = '...';
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
};

module.exports = {
	name: 'combat-declare',
	description: 'Sets the action of a character in combat.',
	oneline: true,
	aliases: ['declare'],
	usage: '[action]',
	args: true,
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: 'DECLARING'
			});
			if (!combat) {
				return message.reply("there is no combat in the DECLARING stage right now. Case of wishful thinking?");
			}

			var player = await Player.getPlayerAsync(message);

			// Check: is it the player's turn?
			var currentCombatant = await Combatant.findById(
				combat.iniOrder[combat.iniCurrentPosition].combatant
			).populate('player', '_id name');
			if (currentCombatant.player._id.toString() !== player._id.toString()) {
				return message.reply("it's not your turn to declare your action.");
            }

			// Write action into the combat's ini order
			var action = text_truncate(args.join(' '));
			combat.iniOrder[combat.iniCurrentPosition].action = action;
			combat.iniCurrentPosition--;
			await combat.save();
			await message.reply(currentCombatant.name + "'s action was set to '" + action + "'.");

			// If all actions are declared, move on to the RESOLVING state
			if (combat.iniCurrentPosition === -1) {
				combat.state = "RESOLVING";
				combat.iniCurrentPosition = 0;
				await combat.save();
				await message.channel.send("All actions are declared. Resolving actions.");
				await Combat.promptResolveAction(message, combat);
			} else {
				await Combat.promptDeclareAction(message, combat);
            }

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}