pragma solidity >=0.4.22 <0.8.0;
contract Study{
    uint public teacherCount=0;
    uint public studentCount=0;
    uint public studentfilesCount=0;
    uint public teacherfilesCount=0;

    struct teacher{
        uint id;
        string name;
        string phonenumber;
        string email;
        string dob;
        string orgname;
        string Address;
        string IDproof;
    } 
    mapping(address => teacher) public teachers;
    struct FileTeacher{
        uint id;
        string filehash;
        string subject;
        string time;
        string description;
        address teacher;
    }
    mapping(uint => FileTeacher) public filesbyteachers;

    struct student{
        uint id;
        string name;
        string phonenumber;
        string email;
        string dob;
        string Address;
        string IDproof;
    } 
    mapping(address => student) public students;
    struct FileStudent{
        uint id;
        string filehash;
        string subject;
        string time;
        string description;
        address student;

    }
    mapping(uint => FileStudent) public filesbystudents;

    address[] public teacheraddresses;
    address[] public studentaddresses;

    function registerteacher(string memory _name, string memory _phonenumber, string memory _email,string memory _dob,string memory _orgname, string memory _Address,string memory _IDproof) public {
        teacherCount++;
        teachers[msg.sender]=teacher(teacherCount,_name,_email,_phonenumber,_dob,_orgname,_Address,_IDproof);
        teacheraddresses.push(msg.sender);
    }
    function registerstudent(string memory _name, string memory _email, string memory _phonenumber,string memory _dob,string memory _Address,string memory _IDproof) public {
        studentCount++;
        students[msg.sender]=student(studentCount,_name,_phonenumber,_email,_dob, _Address,_IDproof);
        studentaddresses.push(msg.sender);
    }
    function addNewfilebyStudent(string memory _subject, string memory _description,string memory _filehash,  string memory _time,string memory _studentaddress) public {
        studentfilesCount++;
        filesbystudents[studentfilesCount]=FileStudent(studentfilesCount,_subject,_description,_filehash,_time,_studentaddress,_msg.sender);       
    }
    function addNewfilebyTeacher( string memory _subject, string memory _description,string memory _filehash,  string memory _time,string memory _teacheraddress) public {
        teacherfilesCount++;
        filesbyteachers[teacherfilesCount]=FileTeacher(teacherfilesCount,_subject,_description,_filehash,_time,_teacheraddress,,msg.sender);       
    }
    
    

}