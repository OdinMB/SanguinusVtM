var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-start',
	description: 'Starts combat in the channel and invites combatants to join.',
	oneline: true,
	aliases: ['combat'],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	wiki: "ASDF" +
		"Examples: \n- " + process.env.PREFIX + "combat-start",
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
			await combat.save();

			return Combat.showSummary(message, combat);

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}