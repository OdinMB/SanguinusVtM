var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll',
	description: 'Performs a dice roll.',
	aliases: ['r'],
	usage: '[dice pool] [(opt) difficulty] [(opt) comment] [(opt) \"spec\"]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'roll 5: rolls 5 dice with difficulty 6' +
		'\n- ' + process.env.PREFIX + 'r 5 8 spec: rolls 5 dice with difficulty 8 with Specialty enabled, i.e. 10s count as two successes' +
		'\n\nThe luck score tells you what percentage of rolls with the same parameters are better and worse than your result. This information is based on a simulation with 10,000 rolls for each combination of dicepool, difficulty, and specialty.',
	args: true,
	cooldown: 3,
	execute(message, args) {
		var dicePool = parseInt(args[0]);
		if (isNaN(dicePool)) {
			message.author.send("Invalid dice pool.");
			return;
		}
		if (dicePool < 1 || dicePool > 100) {
			message.author.send("Dice pool too small or too large.");
			return;
		}

		// If second argument is not a number, 
		// assume difficulty 6
		var difficulty = parseInt(args[1]);
		if (isNaN(difficulty)) {
			difficulty = 6;
			var comment = args.slice(1, args.length).join(' ');
		} else {
			var comment = args.slice(2, args.length).join(' ');
		}

		Roller.roll(message, dicePool, difficulty, comment);
	}
}