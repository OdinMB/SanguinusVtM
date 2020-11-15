var Player = require("../models/player.js");
var Character = require("../models/character.js");
const Discord = require('discord.js');

module.exports = {
	name: 'char-setprofile',
	description: 'Creates a profile for your active character. DM only.',
	aliases: ['setprofile'],
	usage: '',
	DMOnly: true,
	cooldown: 3,
	execute(message, args) {
		Player.getPlayer(message, function (player) {
			if (!player) return;
			if (!player.selectedCharacter) {
				message.author.send("You don't have a character selected. Use '" + process.env.PREFIX + "help to see how to create and select characters.");
				return;
			}

			Character.findById(player.selectedCharacter).exec(function (err, character) {
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
																																	"You completed your character's profile."
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
}