var Character = require("../models/character.js");

module.exports = {
	name: 'wp-replenish',
	description: 'ADMIN ONLY. Replenishes 1 WP for all active characters, or one character if a name is provided.',
	aliases: [],
	usage: '[(opt) character name]',
	guildOnly: true,
	adminOnly: true,
	hidden: true,
	cooldown: 6,
	execute(message, args) {
		if (!args.length) {
			Character.updateMany(
				{ $where: "this.willpower > this.wp" },
				{ $inc: { "wp": 1 } }
			).exec(function (err, result) {
				if (err) {
					console.log("wp-replenish - character.updateMany: " + err);
					return message.author.send(err.message);
				}
				message.reply("All characters replenished 1 WP.");
			});
		} else {
			Character.updateOne(
				{
					name: { $eq: args[0] },
					$where: "this.willpower > this.wp"
				},
				{ $inc: { "wp": 1 } }
			).exec(function (err, result) {
				if (err) {
					console.log("wp-replenish - character.updateOne: " + err);
					return message.author.send(err.message);
				}
				// console.log(result);
				if (!result.n) {
					message.reply(args[0] + " was already at full WP (or doesn't exist).");
				} else {
					message.reply(args[0] + " replenished 1 WP.");
				}
			});
        }
	}
}