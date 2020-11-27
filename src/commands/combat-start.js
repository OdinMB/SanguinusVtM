var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-start',
	description: 'Starts combat in the channel and invites combatants to join.',
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
			var existingCombats = await Combat.find({
				channelDiscordID: "" + message.channel.id,
				state: { $not: /^FINISHED$/ }
			});
			if (existingCombats.length > 0) {
				return message.channel.send("There is already combat ongoing in this channel. Please close the existing combat before starting a new one.");
            }

			var combat = new Combat({
				_id: new mongoose.Types.ObjectId(),
				channelDiscordID: "" + message.channel.id,
				state: "JOINING"
			});
			await combat.save();

			return message.channel.send("Combat has started. `" + process.env.PREFIX + "join` if you want to participate.");

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}