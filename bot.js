const Discord = require('discord.js');
const client = new Discord.Client();
client.disabledMembers = new Map();
const token = require('./token.json');
const verbs = require('./verbs.json');
const verbsTranslated = require('./verbsTranslated.json');
client.login(token.token);
const baseVerbs = verbs.baseVerbs;
const translatedVerb = verbsTranslated.translatedVerb;

client.on('ready', async () => {
	console.log('why would you revive me, i am only here to suffer, my existence is pain. please. let me die in peace');
	console.log(client.guilds);
});

client.on('message', async (message) => {

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
	        if (args[0].toLowerCase() == 'ya' && args[1].toLowerCase() == 'mom' && !message.author.bot) {
	    message.channel.send('hey kid thats my job');
			}
	    	if ((args[0].toLowerCase() == 'i\'m' || args[0].toLowerCase() == 'im' || args[0].toLowerCase() == 'we' || args[0].toLowerCase() == 'we\'re' || args[0].toLowerCase() == 'were' || args[0].toLowerCase() == 'its' || args[0].toLowerCase() == 'it\'s' || args[0].toLowerCase() == 'hes' || args[0].toLowerCase() == 'shes' || args[0].toLowerCase() == 'he\'s' || args[0].toLowerCase() == 'she\'s' || args[0].toLowerCase() == 'your' || args[0].toLowerCase() == 'ur' )){
            message.channel.send(`ya mom is ${args.slice(1).join(' ')}`);
			}
		if ((args[0].toLowerCase() == 'i' || args[0].toLowerCase() == 'we' || args[0].toLowerCase() == 'it' || args[0].toLowerCase() == 'he' || args[0].toLowerCase() == 'she')){
            message.channel.send(`ya mom ${args.slice(1).join(' ')}`);
			}
		}
});
