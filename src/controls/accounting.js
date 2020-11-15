const Discord = require('discord.js');
var mongoose = require('mongoose');
var Player = require("../models/player.js");
var Character = require("../models/character.js");

function getPlayer(message, callback) {
	Player.findOne({ discordID: message.author.id }, function (err, player) {
		if (err) {
			console.log(err);
			message.author.send(err.message);
			return;
		}

		if (player) {
			callback(player);
		} // If the player is not yet registered, do that now
		else {
			createPlayer(message, function (newPlayer) {
				callback(newPlayer);
			});
        }
	});
}

/*
 * Sets the properties of the active character in a series of prompts
 */
exports.setDescription = function (message, args) {
	if (message.channel.type !== 'dm') {
		message.author.send("Please use this command in a direct message to me.");
		return;
    }

	getPlayer(message, function (player) {
		if (!player) return;
		if (!player.activeCharacter) {
			message.author.send("You don't have an active character. Use the following command to activate one:");
			message.author.send("> " + process.env.PREFIX + "activateChar name");
			message.author.send("If you don't have any characters yet, use this command to create one. It will be automatically activated.");
			message.author.send("> " + process.env.PREFIX + "newChar name");
			return;
        }

		Character.findById(player.activeCharacter).exec(function (err, character) {
			if (err) {
				console.log(err);
				message.author.send(err.message);
				return;
			}
			if (!character) {
				message.author.send("Your active character doesn't exist. That shouldn't happen. Please report.");
				return;
			}

			const filter = response => { return true; };

			message.channel.send(
				"Setting up your character description takes a few steps. I will cancel the process if you use another command, if there is an error, or if you do not respond for 1 hour.\n" + 
				"[1/7] Characters are \"called\" using a unique one-word shortname. What is this character's Call? (Example: Paul, JohnSmith. 'Skip' to keep the name unchanged.)\n" +
				"Your current Call is " + character.name + "."
			).then(() => {
				message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
					.then(collected => {

						if (character.name = collected.first().content !== "skip") {
							character.name = collected.first().content
						}
						character.save(function (err) {
							if (err) {
								console.log(err);
								message.author.send(err.message);
								message.author.send("Setting up your character description was cancelled.");
								return;
							}
							// Successful end of step 1

							// Starting step 2
							message.channel.send(
								"New name is " + character.name + "\n" +
								"[2/7] (Optional) What is your character's full name? This displays on your character profile. (Max Length: 40, or skip this.)\n" +
								"The character's current full name is " + (character.fullname ? character.fullname : "not set") + "."
							).then(() => {
								message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
									.then(collected => {

										if (collected.first().content !== "skip") {
											character.fullname = collected.first().content
										}
										character.save(function (err) {
											if (err) {
												console.log(err);
												message.author.send(err.message);
												message.author.send("Setting up your character description was cancelled.");
												return;
											}
											// Successful end of step 2

											// Starting step 3
											message.channel.send(
												"New full name is " + (character.fullname ? character.fullname : "not set") + ".\n" +
												"[3/7] (Optional) Add a website URL to your character's full name, such as a wiki page. (Or skip this.)\n" +
												"The character's current website URL is " + (character.URL ? character.URL : "not set") + "."
											).then(() => {
												message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
													.then(collected => {

														if (collected.first().content !== "skip") {
															character.URL = collected.first().content
														}
														character.save(function (err) {
															if (err) {
																console.log(err);
																message.author.send(err.message);
																message.author.send("Setting up your character description was cancelled.");
																return;
															}
															// Successful end of step 3

															// Starting step 4: imageURL
															message.channel.send(
																"New website URL is " + (character.URL ? character.URL : "not set") + ".\n" +
																"[4/7] (Optional) Add the URL of an image that shows your character. (Or skip this.)\n" +
																"The character's current image URL is " + (character.imageURL ? character.imageURL : "not set") + "."
															).then(() => {
																message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
																	.then(collected => {

																		if (collected.first().content !== "skip") {
																			character.imageURL = collected.first().content
																		}
																		character.save(function (err) {
																			if (err) {
																				console.log(err);
																				message.author.send(err.message);
																				message.author.send("Setting up your character description was cancelled.");
																				return;
																			}
																			// Successful end of step 4

																			// Starting step 5: thumbnail URL
																			message.channel.send(
																				"New image URL is " + (character.imageURL ? character.imageURL : "not set") + ".\n" +
																				"[5/7] (Optional) Add the URL of a badge or thumbnail that will decorate your character profile, e.g. your pack or clan symbol. (Or skip this.)\n" +
																				"The character's current thumbnail URL is " + (character.thumbnailURL ? character.thumbnailURL : "not set") + "."
																			).then(() => {
																				message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
																					.then(collected => {

																						if (collected.first().content !== "skip") {
																							character.thumbnailURL = collected.first().content
																						}
																						character.save(function (err) {
																							if (err) {
																								console.log(err);
																								message.author.send(err.message);
																								message.author.send("Setting up your character description was cancelled.");
																								return;
																							}
																							// Successful end of step 5

																							// Starting step 6: description
																							message.channel.send(
																								"New thumbnail URL is " + (character.thumbnailURL ? character.thumbnailURL : "not set") + ".\n" +
																								"[6/7] (Optional) Add a description for your character. (Max Length: 1000, or skip this.)\n" +
																								"The character's current description is " + (character.description ? character.description : "not set") + "."
																							).then(() => {
																								message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
																									.then(collected => {

																										if (collected.first().content !== "skip") {
																											character.description = collected.first().content
																										}
																										character.save(function (err) {
																											if (err) {
																												console.log(err);
																												message.author.send(err.message);
																												message.author.send("Setting up your character description was cancelled.");
																												return;
																											}
																											// Successful end of step 6

																											// Starting step 7: rpstyle
																											message.channel.send(
																												"New description is " + (character.description ? character.description : "not set") + ".\n" +
																												"[7/7] (Optional) Add a brief RP style or theme description for this character. (Max Length: 150, or skip this.)\n" +
																												"The character's current RP style is " + (character.rpstyle ? character.rpstyle : "not set") + "."
																											).then(() => {
																												message.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
																													.then(collected => {

																														if (collected.first().content !== "skip") {
																															character.rpstyle = collected.first().content
																														}
																														character.save(function (err) {
																															if (err) {
																																console.log(err);
																																message.author.send(err.message);
																																message.author.send("Setting up your character description was cancelled.");
																																return;
																															}
																															// Successful end of step 7

																															message.channel.send(
																																"New RP style is " + (character.rpstyle ? character.rpstyle : "not set") + ".\n" +
																																"You completely set up your character's description. Use the following command to see your new profile:\n" +
																																"> " + process.env.PREFIX + "desc name"
																															)

																															// Closing step 7
																														});
																													})
																													.catch(collected => {
																														message.channel.send('Cancelled character editing due to timeout.');
																													});
																											});
																											// Closing step 6
																										});
																									})
																									.catch(collected => {
																										message.channel.send('Cancelled character editing due to timeout.');
																									});
																							});
																							// Closing step 5
																						});
																					})
																					.catch(collected => {
																						message.channel.send('Cancelled character editing due to timeout.');
																					});
																			});
																			// Closing step 4
																		});
																	})
																	.catch(collected => {
																		message.channel.send('Cancelled character editing due to timeout.');
																	});
															});
															// Closing step 3
														});
													})
													.catch(collected => {
														message.channel.send('Cancelled character editing due to timeout.');
													});
											});
											// Closing step 2
										});
									})
									.catch(collected => {
										message.channel.send('Cancelled character editing due to timeout.');
									});
							});
							// Closing step 1
						});
					})
					.catch(collected => {
						message.channel.send('Cancelled character editing due to timeout.');
					}); 
			});
		});
	});
}

exports.showDescription = function (message, args) {
	if (args.length === 0) {
		message.author.send("Please tell me the name of the character that you want to see the description of. Use");
		message.author.send("> " + process.env.PREFIX + "d name");
		return;
	}

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

/*
 * !activateChar name
  */
exports.activateCharacter = function (message, args) {
	if (args.length === 0) {
		message.author.send("Please tell me the name of the character that you want to activate. Use");
		message.author.send("> " + process.env.PREFIX + "activateChar name");
		return;
	}

	getPlayer(message, function (player) {
		if (!player) return;

		Character.findOne({
			name: args[0]
		}).exec(function (err, character) {
			if (err) {
				console.log(err);
				message.author.send(err.message);
				return;
			}
			if (!character) {
				message.author.send("That caracter doesn't exist.");
				return;
			}
			if (!character.player.equals(player._id)) {
				message.author.send("That character doesn't belong to you.");
				return;
            }

			player.activeCharacter = character._id;
			player.save(function (err) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}

				message.author.send("Made " + character.name + " your active character.");
			});
		});
	});
}

/*
 * !myChars
  */
exports.showMyCharacters = function (message) {
	getPlayer(message, function (player) {
		if (!player) return;

		Character.find({
			player: player._id
		}).exec(function (err, characters) {
			if (err) {
				console.log(err);
				message.author.send(err.message);
				return;
			}
			if (characters.length === 0) {
				message.author.send("You currently don't have any characters. To create one, use");
				message.author.send("> " + process.env.PREFIX + "newChar name");
				return;
			}

			var msg = "```Your characters:";
			characters.forEach(character => {
				if (player.activeCharacter.equals(character._id)) {
					msg += "\n- " + character.name + " (Active)";
				} else {
					msg += "\n- " + character.name;
				}
			}); 
			msg += "\n```";
			message.author.send(msg);
		});
	});
}

/*
 * !newCharacter name
 */
exports.newCharacter = function (message, args) {
	if (args.length === 0) {
		message.author.send("Please tell me the name of the new character.");
		message.author.send("> " + process.env.PREFIX + "newCharacter name");
		return;
	}

	// Is there already a character with that name?
	Character.find({
		name: args[0]
	}).exec(function (err, character) {
		if (err) {
			console.log(err);
			message.author.send(err.message);
			return;
		}
		if (character.length > 0) {
			message.author.send("A character with that name already exists.");
			return;
		}

		// If not, create new Character document
		getPlayer(message, function (player) {
			if (!player) return;

			var newCharacter = new Character({
				_id: new mongoose.Types.ObjectId(),
				player: player._id,
				name: args[0],
			});
			newCharacter.save(function (err) {
				if (err) {
					console.log(err);
					message.author.send(err.message);
					return;
				}

				message.author.send("Created new character " + args[0]);

				if (!player.activeCharacter) {
					player.activeCharacter = newCharacter._id;
					player.save(function (err) {
						if (err) {
							console.log(err);
							message.author.send(err.message);
							return;
						}

						message.author.send("Made " + newCharacter.name + " your active character.");
					});
				} else {
					message.author.send("If you want to make " + newCharacter.name + " your active character, use");
					message.author.send("> " + process.env.PREFIX + "activateChar " + newCharacter.name);
                }
			});
		});
	});
}

exports.sheet = function (message, args) {
	Character.show(message);
}

/*
 * !register
 * Doesn't need any arguments. Registers the Discord user who sent the message.
 */
exports.register = function (message) {
	createPlayer(message, function () { });
}

function createPlayer(message, callback) {
	// Is the player already registered?
	Player.find({
		discordID: message.author.id
	}).exec(function (err, player) {
		if (err) {
			console.log(err);
			message.author.send(err.message);
			return;
		}
		if (player.length > 0) {
			message.author.send("You're already registered.");
			return;
		}

		var newPlayer = new Player({
			_id: new mongoose.Types.ObjectId(),
			name: message.author.username,
			discordID: message.author.id
		});
		newPlayer.save(function (err) {
			if (err) {
				console.log(err);
				message.author.send(err.message);
				return;
			}
			message.author.send("It seems like you weren't registered at the SanguinusVtM bot. I fixed that for you. You are now registered as " + message.author.username + " with your Discord ID " + message.author.id + ".");
			callback(newPlayer);
		});
	});
}