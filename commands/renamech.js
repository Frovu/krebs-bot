const confirm = require('../modules/reactConfirm');
const regex = /[a-zа-я\s\-_]*$/ui;

module.exports = {
	name: 'radiosuck',
	permissions: 'ADMIN',
	exec: async function(message) {
		const changes = {};
		for (const ch of message.guild.channels.cache.array()) {
			const match = ch.name.match(regex);
			if (match)
				changes[ch.name] = match[0];
		}
		const text = Object.keys(changes).map(c => `${c} => ${changes[c]}`).join('\n');
		if(!await confirm(message.channel, message.author.id, `\`\`\`\n${text}\`\`\``))
			return;
		for (const ch of message.guild.channels.cache.array()) {
			const newName = changes[ch.name];
			if (newName)
				await ch.setName(newName);
		}
	}
};
