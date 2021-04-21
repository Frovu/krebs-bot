
/* Ask confirmation before doing some action

@channel  - discord channel we are working in
@author   - *id* for confirmer
@text     - (string) to ask caller
@timer    - how long to wait for response

@returns Promise (resolved with bool)
*/

module.exports = async function(channel, author, text, timer=60000){
	try {
		// ask a question
		const confirmMsg = await channel.send(text);
		const p = new Promise((resolve)=>{
			const collector = confirmMsg.createReactionCollector((r, u) => u.id === author, { time: timer });
			collector.on('collect', r => {
				if(r.emoji.name === '✅') {
					resolve(true);
					collector.stop('confirmed');
				} else if (r.emoji.name === '❌') {
					collector.stop('canceled');
				}
			});
			collector.on('end', (_, reason) => {
				if(reason==='canceled') {
					resolve(false);
				} else if(reason!=='confirmed') {
					resolve(null);
					confirmMsg.reactions.removeAll().catch(()=>{});
				}
			});
		});
		await confirmMsg.react('✅');
		await confirmMsg.react('❌');
		return p;
	} catch(e) {
		return global.log(`Failed reactConfirmation: ${e.stack}`);
	}
};
