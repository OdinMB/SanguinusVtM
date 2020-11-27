var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roll = require("../models/roll.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll-load',
	description: 'Performs a previously saved roll for your selected character.',
	aliases: ['rl'],
	usage: '[roll name] [(opt) +/- modifier]',
	wiki: 'Example:\n- `' + process.env.PREFIX + 'roll-load mysavedroll`: Rolls whatever you saved under the name mysavedroll' +
		'\n- `' + process.env.PREFIX + 'rl mysavedroll -2`: Rolls mysavedroll with 2 fewer dice.' +
		'\n\nThe luck score tells you how your result ranks among 10,000 simulated rolls wit the same dicepool, difficulty, and specialty.',
	args: true,
	cooldown: 3,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("roll-load - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}
				Roll.findOne({
					character: character._id,
					name: args[0]
				}).exec(function (err, roll) {
					if (err) {
						console.log("roll-load - Roll.findOne: " + err);
						return message.author.send(err.message);
					}
					if (!roll) {
						return message.author.send("You haven't saved a roll under that name for " + character.name + ".");
					}

					var dicepool = roll.dicepool;
					var comment = roll.comment;
					// +/- modifiers
					if (args[1] && (args[1].substr(0, 1) === "-" || args[1].substr(0, 1) === "+")) {
							if (isNaN(args[1].substr(1, args[1].length-1))) {
								return message.channel.send("I don't recognize that parameter.");
							}
							if (args[1].substr(0, 1) === "-") {
								dicepool -= parseInt(args[1].substr(1, args[1].length-1));
							} else {
								dicepool += parseInt(args[1].substr(1, args[1].length-1));
							}
							comment += (comment.length !== 0 ? " + " : "") + "Mod (" + args[1] + ")";
					}

					Roller.roll(message, dicepool, roll.difficulty, comment);
				});
			});
		});
	}
}