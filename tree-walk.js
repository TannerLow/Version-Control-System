const fs = require('fs');

/* Takes in a filepath as a string and ouput object(array).
 * Output object will gain every source file excluding dot-files*/
function getContents(sourcePath, output){
	fs.readdirSync(sourcePath).forEach(function(file){
		if(file.toString().charAt(0) != '.'){
			file = sourcePath + "\\" + file;
			let stats = fs.statSync(file);
			if(stats){
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

/***************************************
 * Driver Code to show off that it works
 **************************************/
const path = __dirname;
files = [];
getContents(path, files);

for(var i = 0; i < files.length; i++){
	files[i] = files[i].replace(path, '');
}
console.log(files);