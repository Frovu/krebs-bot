
const fs = require('fs');
const path = require('path');
const config = require('../data/config.json');
const log = global.log;

const CMD_DIR = 'commands';
const commands = {};

function importDir(dirpath) {
	try {
		const files = fs.readdirSync(dirpath);
		log(`Importing commands from ${path.relative('.', dirpath)}/`);
		for (const file of files) {
			const fpath = path.join(dirpath, file);
			if (path.extname(fpath) !== '.js') {
				importDir(fpath);
			} else {
				let command = require(fpath);
				commands[command.name] = command;
			}
		}
	} catch (e) {
		return log(`Failed to import cmds from ${dirpath}:\n${e.stack}`);
	}
}
importDir(path.resolve(CMD_DIR));

function checkPermissions(flag, message) {
	switch (flag) {
	case 'ADMIN':
		return message.member.hasPermission('ADMINISTRATOR');
	case 'OFFICER':
		return message.member.roles.cache.has(config.officer);
	case 'NONE':
		return true;
	default:
		return false;
	}
}

async function execute(message) {
	if (message.author.bot || !message.guild)
		return false;
	if (message.content.indexOf(config.prefix) !== 0)
		return false;

	const name = message.content.slice(config.prefix.length).split(/\n|\r| +/g)[0].toLowerCase();
	const command = commands[name];
	if (!command)
		return false;
	if (!checkPermissions(command.permissions, message))
		return false;

	try {
		await command.exec(message);
	} catch(e) {
		log(`Command ${name} failed: ${e.stack}`);
	}
	return true;
}

module.exports = {
	execute
};
