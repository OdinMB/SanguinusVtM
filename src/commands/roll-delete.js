var Roll = require("../models/roll.js");
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'roll-delete',
	description: 'Deletes a saved roll for your selected character.',
	oneline: true,
	aliases: [],
	usage: '[name]',
	args: true,
	cooldown: 3,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("roll-delete - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}
				// Does the player have a stored roll with that name?
				Roll.findOne({
					name: args[0],
					character: character._id
				}).exec(function (err, roll) {
					if (err) {
						console.log("roll-delete - Roll.findOne: " + err);
						return message.author.send(err.message);
					}

					if (!roll) {
						return message.author.send("You don't have a saved roll with that name for " + character.name + ".");
					}

					roll.remove(function (err) {
						if (err) {
							console.log("roll-delete - roll.remove: " + err);
							return message.author.send(err.message);
						}
						message.author.send("Roll with the name " + args[0] + " was deleted for " + character.name + ".");
					});
				});
			});
		});
	}
}