var mongoose = require('mongoose');
var Roll = require("../models/roll.js");
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'roll-save',
	description: 'Saves a roll for your selected character under a name.',
	aliases: [],
	usage: '[name] [dice pool] [(opt) difficulty] [(opt) comment] [(opt) \"spec\"]',
	wiki: 'Example:\n- ' + process.env.PREFIX + 'roll-save hunt 7 5 Hunting (Base 7, -2 Auspex/Presence): shortens your hunting roll to \'' + process.env.PREFIX + 'rl hunt\'',
	args: true,
	cooldown: 3,
	execute(message, args) {
		var name = args[0];
		var dicepool = args[1];
		// If difficulty is not a number, assume difficulty 6
		var difficulty = parseInt(args[2]);
		if (isNaN(difficulty)) {
			difficulty = 6;
			var comment = args.slice(2, args.length).join(' ');
		} else {
			var comment = args.slice(3, args.length).join(' ');
		}

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("roll-save - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}
				// Does the character already have a stored roll with that name?
				Roll.findOne({
					name: name,
					character: character._id
				}).exec(function (err, roll) {
					if (err) {
						console.log("roll-save - Roll.findOne: " + err);
						return message.author.send(err.message);
					}
					// If so: update the existing entry
					if (roll) {
						roll.dicepool = dicepool;
						roll.difficulty = difficulty;
						roll.comment = comment;
						roll.save(function (err) {
							if (err) {
								console.log("roll-save - roll.save: " + err);
								return message.author.send(err.message);
							}
							message.author.send("Updated existing roll with name '" + roll.name + "' for " + character.name + ".");
						});
					} // Otherwise, create a new entry
					else {
						var newRoll = new Roll({
							_id: new mongoose.Types.ObjectId(),
							character: character._id,
							name: name,
							dicepool: dicepool,
							difficulty: difficulty,
							comment: comment
						});
						newRoll.save(function (err) {
							if (err) {
								console.log("roll-save - newRoll.save: " + err);
								return message.author.send(err.message);
							}

							message.author.send("New roll with name '" + newRoll.name + "' was saved for " + character.name + ".");
						});
					}
				});
			});
		});
	}
}