var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'wp',
	description: 'Spends 1 WP with your selected character.',
	oneline: true,
	aliases: [],
	usage: '[(opt) comment]',
	hidden: true,
	cooldown: 6,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, character) {
				if (err) {
					console.log("wp - character.findById: " + err);
					return message.author.send(err.message);
				}
				if (!character) {
					return message.author.send("You don't have a character selected.");
				}

				if (character.wp < 1) {
					return message.reply("You have no WP left.");
				}

				character.wp--;
				character.save(function (err) {
					if (err) {
						console.log("wp - character.save: " + err);
						return message.author.send(err.message);
					}

					message.reply(character.name + " spent 1 WP" +
						(args[0] ? " on '" + args.join(' ') + "'" : "") + ". " +
						character.wp + "/" + character.willpower + " WP left.");
				});
			});
		});
	}
}