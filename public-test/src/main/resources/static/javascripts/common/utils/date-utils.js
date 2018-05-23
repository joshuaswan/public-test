
//返回两个日期的天数
function getDiffDays(fromDate ,toDate){
    return Math.floor((Date.parse(fromDate) - Date.parse(toDate))/(1000 * 60 * 60 * 24));
}

//返回日期的小时
function getHours(date){
    return new Date(Date.parse(date)).getHours();
}


function getHoursd(date){
    var d = 1 ;
    if(date === 2){
        d =1;
    }else if(date ===6){
        d = 2
    }else if(date ===10){
        d = 3
    }else if(date ===14){
        d = 4
    }else if(date ===18){
        d = 5
    }else if(date ===22){
        d = 6
    }

    return d;
}