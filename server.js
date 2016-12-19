//TODO: deletes and put endpoints

var application_root = __dirname,
http = require('http'),
express = require('express'),
path = require("path"),
bodyParser = require('body-parser'),
request = require('request');
var champions = require('./StaticData/Champions');
var app = express();

var ritoURL = "https://lan.api.pvp.net/api/lol/";
var apiKey = "";//get api key from constant file which we will have to ignore so its not seen by someone -_- (supicious face) xd
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(application_root, 'build')));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!' + err.stack);
});
var port = process.env.PORT || 6800;
var router = express.Router();

app.get('/', function(req, res) {
	console.log(getSummonerId("lan","Arcant"));
	
});
var arrayChampions = (function getArrayChampions(){
	var champs = champions.data;
	arrayChamps = [];
	for (key in champs) {
        if (champs.hasOwnProperty(key)) {
            var tempObj = {};
            tempObj.name=key;
            tempObj.id=champions.data[key].id;
            arrayChamps.push(tempObj);
        }
    }
    return arrayChamps;
})();
//getSummonerId("lan","Arcant").then(function(a){console.log(a);});
//getMatchList("lan",144020,58,86,"RANKED_FLEX_SR","SEASON2016");
//console.log(getChampionId("Garen"));

function getMatchList(serverName, summonerId, championId,enemyChampionId, gameMode, season){	
	return new Promise(function (fulfill, reject){
		request(ritoURL+serverName+"/v2.2/matchlist/by-summoner/"+summonerId+"?championIds="+championId+"&rankedQueues="+gameMode+"&seasons="+season+"&api_key="+apiKey, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  		body = JSON.parse(body);
		  		fulfill(body);
		  }
		  else{
		  	console.log("error trying to get to the server");
		  	reject(error);
		  }
		});
	});
}

function getChampionId(championName){
	var id=(arrayChampions.filter((champion)=>{return champion.name==championName}))[0].id;
    return id;
}

function getSummonerId(serverName,summonerName){
	return new Promise(function (fulfill, reject){
		request(ritoURL+serverName+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+apiKey, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  		body = JSON.parse(body)
		  		//console.log(body[summonerName.toLowerCase()].id);
	 	 		fulfill (body[summonerName.toLowerCase()].id);
		  }
		  else{
		  	console.log("error trying to get to the server");
		  	reject(error);
		  }
		});
	});
};

app.listen(port);
console.log('Server started on ' + port);
