const express = require('express');

var app = express();

app.get('/get_form_text', function(req,res){
	var myText = req.query.my_input_box_text;
	res.send('Your Text:' + myText);
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000);