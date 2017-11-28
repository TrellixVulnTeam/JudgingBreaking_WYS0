//express code start
var express = require("express"); //get the express server
var app = express(); //express init server, server is running and grab all functions
var path = require("path");
var router = express.Router();
//express code end

//firebase database code start
var firebase = require('firebase-admin');
var serviceAccount = require("./judgingbreaking-firebase-adminsdk-egkcj-843b81f899.json")

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://judgingbreaking.firebaseio.com"
});
var judgesRef = firebase.database().ref("Judges");


//firebase database code end
app.set('views','./views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//lookup judge
app.get("/judgePage/:name", function(req, res){
    var judgePage = require("./judgePage");
    console.log("looking up judge" + req.params.name)
    
    var ref = firebase.database().ref().child("Judges/" + req.params.name);
    ref.once('value', (snapshot) => {
        if(!snapshot || !snapshot.val()) {
            res.render('judge.ejs', {
                judgeName : "ERROR",
                experience : 0,
                style: 0,
                stats : 0  /*do this fucking later*/
            })
        } else {
            res.render('judge.ejs', {
                judgeName : snapshot.val().name,
                experience : snapshot.val().experience,
                style: snapshot.val().style,
                stats : 0  /*do this fucking later*/
            })
        }
    });
    //not found upload error page
    
});

//add judge
app.get("/judgePage/newJudge/:name", function(req, res) {
    var judgePage = require("./judgePage");
    console.log(" hello" + judgePage.name);
    //upload to the database
    var judgeChildPath = judgesRef.child(req.params.name);
    
    judgeChildPath.update({
        "name" : req.params.name,
        "experience" : 0,
        "style" : "breaking",
        "styleVotes": 0,
        "powerVotes": 0,
        "abstractVotes": 0,
        "foundationVotes": 0,
    }, function(error) {
        if (error) {
          res.render('addJudge.ejs', {
            judgeName : req.params.name,
            status: "Failed"});
        } else {
          
          res.render('addJudge.ejs', {
            judgeName : req.params.name,
            status: "Success"});
        }
    });

});

app.post("/judge/:id/:name/:email", function(req, res) {
    console.log(req.params.id);    
});

module.exports = router;
app.listen(3000);
