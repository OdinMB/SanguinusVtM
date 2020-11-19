var Player = require("../models/player.js");
var Character = require("../models/character.js");

/*
 * ToDo:
 * - Warn about frenzy depending on Virtue
 * - Warn about BP spent in one turn depending on Generation
 */
module.exports = {
	name: 'bp-feed',
	description: 'Gain BP with your selected character. Gains full BP, if no amount is provided.',
	aliases: ['feed'],
	usage: '[(opt) amount]',
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

				if (args[0] && isNaN(args[0])) {
					message.reply("Invalid amount of BP.");
					return;
				} else if (args[0] && !isNaN(args[0])) {
					var amount = parseInt(args[0]);
				} else {
					var amount = character.BPMax - character.BP;
				}

				if ((character.BP + amount) > character.BPMax) {
					message.reply("That's more than you can take. Reducing amount to " + (character.BPMax - character.BP) + ".");
					amount = character.BPMax - character.BP;
				}

				character.BP += amount;
				character.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.reply(character.name + " gained " + amount + " BP. Now at " + character.BP + "/" + character.BPMax + " BP.");
				});
			});
		});
	}
}