var local_available = true;
var remote_available = true;

function onReady(yourMethod) {
  var readyStateCheckInterval = setInterval(function() {
    if (document && document.readyState === 'complete') { // Or 'interactive'
      clearInterval(readyStateCheckInterval);
      yourMethod();
    }
  }, 10);
}
// use like

function saveforms() {
// save the remote first, then the local
    if (remote_available == true) { 
        saveform( "remote", "/r900x_params_remote.txt" );
    }
    if (local_available == true) {
        if (remote_available == false) {
          saveform( "local", "/r900x_params.txt" );  
        }
        if (remote_available == true) {
          setTimeout(function() {
                saveform( "local", "/r900x_params.txt" );      
            }, 5000);
        }
    }
}

function saveform(tableid, tourl) {

  var xhttp = new XMLHttpRequest();

  document.getElementById("sub").value = tableid + " Processing, Please Wait...";

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("sub").value = tableid + " Params Saved.";
    }
    if (this.readyState == 4 && this.status == 201) {
      document.getElementById("sub").value = tableid + " Params Saved and Activated.";
    }
    if (this.readyState == 4 && this.status == 202) {
      ddocument.getElementById("sub").value = tableid + " Params Saved but not Activated, your modem might not be configured as-expected";
    }
  };

  var payload = "";

    var table = document.getElementById(tableid);

    // skip ZERO'th row, as it's the TH header row.
    for (var i = 1, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       //for (var j = 0, col; col = row.cells[j]; j++) {
         //iterate through columns
         //columns would be accessed using the "col" variable assigned in the for loop
            //alert(JSON.stringify(col));
           // alert(col.innerHTML);
       //} 

       var id_name = row.cells[0].innerHTML; 
        //alert(id_name);
       //var input_field = row.cells[1].innerHTML;
        //alert(input_field);

            stuff = id_name.split(":");
            stuff2 = stuff[1].split("=");
            //x:y=z
            id=stuff[0];

            if ( tourl == "/r900x_params_remote.txt" ) { 
                // add a  'R' to the start of the id 
                id = "R" + id; 
            } 

            name=stuff2[0];
            value = document.getElementById(id).value
            //alert(id); alert(name); alert(value);
            payload = payload + id_name + value + "\r\n";
        
    }

  var url = "/psave?f="+tourl; 

  xhttp.open("PUT", url, true);
  xhttp.send(payload); 

}

onReady(function() { loadforms(); } );

function loadforms( ) {
loadform( "local", "/r900x_params.txt" );
loadform( "remote", "/r900x_params_remote.txt" );
}

function reload_fresh_params() { 
  document.getElementById("fresh").value = "Talking With Radio/s, please wait...( page will reload )";
  reload_fresh("http://192.168.4.1/prefresh?type=remote",false);
  reload_fresh("http://192.168.4.1/prefresh?type=local",true);
} 

function reload_fresh(url,reload) { 

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("sub").value = "Params Saved.";
      paramdata = this.responseText;
      //alert("ok, handled:"+url);
        if ( reload) {
            window.location.reload(true);
        } 
    }
    if (this.readyState == 4 && this.status == 404) {
        alert("err, unhandled:"+url);
    }

  }

  xhttp.open("GET", url, true);
  xhttp.send();

} 

function loadform( tableid, fromurl ) {

  var xhttp = new XMLHttpRequest();
  var paramdata = '';
  //document.getElementById("sub").value = "Processing, Please Wait...";

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("sub").value = "Params Saved.";
      paramdata = this.responseText;
        var paramsarray = paramdata.split("\n");

        // iterate over the paramdata string, breakup and populate into fields in html by ID.
        for(var x in paramsarray){  
            if  ( paramsarray[x].substring(0,4) == "ATI5" ) continue;
            if  ( paramsarray[x].substring(0,4) == "RTI5" ) continue;
            //alert(paramsarray[x]);
            var line = paramsarray[x];
            if  ( line == "" ) continue;
            stuff = line.split(":");
            stuff2 = stuff[1].split("=");
            //alert(stuff);
            //alert(stuff2);
            //x:y=z
            id=stuff[0];
            name=stuff2[0];
            value=stuff2[1];

            // javascript to make this: <tr><td>S0:FORMAT=<td><input type='text' id='S0' value='35'></tr>
            var table = document.getElementById(tableid);
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var txt = document.createTextNode(id+":"+name+"=");

            var mi = document.createElement("input");
            mi.setAttribute('type', 'text');
            mi.setAttribute('value', value);
            if ( fromurl == "/r900x_params_remote.txt" ) { 
                mi.setAttribute('id', "R"+id);
            } else { 
                mi.setAttribute('id', id);
            }

            td1.appendChild(txt);
            td2.appendChild(mi);

            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);

            //document.getElementById(id).value = value;
        }

    }
    if (this.readyState == 4 && this.status == 404) {

            var table = document.getElementById(tableid);
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var txt = document.createTextNode("Sorry, No Parameters Available.");

            td1.appendChild(txt);
            tr.appendChild(td1);
            table.appendChild(tr);

            if ( tableid == "local" ) { local_available = false; }
            if ( tableid == "remote") { remote_available = false; }


    }
  };
  //var url = "/r900x_params.txt"; 
  xhttp.open("GET", fromurl, true);
  xhttp.send(); 
}


function gv(id) { 
return document.getElementById(id).value; 
}