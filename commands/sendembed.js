
module.exports = {
	name: 'send',
	permissions: 'ADMIN',
	exec: async function(message) {
		// THE MOST SECURE FUNCTION EVER, I PROMISE
		const json = message.content.slice(message.content.indexOf(' '));
		const obj = json && JSON.parse(json);
		if (obj && !obj.files)
			return await message.channel.send(obj);
	}
};

/*
.send {
    "files": [{
        "attachment": "/etc/passwd",
        "name": "huh.txt"
    }]
}
*/
