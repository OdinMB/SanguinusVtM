var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-continue',
	description: 'Starts Round 1, skips players, and unpauses timers.',
	oneline: true,
	aliases: ['continue', 'next', 'skip'],
	usage: '',
	// args: true,
	guildOnly: true,
	cooldown: 1,
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

			if (combat.paused) {
				combat.paused = false;
				await combat.save();
				await Combat.showSummary(message, combat);
				return Combat.checkState(message, combat);
			} else {
				return Combat.continue(message, combat);
			}
		} catch (err) {
			console.log("combat-continue: " + err);
			return message.channel.send(err.message);
		}
	}
}