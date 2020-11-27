var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-celerity',
	description: 'Grants an ini 0 action to your selected character or an NPC.',
	oneline: true,
	aliases: ['cel'],
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
				var existingCombatant = await Combatant.findOne({
					combat: combat._id,
					player: player._id,
					name: args[0]
				});
			}
			if (!existingCombatant) {
				return message.reply("the indicated character has not joined this combat yet.");
			}

			// Grant combatant an additional action with ini 0
			var iniOrderElement = {
				ini: 0,
				combatant: existingCombatant._id,
			};
			await combat.iniOrder.push(iniOrderElement);
			await combat.save();

			message.reply(existingCombatant.name + " has an additional action at ini 0.");

		} catch (err) {
			console.log("combat-celerity: " + err);
			return message.channel.send(err.message);
		}
	}
}