var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'damage-take',
	description: 'Take damage with your selected character.',
	oneline: true,
	aliases: ['take'],
	usage: '[amount] [b/l/a]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'damage-take 3 bash: takes 3 bashing damage' +
		'\n- ' + process.env.PREFIX + 'take 2 a: takes 2 aggrevated damage',
	args: true,
	cooldown: 3,
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
					message.reply("You don't have a character selected.");
					return;
				}

				if (!args[0] || !args[1]) {
					message.reply("Please tell me the amount and type of damage that you would like to suffer. (And we both know you like it.)");
					return;
				}

				var amount = args[0]
				if (isNaN(amount) || amount < 1) {
					message.reply("The amount of damage needs to be a number. A positive one. Don't try to cheat.");
					return;
				}

				switch (args[1].toLowerCase()) {
					case "b":
					case "bas":
					case "bash":
					case "bashing":
						var type = 1;
						break;
					case "l":
					case "let":
					case "leth":
					case "lethal":
						var type = 2;
						break;
					case "a":
					case "agg":
					case "aggrevated":
						var type = 3;
						break;
					default:
						message.reply("Please let me know which type of damage you want to suffer. I won't judge.");
						return;
                }

				var takeDamageResult = Character.takeDamage(character.health, amount, type);
				var newHealth = takeDamageResult[0];
				var finalDeath = takeDamageResult[1];

				character.health = newHealth;
				character.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.reply(
						character.name + " suffered " + amount + " " +
						(type === 1 ? "bashing" : (type === 2 ? "lethal" : "aggrevated")) + " damage." +
						(finalDeath ? "\n**" + character.name + " met Final Death!**\nPSA: `" + process.env.PREFIX + "char-new name` lets you create a new character." : "") +
						"\nStatus: " + Character.getHealthStatus(newHealth) + ", Damage: " + Character.getHealthBox(newHealth)
					);
				});
			});
		});
	}
}