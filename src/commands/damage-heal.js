var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'damage-heal',
	description: 'Heal damage with your selected character.',
	oneline: true,
	aliases: ['heal'],
	usage: '[amount] [b/l/a]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'damage-heal 2 bash: heals 2 bashing damage' +
		'\n- ' + process.env.PREFIX + 'heal 1 a: heals 1 aggrevated damage',
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
					message.reply("Please tell me the amount and type of damage that you want to heal.");
					return;
				}

				var amount = args[0]
				if (isNaN(amount) || amount < 1) {
					message.reply("The amount of damage you want to heal needs to be a number. If someone told you to type in a negative number, don't listen to them. They tried to trick you.");
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
						message.reply("Please let me know which type of damage you want to heal.");
						return;
				}

				var healDamageResult = Character.healDamage(character.health, amount, type);
				var newHealth = healDamageResult[0];
				var amountHealed = healDamageResult[1];

				character.health = newHealth;
				character.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.reply(
						character.name + " healed " + parseInt(amountHealed) + " " +
						(type === 1 ? "bashing" : (type === 2 ? "lethal" : "aggrevated")) + " damage." +
						"\nStatus: " + Character.getHealthStatus(newHealth) + ", Damage: " + Character.getHealthBox(newHealth)
					);
				});
			});
		});
	}
}