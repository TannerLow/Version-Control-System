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
 * (Ex. "bot/a/b/fred.txt" -> ["bot/a/b/", "fred.txt"]) */
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

/*
 * Driver Code to show off that it works
 */
var path = 'bot/a/b/fred.txt';
var splitted = splitPath(path);
console.log(splitted);
var P = checksumP(splitted[0]);
var L = checksumL(path);
var C = checksumC(path);
console.log(P + '\n' + L + '\n' + C);
var ArtID = 'P' + P + '-L' + L + '-C' + C + '.' + getExtension(splitted[1]);
console.log(ArtID);