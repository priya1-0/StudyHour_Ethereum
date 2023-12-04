App = {
  web3Provider: null,
  contracts: {},
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Study = await $.getJSON('Study.json')
    App.contracts.Study = TruffleContract(Study)
    App.contracts.Study.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.study = await App.contracts.Study.deployed()
    ////window.alert("smart contract loaded")
  },
  render: async () => {
    // Set the current blockchain account
    
     var teacher =await App.study.teachers(App.account);
    //window.alert("Role="+role);
    console.log(teacher);
    if (teacher[1]=="" ){
      //Account not registered as teacher
      var student =await App.study.students(App.account);
      if(student[1]==""){
        //this is noa student
        $("#homepage").show()
        $("#teachersignup").hide();
        $("#studentsignup").hide();
        $("#teacherdashboard").hide();
      }
      else{
        //here we need to show student dashboard
        //file event listener adding
      document.getElementById('studentfileupload') 
      .addEventListener('change', function() {                       
      var fr=new FileReader(); 
      fr.onload=function(){ 
          //  document.getElementById('output') 
          //          .textContent=fr.result; 
          //window.alert(fr.result);
          App.filedatastudent=fr.result;
      }                       
      fr.readAsText(this.files[0]); 
      }) ;
  //file event listener adding

        $("#disstudentname").html(student[1])
        $("#homepage").hide()
        $("#teachersignup").hide();
        $("#studentsignup").hide();
        $("#studentdashboard").show();
      }
     
    }
    
    else{
     //teacher dashboard shows up here
     $("#displayallbooks").empty();
     // retrieve all teacher books
     var teacherfilecount=await App.study.teacherfilesCount();
    
     for (var i=1;i<=teacherfilecount;i++){
      var filedetailes=await App.study.filesbyteachers(i);      
      var subject=filedetailes.subject;
      var teacheraddress=filedetailes.teacher;
      var file=filedetailes.filehash;
      var str=` <div class="col-9 col-sm-6 col-md-6 col-lg-9">
      <div class="panel panel-default panel-pet">
        <div class="panel-heading">
          <h3 class="panel-title">`+subject+`</h3>
        </div>
        <div class="panel-body">
          <img alt="140*140"  class="img-rounded img-center" style="height: 55%;width: 55%;" src="2.jpg"  >
          
          <br/><br/>
          <!-- used for filters -->
          <strong>All file details</strong>: <span class="Filedetails">Maths</span><br/> 
          <strong>Description about file</strong>: <span class="Descriptionaboutfile"></span><br/>
      
          <button class="btn btn-default btn-primary" type="button" data-id="0">View</button>
          
        </div>
      </div>
    </div>`;
    $("#displayallbooks").append(str);
     
     }


     //retrieve all student books
     var filecount=await App.study.studentfilesCount();
    
     for (var i=1;i<=filecount;i++){
      var filedetailes=await App.study.filesbystudents(i);      
      var subject=filedetailes.subject;
      var studentaddress=filedetailes.student;
      var file=filedetailes.filehash;
      var str=` <div class="col-9 col-sm-6 col-md-6 col-lg-9">
      <div class="panel panel-default panel-pet">
        <div class="panel-heading">
          <h3 class="panel-title">`+subject+`</h3>
        </div>
        <div class="panel-body">
          <img alt="140*140"  class="img-rounded img-center" style="height: 55%;width: 55%;" src="2.jpg"  >
          
          <br/><br/>
          <!-- used for filters -->
          <strong>All file details</strong>: <span class="Filedetails">Maths</span><br/> 
          <strong>Description about file</strong>: <span class="Descriptionaboutfile"></span><br/>
      
          <button class="btn btn-default btn-primary" type="button" data-id="0">View</button>
          
        </div>
      </div>
    </div>`;
    $("#displayallbooks").append(str);
     
     }
   



   
      $("#disteachername").html(teacher[1])
      $("#homepage").hide()
      $("#teachersignup").hide();
      $("#studentsignup").hide();
      $("#teacherdashboard").show();
    }
    
    
  },
  
  uploadteacherfile: async () =>{
    //Add files
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   
  
    var input = document.getElementById('teacherfileupload');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
      App.filedata="";               
    }
    else {           
      document.getElementById('teacherfileupload') 
      .addEventListener('change', function() {                       
      var fr=new FileReader(); 
      fr.onload=function(){ 
          //  document.getElementById('output') 
          //          .textContent=fr.result; 
          //window.alert(fr.result);
          App.filedata=fr.result;
      }                       
      fr.readAsText(this.files[0]); 
      })
    }
    if(App.filedata!==""){
     // window.alert("succefully uploaded");
    }
    var subject=$("#teachersubjectfile").val();
   // window.alert(subject)
//store file into ipfs
      //Add file to Blockchain
      const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
      var filehash="";
      window.alert(App.filedata);
      ipfs.add(App.filedata,(err,hash)=>{
        if(err){
          console.log(err); 
          filehash="";
          App.filehash="";
          window.alert("Eror in file upload to blockchain"+err) ;     
        }
        else{
          console.log("https://ipfs.infura.io/ipfs/"+hash);
          filehash=hash;  
          App.filehash=hash;
          App.study.addNewfilebyTeacher(App.filehash,subject,{from : App.account}).then(()=>{
            window.alert("Successfully added in smart contract")
          })
         // window.alert("https://ipfs.infura.io/ipfs/"+App.filehash); 
        }
      });          
      //Add file to Blockchain Ends
    },
    uploadstudentfile: async () =>{
      //Add files
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }   
    
      var input = document.getElementById('studentfileupload');
      if (!input) {
        alert("Um, couldn't find the fileinput element.");
      }
      else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
      }
      else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
        App.filedatastudent="";               
      }
      else {           
        document.getElementById('studentfileupload') 
        .addEventListener('change', function() {                       
        var fr=new FileReader(); 
        fr.onload=function(){ 
            //  document.getElementById('output') 
            //          .textContent=fr.result; 
            //window.alert(fr.result);
            App.filedatastudent=fr.result;
            console.log(App.filedatastudent);
        }                       
        fr.readAsText(this.files[0]); 
        })
      }
      
      var studentsubject=$("#studentsubjectfile").val();
      var studentfiledesription=$("#Descriptionaboutfile").val();
     // window.alert(subject)
  //store file into ipfs
        //Add file to Blockchain
        const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        var filehash="";
        window.alert(App.filedatastudent);
        ipfs.add(App.filedatastudent,(err,hash)=>{
          if(err){
            console.log(err); 
            filehash="";
            App.filehash="";
            window.alert("Eror in file upload to blockchain"+err) ;     
          }
          else{
            console.log("https://ipfs.infura.io/ipfs/"+hash);
            filehash=hash;  
            App.studentfilehash=hash;
              console.log("subject="+studentsubject+"description="+studentfiledesription+"file hash="+filehash+"file content="+App.filedatastudent)
            // get the current time using jascript
              // App.study.addNewfilebyTeacher(App.studentfilehash,subject,{from : App.account}).then(()=>{
            //   window.alert("Successfully added in smart contract")
            // })

            // define a function in smart contract to store file detls of a student
            //studentsubject,studentfiledesription,filehash,time
           // window.alert("https://ipfs.infura.io/ipfs/"+App.filehash); 
          }
        });          
        //Add file to Blockchain Ends
      },
teacherbuttonclick: async () =>{
  window.alert("displaying")
  $("#teachersignup").show();
  $("#studentsignup").hide();

},
studentbuttonclick: async () =>{
  // window.alert("displaying")
  $("#teachersignup").hide();
  $("#studentsignup").show();
  
},
registerStudent: async () =>{
var name=$("#studentname").val();
var phonenumber=$("#studentphonenumber").val();
var email=$("#studentemail").val();
var dob=$("#studentdob").val();
var address=$("#studentaddress").val();
var IDproof=$("#studentIDproof").val();
window.alert("registered"+name+phonenumber+email+dob+address);

await App.study.registerstudent(name,phonenumber,email,dob,address,IDproof,{from :App.account});
},
searchforteacher: async () =>{
  var name=$("#teachersearchvalue").val()
  window.alert(name);
  $("#displayteachers").empty();
  //here retrieve all teachers register 
  var count=await App.study.teacherCount();
  for (var i=0;i<count;i++){
    var teacheraddr=await App.study.teacheraddresses(i)
    var teacher=await App.study.teachers(teacheraddr);
    if(name.localeCompare(teacher[1])==0){
      var str="<tr><td>"+teacher[1]+"</td><td>"+teacher[2]+"</td></tr>";
      $("#displayteachers").append(str);
    }
    
    console.log(teacher);
  }

      $("#findingteacherbystudent").show();
      $("#homepage").hide()
      $("#teachersignup").hide();
      $("#studentsignup").hide();
     





},
registerTeacher : async () =>{
var name=$("#teachername").val();
var phonenumber=$("#teacherphonenumber").val();
var email=$("#teacheremail").val();
var dob=$("#teacherdob").val();
var orgname=$("#teacherorgname").val();
var address=$("#teacheraddress").val();
var IDproof=$("#teacherIDproof").val();
//window.alert("registered"+name+phonenumber+email+dob+address+orgname);
//window.alert("smart contract calloing "+IDproof)
await App.study.registerteacher(name,phonenumber,email,dob,orgname,address,IDproof,{from :App.account});
},
searchforstudent : async () =>{
  var name=$("#studentsearchvalue").val()
  window.alert(name);
  $("#displaystudents").empty();
  //here retrieve all students register 
  var count=await App.study.studentCount();
  for (var i=0;i<count;i++){
    var studentaddr=await App.study.studentaddresses(i)
    var student=await App.study.students(studentaddr);
    if(name.localeCompare(student[1])==0){
      var str="<tr><td>"+student[1]+"</td><td>"+student[2]+"</td></tr>";
      $("#displaystudents").append(str);
    }
  }
  var filecount=await App.study.studentfilesCount();
  $("#displayallfilesbystudents").empty();
  for (var i=1;i<=filecount;i++){
   var filedetailes=await App.study.filesbystudents(i);
   var str="<tr><td>"+filedetailes.student+"</td><td>"+filedetailes.filehash+"</td></tr>";
   $("#displayallfilesbystudents").append(str);
  }

      $("#findingstudentbyteacher").show();
      $("#homepage").hide()
      $("#teachersignup").hide();
      $("#studentsignup").hide();
     




},
}

$(function () {
  $(window).load(function () {
    //window.alert("starting")
    App.load();
  });
});
