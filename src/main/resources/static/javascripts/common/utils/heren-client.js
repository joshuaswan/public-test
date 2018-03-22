var HerenClient = {
    readHerenClient: function (messags, herenClientCallback) {
        $.ajax({
            type: 'get',
            url: 'http://localhost:8089/heren-client',
            dataType: "jsonp",
            data: '' + messags + '',
            jsonp: "callback",
            jsonpCallback: "jsonpCallback",
            success: function (data) {
                herenClientCallback(data);
            },
            error: function (data) {
                alert('p');
                console.log(JSON.stringify(data));
            }
        });
    }
};
var HerenMedicare = {
    callHerenMedicare: function (message, herenMedicareCallback) {
        $.ajax({
            type: 'post',
            url: 'http://localhost:8089/heren-medicare',
            dataType: "json",
            data: '' + message + '',
//        jsonp: "callback",
//        jsonpCallback: "jsonpCallback",
            success: function (data) {
                herenMedicareCallback(data);
            },
            error: function (data) {
                alert('error');
                console.log(JSON.stringify(data));
            }
        });
    }
};