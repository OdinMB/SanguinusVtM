var mongoose = require('mongoose');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'activatechar',
	description: 'Makes one of your characters the currently active one. DM only.',
	aliases: [],
	usage: '[name]',
	args: true,
	DMOnly: true,
	cooldown: 3,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findOne({
				name: args[0]
			}).exec(function (err, character) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (!character) {
					message.author.send("That caracter doesn't exist.");
					return;
				}
				if (!character.player.equals(player._id)) {
					message.author.send("That character doesn't belong to you.");
					return;
				}

				player.activeCharacter = character._id;
				player.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.author.send("Made " + character.name + " your active character.");
				});
			});
		});
	}
}