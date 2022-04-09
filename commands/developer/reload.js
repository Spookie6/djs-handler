const { MessageEmbed } = require('discord.js');
const glob = require('glob');

module.exports = {
	name: 'reload',
	description: 'Reload commands',
	cooldown: 3000,
	developersOnly: true,

	run: async (client, message, args) => {
		client.commands.sweep(() => true);

		// Prefix Commands
		glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
			if (err) return console.log(err);

			filePaths.forEach((file) => {
				delete require.cache[require.resolve(file)];

				const pull = require(file);
				if (pull.name) client.commands.set(pull.name, pull);

				if (pull.aliases && Array.isArray(pull.aliases)) {
					pull.aliases.forEach((alias) => {
						client.aliases.set(alias, pull.name);
					});
				}
			});
		});

		message.reply('Done!');
	},
};
