//declare constants and other stuff like token
//clients (discord and top.gg)
const Discord = require('discord.js');
const AutoPoster = require('topgg-autoposter');
const sqlite = require('sqlite3').verbose();
const client = new Discord.Client();
//tokens & config
const config = require('./config.json')
client.login(config.tokens.discord);
//loading verbs
const verbs = require('./verbs.json');
const baseVerbs = verbs.baseVerbs;
const translatedVerb = verbs.translatedVerb;
//ya mom bot trigger cases
const caseVerb = ['i', 'you', 'u', 'she', 'he', 'it', 'we', 'they', 'them'];
const caseYaMomIs = ['i\'m', 'im', 'we\'re', 'were', 'its', 'it\'s', 'hes', 'shes', 'he\'s', 'she\'s', 'your', 'ur', 'youre', 'you\'re'];
const caseYaMom = ['i', 'it', 'he', 'she'];

const embded = new Discord.MessageEmbed() //no embeds? im outta here!
	.setColor('0x545454') // ok but really this is just the fancy help command thingy
	.setDescription('commands for ya mom bot')
	.setThumbnail('https://i.imgur.com/IVI3LPn.jpg')
	.addFields(
		{ name: 'help', value: 'this command' },
		{ name: 'donate', value: 'sends patreon link and current/past patreons' },
		{ name: 'server', value: 'sends invite link for support server' },
		{ name: 'severcount', value: 'sends amount of servers ya mom bot is in' },
		{ name: 'website', value: 'sends website link for ya mom bot'},
		{ name: 'invite', value: 'sends ya mom bot invite link'},
		{ name: 'setchance', value: 'sets chance for entire server for ya mom bot to trigger'}
	)
	
//top.gg stuff
const ap = AutoPoster(config.tokens.ap, client);
ap.on('posted', () => {
	console.log('refreshed')
	client.user.setActivity(`${config.statuses[getRandomInt(config.statuses.length)]} | @ya mom bot help or /help`, { type: "PLAYING"}); //i am way to proud of myself for putting this here
})
client.on('ready', async () => {
	console.log('bot on or somethign like that');
	//database shit
	console.log("Loading database...")
	let db = new sqlite.Database('./servers.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
	await db.run('CREATE TABLE IF NOT EXISTS servers(serverid INTEGER NOT NULL, chance INTEGER NOT NULL, UNIQUE(serverid))');
	await refreshDb(db);
});
//messages =====
client.on('message', async (message) => {
	const args = message.content.trim().split(/ +/g);

	if (message.channel.type === 'dm' || //checks to see if it can send emssgae in channle and blcoks from responding to bot
		message.author.bot ||
		!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")  ||
		args.length < 2)
		return;

	if (args[0].toLowerCase() === 'ya' && args[1].toLowerCase() === 'mom') {
		message.channel.send('hey kid thats my job');
		return;
	}

	if(args.slice(0).join(" ").length >= 1985) return; //ok im gonna be real with you this is like the most simple solution my dumbass can handle to the max char problem
	//note: i also have no clue to why the hell it wont let me just do message.content.length

	//message content command handler
	if(args[0] == `<@!${client.user.id}>` || args[0] == `<@${client.user.id}>`){//for some goddamn reason on mobile it pings diffrently from desktop so jsut compensate by checking for both
		switch(args[1].toLowerCase()) { //holy shit i used something that actually makes sense
			case "help": //TODO add stats
				message.channel.send(embded);
				break;
			case "donate":
				message.channel.send(`thank you for considering donating: https://www.patreon.com/yamombot\nCurrent Supporters:\n${config.supporters.join('\n')}`);
				break;
			case "server":
				message.channel.send("https://discord.gg/aZWUDjQCbD yamomcord!");
				break;
			case "servercount":
				message.channel.send(`im doin ${client.guilds.cache.size} moms!`);
				break;
			case "website":
				message.channel.send("https://yamombot.info")
				break;
			case "invite":
				message.channel.send("https://discord.com/api/oauth2/authorize?client_id=743110495992807495&permissions=0&scope=bot%20applications.commands");
				break;
			case "setchance":
				if (args[2] == "on") args[2] = 100;
				if (args[2] == "off") args[2] = 0;
				if (!message.member.hasPermission("ADMINISTRATOR")) {
					message.channel.send("You dont have proper permissions!");
					break;
				}
				if (!Number.isInteger(parseInt(args[2]))) {
					message.channel.send("Please enter a number!");
					break;
				}
				if (parseInt(args[2]) < 0 || parseInt(args[2]) > 100){ //checks for number if 0-100 inclusive
					message.channel.send("Please enter a valid number! (0-100)");
					break;
				}
				editChance(message.guild.id, parseInt(args[2]));
				message.channel.send(`Chance is now set to ${parseInt(args[2])} percent`);
				break;
			default:
				message.channel.send("Please enter a valid command argument!");
		} //that felt wayyyyyyy to similar to writing python, i am going to go take a cold shower now
	}

	//basically just combines all arrays together and does check, as to not waste time if it cant be "ya mom'd"
	let check = [];
	if (!check.concat(caseYaMom, caseVerb, caseYaMomIs).includes(args[0].toLowerCase())) return;

	if (getRandomInt(101) > await getGuildChance(message.guild.id)) return;
	const verb = findVerb(args[1]); //finds verb if any, if not it goes "undefined" or its a clone
	//WHERE THE MAGIC HAPPENS (choses what case to use)
	if (!(verb == undefined) && caseVerb.includes(args[0].toLowerCase())) { //checks to see if it needs to use gramar
			message.channel.send(`ya mom ${verb} ${args.slice(2).join(' ')}`);
			return;
	} else {//still not putting cases here, simply beacuse they only get indexed 5 and above (i think dont quote me) and also its seems to complicated to do ".includes" in a swithc case
		if (args[0].toLowerCase() === 'i' && args[1].toLowerCase() === 'am') {
			message.channel.send(`ya mom is ${args.slice(2).join(' ')}`);
			return;
		}
		if (caseYaMomIs.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom is ${args.slice(1).join(' ')}`);
			return;
		}
		if (caseYaMom.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom ${args.slice(1).join(' ')}`);
			return;
		}
	}
});
//wghen bot joins guild
client.on("guildCreate", guild => {
	let db = new sqlite.Database('./servers.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
	insertIntoDb(db, guild.id, 100);
})

//functions
function findVerb(verb) { //TODO not gonna do this update (ya mom bot anni) but i wrote this peice when i was first leaarning js, i should probally do something more effiecnt ie: binanry search
	for (let verbNum = 0; verbNum < baseVerbs.length; verbNum++) {
		if (verb.toLowerCase() === baseVerbs[verbNum]) {
			return translatedVerb[verbNum];
		}//repeat loop until found match
	}
}
//checkjs for new servers and adds them to db with default of 100 chance
function refreshDb(db){
	client.guilds.cache.forEach(guild => {
		insertIntoDb(db, guild.id, 100)
	});
}
function insertIntoDb(db, guildId, chance) {
	let insert = db.prepare(`INSERT or IGNORE INTO servers VALUES(?,?)`);
	insert.run(guildId, chance);
}
async function getGuildChance(guildId) {
	return new Promise((resolve, reject) => {
		let db = new sqlite.Database('./servers.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
		let query = `SELECT * FROM servers WHERE serverid = ?`;
		db.get(query, [guildId], (err, row) => {
			if (err) {
				console.log(err)
				return;//HAHAH AH HFHAGHA HOYL SHIT IM WRITING THIS AFTER TRYING FOR HOURS TO GET THIS TO
				//WORK, I AM IN COMPLETE BLISS RIGHT NOW. NOTHING CAN GO WRONG.
			}
			resolve(row.chance);
		});

	});
}
function editChance(guildId, chance) {
	let db = new sqlite.Database('./servers.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
	let query = `UPDATE servers SET chance=${chance} WHERE serverid = ?`;
	db.get(query, [guildId], (err) => {
		if (err) {
			console.log(err)
			return;
		}
	});
}
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
//slash command handler
client.ws.on('INTERACTION_CREATE', async interaction => {
	switch (interaction.data.name.toLowerCase()) {
		case "help":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						embeds: [embded]
					}
				}});
			break;

		case "donate":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: `thank you for considering donating: https://www.patreon.com/yamombot\nCurrent Supporters:${config.supporters.join('\n')}`
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

		case "website":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: 'https://yamombot.info' //may chjange
					}
				}})
			break;
		case "invite":
			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: 'https://discord.com/api/oauth2/authorize?client_id=743110495992807495&permissions=0&scope=bot%20applications.commands' //may chjange
					}
				}})
			break;
	}
	//TODO make it where ican set the server chance with slash comamnds
})
