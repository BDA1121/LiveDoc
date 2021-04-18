var showingSourceCode= false;
	var isInEditMode= true;
    var socket=io();

    socket.emit('joinRoom',{room:document.getElementById('room').value});
    richTextField.document.getElementsByTagName('body')[0].innerHTML =document.getElementById('Content').value
    socket.on("render", data => {
        // console.log(data+richTextField.document.getElementsByTagName('body')[0].innerHTML)
    });
    socket.on('moved',data=>{
        // console.log(data)
        richTextField.document.getElementsByTagName('body')[0].innerHTML = data;
    })


	richTextField.document.addEventListener('keyup', function(e){
			socket.emit('move',{data:richTextField.document.getElementsByTagName('body')[0].innerHTML});
			// document.querySelectorAll(".save")[0].innerHTML=richTextField.document.getElementsByTagName('body')[0].innerHTML;
		});
	function enableEditMode(){
		richTextField.document.designMode='On';
	}
	function execCmd(command){
		richTextField.document.execCommand(command, false, null);
	}
	function execCommandWithArg(command,arg){
		richTextField.document.execCommand(command, false, arg);
	}
    var adduser = [];
    var checks = document.getElementsByClassName('check')
    
    async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
 
    headers: {
      'Content-Type': 'application/json'
    },
   
    body: JSON.stringify(data) 
  });
  return response.json(); 
}
function save(){
    postData('/save/'+document.getElementById('room').value, { Content: richTextField.document.getElementsByTagName('body')[0].innerHTML})
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
}
	function Onsubmit(event) {
	console.log("hhh");
    for(var i =0;i<checks.length;i++){
        if(checks[i].checked){
            adduser.push(checks[i].value)
            console.log(adduser)
        }
    }
    postData('/add/'+document.getElementById('room').value, { users:adduser })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
}