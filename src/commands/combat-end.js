var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-end',
	description: 'Ends an ongoing combat in a channel.',
	oneline: true,
	aliases: [],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	guildOnly: true,
	// cooldown: 10,
	async execute(message, args) {
		try {
			// Is there an ONGOING combat in this channel?
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel.");
			}

			// If so, set state to FINISHED
			combat.state = "FINISHED";
			await combat.save();

			return message.channel.send("Combat in this channel is officially over.");

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}