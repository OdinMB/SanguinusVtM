var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-continue',
	description: 'Continues with combat. Use to start Round 1 and to skip players.',
	oneline: true,
	aliases: ['continue', 'skip'],
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

			return Combat.continue(message, combat);
		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}