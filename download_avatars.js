// Variable declarations

var owner = process.argv[2];
var repo = process.argv[3];
var request = require('request');
var secrets = require('./secrets.js');


// Returns an error message if no owner or repositories specified

if(!owner || !repo){
  console.log("Error! Please enter at least two values.");
  return;
}


// Introductory program message

console.log('Welcome to the GitHub Avatar Downloader! Downloading avatars...');


// Fetches corresponding repository data

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token: ' + secrets.GITHUB_TOKEN
    }
  };


// Parses string to object using JSON.parse

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}


// Downloads avatars and saves to corresponding filepaths

 function downloadImageByURL(url, filePath){

   var fs = require('fs');
   request.get(url)
   .pipe(fs.createWriteStream(filePath));

}


// Fetches individual avatar urls

getRepoContributors(owner, repo, function(err, result) {
  for(var i = 0; i < result.length; i++){
  var path = './avatars/'+result[i].login+".jpg";
  downloadImageByURL(result[i]['avatar_url'], path);}
});
