var Roller = require("../models/roller.js");

module.exports = {
	name: 'ini',
	description: 'Rolls your initiative based on your ini modifier (Dexterity + Wits + unsued Celerity)',
	aliases: ['init'],
	usage: '[ini modifier]',
	args: true,
	cooldown: 5,
	execute(message, args) {
		var mod = parseInt(args[0]);
		if (isNaN(mod)) {
			message.author.send("Ini modifier needs to be a number.");
			return;
		}
		Roller.ini(message, mod);
	}
}