var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

module.exports = {
	name: 'combat',
	description: 'Starts combat or changes an existing combat.',
	oneline: true,
	aliases: [],
	usage: '[(opt) notimer/slow/medium/fast/blitz] [(opt) fixini]',
	wiki: "Starts combat in the channel and invites combatants to join. If there already is a combat in that channel, changes the settings of that combat." +
		"\n\nExamples: \n- `" + process.env.PREFIX + "combat`: starts combat with default settings (no timers and new inis every round)" +
		"\n- `" + process.env.PREFIX + "combat fixini`: combatants roll ini only once and keep their ini rating for the combat." +
		"\n- `" + process.env.PREFIX + "combat slow|medium|fast`: players have a limited amount of time to roll ini and to declare and resolve their actions." +
		"\n\nTimers\n- slow: 120s for inis, 180s for declaring actions, no limit for resolving actions" + 
		"\n- medium: 60s for inis, 120s for declaring actions, 180s for resolving actions" +
		"\n- fast: 60s for inis, 60s for declaring actions, 120s for resolving actions" +
		"\n- blitz: 30s to join, 15s for inis, 30s for declaring actions, 60s for resolving actions",
	// args: true,
	guildOnly: true,
	cooldown: 4,
	async execute(message, args) {
		try {
			// Only one combat per channel at any given time
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id
			});
			if (!combat) {
				var combat = new Combat({
					_id: new mongoose.Types.ObjectId(),
					channelDiscordID: "" + message.channel.id,
					state: "JOINING",
					iniOrder: [[]],
				});
				var newCombat = true;
			} else {
				var newCombat = false;
            }

			// Set parameters
			if (args && args.length > 0) {
				if (args.includes('fixini')) {
					combat.fixedIni = true;
				}
				if (args.includes('notimer')) {
					combat.timeoutJoin = 0;
					combat.timeoutIni = 0;
					combat.timeoutDeclare = 0;
					combat.timeoutResolve = 0;
				}
				if (args.includes('slow')) {
					combat.timeoutJoin = 0;
					combat.timeoutIni = 120 * 1000;
					combat.timeoutDeclare = 180 * 1000;
					combat.timeoutResolve = 0;
				}
				if (args.includes('medium')) {
					combat.timeoutJoin = 0;
					combat.timeoutIni = 60 * 1000;
					combat.timeoutDeclare = 120 * 1000;
					combat.timeoutResolve = 180 * 1000;
				}
				if (args.includes('fast')) {
					combat.timeoutJoin = 0;
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

			if (newCombat) {
				await Combat.showSummary(message, combat);
				return Combat.checkState(message, combat);
			} else {
				return message.reply("Changed settings (starting next phase, declare, or resolve).");
				// return Combat.checkState(message, combat);
            }

		} catch (err) {
			console.log("combat-start: " + err);
			return message.channel.send(err.message);
		}
	}
}