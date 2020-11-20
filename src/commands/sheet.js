const Discord = require('discord.js');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

module.exports = {
	name: 'sheet',
	description: 'Displays the sheet of your currently selected character.',
	oneline: true,
	aliases: [],
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
				embed.setTitle(message.author.username);
				// embed.setDescription(comment);
				embed.setColor('#0099ff');
				//.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
				//.setThumbnail('https://i.imgur.com/wSTFkRM.png')
				// embed.setImage('https://www.sanguinus.org/klaus/botch.png')

				embed.addField('State', `BP: ${c.BP}/${c.BPMax}\nWP: ${c.WP}/${c.WPMax}\nHealth: ________`, true)
				embed.addField('Placeholder', `_`, true)
				embed.addField('Placeholder', `_`, true)

				embed.addField('Physical', `Strength: ${c.strength}\nDexterity: ${c.dexterity}\nStamina: ${c.stamina}`, true)
				embed.addField('Social', `Charisma: ${c.charisma}\nManipulation: ${c.manipulation}\nAppearance: ${c.appearance}`, true)
				embed.addField('Mental', `Perception: ${c.perception}\nIntelligence: ${c.intelligence}\nWits: ${c.wits}`, true)

				// embed.addField('\u200B', '\u200B');

				embed.addField('Talents', `Alertness: ${c.alertness}\nAthlectics: ${c.athletics}\nAwareness: ${c.awareness}\nBrawl: ${c.brawl}\nEmpathy: ${c.empathy}\nExpression: ${c.expression}\nIntimidation: ${c.intimidation}\nLeadership: ${c.leadership}\nStreetwise: ${c.streetwise}\nSubterfuge: ${c.subterfuge}`, true)
				embed.addField('Skills', `Animal Ken: ${c.animalken}\nCrafts: ${c.crafts}\nDrive: ${c.drive}\nEtiquette: ${c.etiquette}\nFirearms: ${c.firearms}\nLarceny: ${c.larceny}\nMelee: ${c.melee}\nPerformance: ${c.performance}\nStealth: ${c.stealth}\nSurvival: ${c.survival}`, true)
				embed.addField('Knowledges', `Academics: ${c.academics}\nComputers: ${c.computers}\nFinance: ${c.finance}\nInvestigation: ${c.investigation}\nLaw: ${c.law}\nMedicine: ${c.medicine}\nOccult: ${c.occult}\nPolitics: ${c.politics}\nScience: ${c.science}\nTechnology: ${c.technology}`, true)



				/*
				embed.addField('Specialties',
					// c.specialties.get('github', 'vkarpov15');
					'Charisma (Inspiring)\nPerception (Observant)\nEmpathy (Gain Trust)\nPerformance (Performance Art)',
					true)
				*/

				message.author.send(embed);

			});
		});
	}
}