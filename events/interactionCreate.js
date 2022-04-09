const client = require('../index');

client.on('interactionCreate', async (interaction) => {
	// Slash Command Handling
	if (interaction.isCommand()) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) return interaction.followUp({ content: 'An error has occured ' });

		const args = [];

		for (let option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach((x) => {
					if (x.value) args.push(x.value);
				});
			}
			if (option.value) args.push(option.value);
		}

		interaction.member = interaction.guild.members.cache.get(
			interaction.user.id
		);

		// Checking permissions
		if (!interaction.member.permissions.has(cmd.permissions || [])) {
			return interaction.followUp(
				`You don't have permission to use this command!\nType ${client.config.prefix}${cmd.name} help for more information.`
			);
		}

		// Checking cooldown
		if (client.cooldowns.has(`${cmd}${interaction.member.id}`))
			return interaction.followUp(
				`You can use this command again in ${ms(
					client.cooldowns.get(`${cmd}${interaction.member.id}`) - Date.now(),
					{ long: true }
				)}!`
			);

		// Set the cooldown
		client.cooldowns.set(
			`${cmd.name}${interaction.member.id}`,
			Date.now() + cmd.cooldown
		);

		// Remove cooldown after cooldown time
		setTimeout(() => {
			client.cooldowns.delete(`${cmd.name}${interaction.member.id}`);
		}, cmd.cooldown);

		// Run the code
		cmd.run(client, interaction, args);
	}

	// Context Menu Handling
	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: false });
		const command = client.slashCommands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}
});
