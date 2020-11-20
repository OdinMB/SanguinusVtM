var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roll = require("../models/roll.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll-load',
	description: 'Performs a previously stored roll for your selected character.',
	oneline: true,
	aliases: ['rl'],
	usage: '[roll name]',
	wiki: 'The luck score tells you what percentage of rolls with the same parameters are better and worse than your result. This information is based on a simulation with 10,000 rolls for each combination of dicepool, difficulty, and specialty.',
	args: true,
	cooldown: 3,
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
				Roll.findOne({
					character: character._id,
					name: args[0]
				}).exec(function (err, roll) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}
					if (!roll) {
						message.author.send("You haven't saved a roll under that name for " + character.name + ".");
						return;
					}

					Roller.roll(message, roll.dicepool, roll.difficulty, roll.comment);
				});
			});
		});
	}
}