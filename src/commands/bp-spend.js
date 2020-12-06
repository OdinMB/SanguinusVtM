var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'bp-spend',
	description: 'Spends BP with your selected character. Spends 1 BP if no amount is provided.',
	aliases: ['bp', 'blood-spend'],
	usage: '[(opt) amount] [(opt) comment]',
	hidden: true,
	cooldown: 2,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("bp-spend - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}

				if (args[0] && !isNaN(args[0])) {
					var amount = parseInt(args.shift());
				} else {
					var amount = 1;
				}
				if (character.bp < amount) {
					return message.reply("You don't have enough BP. Currently " + character.bp + "/" + Character.getMaxBP(character.generation) + "." +
						"Keep in mind, if you spend BP without having any, you take leathal damage instead.");
                }

				character.bp -= amount;
				character.save(function (err) {
					if (err) {
						console.log("by-spend - character.save: " + err);
						return message.author.send(err.message);
					}
					message.reply(character.name + " spent " + amount + " BP" +
						(args[0] ? " on '" + args.join(' ') + "'" : "") + ". " +
						character.bp + "/" + Character.getMaxBP(character.generation) + " BP left." +
						(amount > Character.getMaxBPPerTurn(character.generation) ? "\nKeep in mind: you are only allowed to spend " + Character.getMaxBPPerTurn(character.generation) + " BP per turn." : "") + 
						(character.bp <= (7 - character.instinct) ? "\nWarning: your BP is at or below the frenzy threshold of " + (7 - character.instinct) + " (7 - Instict " + character.instinct + ")." : "")
					);
				});
			});
		});
	}
}