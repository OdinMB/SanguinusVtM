var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roll = require("../models/roll.js");

module.exports = {
	name: 'roll-my',
	description: 'Shows a list of stored rolls for your selected character.',
	oneline: true,
	aliases: ['myrolls'],
	cooldown: 5,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("roll-my - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}
				Roll.find({
					character: character._id
				}).sort({ name: 1 })
					.exec(function (err, rolls) {
						if (err) {
							console.log("roll-my - Roll.find: " + err);
							return message.author.send(err.message);
						}
						if (rolls.length === 0) {
							return message.author.send("You currently don't have any saved rolls for " + character.name + ".");
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