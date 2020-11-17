var mongoose = require('mongoose');
var Roll = require("../models/roll.js");
var Player = require("../models/player.js");

module.exports = {
	name: 'roll-save',
	description: 'DM. Assigns a name to a roll.',
	aliases: [],
	usage: '[name] [dice pool] [(opt) difficulty] [(opt) comment] [(opt) \"spec\"]',
	args: true,
	DMOnly: true,
	cooldown: 3,
	execute(message, args) {
		var name = args[0];
		var dicepool = args[1];
		// If difficulty is not a number, assume difficulty 6
		var difficulty = parseInt(args[2]);
		if (isNaN(difficulty)) {
			difficulty = 6;
			var comment = args.slice(2, args.length).join(' ');
		} else {
			var comment = args.slice(3, args.length).join(' ');
		}

		Player.getPlayer(message, function (player) {
			if (!player) return;

			// Does the player already have a stored roll with that name?
			Roll.findOne({
				name: name,
				player: player._id
			}).exec(function (err, roll) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				// If so: update the existing entry
				if (roll) {
					roll.dicepool = dicepool;
					roll.difficulty = difficulty;
					roll.comment = comment;
					roll.save(function (err) {
						if (err) {
							console.log(err);
							message.author.send(err.message);
							return;
						}
						message.author.send("Updated existing roll with name '" + roll.name + "'.");
					});
				} // Otherwise, create a new entry
				else {
					var newRoll = new Roll({
						_id: new mongoose.Types.ObjectId(),
						player: player._id,
						name: name,
						dicepool: dicepool,
						difficulty: difficulty,
						comment: comment
					});
					newRoll.save(function (err) {
						if (err) {
							console.log(err);
							message.author.send(err.message);
							return;
						}

						message.author.send("Created new roll with name '" + newRoll.name + "'.");
					});
				}
			});
		});
	}
}