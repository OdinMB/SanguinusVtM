var mongoose = require('mongoose');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'char-select',
	description: 'Selects one of your characters.',
	oneline: true,
	aliases: ['select'],
	usage: '[name]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findOne({
				name: args[0]
			}).exec(function (err, character) {
				if (err) {
					console.log("char-select - Character.findOne: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("That caracter doesn't exist.");
				}
				if (!character.player.equals(player._id)) {
					return message.author.send("That character doesn't belong to you.");
				}

				player.selectedCharacter = character._id;
				player.save(function (err) {
					if (err) {
						console.log("char-select - player.save: " + err);
						return message.author.send(err.message);
					}

					message.author.send("Made " + character.name + " your active character.");
				});
			});
		});
	}
}