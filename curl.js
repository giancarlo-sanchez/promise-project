const fetch = require('node-fetch');
const fsPromises = require('fs').promises;
const yargs = require('yargs');
const argv = yargs.argv;


const url = argv._[0];
const output = argv.output;
const header = argv.header;
const userAgent = argv.A;
const referer = argv.e;
const dumpHeader = argv["dump-header"];
// console.log(argv);


let urlObj;
fetch(url)
    .then(res => {
        urlObj = res;
        const contentType = res.headers.get('content-type')
        if(contentType.includes("text")) return res.text();
        else if(contentType.includes("json")) return res.json();
    })
    .then(data =>{
        let headerText = "";
        if(header){
            if(!Array.isArray(header)){
                headerText = header +"\n";
            } else if(Array.isArray(header)){
                header.forEach(ele =>{
                    headerText += ele+"\n";
                })
            }
        }
        if(userAgent){
          if(!Array.isArray(userAgent)){
                headerText = "User-Agent: "+userAgent + "\n";
            } else if(Array.isArray(userAgent)){
                headerText = "User-Agent: "+userAgent[userAgent.length-1] + "\n";
            }
        }
        if(referer){
            if(!Array.isArray(referer)){
                headerText = "Referer: "+referer + "\n";
            } else if(Array.isArray(referer)){
                headerText = "Referer: "+referer[referer.length-1] + "\n";
            }
        }
        return headerText+"\n" + data;
    })
    .then( data => {
        if(dumpHeader){


            const headersObj = urlObj.headers;
            // const headersOnly = headersObj.entries();
            for (let pair of headersObj.entries()) {
                console.log(pair[0]+ ': '+ pair[1]);
            }
        }
        return data;
    })
    .then( data=>{
        if(output){
            fsPromises.writeFile(output, data, "utf8");
        }
        else{
            console.log(data);
        }
    })
    .catch(reason => console.error("the reason for the error is:", reason));

    // curl https://api.github.com/users/github --output filename.txt --header "header content"
    // argv = {
    //     _: [];
    //     header: " header content",
    //     output: "filename.txt"
    // }
/*    fsPromises.writeFile(file, data[, options])
JSON example data: https://api.github.com/users/github
text example data: https://artii.herokuapp.com/make?text=curl++this
In our first 'then' statement we need to check the data type of the link from res.headers.get("content-type")
if the content type is text we return res.text(), if json, we do res.json()

NEXT STEP: pass in the URL as a parameter, and have it console log (this is what curl does w/o any modifies)


*/
