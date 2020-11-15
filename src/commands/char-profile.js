var Player = require("../models/player.js");
var Character = require("../models/character.js");
const Discord = require('discord.js');

module.exports = {
	name: 'char-profile',
	description: 'Shows the profile of a character.',
	aliases: ['p', 'show'],
	usage: '[name]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		Character.findOne({
			name: args[0]
		}).exec(function (err, character) {
			if (err) {
				console.log(err);
				message.channel.send(err.message);
				return;
			}
			if (!character) {
				message.channel.send("That caracter doesn't exist.");
				return;
			}

			Player.findById(character.player, function (err, player) {
				if (err) {
					console.log(err);
					message.channel.send(err.message);
					return;
				}
				if (!player) {
					message.channel.send("That caracter doesn't seem to be associated with a player. Please report!");
					return;
				}

				const embed = new Discord.MessageEmbed();
				embed.setColor('#0099ff');
				embed.setTitle((character.fullname ? character.fullname : character.name));
				if (character.URL) {
					embed.setURL(character.URL);
				}
				if (character.description) {
					embed.setDescription(character.description);
				}
				if (character.rpstyle) {
					embed.addField('RP Style', character.rpstyle);
				}
				if (character.thumbnailURL) {
					embed.setThumbnail(character.thumbnailURL);
				}
				if (character.imageURL) {
					embed.setImage(character.imageURL);
				}

				embed.setFooter(character.name + " is played by " + player.name);
				// embed.addField('\u200B', '\u200B');

				message.channel.send(embed);
			});
		});
	}
}