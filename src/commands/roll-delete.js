var Roll = require("../models/roll.js");
var Player = require("../models/player.js");

module.exports = {
	name: 'roll-delete',
	description: 'Deletes a saved roll. DM only.',
	aliases: [],
	usage: '[name]',
	args: true,
	DMOnly: true,
	cooldown: 3,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			// Does the player have a stored roll with that name?
			Roll.findOne({
				name: args[0],
				player: player._id
			}).exec(function (err, roll) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}

				if (!roll) {
					message.author.send("You don't have a saved roll with that name.");
					return;
				}

				roll.remove(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}
					message.author.send("Roll with the name " + args[0] + " was deleted.");
				});
			});
		});
	}
}