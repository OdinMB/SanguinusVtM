var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'sheet-set',
	description: 'Sets a value on the sheet of your selected character. DM only.',
	aliases: ['ss'],
	usage: '[name of attribute/ability/etc.] [new value]',
	args: true,
	cooldown: 2,
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

				key = args[0].toLowerCase();
				if (key === "animal ken") {
					key = "animalken";
				}
				if (!Character.isEditable(key)) {
					message.author.send("'" + key + "' is not a valid thing to change on your sheet.");
					return;
                }

				character[key] = args[1];
				character.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.author.send("Set " + key + " to " + args[1] + ".");
				});
			});
		});
	}
}