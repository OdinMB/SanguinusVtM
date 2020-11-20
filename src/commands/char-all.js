var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'char-all',
	description: 'Shows a list of all active (and paused) characters.',
	oneline: true,
	aliases: ['allchars'],
	cooldown: 5,
	execute(message, args) {

		Character.find().or([{ status: 'active' }, { status: 'paused' }])
			.populate('player', 'name')
			.sort({ status: 1, name: 1 })
			.exec(function (err, characters) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (characters.length === 0) return

				var msg = "```The following PCs are currently part of our chronicle:";
				characters.forEach(character => {
					msg += "\n- " + character.name + " (played by " + character.player.name + ")" +
						(character.status === 'paused' ? " (" + character.status + ")" : "");
				});
				msg += "\n```";
				message.author.send(msg);
			});
	}
}