var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var DBName = "SCHOOL-DB";
var RelationName = "STUDENT-TABLE";
var connToken = "90933193|-31949319906241446|90951128";

$('#id').focus();
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}
function getIdAsJsonObj() {
    var id = $('#id').val();
    var jsonStr = {
        id:id
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#name').val(data.name);
    $('#std').val(data.std);
    $('#dob').val(data.dob);
    $('#add').val(data.address);
    $('#doe').val(data.doe);
}
function resetForm() {
    $('#id').val('');
    $('#name').val('');
    $('#std').val('');
    $('#dob').val('');
    $('#add').val('');
    $('#doe').val('');
    $('#id').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#id').focus();
}
function validateData() {
    var id=$('#id').val();
    var name=$('#name').val();
    var std=$('#std').val();
    var dob=$('#dob').val();
    var add=$('#add').val();
    var doe=$('#doe').val();
    if (id === '') {
        alert('Employee ID missing');
        $('#id').focus();
        return '';
    }
    if (name === '') {
        alert('Employee Name missing');
        $('#name').focus();
        return '';
    }
    if (std === '') {
        alert('Employee Salary missing');
        $('#std').focus();
        return '';
    }
    if (dob === '') {
        alert('HRA missing');
        $('#dob').focus();
        return '';
    }
    if (add === '') {
        alert('DA missing');
        $('#add').focus();
        return '';
    }
    if (doe === '') {
        alert('Deduction missing');
        $('#doe').focus();
        return '';
    }
    var jsonStrObj = {
        id : id,
        name : name,
        std: std,
        dob: dob,
        address : add,
        doe : doe
    };
    return JSON.stringify(jsonStrObj);
}
function get(){
    var IdJsonObj = getIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBName, RelationName, IdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    } else if (resJsonObj.status === 200) {
        $("#id").prop("disabled",true);
        fillData(resJsonObj);
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    }
}
function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return '';
    }
    var putRequest = createPUTREQUEST(connToken, jsonStrObj, DBName, RelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#id').focus();
}
function updateData() {
    $('#change').prop("disabled",true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,DBName,RelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonDB);
    resetForm();
    $('#id').focus();
}
function createGET_BY_KEYRequest(connToken, DBName, RelationName, empIdJsonObj) {
    var GET_BY_KEY="{\n"
                + "\"token\" : \""
                + connToken
                + "\","
                + "\"dbName\": \""
                + DBName
                + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
                + "\"rel\" : \""
                + RelationName + "\","
                + "\"jsonStr\": \n"
                + empIdJsonObj
                + "\n"
                + "}";
                return GET_BY_KEY;
}
function createPUTREQUEST(connToken, jsonStrObj, DBName, RelationName) {
    var putRequest = "{\n"
                + "\"token\" : \""
                + connToken
                + "\","
                + "\"dbName\": \""
                + DBName
                + "\",\n" + "\"cmd\" : \"PUT\",\n"
                + "\"rel\" : \""
                + RelationName + "\","
                + "\"jsonStr\": \n"
                + jsonStrObj
                + "\n"
                + "}";
    return putRequest;
}
function executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL) {
    var url = jpdbBaseURL + jpdbIRL;
    var jsonObj;
    $.post(url, getRequest, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}
    
    