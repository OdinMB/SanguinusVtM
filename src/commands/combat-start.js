var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-start',
	description: '',
	aliases: ['combat'],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	wiki: "ASDF" +
		"Examples: \n- " + process.env.PREFIX + "combat-start",
	// args: true,
	guildOnly: true,
	// cooldown: 10,
	async execute(message, args) {
		try {
			// Only one combat per channel at any given time
			var existingCombats = await Combat.find({
				channelDiscordID: "" + message.channel.id,
				status: 'ONGOING'
			});
			if (existingCombats.length > 0) {
				return message.channel.send("There is already combat ongoing in this channel. Please close the existing combat before starting a new one.");
            }

			var combat = new Combat({
				_id: new mongoose.Types.ObjectId(),
				channelDiscordID: "" + message.channel.id,
			});
			var combatSaveResult = await combat.save();
			console.log(combatSaveResult);

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}