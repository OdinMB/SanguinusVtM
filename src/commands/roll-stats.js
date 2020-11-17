var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll-stats',
	description: 'Performs a roll based on your character\'s stats.',
	aliases: ['rs'],
	usage: '[(opt) difficulty] [stat names 1-3] [(opt) "spec"]',
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

				var difficulty = 6;
				var dicepool = 0;
				var spec = 0;
				var comment = "";

				if (!isNaN(args[0])) {
					difficulty = args.shift();
                }

				args.forEach(function (arg) {
					arg = arg.toLowerCase();
					// Turns str into strength etc.
					arg = Character.shorthand(arg);

					if (arg === "spec") {
						spec = 1;
						comment += (comment.length !== 0 ? " + " : "") + arg;
					} else if (character[arg] || character[arg] === 0) {
						dicepool += character[arg];
						comment += (comment.length !== 0 ? " + " : "") + Character.readable(arg);

						// unskilled: Talents: no effect, Skills: +1/2 diff, Knowledge: not possible
						if (Character.isKnowledge(arg) && character[arg] === 0) {
							message.channel.send("Chances are that you cannot roll with a Knowledge of 0. Please ask an ST.");
						} else if (Character.isSkill(arg) && character[arg] === 0) {
							message.channel.send("Rolls with Skills you don't have usually have increased difficulty. Let the ST know before rolling.");
						}
					} else {
						message.channel.send("I don't recognize that stat.");
						return;
                    }
				});

				Roller.roll(message, dicepool, difficulty, comment);
			});
		});
	}
}