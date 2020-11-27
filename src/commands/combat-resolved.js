var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-resolved',
	description: 'Mark a previously declared combat action as resolved.',
	oneline: true,
	aliases: ['resolve'],
	// usage: '',
	// args: true,
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: 'RESOLVING'
			});
			if (!combat) {
				return message.reply("there is no combat in the RESOLVING stage right now. Case of wishful thinking?");
			}

			var player = await Player.getPlayerAsync(message);

			// Check: is it the player's turn?
			var currentCombatant = await Combatant.findById(
				combat.iniOrder[combat.iniCurrentPosition].combatant
			).populate('player', '_id name');
			if (currentCombatant.player._id.toString() !== player._id.toString()) {
				return message.reply("it's not your turn to resolve your action.");
			}

			// Delete action in the combat's ini order
			combat.iniOrder[combat.iniCurrentPosition].action = "Resolved";
			combat.iniCurrentPosition++;
			await combat.save();

			return Combat.checkState(message, combat);
		} catch (err) {
			console.log("combat-resolved: " + err);
			return message.channel.send(err.message);
		}
	}
}