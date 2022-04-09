const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const client = require('../index');

client.on('messageCreate', async (message) => {
	// Don't run when user is bot, msg is in dms or msg isn't a cmd.
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLowerCase().startsWith(client.config.prefix)
	)
		return;

	// Splitting content
	const [cmd, ...args] = message.content
		.toLowerCase()
		.slice(client.config.prefix.length)
		.trim()
		.split(/ +/g);

	// Retrieving the command
	const command =
		client.commands.get(cmd.toLowerCase()) ||
		client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

	if (!command) return;
	if (command.disabled) return;

	if (
		command.developersOnly &&
		!client.config.developers.includes(message.author.id)
	)
		// Dev only commands.
		return;

	if (args[0] == 'help') {
		const embed = new MessageEmbed()
			.setTitle(
				`Commands Menu - ${client.functions.util.capitalize(command.name)}`
			)
			.setDescription(
				`**Command Name**: ${command.name}\n**Aliases**: ${(
					command.aliases || ['No aliases']
				).join(', ')}\n**Permissions**: ${
					command.permissions.join(', ').toLowerCase().replace(/_+/g, ' ') ||
					'No permissions required'
				}\n\n**Description**: ${
					command.description || 'No description'
				}\n**Example Usage**: ${client.config.prefix}${command.name} ${
					command.parameters
						? command.parameters.map((par) => `<${par.name}>`)
						: ''
				}\n\n${command.parameters ? '**Parameters**:' : ''}
			`
			)
			.setColor(client.config.embedColor)
			.setTimestamp()
			.setFooter({
				text: client.config.clientName,
				iconURL: client.config.clientAvatar,
			});

		if (command.parameters) embed.setFields(command.parameters);

		return message.reply({ embeds: [embed] });
	}

	if (!message.member.permissions.has(command.userPermissions || []))
		// Checking permissions
		return message.reply(
			`You don't have permission to use this command!\nType ${client.config.prefix}${cmd} help for more information.`
		);

	// Checking args length
	const argsLength = (command.parameters || []).filter(
		(par) => par.required || false
	).length;

	if (argsLength > args.length)
		return message.reply(
			`Error, invalid command format. Example: \`${
				client.config.prefix
			}${cmd} ${
				command.parameters
					? command.parameters.map((par) => `<${par.name}> `)
					: ''
			}\`.\nType \`${client.config.prefix}${cmd} help\` for more information.`
		);

	// Checking cooldown
	if (client.cooldowns.has(`${cmd}${message.author.id}`))
		return message.reply(
			`You can use this command again ${client.functions.format.relativeDate(
				client.cooldowns.get(`${cmd}${message.author.id}`)
			)}!`
		);

	// Set the cooldown
	client.cooldowns.set(
		`${command.name}${message.author.id}`,
		Date.now() + command.cooldown
	);

	// Remove cooldown after cooldown time
	setTimeout(() => {
		client.cooldowns.delete(`${command.name}${message.author.id}`);
	}, command.cooldown);

	// Run the code
	await command.run(client, message, args);
});
