var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roll = require("../models/roll.js");

module.exports = {
	name: 'roll-my',
	description: 'DM. Shows a list of stored rolls for your selected character.',
	aliases: ['myrolls'],
	DMOnly: true,
	cooldown: 5,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (!character) {
					message.author.send("You don't have a character selected.");
					return;
				}
				Roll.find({
					character: character._id
				}).sort({ name: 1 })
					.exec(function (err, rolls) {
						if (err) {
							console.log(err);
							message.author.send(err.message);
							return;
						}
						if (rolls.length === 0) {
							message.author.send("You currently don't have any saved rolls for " + character.name + ".");
							return;
						}

						var msg = "Rolls saved for " + character.name + ":\n";
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
		});
	}
}