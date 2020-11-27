var Player = require("../models/player.js");
var Character = require("../models/character.js");
var Vinculum = require("../models/vinculum.js");

module.exports = {
	name: 'vinculums',
	description: 'Shows the vinculums of the selected character.',
	aliases: ['myvincs'],
	usage: '',
	oneline: true,
	cooldown: 6,
	async execute(message, args) {
		Player.getPlayer(message, async function (player) {
			if (!player) return;
			try {
				character = await Character.findById(player.selectedCharacter)
				if (!character) {
					return message.reply("You don't have a character selected.");
				}

				vinculums = await Vinculum.find({
					bound: character._id
				}).populate('binding', 'name');

				var msg = character.name + "'s vinculums:";
				for (const vinculum of vinculums) {
					msg += "\n- " + vinculum.binding.name + ": " + vinculum.rating;
				}
				message.author.send(msg);

			} catch (err) {
				console.log("vinculum: " + err);
				return message.author.send(err.message);
			}
		});
	}
}