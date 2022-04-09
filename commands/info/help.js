const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');

module.exports = {
	name: 'help',
	cooldown: 3000,
	description: 'Help Command',
	run: async (client, message, args) => {
		const directories = [
			...new Set(client.commands.map((cmd) => cmd.directory)),
		];

		const formatString = (str) => {
			return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
		};

		const categories = directories.map((dir) => {
			const getCommands = client.commands
				.filter((cmd) => cmd.directory === dir)
				.map((cmd) => {
					return {
						name: cmd.name ? cmd.name : 'No command name!',
						description: cmd.description
							? cmd.description
							: 'No command description!',
					};
				});

			return {
				directory: formatString(dir),
				commands: getCommands,
			};
		});

		const embed = new MessageEmbed()
			.setTitle(`${client.config.clientName || 'Bot'}'s Commands`)
			.setDescription('Please choose one of the options in the dropdown below!')
			.setColor(client.config.embedColor)
			.setFooter({
				text: client.config.clientName,
				iconURL: client.config.clientAvatar,
			})
			.setTimestamp();

		const components = (state) => [
			new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('help-menu')
					.setPlaceholder('Please select a category!')
					.setDisabled(state)
					.addOptions([
						categories.map((cmd) => {
							return {
								label: `${cmd.directory}`,
								value: `${cmd.directory.toLowerCase()}`,
								description:
									`Commands from ` + `${cmd.directory}` + ' category',
							};
						}),
					])
			),
		];

		const inMessage = await message.reply({
			embeds: [embed],
			components: components(false),
		});

		const filter = (interaction) => interaction.user.id === message.author.id;

		const collector = message.channel.createMessageComponentCollector({
			filter,
			componentType: 'SELECT_MENU',
			time: 60000,
		});

		collector.on('collect', (interaction) => {
			const [directory] = interaction.values;
			const category = categories.find(
				(x) => x.directory.toLowerCase() === directory
			);

			const embed2 = new MessageEmbed()
				.setTitle(
					`${directory.charAt(0).toUpperCase()}${directory
						.slice(1)
						.toLowerCase()}`
				)
				.setDescription(
					'' +
						category.commands
							.map((cmd) => `\`${cmd.name}\` (*${cmd.description}*)`)
							.join('\n ')
				)
				.setColor(client.config.embedColor);

			interaction.update({ embeds: [embed2] });
		});

		collector.on('end', () => {
			inMessage.edit({ components: components(true) });
		});
	},
};
