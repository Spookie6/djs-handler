const { Message, Client } = require('discord.js');

module.exports = {
	name: 'ping',
	aliases: ['p'],
	description: 'Returns web socket ping',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		message.channel.send(`${client.ws.ping} ws ping`);
	},
};
