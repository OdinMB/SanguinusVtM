var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-end',
	description: 'Ends an ongoing combat in a channel.',
	aliases: [],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	guildOnly: true,
	// cooldown: 10,
	async execute(message, args) {
		try {
			// Is there an ONGOING combat in this channel?
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				status: 'ONGOING'
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel.");
			}

			// If so, set it to FINISHED
			combat.status = "FINISHED";
			await combat.save();

			return message.channel.send("Combat in this channel is officially over.");

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}