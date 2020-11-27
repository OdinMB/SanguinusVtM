var Player = require("../models/player.js");
var Character = require("../models/character.js");
const Discord = require('discord.js');

module.exports = {
	name: 'char-profile',
	description: 'Shows the profile of a character.',
	oneline: true,
	aliases: ['profile', 'p', 'show'],
	usage: '[name]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		Character.findOne({
			name: args[0]
		}).exec(function (err, character) {
			if (err) {
				console.log("char-profile - Character.findOne: " + err);
				return message.channel.send(err.message);
			}
			if (!character) {
				return message.channel.send("That caracter doesn't exist.");
			}

			Player.findById(character.player, function (err, player) {
				if (err) {
					console.log("char-profile - player.findById: " + err);
					return message.channel.send(err.message);
				}
				if (!player) {
					return message.channel.send("That caracter doesn't seem to be associated with a player. Please report!");
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