/* Authors: Tanner Lowthorp   lowthorpt@gmail.com 
 *			Edmund Zhou 	  edmundhypebeast@gmail.com
 *			Parth Chhasatiya  chhasatiyaparth@gmail.com
 *			Saurav Chhapawala sauravc41@gmail.com
 *
 * Description:
 *	 This file handles the serving of the landing page as
 *	 well as the functions necessary to create a repo
 */



const express = require('express');
const fs = require('fs');

/* Splits a string at the last instance of char without removing the char
 * (Ex. ("bot/a/b/fred.txt", '/') -> ["bot/a/b/", "fred.txt"]) */
function splitFromBack(str, char){
	var i, index = 0;
	for(i = str.length-1; i >= 0; i--){
		if(str.charAt(i) == char){
			index = i+1;
			break;
		}
	}
	return [str.substring(0, index), str.substring(index, str.length)];
}

//Returns the file extension from a filename(Ex. "fred.txt" -> "txt")
function getExtension(filename){
	return splitFromBack(filename, '.')[1];
}

/* Returns a 2 item array in the format [directory, file]
 * (Ex. "bot\a\b\fred.txt" -> ["bot\a\b\", "fred.txt"]) */
function splitPath(filepath){
	return splitFromBack(filepath, '/');
}

/* Multiplies the characters in a string by coefficients 1,7,3,11 in a loop
 * HELLO -> (1*H + 7*E + 3*L + 11*L + 1*O)
 * characters represent their ASCII value 
 * Only the last 4 digits of the computation are returned*/
function checksum(str){
	var i, checksum = 0;
	var coefficients = [1,7,3,11];
	for(i = 0; i < str.length; i++){
		checksum += (coefficients[i % coefficients.length] * str.charCodeAt(i));
	}
	return checksum % 10000;
}

//Returns the size(Bytes) of the file at the given path (Ex. fred.txt -> 11)
function getFileSizeBytes(filepath){
	var stats = fs.statSync(filepath);
	return stats["size"];
}

//Returns checksum of directory(Ex. "bot/a/b/"" -> checksum("bot/a/b/""))
function checksumP(directory){
	return checksum(directory);
}

//Return the last 4 digits of the file's size
function checksumL(filepath){
	return getFileSizeBytes(filepath) % 10000;
}

//Returns checksum() of the file's contents
function checksumC(filepath){
	return checksum(fs.readFileSync(filepath).toString());
}

//Returns the artID in the form P<checksumP>-L<checksumL>-C<checksumC>.<file extension>
function getArtID(path){
	var splitted = splitPath(path);
	var P = checksumP(splitted[0]);
	var L = checksumL(path);
	var C = checksumC(path);
	var ArtID = 'P' + P + '-L' + L + '-C' + C + '.' + getExtension(splitted[1]);
	return ArtID;
}

/*Takes a source filepath and an array to populate.
 *Populates the given array with all source files
 *inside the give path.*/
function getContents(sourcePath, output){
	fs.readdirSync(sourcePath).forEach(function(file){
		//ignores dot-files
		if(file.toString().charAt(0) != '.'){
			file = sourcePath + "/" + file;
			let stats = fs.statSync(file);
			if(stats){
				//ignores directories and goes into them
				if(stats.isDirectory()){
					getContents(file, output);
				}
				else{
					output.push(file.toString());
				}
			}
		}
	});
}

//Copys files from src to dst path
function copyFile(src, dst){
	fs.copyFile(src, dst, function(err){
	  if (err) throw err;
	});	
}

//Makes a new directory at filepath
function makeDirectory(filepath){
	if (!fs.existsSync(filepath)){
    	fs.mkdirSync(filepath);
	}
}

//Creates a copy of a file in the repo with its ArtID name
function createArtifact(filepath, repoPath){
	var artID = getArtID(filepath);
	copyFile(filepath, repoPath + '/' + artID);
}

/*Takes the initial command and a list of source file paths.
 *Creates a manifest file in the repo and source directories
 *with */
function createManifestFile(command, files){
	var repo   = command.split(' ')[1];
	var source = command.split(' ')[2];
	var data   = command + '\n';

	data += Date().toString() + '\n';
	for(var file of files){
		data += file.replace(source + '/','') + ' ' + getArtID(file) + '\n';
	}

	//names the manifest file
	var manifestNumber = 1;
	var filepath = repo + "/.man-" + manifestNumber + ".rc";
	while(fs.existsSync(filepath)){
		manifestNumber++;
		filepath = repo + "/.man-" + manifestNumber + ".rc";
	}

	//writes the 2 manifest files
	fs.writeFile(filepath, data, function(err){
		if(err) throw err;
	});
	fs.writeFile(source + "/.man-" + manifestNumber + ".rc", data, function(err){
		if(err) throw err;
	});
}

/*Takes a target directory for the repo and source directory to copy from.
 *copies all source files over and create a manifest file in both directories*/
function createRepo(directoryPath, sourceDirectoryPath){
	makeDirectory(directoryPath);
	var _filepaths = [];
	getContents(sourceDirectoryPath, _filepaths);
	for(var file of _filepaths){
		createArtifact(file, directoryPath);
	}
	createManifestFile("create-repo " + directoryPath + ' ' + sourceDirectoryPath, _filepaths);
}

/*****************
 ***Driver Code***
 *****************/

var app = express();

//Handles commands entered into webpage
app.get('/get_form_text', function(req,res){
	var command = req.query.my_input_box_text;
	res.send('Command: ' + command + ', entered successfully');
	createRepo(command.split(' ')[1], command.split(' ')[2]);
});

//Handles serving the landing page 
app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

//express listening on port 3000
app.listen(3000);