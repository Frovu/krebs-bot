const rroles = require('../../modules/reactionRoles');

module.exports = {
	name: 'bindmessage',
	permissions: 'ADMIN',
	exec: async function(message) {
		const split = message.content.split(/\s+/g);
		const id = split[1];
		const m = id && await message.channel.messages.fetch(id).catch(()=>{});
		if (!m)
			return await message.channel.send(`Failed to find message: \`${id}\``);
		rroles.bind(m);
		return await message.channel.send(`new reactionRole message: \`${m.id}\``);
	}
};
