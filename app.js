function TemplateOptions(container, sepperator, copyLastEntry, testing) {
    if (container===undefined)
      { throw new Error("Container id is required"); }
    if (typeof(container)!="string")
      { throw new TypeError("Container id must be a string"); }
    if (sepperator !== undefined && typeof(sepperator) !== "string")
      {  throw new TypeError("Sepperator character must be a string"); }
    this.container = container;
    this.sepperator = sepperator === undefined ? "*" : sepperator; 
    this.copyLastEntry = copyLastEntry === undefined ? false : true;
    this.testing = testing === undefined ? false : true;
}

function TemplateGenerator(options,template,source){
  var container,lastEntry;
  
  //validation
  if (options===undefined || template===undefined || source===undefined)
    { throw new Error("Options, template, and source are required parameters");}
  if (!isOptions(options, new TemplateOptions("test")))
    { throw new TypeError("Options must be a TemplateOptions object"); }
  if (typeof(template)!="string")
    { throw new TypeError("Template must be a string"); }
  if (!Array.isArray(source))
    { throw new TypeError("Source must be an array"); }
  //validation
  
  //1 - clear contents of container
  if (!options.testing){
    container = document.getElementById(options.container);
    if (container===null)
      { throw new Error(`Container with id '${options.container}' was not found on DOM`);}
    container.innerHtml = "";
  }
  
  //2 - loop through entries in source and create a template for each
  var result = "";
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // loop through each entry
  for (var x = 0; x < source.length; x++){
    let entrynumber = x;
    let _template = template;
    //loop through each arrayVariable in the selected entry
    for (var y = 0; y < source[x].length; y++)
    {
      var arrayVariable = source[x][y] === undefined ? "" : source[x][y];
      if (options.copyLastEntry && arrayVariable === "")
        { findLastEntry(x,y); arrayVariable = lastEntry; }
      let placeholder = options.sepperator + letters[y] + options.sepperator;
      _template = _template.replace(placeholder, arrayVariable);
    }
    result === "" ? result += _template : result += ('\n' + _template);
  }
  
  //3 - add contents to container on DOM
  if (!options.testing){
    container.innerHTML = result;
  } else { console.log(result); }
  
  //utility
  function isOptions(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }
  function findLastEntry(x,y){
    var entry = source[x];
    var arrayVariable = source[x][y];
    if (arrayVariable === undefined)
    { 
      findLastEntry((x-1),y);
    }
    if (arrayVariable !== undefined)
    { 
      lastEntry = arrayVariable;
    }
  }
  //utility
}

// Test

var options = new TemplateOptions("myContainer",undefined,true);

var temp = "<p id='*A*' style='*B*'>*C*</p>"

var content = [
	["id1","background-color:red;color:white;","this is red"],
	["id2","background-color:blue;color:white;","this is blue"],
	["id3","background-color:green;color:white;","this is green"]
];

TemplateGenerator(options, temp, content);


// test
/*
goal:
create a javacript module that can replicate templates. each template would have certain values filled in from an array.

benefit:
The system would sepperate dynamic from static properties in the template making replication faster and more accurate. 

use-cases:
dynamic -> module could be included in project and dynamically create content when page is loaded 

static -> module could be run on packaging for deployment and write content to html page

How-To-Use:
1) create a new TemplateOptions object with following arguments
    container (required, string): the id of the HTMLElement you want to add the templates to.
    sepperator (optional, string): a character or set of unique characters used to denote a replacement variable. default is "*". 
    copyLastEnter (optional, bool): set true to enable, undefined to disable. when enabled, if a arrayVariable is denoted undefined, it will be replaced with the last corresponding array variable that is not undefined. when disabled, if an arrayVariable is denoted as undefined, it will be replaced with an empty string. for example:
          (enabled)[1,2][1,undefined] => <p id='1'>2</p> || <p id='1'>2</p>
          (disabled)[1,2][1,undefined] => <p id='1'>2</p> || <p id='1'></p>
    testing (optional, bool): set true to enable, undefined to disable. when enabled, templates are sent to the console instead of added to the dom.
2) create a string template, with replace-able values denoted in incrementing letters surrounded by sepperators. for example:
      <p>*A*</p><span>*B*</span><img src="*C*"/>
3) create a multi-dimensional array of conent. the outer array is a container that holds inner arrays. each inner array represents a copy of the template. each value inside the inner array is assigned to the corresponding letter in the template. for example:
      [[1,2,3],[3,4,5]] will create two copies of the template, replacing the *A*, *B*, *C* in the template above. 
4) call the TemplateGenerator method with the following arguments:
    options (required, TemplateOptions): the TemplateOptions object you created in step 1.
    template: (required, string): the string template you created in step 2.
    source: (required, multi-dimensional array): the array of content created in step 3. 
*/
