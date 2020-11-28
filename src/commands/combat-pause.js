var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-pause',
	description: 'Pauses combat timers. Use ' + process.env.PREFIX + 'combat-continue to continue.',
	oneline: true,
	aliases: ['pause'],
	usage: '',
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		try {
			// Only one combat per channel at any given time
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			combat.paused = true;

			// Stop timers and countdown messages
			combat.expirationTime = 0;
			combat.timerMessageDiscordID = "";

			await combat.save();

			message.channel.send("**COMBAT PAUSED**");
		} catch (err) {
			console.log("combat-pause: " + err);
			return message.channel.send(err.message);
		}
	}
}