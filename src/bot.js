require("dotenv").config();
var mongoose = require('mongoose');

const { Client } = require("discord.js");
const client = new Client();

var Accounting = require("./controls/accounting.js");
var Rolling = require("./controls/rolling.js");

process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
})

client.on("ready", () => {
	console.log("Bot logged in.");
});

mongoose.connect(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, function (err) {
	if (err) throw err;
	console.log('Successfully connected to MongoDB');
});


client.on("message", (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(process.env.PREFIX)) return;
	const [CMD_NAME, ...args] = message.content
		.trim()
		.substring(process.env.PREFIX.length)
		.split(/\s+/);

	switch (CMD_NAME) {
		case "register":
			Accounting.register(message);
			break;
		case "newCharacter":
		case "newChar":
			Accounting.newCharacter(message, args);
			break;
		case "myChars":
		case "myCharacters":
			Accounting.showMyCharacters(message, args);
			break;
		case "activateChar":
		case "activateCharacter":
			Accounting.activateCharacter(message, args);
			break;
		case "d":
		case "desc":
		case "description":
			Accounting.showDescription(message, args);
			break;
		case "setD":
		case "setDesc":
		case "setDescription":
			Accounting.setDescription(message, args);
			break;
		case "sheet":
			Accounting.sheet(message);
			break;

		case "init":
		case "ini":
		case "i":
			Rolling.ini(message, args);
			break;

		case "roll":
		case "r":
			Rolling.roll(message, args);
			break;

		default:
			return;
    }
});

client.login(process.env.SANGUINUS_VTM_TOKEN);