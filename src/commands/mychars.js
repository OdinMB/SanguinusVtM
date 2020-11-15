var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'mychars',
	description: 'Shows a list of your characters. DM only.',
	aliases: ['mycharacters'],
	DMOnly: true,
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
					if (player.selectedCharacter.equals(character._id)) {
						msg += "\n- " + character.name + " (" + character.status + ") (Selected)";
					} else {
						msg += "\n- " + character.name + " (" + character.status + ")";
					}
				});
				msg += "\n```";
				message.author.send(msg);
			});
		});
	}
}