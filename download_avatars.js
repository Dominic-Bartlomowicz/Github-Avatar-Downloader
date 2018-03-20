var owner = process.argv[2];
var repo = process.argv[3];
var request = require('request');
var secrets = require('./secrets.js');

if(!owner || !repo){
  console.log("Error! Please enter at least two values.");
  return;
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token: ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}


 function downloadImageByURL(url, filePath){

   var fs = require('fs');
   request.get(url)
   .pipe(fs.createWriteStream(filePath));

}


getRepoContributors(owner, repo, function(err, result) {
  for(var i = 0; i < result.length; i++){
  var path = './avatars/'+result[i].login+".jpg";
  downloadImageByURL(result[i]['avatar_url'], path);}
});
