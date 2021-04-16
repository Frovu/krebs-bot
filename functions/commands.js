
const fs = require('fs');
const path = require('path');
const config = require('../data/config.json');
const log = global.log;

const commands = {};

function importDir(dirpath) {
	try {
		fs.readdir(dirpath, (err, files) => {
			if (err) throw err;
			log(`Importing commands from ${dirpath}`);
			for (const file of files) {
				const fpath = path.join(dirpath, file);
				if (path.extname(fpath) !== '.js')
					importDir();
				let command = require(fpath);
				commands[command.name] = command;
			}
		});
	} catch (e) {
		return log('ERROR', `Failed to import cmds from ${path}:\n${e.stack}`);
	}
}
importDir(path.resolve('../commands'));

function checkPermissions(flag) {
	switch (flag) {
	case 'DEV':

		break;
	case 'OFFICER':

		break;
	default:
		return false;
	}
}

async function execute(message) {
	if (message.author.bot)
		return false;
	if (message.content.indexOf(config.prefix) !== 0)
		return false;

	const name = message.content.slice(config.prefix.length).split(/\n|\r| +/g)[0].toLowerCase();
	const command = commands[name];

	if (!command)
		return false;
	if (!checkPermissions(command.permissions))
		return false;

	try {
		await command.exec(message);
	} catch(e) {
		log(`Command ${name} failed: ${e.stack}`);
	}
	return true;
}
