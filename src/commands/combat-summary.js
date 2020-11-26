const Discord = require('discord.js');
var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-summary',
	description: 'Provides a summary of the ongoing combat in a channel.',
	aliases: ['summary'],
	usage: '',
	// args: true,
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		try {
			// Find combat
			var combat = await Combat.findOne({
				channelDiscordID: "" + message.channel.id,
				status: 'ONGOING'
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			const embed = new Discord.MessageEmbed();
			embed.setTitle("Combat Summary");
			embed.setColor('#0099ff');

			var fieldInitiative = "";
			var fieldCharacters = "";
			var fieldPlayers = "";
			for (const iniEntry of combat.iniOrder) {
				var combatant = await Combatant.findById(iniEntry.combatant).populate('player', '_id name');

				fieldInitiative +=
					(fieldInitiative.length > 0 ? "\n" : "") +
					(iniEntry.ini > 0 ? iniEntry.ini : "/");
				fieldCharacters +=
					(fieldCharacters.length > 0 ? "\n" : "") +
					combatant.name;
				fieldPlayers +=
					(fieldPlayers.length > 0 ? "\n" : "") +
					combatant.player.name
			}
			embed.addField('Initiative', fieldInitiative, true);
			embed.addField('Character', fieldCharacters, true);
			embed.addField('Player', fieldPlayers, true);

			return message.channel.send(embed);

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}