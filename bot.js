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
const caseVerb = ['i', 'you', 'u', 'she', 'he', 'it', 'we', 'they', 'them'];
const caseYaMomIs = ['i\'m', 'im', 'we\'re', 'were', 'its', 'it\'s', 'hes', 'shes', 'he\'s', 'she\'s', 'your', 'ur', 'youre', 'you\'re'];
const caseYaMom = ['i', 'it', 'he', 'she'];

//holy shit i finally added database :heart_eyes:
var mysql = require('mysql');
//================================================================================================================================================================================
const con = mysql.createConnection({
  host: "host",
  user: "user",
  password: "pass",
  database: "db"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connecting to database...");
});
//================================================================================================================================================================================

client.on('ready', async () => {
	console.log('bot on or somethign like that');
	//status funny
	refreshStatus();
	console.log(`doin ${client.guilds.cache.array().length} moms with ${usersCount} people watching!`);
});


//messages =====
client.on('message', async (message) => {
	if (message.channel.type === 'dm') return;
	if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
	//comands ======
	if (message.content === "!yamombot help") {
		message.channel.send("```\n!yamombot help\n```this command\n\n```\n!yamombot rate <percentage 0-100>\n```sets the rate/chance at which ya mom bot will send messages. 0 disables the bot completely (requires admin)\n NOTICE: YOU MAY HAVE TO RUN THIS COMMAND TWICE FOR IT TO TAKE AFFECT.");
	return;
	}
	
	if (message.content.includes("!yamombot rate")) {
		if (!(message.member.hasPermission("ADMINISTRATOR"))) return message.channel.send("you absolute bufoon, this command requires admin perms.");
		if (message.author.bot) return;
		const args = message.content.trim().split(/ +/g);
		if (args[2] < 0 || args[2] > 100 || isNaN(Number(args[2]))) {
			message.channel.send("Please use a proper percentage! eg: \"!yamombot chance 35\" ");
		} else {
			setRate(message.guild.id, args[2]);
			message.channel.send(`The rate has been set to ${args[2]}!`)
		}
	 return;
	}
	//==============
	setRate(message.guild.id, 100);
	let chance = await fetchServerChance(message.guild.id);//grab chance
	if(chance == undefined) return;
	if(!(getRandomInt(101) <= parseFloat(chance))) return; //checks to see if its gonna send based off of rates
	const args = message.content.trim().split(/ +/g);
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
		refreshStatus(); //only here because I dont want it constantly being refreshed nor do i want to set a timer.
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

//server join, database updates ==========
client.on("guildCreate", guild => {
	var sql = "INSERT INTO serversConfigs (serverID, chance) VALUES ('"+guild.id+"', '100')";
	 con.query(sql, function (err, result) {
		if (err) throw err;
  });
});
//========================================





function refreshStatus() {
	usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
	client.user.setActivity(`!yamombot help | doin ${client.guilds.cache.array().length} moms with ${usersCount} people watching!`); 
}

function getRandomInt(max) { //random number easiest way i found
  return Math.floor(Math.random() * Math.floor(max));
}

async function fetchServerChance(serverID) { //tysm to Vitalii on stackoverflow for helping with this <3
    const returnValue = new Promise(function (resolve, reject) {
      con.query(
        // serverID value will be escaped for safety and put into ? placeholder
        // see https://github.com/mysqljs/mysql#escaping-query-values
        "SELECT chance FROM serversConfigs WHERE serverID = ? LIMIT 1", [serverID], 
        function (err, rows) {
            // promise will be rejected if error happens (async function can catch the error with try/catch clause
            if (err) { reject(err) };
            // promise will resolve to value of chance
            resolve(rows[0].chance); 
        }
      );
    });
    return returnValue; // promise of future value
}

function setRate(serverID, newChance) {
	con.query("SELECT chance FROM serversConfigs WHERE serverID = '"+serverID+"'", (err, result) => {
     if (err) throw err;
	 if (result == "") { //checks to see if row exists for server yet, if not it make one
		
		var sql2 = "INSERT INTO serversConfigs (serverID, chance) VALUES ('"+serverID+"', '100')";
		con.query(sql2, function (err, result) {
			if (err) throw err;
		});
	}
	});
	var sql3 = "UPDATE serversConfigs SET chance = '"+newChance+"' WHERE serverID = '"+serverID+"'";
	con.query(sql3, function (err, result) {
		if (err) throw err;
  });
}
