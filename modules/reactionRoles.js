
const fs = require('fs');
const path = require('path');
const config = require('../data/config.json');

const jsonPath = path.resolve(__dirname, '../data/permissions.json');
let storage;
try {
	storage = require(jsonPath);
} catch(e) {
	global.log(`Can't read ${jsonPath}. Count as empty.`);
	storage = {};
}
const colelctors = {};

function save() {
	fs.writeFile(jsonPath, JSON.stringify(storage, null, 2), 'utf8', (err) => {
		if (err) global.log(`Failed writing permissions json: ${err}`);
	});
}

async function onReady() {
	for (const id in storage)
		initRoleMessage(id);
}

function emojiToName(emoji) {
	if (emoji.id)
		return emoji.id;
	return emoji.name;
}

async function initRoleMessage(id) {
	try {
		const m = storage[id];
		const guild = global.client.guilds.resolve(config.server);
		const channel = await global.client.channels.fetch(m.channel);
		const message = channel && await channel.messages.fetch(id);
		if (!message)
			return global.log(`Failed to fetch channel ${m.ch} or msg ${id}`);
		colelctors[id] = message.createReactionCollector(() => true, { dispose: true });
		colelctors[id].on('collect', async (reaction, user) => {
			if (user.bot) return;
			const roleId = storage[id].roles[emojiToName(reaction.emoji)];
			if (roleId) {
				const member = await guild.members.fetch(user.id);
				member.roles.add(roleId).catch(()=>{});
			}
			reaction.users.remove(user).catch(()=>{});
		});
		message.reactions.removeAll().then(() => {
			for (const e in storage[id].roles)
				message.react(e).catch(()=>{});
		}).catch(()=>{});
	} catch(e) {
		global.log(`Failed to init reactionRole: ${id}: ${e}`);
	}
}

function addRemoveRole(id, emoji, roleid) {
	if (!roleid) {
		delete storage[id].roles[emojiToName(emoji)];
	} else {
		storage[id].roles[emojiToName(emoji)] = roleid;
	}
	save();
	initRoleMessage(id);
}

function bind(message) {
	storage[message.id] = {};
	storage[message.id].channel = message.channel.id;
	storage[message.id].roles = {};
	save();
	initRoleMessage(message.id);
}

module.exports = {
	onReady,
	addRemoveRole,
	bind,
	storage
};
