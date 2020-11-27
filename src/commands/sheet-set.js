var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'sheet-set',
	description: 'Sets a value on the sheet of your selected character. Via DM only.',
	oneline: true,
	aliases: ['ss'],
	usage: '[stat name] [value]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'sheet-set dexterity 3: sets your Dexterity to 3' +
		'\n- ' + process.env.PREFIX + 'ss dex 3: also sets your Dexterity to 3' +
		'\n\nMost stats can be abbreviated with three letters. Beware of abilities that share their first letters with attributes:\n- Intimidation (short intim; int = intelligence)\n- Streetwise (short street; str = strength)\n- Performance (short perf/perform; per = perception)',
	args: true,
	DMOnly: true,
	cooldown: 2,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("sheet-set - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}

				key = args[0].toLowerCase();
				key = Character.shorthand(key);
				if (!Character.isEditable(key)) {
					return message.author.send("'" + key + "' is not a valid stat.");
                }

				character[key] = args[1];
				character.save(function (err) {
					if (err) {
						console.log("sheet-set - character.save: " + err);
						return message.author.send(err.message);
					}

					message.author.send("Set " + Character.readable(key) + " to " + args[1] + ".");
				});
			});
		});
	}
}