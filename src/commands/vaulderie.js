var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Vinculum = require("../models/vinculum.js");

module.exports = {
	name: 'vaulderie',
	description: 'ADMIN ONLY. Updates the vinculum ratings between characters. Use \'-name\' instead of \'name\' for characters who drank but didn\'t contribute blood.',
	aliases: [],
	usage: '[(opt) city] [character names 1-n]',
	wiki: "Creates a new vinculum rating or strengthens an existing vinculum if the roll demands it for every combination of characters that are provided to me." +
		"\n\nPlayers are informed about the new ratings, and whether or not they changed. The admin who executed the command will get a summary as well." +
		"Examples: \n- " + process.env.PREFIX + "vaulderie Joe Jonny Jane: runs a Vaulderie with the three characters" +
		"\n- " + process.env.PREFIX + "vaulderie Joe Jonny -Jane: runs a Vaulderie with the characters, but doesn't create or strengthen the vinculums of Joe and Jonny towards Jane" +
		"\n- " + process.env.PREFIX + "vaulderie city -Jane: runs a Vaulderie with every active character in the city, but doesn't create or strengthen the vinculums of Cainites towards Jane",
	args: true,
	guildOnly: true,
	adminOnly: true,
	cooldown: 10,
	async execute(message, args) {
		try {
			var city = false;
			var characters = [];
			var falseSabbat = [];

			// City mode
			if (args[0].toLowerCase() === "city") {
				city = true;
				args.shift();

				characters = await Character.find({
					status: 'active'
				}, '_id name').populate('player', 'discordID');
			}

			for (var arg of args) {
				// Names with "-" didn't contribute blood
				if (arg.substr(0, 1) === "-") {
					arg = arg.substr(1, arg.length - 1);
					falseSabbat.push(arg);
				}

				var character = await Character.findOne({
					status: 'active',
					name: arg
				}, '_id name').populate('player', 'discordID');

				if (!character) {
					return message.reply("There is no active character called '" + arg + "'.");
				} else if (!city) {
					characters.push(character);
                }
			}

			if (characters.length < 2) {
				return message.reply("A vaulderie needs at least two characters.");
			}

			var combinations = [];
			for (const characterBinding of characters) {
				for (const characterBound of characters) {
					// Ignore pairs consisting of the same character
					if (characterBinding !== characterBound &&
						// Ignore characters who didn't contribute blood
						!falseSabbat.includes(characterBinding.name)) {

						combinations.push([characterBinding, characterBound]);
					}
				}
			}

			var adminMsg = "Vinculum updates:";
			for (const combination of combinations) {
				var result = await Vinculum.strengthen(
					combination[0],
					combination[1]
				);
				var user = await message.client.users.fetch("" + combination[1].player.discordID);
				user.send(result);
				adminMsg += "\n- " + result;
			}
			message.author.send(adminMsg);
			message.reply("Vaulderie completed.");

		} catch (err) {
			console.log(err);
			return message.author.send(err.message);
		}
	}
}