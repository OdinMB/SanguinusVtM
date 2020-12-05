var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-end',
	description: 'Ends an ongoing combat in a channel.',
	oneline: true,
	aliases: ['end'],
	// usage: '[(opt) fixedIni] [(opt) noNotifications]',
	guildOnly: true,
	// cooldown: 10,
	async execute(message, args) {
		try {
			// Is there an ONGOING combat in this channel?
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel.");
			}

			// Delete combat and combatants
			// Old idea: combat.state = "FINISHED";
			await Combatant.deleteMany({
				combat: combat._id
			});
			await combat.remove();

			return message.channel.send("COMBAT IS OVER.");

		} catch (err) {
			console.log("combat-end: " + err);
			return message.channel.send(err.message);
		}
	}
}