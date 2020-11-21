const Discord = require('discord.js');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'status',
	description: 'Displays BP, WP, and Health of your selected character.',
	oneline: true,
	aliases: ['health'],
	usage: '',
	args: false,
	cooldown: 5,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;

			Character.findById(player.selectedCharacter).exec(function (err, c) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}
				if (!c) {
					message.author.send("You don't have a character selected.");
					return;
				}

				const embed = new Discord.MessageEmbed();
				// embed.setTitle(c.name);
				embed.setColor('#0099ff');
				embed.addField(`${c.name}`, `${c.bp}/${Character.getMaxBP(c.generation)} BP\n${c.wp}/${c.willpower} WP`, true)
				embed.addField(`\u200B`, `${Character.getHealthStatus(c.health)}\n${Character.getHealthBox(c.health)}`, true)

				message.channel.send(embed);
			});
		});
	}
}