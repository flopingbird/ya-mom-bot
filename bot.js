//declare constants and other stuff like token
const Discord = require('discord.js');
const client = new Discord.Client();
client.disabledMembers = new Map();
const token = require('./token.json');
const verbs = require('./verbs.json');
const verbsTranslated = require('./verbsTranslated.json');
client.login(token.token);
const baseVerbs = verbs.baseVerbs;
const translatedVerb = verbsTranslated.translatedVerb;
var usersCount;

//ok then it does database stuff which i legit have a childs understanding of


client.on('ready', async () => {
	console.log('bot on or somethign like that');
	console.log(client.guilds);
	//status funny
	refreshStatus();
	console.log(`doin ${client.guilds.cache.array().length} moms with ${usersCount} people watching!`);
});

client.on('message', async (message) => {
	if(!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
	var verbNum; 
	var correctVerbNum = -1;
	const args = message.content.trim().split(/ +/g);
	if(args.length < 2) return;
	
	//if verb needs correcting search================================================
	for (verbNum = 0; verbNum < baseVerbs.length; verbNum++) {
		if (args[1].toLowerCase() == baseVerbs[verbNum]) {
			correctVerbNum = verbNum;
		}
		//repeat loop until found match 
	}
	//================================================================================
	
	
	//if verb le troll funny happens here
	if (!(correctVerbNum == -1)) {
			
		if (args[0].toLowerCase() == 'i' || args[0].toLowerCase() == 'you' || args[0].toLowerCase() == 'u' || args[0].toLowerCase() == 'she' || args[0].toLowerCase() == 'he' || args[0].toLowerCase() == 'it' || args[0].toLowerCase() == 'we' || args[0].toLowerCase() == 'they' || args[0].toLowerCase() == 'them') {
			message.channel.send(`ya mom ${translatedVerb[correctVerbNum]} ${args.slice(2).join(' ')}`);
		}
	}else{
				if (args[0].toLowerCase() == 'i' && args[1].toLowerCase() == 'am') {
			message.channel.send(`ya mom is ${args.slice(2).join(' ')}`);
		    }
				if (args[0].toLowerCase() == 'ya' && args[1].includes('mom') && !message.author.bot) {
			message.channel.send('hey kid thats my job');
			}
				if ((args[0].toLowerCase() == 'i\'m' || args[0].toLowerCase() == 'im' || args[0].toLowerCase() == 'we' || args[0].toLowerCase() == 'we\'re' || args[0].toLowerCase() == 'were' || args[0].toLowerCase() == 'its' || args[0].toLowerCase() == 'it\'s' || args[0].toLowerCase() == 'hes' || args[0].toLowerCase() == 'shes' || args[0].toLowerCase() == 'he\'s' || args[0].toLowerCase() == 'she\'s' || args[0].toLowerCase() == 'your' || args[0].toLowerCase() == 'ur' )){
            message.channel.send(`ya mom is ${args.slice(1).join(' ')}`);
			refreshStatus(); //only here because I dont want it constantly being refreshed nor do i want to set a timer.
			}
				if ((args[0].toLowerCase() == 'i' || args[0].toLowerCase() == 'we' || args[0].toLowerCase() == 'it' || args[0].toLowerCase() == 'he' || args[0].toLowerCase() == 'she')){
            message.channel.send(`ya mom ${args.slice(1).join(' ')}`);
			}
		}
});


//functions
function refreshStatus() {
	usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
	client.user.setActivity(`doin ${client.guilds.cache.array().length} moms with ${usersCount} people watching!`); 
}
