var Player = require("../models/player.js");
var Roll = require("../models/roll.js");

module.exports = {
	name: 'roll-my',
	description: 'Shows a list of your stored rolls. DM only.',
	aliases: ['myrolls'],
	DMOnly: true,
	cooldown: 5,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Roll.find({
				player: player._id
			}).sort({ name: 1 })
				.exec(function (err, rolls) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}
					if (rolls.length === 0) {
						message.author.send("You currently don't have any stored rolls.");
						return;
					}

					var msg = "Your rolls:\n";
					rolls.forEach(roll => {
						msg += "> **" + roll.name + "**: " +
							"Dice " + roll.dicepool + ", " +
							"Difficulty " + roll.difficulty +
							(roll.comment ? ", Comment: '" + roll.comment + "'" : "") + 
							"\n";
					});
					message.author.send(msg);
				});
		});
	}
}