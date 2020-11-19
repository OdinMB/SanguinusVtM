var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'sheet-set',
	description: 'DM. Sets a value on the sheet of your selected character.',
	aliases: ['ss'],
	usage: '[stat name] [value]',
	wiki: 'Examples:\n- ' + process.env.PREFIX + 'sheet-set dexterity 3: sets your Dexterity to 3' +
		'\n- ' + process.env.PREFIX + 'ss dex 3: also sets your Dexterity to 3' +
		'\nMost stats can be abbreviated with three letters. Beware of abilities that share their first letters with attributes:\n- Intimidation (short intim)\n- Streetwise (short street)\n- Performance (short perf/perform)',
	args: true,
	DMOnly: true,
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

				key = args[0].toLowerCase();
				key = Character.shorthand(key);
				if (!Character.isEditable(key)) {
					message.author.send("'" + key + "' is not a valid stat.");
					return;
                }

				character[key] = args[1];
				character.save(function (err) {
					if (err) {
						console.log(err);
						message.author.send(err.message);
						return;
					}

					message.author.send("Set " + Character.readable(key) + " to " + args[1] + ".");
				});
			});
		});
	}
}