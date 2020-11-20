module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	oneline: true,
	aliases: [],
	usage: '[(opt) command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			// data.push("Use '" + process.env.PREFIX + "help [command name]' to get info on a specific command. (Example: '" + process.env.PREFIX + "help roll')");
			data.push(commands.map(command =>
				"**" + process.env.PREFIX + command.name + "**" +
				((!command.aliases || !command.aliases.length) && !command.usage ? "" : " `") +
				(command.aliases && command.aliases.length ? "(" + command.aliases.join(', ') + ")" : "") +
				(command.usage ? " " + command.usage : "") +
				((!command.aliases || !command.aliases.length) && !command.usage ? "" : "`") +
				(command.description ? (command.oneline ? ": " : "\n") + command.description : "")
			).join("\n"));

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases && command.aliases.length) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push("**Usage:** " + process.env.PREFIX + command.name + " " + command.usage);
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		if (command.wiki) data.push(`**Wiki:**\n${command.wiki}`);

		message.channel.send(data, { split: true });
	},
};