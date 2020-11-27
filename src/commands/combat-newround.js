var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-newround',
	description: 'Starts a new round in an ongoing combat. Execute to start Round 1.',
	oneline: true,
	hidden: true,
	aliases: ['round'],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	guildOnly: true,
	cooldown: 10,
	async execute(message, args) {
		try {
			// Is there an ongoing combat in this channel?
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel.");
			}

			return Combat.startNewRound(message, combat);
		} catch (err) {
			console.log("combat-newround: " + err);
			return message.channel.send(err.message);
		}
	}
}