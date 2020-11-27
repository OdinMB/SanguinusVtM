var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-summary',
	description: 'Shows the ini ranking and marks the player who has to act next.',
	oneline: true,
	aliases: ['summary'],
	usage: '',
	// args: true,
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			return Combat.showSummary(message, combat);
		} catch (err) {
			console.log("combat-summary: " + err);
			return message.channel.send(err.message);
		}
	}
}