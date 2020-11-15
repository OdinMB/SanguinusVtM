const fs = require('fs');
require("dotenv").config();

var mongoose = require('mongoose');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

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

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/\s+/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.DMOnly && message.channel.type !== 'dm') {
		return message.reply('I can only execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments.`;

		if (command.usage) {
			reply += " The proper usage would be:\n> " + process.env.PREFIX + command.name + " " + command.usage;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(process.env.SANGUINUS_VTM_TOKEN);