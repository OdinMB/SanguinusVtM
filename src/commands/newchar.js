var mongoose = require('mongoose');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'newchar',
	description: 'Creates a new character. DM only.',
	aliases: ['newcharacter'],
	usage: '[name]',
	args: true,
	DMOnly: true,
	cooldown: 3,
	execute(message, args) {
		// Is there already a character with that name?
		Character.find({
			name: args[0]
		}).exec(function (err, character) {
			if (err) {
				console.log(err);
				message.author.send(err.message);
				return;
			}
			if (character.length > 0) {
				message.author.send("A character with that name already exists.");
				return;
			}

			// If not, create new Character document
			Player.getPlayer(message, function (player) {
				if (!player) return;

				var newCharacter = new Character({
					_id: new mongoose.Types.ObjectId(),
					player: player._id,
					name: args[0],
				});
				newCharacter.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.author.send("Created new character " + args[0]);

					if (!player.activeCharacter) {
						player.activeCharacter = newCharacter._id;
						player.save(function (err) {
							if (err) {
								console.log(err);
								message.author.send(err.message);
								return;
							}

							message.author.send("Made " + newCharacter.name + " your active character.");
						});
					} else {
						message.author.send(
							"If you want to make " + newCharacter.name + " your active character, use\n" +
							"> " + process.env.PREFIX + "activateChar " + newCharacter.name
						);
					}
				});
			});
		});
	}
}