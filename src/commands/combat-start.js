var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat-start',
	description: 'Starts combat.',
	oneline: true,
	aliases: ['combat'],
	usage: '[(opt) slow/medium/fast/blitz] [(opt) fixini]',
	wiki: "Starts combat in the channel and invites combatants to join. If there already is a combat in that channel, shows an overview of the combat instead." +
		"\n\nExamples: \n- `" + process.env.PREFIX + "combat-start`: starts combat with default settings (no timers)" +
		"\n- `" + process.env.PREFIX + "combat fixini`: combatants roll ini only once and keep their ini rating for the combat." +
		"\n- `" + process.env.PREFIX + "combat slow|medium|fast`: players have a limited amount of time to roll ini and to declare and resolve their actions." +
		"\n\nTimers\n- slow: 120s for inis, 180s for declaring actions, no limit for resolving actions" + 
		"\n- medium: 60s for inis, 120s for declaring actions, 180s for resolving actions" +
		"\n- fast: 60s for inis, 60s for declaring actions, 120s for resolving actions" +
		"\n- blitz: 30s to join, 15s for inis, 30s for declaring actions, 60s for resolving actions",
	// args: true,
	guildOnly: true,
	cooldown: 10,
	async execute(message, args) {
		try {
			// Only one combat per channel at any given time
			var existingCombat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				// state: { $not: /^FINISHED$/ }
			});
			if (existingCombat) {
				return Combat.showSummary(message, existingCombat);
				// return message.channel.send("There is already combat ongoing in this channel. Please close the existing combat before starting a new one.");
            }

			var combat = new Combat({
				_id: new mongoose.Types.ObjectId(),
				channelDiscordID: "" + message.channel.id,
				state: "JOINING"
			});

			// Set parameters
			if (args && args.length > 0) {
				if (args.includes('fixini')) {
					combat.fixedIni = true;
				}
				if (args.includes('slow')) {
					combat.timeoutIni = 120 * 1000;
					combat.timeoutDeclare = 180 * 1000;
				}
				if (args.includes('medium')) {
					combat.timeoutIni = 60 * 1000;
					combat.timeoutDeclare = 120 * 1000;
					combat.timeoutResolve = 180 * 1000;
				}
				if (args.includes('fast')) {
					combat.timeoutIni = 60 * 1000;
					combat.timeoutDeclare = 60 * 1000;
					combat.timeoutResolve = 120 * 1000;
				}
				if (args.includes('blitz')) {
					combat.timeoutJoin = 30 * 1000;
					combat.timeoutIni = 15 * 1000;
					combat.timeoutDeclare = 30 * 1000;
					combat.timeoutResolve = 60 * 1000;
				}
            }

			await combat.save();

			await Combat.showSummary(message, combat);
			return Combat.checkState(message, combat);

		} catch (err) {
			console.log("combat-start: " + err);
			return message.channel.send(err.message);
		}
	}
}