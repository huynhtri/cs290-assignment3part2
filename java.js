/*********************************************************************
* AJAX Portion 
* Note: All HML information was learned from thenewboston tutorials
*********************************************************************/

var xmlHttp = createXmlHttpRequestObject();

function createXmlHttpRequestObject(){
	var xmlHttp;

	if(window.XMLHttpRequest)
		xmlHttp = new XMLHttpRequest();
	else
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");

	return xmlHttp;
}

//"https://api.github.com/gists/public?page=1&per_page=30"
function process(){
	if(xmlHttp){
		try{
			xmlHttp.open("GET", "https://api.github.com/gists/public", true);
			xmlHttp.onreadystatechange = checkServerStatus;
			xmlHttp.send(null);
		} 
		catch(e){
			alert(e.toString());
		}
	}
}

function checkServerStatus(){
	searchForm = document.getElementById('searchForm');
	if(xmlHttp.readyState===1)
		searchForm.innerHTML += "Status 1: Server worked. <br>";
	else if(xmlHttp.readyState===2)
		searchForm.innerHTML += "Status 2: Server worked. <br>";
	else if(xmlHttp.readyState===3)
		searchForm.innerHTML += "Status 3: Server worked. <br>";
	else if(xmlHttp.readyState===4){

		if(xmlHttp.status===200){
			try{
				text = xmlHttp.responseText;
				searchForm.innerHTML += "Status 4: Server worked. <br>";

				//Converts the info from JSON into an object
				var convertJSON = JSON.parse(xmlHttp.responseText);
				convertInfo(convertJSON);
				}
			catch(e){
				alert(xmlHttp.statusText);
			}
		}
		else
			alert(xmlHttp.statusText);
	}
}

/*********************************************************************
* Storing JSON files and manipulating data
*********************************************************************/
//Converts the info from JSON into an object one at a time
function convertInfo(convertJSON){
	var mainData = []; 

	//Transferres the info from JSON to mainData object array
	for(var i in convertJSON){
		//Checks if description is null and provides info that it empty it is true
		if(convertJSON[i].description !== "")
			description = convertJSON[i].description;
		else
			description = "No description provided...";

		//Sets the url and default language
		url = convertJSON[i].html_url;
		lang = "Not defined";
		
		for(var j in convertJSON[i].files){
			//If there is a language, it will be recorded
			if(typeof convertJSON[i].files[j] !== null){
				lang = convertJSON[i].files[j];
			}
		}	
		mainData.push({description: description, url: url, language: lang});

		//Used for testing purposes
		console.log(mainData[i].description);
		console.log(mainData[i].url);
		console.log(mainData[i].language.language);
		console.log("   ");
	}

	//Moves the object array to generate the search results
	generateResults(mainData);
}

/*********************************************************************
* Show search results 
* Note: The code below was used with the help of Dustin Chase.
*********************************************************************/

//Generates the search results to the user
function generateResults(mainData){
	var searchResults = document.getElementById("searchResults");
	for(var i in mainData){

		//Creates the all the definitions needed to post the info
		var item = document.createElement("dl");
		item.setAttribute("id", i);
		var url = document.createElement("dt");
		var button = document.createElement("dd");

		//Sets up hyperlink
		var hyperlink = document.createElement("a");
		hyperlink.setAttribute("href", mainData[i].url);
		hyperlink.innerHTML = mainData[i].description;

		//Creates the button
		var addButton = document.createElement("button");
		var buttonText = document.createTextNode("Add to Favs");
		addButton.appendChild(buttonText);
		addButton.setAttribute("name", mainData[i].url);
		addButton.addEventListener("click", addFavorites(mainData[i]));
		button.appendChild(addButton);

		//Puts all the definition lists together
		button.appendChild(addButton);
		url.appendChild(hyperlink);
		url.appendChild(button);
		item.appendChild(url);

		searchResults.appendChild(item);
	}
}

//Adding an item to favorites
function addFavorites(data){
	localStorage.setItem("favorite", JSON.stringify(data));


}

