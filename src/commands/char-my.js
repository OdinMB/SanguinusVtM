var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'char-my',
	description: 'Shows a list of your characters.',
	oneline: true,
	aliases: ['mychars'],
	cooldown: 5,
	execute(message, args) {

		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.find({
				player: player._id
			}).sort({ status: 1, name: 1 })
			.exec(function (err, characters) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (characters.length === 0) {
					message.author.send("You currently don't have any characters.");
					return;
				}

				var msg = "```Your characters:";
				characters.forEach(character => {
					msg += "\n\n- " + character.name + " (" + character.status + ")" +
						(player.selectedCharacter.equals(character._id) ? " (selected)" : "") +
						"\nClan: " + character.clan + " | Nature: " + character.nature + " | Demeanor: " + character.demeanor + " | Code: " + character.code;
				});
				msg += "\n```";
				message.author.send(msg);
			});
		});
	}
}