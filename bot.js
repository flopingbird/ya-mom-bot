//declare constants and other stuff like token
const Discord = require('discord.js');
const AutoPoster = require('topgg-autoposter');
const client = new Discord.Client();
//getting and using the tokens
const tokens = require('./tokens.json')
client.login(tokens.token);
//verbs moment
const verbs = require('./verbs.json');
const baseVerbs = verbs.baseVerbs;
const translatedVerb = verbs.translatedVerb;
//ya mom bot trigger cases
const caseVerb = ['i', 'you', 'u', 'she', 'he', 'it', 'we', 'they', 'them'];
const caseYaMomIs = ['i\'m', 'im', 'we\'re', 'were', 'its', 'it\'s', 'hes', 'shes', 'he\'s', 'she\'s', 'your', 'ur', 'youre', 'you\'re'];
const caseYaMom = ['i', 'it', 'he', 'she'];

const embded = new Discord.MessageEmbed() //no embeds? im outta here!
	.setColor('0x545454') // ok but seriously this is just the fancy help command thingy
	.setDescription('commands for ya mom bot')
	.setThumbnail('https://i.imgur.com/IVI3LPn.jpg')
	.addFields(
		{ name: 'help', value: 'this command' },
		{ name: 'donate', value: 'sends donation link' },
		{ name: 'FAQ', value: 'sends FAQ\'s' },
		{ name: 'server', value: 'sends invite link for support server' },
		{ name: 'severcount', value: 'sends amount of servers ya mom bot is in' },
	)
	
//top.gg stuff
const ap = AutoPoster(tokens.apToken, client);
ap.on('posted', () => {
	console.log('updated')
	client.user.setActivity(`with @ya mom bot#7927 (imposter) | @ya mom bot help`, { type: "PLAYING"}); //i am way to proud of myself for putting this here
})

//===============================================================

client.on('ready', async () => {
	console.log('bot on or somethign like that');
	//status funny
	client.user.setActivity(`with @ya mom bot#7927 (imposter) | @ya mom bot help`, { type: "PLAYING"}); //i am way to proud of myself for putting this here
});


//messages =====
client.on('message', async (message) => {
	if (message.channel.type === 'dm' || message.author.bot || !message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
	const args = message.content.trim().split(/ +/g);
	if(args.slice(0).join(" ").length >= 1985 || args.length < 2) return; //| BRO I HAVE NO FUCKING CLUE WHY | just realized this looks alot neater with it divided
	//commands section (i shoudl probally make this a secdons .js or soemthing) | I CANT JUST DO message.content.length |
	if(args[0] == "<@!743110495992807495>" || args[0] == "<@743110495992807495>"){
		switch(args[1].toLowerCase()) { //holy shit i used something that actually makes sense
			case "help":
				message.channel.send(embded);
				break;
			case "donate":
				message.channel.send("thank you for considering donating, in the future ill have names under this command! (once i get people that actually donate :D)\nhttps://www.patreon.com/yamombot");
				break;
			case "faq":
				message.channel.send("no, i am not gonna add a toggle in the next month or two \n what were you expecting");
				break;
			case "server":
				message.channel.send("https://discord.gg/aZWUDjQCbD yamomcord!");
				break;
			case "servercount":
				message.channel.send(`im doin ${client.guilds.cache.size} moms!`);
				break;
			default:
				message.channel.send("Please enter a valid command argument!");
		} //that felt wayyyyyyy to similar to writing python, i am going to go take a cold shower now
	}

	//check if they contain trigger word so it doesnt waste time processing looking for verb if it doesnt even matter (hopefully i explained that well)
	if (!(caseYaMomIs.includes(args[0].toLowerCase()) || caseYaMom.includes(args[0].toLowerCase()) || caseVerb.includes(args[0].toLowerCase())) || (args[0] === 'ya')) return;
	//TRUST ME THIS IS MUCH BETTER COMPARED TO THE LUMP OF CANCER THAT WAS HERE EARLIER

	const verb = findVerb(args[1]); //bro i legit have no idea what to do beside this

	//WHERE THE MAGIC HAPPENS (choses what case to use) =======================
	if (!(verb == undefined) && caseVerb.includes(args[0].toLowerCase())) { //checks to see if it needs to use gramar
			message.channel.send(`ya mom ${verb} ${args.slice(2).join(' ')}`);
	} else {//still not putting cases here, simply beacuse they only get indexed 5 and above (i think dont quote me), ill do it next time maybe

		if (args[0].toLowerCase() === 'i' && args[1].toLowerCase() === 'am') {
			message.channel.send(`ya mom is ${args.slice(2).join(' ')}`);
			return;
		}
		if (args[0].toLowerCase() === 'ya' && args[1].includes('mom')) {
			message.channel.send('hey kid thats my job');
			return;
		}
		if (caseYaMomIs.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom is ${args.slice(1).join(' ')}`);
			return;
		}
		if (caseYaMom.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom ${args.slice(1).join(' ')}`);
		} //should've written else if statements :/ classic december me!
	}
});

//functions
function findVerb(verb) {
	for (let verbNum = 0; verbNum < baseVerbs.length; verbNum++) {
		if (verb.toLowerCase() === baseVerbs[verbNum]) {
			return translatedVerb[verbNum];
		}//repeat loop until found match
	}
}


//slash command responses
client.ws.on('INTERACTION_CREATE', async interaction => {
	switch (interaction.data.name.toLowerCase()) {
		case "help":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						embeds: embded
					}
				}});
			break;

		case "donate":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: 'thank you for considering donating, in the future ill have names under this command! (once i get people that actually donate :D)\nhttps://www.patreon.com/yamombot'
					}
				}})
			break;

		case "faq":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: 'no, i am not gonna add a toggle in the next month or two \n what were you expecting'
					}
				}})
			break;

		case "server":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: 'https://discord.gg/aZWUDjQCbD yamomcord!'
					}
				}})
			break;

		case "servercount":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: `im doin ${client.guilds.cache.size} moms!`
					}
				}})
			break;
	}
})
