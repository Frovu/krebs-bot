const Discord = require('discord.js');
const config = require('./data/config.json');

global.log = require('./modules/logging');
global.client = new Discord.Client({
	forceFetchUsers: true
});
const client = global.client;
const log = global.log;
const commands = require('./modules/commands');
const reactionRole = require('./modules/reactionRoles');

client.login(config.token);

client.on('ready', () => {
	try {
		log('The bot is online!');
		reactionRole.onReady();
	} catch (e) {
		return log('ERROR', `Failed on.ready: ${e.stack}`);
	}
});

client.on('message', message => {
	commands.execute(message);
});
