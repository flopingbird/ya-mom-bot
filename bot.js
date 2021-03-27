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
const caseVerb = ['i', 'you', 'u', 'she', 'he', 'it', 'we', 'they', 'them'];
const caseYaMomIs = ['i\'m', 'im', 'we\'re', 'were', 'its', 'it\'s', 'hes', 'shes', 'he\'s', 'she\'s', 'your', 'ur', 'youre', 'you\'re'];
const caseYaMom = ['i', 'it', 'he', 'she'];

//top.gg stuff
const AutoPoster = require('topgg-autoposter')
const ap = AutoPoster('token', client)
ap.on('posted', () => {
	console.log('updated')
})

//================================================================================================================================================================================

client.on('ready', async () => {
	console.log('bot on or somethign like that');
	//status funny
	refreshStatus();
	console.log("bot on")
});


//messages =====
client.on('message', async (message) => {
	if (message.channel.type === 'dm') return;
	if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
	const args = message.content.trim().split(/ +/g);
		//comands ==========
	if(args[0] == "<@!743110495992807495>"){
		if(args[1] == "help") { //help command
			message.channel.send("<@743110495992807495> *donate* - sends donation link\n<@743110495992807495> *website* - sends website link\n<@743110495992807495> *FAQ* - displays FAQ\n<@743110495992807495> *server* - displays support server");
		}//timne to checj through all the possibnle commands !  ! :DDDDD
		else if(args[1] == "donate") {
			message.channel.send("thank you for considering donating to this ~~horrible~~ great bot!\nhttps://www.patreon.com/yamombot");
		}else if(args[1] == "website") {
			message.channel.send("thank you for considering giving me ad sens\nhttps://yamombot.info");
		}else if(args[1] == "FAQ") {
			message.channel.send("no, i am not gonna add a toggle in the next month or two");
		}else if (args[1] == "server"){
			message.channel.send("https://discord.gg/F9Mqtndkrp");
		}else{
			message.channel.send("Please enter a valid command argument!");
		}
		//holy cow thats like, alot of if else statements!
		//shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut up shut
	}

		//=================
	//check if they contain trigger word so it doesnt waste time processing looking for verb if it doesnt even matter (hopefully i explained that well)
	if (!caseYaMomIs.includes(args[0].toLowerCase())) {
		if (!caseYaMom.includes(args[0].toLowerCase())) {
			if (!caseVerb.includes(args[0].toLowerCase())) {
				if (!(args[0] === 'ya')) return; }}}//i took like 5 minutes to write this im gonna have an anrysm that took longer than it shoudlve
	if (args.length < 2) return; //if message 1 word dont do it or cases dont fit idk man
	var verbNum;
	var correctVerbNum = -1;
	findVerb(args[1]);
	//WHERE THE MAGIC HAPPENS (choses what case to use) ======================================================================================================================================
	if (!(correctVerbNum === -1)) { //checks to see if it needs to use gramar
		if (caseVerb.includes(args[0].toLowerCase())) {
			message.channel.send(`ya mom ${translatedVerb[correctVerbNum]} ${args.slice(2).join(' ')}`);
		}
	} else {
		if (args[0].toLowerCase() === 'i' && args[1].toLowerCase() === 'am') {
			message.channel.send(`ya mom is ${args.slice(2).join(' ')}`);
			return;
		}
		if (args[0].toLowerCase() === 'ya' && args[1].includes('mom') && !message.author.bot) {
			message.channel.send('hey kid thats my job');
			return;
		}
		if (caseYaMomIs.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom is ${args.slice(1).join(' ')}`);
			return;
		}
		if (caseYaMom.includes(args[0].toLowerCase())){
			message.channel.send(`ya mom ${args.slice(1).join(' ')}`);
		}


	}//===========================================================================================================================================================================================
//functions that require scope (should be all of them but im just lazy ok?)
	function findVerb(verb) {
		for (verbNum = 0; verbNum < baseVerbs.length; verbNum++) {
			if (verb.toLowerCase() === baseVerbs[verbNum]) {
				correctVerbNum = verbNum;
				return;
			}//repeat loop until found match
		}
	}

});

client.on("guildCreate", async (guild) => {//when the bot joins a guild
	refreshStatus();
});
client.on("guildDelete", (guild) => { //when the bot joins a guild
	refreshStatus();
});

//functions
function refreshStatus() {
	client.user.setActivity(`@yamombot help | doin ${client.guilds.cache.size} moms`, { type: "PLAYING"});
}
