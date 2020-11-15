var Player = require("../models/player.js");
var Roll = require("../models/roll.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll-saved',
	description: 'Performs a previously stored roll.',
	aliases: ['rs'],
	usage: '[roll name]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Roll.findOne({
				player: player._id,
				name: args[0]
			}).exec(function (err, roll) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (!roll) {
					message.author.send("You haven't saved a roll under that name.");
					return;
				}

				Roller.roll(message, roll.dicepool, roll.difficulty, roll.comment);
			});
		});
	}
}