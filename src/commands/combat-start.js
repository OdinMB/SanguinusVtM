var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-start',
	description: 'Starts combat.',
	oneline: true,
	aliases: ['combat'],
	usage: '[(opt) fixini]',
	wiki: "Starts combat in the channel and invites combatants to join. If there already is a combat in that channel, shows an overview of the combat instead." +
		"\n\nExamples: \n- `" + process.env.PREFIX + "combat-start`" +
		"\n- `" + process.env.PREFIX + "combat fixini`: combatants roll ini only once and keep their ini rating for the combat.",
	// args: true,
	guildOnly: true,
	cooldown: 10,
	async execute(message, args) {
		try {
			// Only one combat per channel at any given time
			var existingCombat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (existingCombat) {
				return Combat.showSummary(message, existingCombat);
				// return message.channel.send("There is already combat ongoing in this channel. Please close the existing combat before starting a new one.");
            }

			var combat = new Combat({
				_id: new mongoose.Types.ObjectId(),
				channelDiscordID: "" + message.channel.id,
				state: "JOINING"
			});

			// Set parameters
			if (args && args.length > 0) {
				if (args.includes('fixini')) {
					combat.fixedIni = true;
                }
            }

			await combat.save();

			return Combat.showSummary(message, combat);

		} catch (err) {
			console.log("combat-start: " + err);
			return message.channel.send(err.message);
		}
	}
}