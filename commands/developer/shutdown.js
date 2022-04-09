const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'shutdown',
	description: 'Shut down the bot.',
	aliases: ['sd'],
	developersOnly: true,
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		try {
			message.reply('Shutting down...').then(() => {
				process.exit();
			});
		} catch (err) {
			message.reply('Something went wrong.');
		}
	},
};
