var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll-stats',
	description: 'Performs a roll based on your character\'s stats.',
	aliases: ['rs'],
	usage: '[(opt) difficulty] [stat names 1-3] [(opt) "spec"]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'roll-stats dexterity melee: rolls your dexterity + melee with difficulty 6' +
		'\n- ' + process.env.PREFIX + 'rs dex mel spec: also rolls your dexterity + melee with difficulty 6, but with Specialty enabled' +
		'\n\nMost stats can be abbreviated with three letters. Beware of abilities that share their first letters with attributes:\n- Intimidation (short intim; int = intelligence)\n- Streetwise (short street; str = strength)\n- Performance (short perf/perform; per = perception)' +
		'\n\nThe luck score tells you what percentage of rolls with the same parameters are better and worse than your result. This information is based on a simulation with 10,000 rolls for each combination of dicepool, difficulty, and specialty.',
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
				var comment = "";

				if (!isNaN(args[0])) {
					difficulty = args.shift();
                }

				args.forEach(function (arg) {
					arg = arg.toLowerCase();
					// Turns str into strength etc.
					arg = Character.shorthand(arg);

					if (arg === "spec") {
						comment += (comment.length !== 0 ? " + " : "") + "Spec";
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