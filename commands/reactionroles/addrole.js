const rroles = require('../../modules/reactionRoles');

module.exports = {
	name: 'bindrole',
	permissions: 'ADMIN',
	exec: async function(message) {
		const split = message.content.split(/\s+/g);
		const id = split[1];
		if (!rroles.storage[id])
			return await message.channel.send(`No such reactionRoles message: \`${id}\``);
		const r = split[2] && await message.react(split[2]).catch(()=>{});
		if (!r)
			return await message.channel.send(`Invalid emoji: \`${split[2]}\``);
		const roleid = split[3];
		await message.channel.send(`${roleid?'Add':'Remov'}ing emoji:role pair ${r.emoji}:\`${roleid||'something'}\``);
		rroles.addRemoveRole(id, r.emoji, roleid);
	}
};
