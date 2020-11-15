const Discord = require('discord.js');
var Roller = require("../models/roller.js");

exports.ini = function (message, args) {
	if (args.length === 0) {
		message.author.send("Please tell me your ini modifier (Dexterity + Wits + unspent Celerity)");
		message.author.send("> " + process.env.PREFIX + "ini mod");
		return;
	}
	var mod = parseInt(args[0]);
	if (isNaN(mod)) {
		message.author.send("Invalid ini command. Please use");
		message.author.send("> " + process.env.PREFIX + "ini mod");
		return;
	}
	Roller.ini(message, mod);
}

exports.roll = function (message, args) {
	if (args.length === 0) {
		message.author.send("Please tell me how many dice I should throw.");
		message.author.send("> " + process.env.PREFIX + "roll dice [difficulty] [spec] [comment]");
		return;
	}
	var dicePool = parseInt(args[0]);
	if (isNaN(dicePool)) {
		message.author.send("Invalid dice pool. Please use");
		message.author.send("> " + process.env.PREFIX + "roll dice [difficulty] [spec] [comment]");
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