const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MAILCHIMP_URL;

    const options = {
        method: "POST",
        auth: `${process.env.MAILCHIMP_API_KEY}`,
    }
    const request =  https.request(url,options,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});



app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});

