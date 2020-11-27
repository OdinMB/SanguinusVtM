const Discord = require('discord.js');
var Character = require("../models/character.js");
var Player = require("../models/player.js");
var Combat = require("../models/combat.js");
var Combatant = require("../models/combatant.js");

module.exports = {
	name: 'combat-summary',
	description: 'Shows the ini ranking and marks the player who has to act next.',
	oneline: true,
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
				state: { $not: /^FINISHED$/ }
			});
			if (!combat) {
				return message.reply("there is no combat happening in this channel right now. Case of wishful thinking?");
			}

			const embed = new Discord.MessageEmbed();
			embed.setTitle("Round " + combat.round);
			embed.setColor('#0099ff');

			switch (combat.state) {
				case "JOINING":
					embed.setDescription("Waiting for combatants to join.");
					break;
				case "INI":
					embed.setDescription("Waiting for combatants to roll ini.");
					break;
				case "DECLARING":
					embed.setDescription("Declaring actions.");
					break;
				case "RESOLVING":
					embed.setDescription("Resolving actions.");
					break;
            }
			

			var fieldInitiative = "";
			var fieldCharacters = "";
			var fieldActions = "";
			for (const iniEntry of combat.iniOrder) {
				var combatant = await Combatant.findById(iniEntry.combatant).populate('player', '_id name');

				fieldInitiative +=
					(fieldInitiative.length > 0 ? "\n" : "") +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
					(iniEntry.ini > 0 ? iniEntry.ini : "/") +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
				fieldCharacters +=
					(fieldCharacters.length > 0 ? "\n" : "") +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
					combatant.name + " (" + combatant.player.name + ")" +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
				fieldActions +=
					(fieldActions.length > 0 ? "\n" : "") +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
					(iniEntry.action ? iniEntry.action : "/") +
					(combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
			}
			embed.addField('Ini', fieldInitiative, true);
			embed.addField('Character', fieldCharacters, true);
			embed.addField('Action', fieldActions, true);

			return message.channel.send(embed);

		} catch (err) {
			console.log(err);
			return message.channel.send(err.message);
		}
	}
}