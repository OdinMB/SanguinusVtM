const Discord = require('discord.js');
var Roller = require("../models/roller.js");

module.exports = {
	name: 'roll',
	description: 'Performs a dice roll and shows the result in the channel.',
	aliases: ['r'],
	usage: '[dice pool] [(opt) difficulty] [(opt) comment] [(opt) \"spec\"]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		var dicePool = parseInt(args[0]);
		if (isNaN(dicePool)) {
			message.author.send("Invalid dice pool.");
			return;
		}
		if (dicePool <= 0 || dicePool > 100) {
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