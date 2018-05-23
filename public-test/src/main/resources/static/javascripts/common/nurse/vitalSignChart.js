var gov = new Object();
var Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    }
};
Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
};
var getEleById = function(elem) {
    if (arguments.length > 1) {
        for (var i = 0, elems = [], length = arguments.length; i < length; i++)
            elems.push($(arguments[i]));
        return elems;
    }
    if (typeof elem == 'string') {
        return document.getElementById(elem);
    } else {
        return elem;
    }
};

gov.Graphic = Class.create();
gov.Graphic.prototype={
    initialize: function(data,elm,options){
        var This = this;
        this.setOptions(options);
        this.entity = document.createElement("div");
        this.pointBox=getEleById(elm);
        this.vitalSingChart = getEleById("vitalSingChart");
//        console.log("top=="+this.vitalSingChart.top);
//        console.log("left=="+this.vitalSingChart.left);
        This.count = data.length;
    },
    //设置属性
    setOptions: function(options) {
        this.options = {
            height:676,                 //绘图区域高度
            maxHeight:50,              //y轴最高数值
            barDistance:13.890,           //x轴坐标间距
            topDistance:0,             //上部填充
            bottomDistance:0,        //底部填充
            leftDistance:0,
            pointWidth:20,               //坐标点宽度
            pointHeight:20,             //坐标点高度
            pointColor:"#3366ff",     //坐标点颜色
            pointType : 1,           //1:口表 2肛表 3腋表  4脉搏
            lineColor:"blue",       //连接线颜色
            valueWidth:14.890,            //y轴数值宽度    13.890+1  单元格宽度+边线宽度
            valueColor:"#000",       //y轴数值颜色
            valueType : 1 ,           //y轴类型  包括1：摄氏度、2：脉搏、3：呼吸、4：华氏
            timeWidth:0,             //x轴数值宽度
            timeColor:"#000",       //x轴数值颜色
            disvalue:false,             //是否显示y轴数值
            distime:false,              //是否显示x轴数值
            firstTime : ''
        }
        Object.extend(this.options, options || {});
    },
    //描点画图
    showPointGraphic:function(data){
        var This = this;
        //定义显示点的集合
        var showPoints = new Array();
        //y坐标数据(如：脉搏、口表、肛表)
        var values = new Array();
        //x坐标数据，日期
        var times = new Array();
        var pointsType = "";
        if(data){
            This.points = data;
//        console.info("将要渲染的曲线数据：");
//        console.info(data);
            This.count = data.length;
            for(var i = 0;i < This.count ; i++ ){
                var showPoint = document.createElement("span");
                var spanValue = document.createElement("span");
                var spanTime = document.createElement("span");
                //描述信息，例如：XX时间段手术后时间
                var remarkDiv = document.createElement("div");

                showPoint.height = This.points[i].value;
                showPoint.value = This.points[i].value;
                showPoint.time = This.points[i].time;

                //1:口表 2腋表 3肛表
                if(This.points[i].pointType === "1"){
                    var textNode = document.createTextNode("●");
                    showPoint.appendChild(textNode);
                }else if(This.points[i].pointType === "2"){
                    var textNode = document.createTextNode("x");
                    showPoint.appendChild(textNode);
                }else if(This.points[i].pointType === "3"){
                    var textNode = document.createTextNode("○");
                    showPoint.appendChild(textNode);
                }else if(This.points[i].pointType === "4"){
                    this.options.valueType = 2;
                    pointsType = "4";
                    var textNode = document.createTextNode("●");
                    showPoint.appendChild(textNode);
                }else if(This.points[i].pointType === "5"){
                    this.options.valueType = 5;
                    pointsType = "5";
                    var textNode = document.createTextNode("●");
                    showPoint.appendChild(textNode);
                }
                //事件描述   以后可以考虑加上
                if(This.points[i].remark){
                    var textNode = document.createTextNode(This.points[i].remark);
                    remarkDiv.appendChild(textNode);
                }

                //y坐标数据点样式定义(如：脉搏、口表、肛表)
                showPoint.style.fontSize = this.options.pointWidth+"px";
                showPoint.style.position = "absolute";
                showPoint.style.zIndex = "5";
                showPoint.style.width = this.options.pointWidth+"px";
                showPoint.style.height = this.options.pointHeight+"px";
                if(This.points[i].pointType === "4"){
                    showPoint.style.color = "red";
                }else if(This.points[i].pointType === "5"){   //呼吸
                    showPoint.style.color = "black";
                }else{
                    showPoint.style.color = "blue";
                }
                //y坐标数据点值样式定义(如：脉搏、口表、肛表)
                spanValue.style.position = "absolute";
                spanValue.style.width = this.options.valueWidth+"px";
                spanValue.style.textAlign = "center";
                spanValue.style.color = this.options.valueColor;
                spanValue.style.zIndex = "5";
                spanTime.style.position = "absolute";
                spanTime.style.width = this.options.timeWidth+"px";
                spanTime.style.textAlign = "center";
                spanTime.style.color = this.options.timeColor;
                //描述信息样式定义
                remarkDiv.style.position = "absolute";
                remarkDiv.style.zIndex = "5";
                remarkDiv.style.width = this.options.timeWidth+"px";
                remarkDiv.style.textAlign = "center";
                remarkDiv.style.color = "red";
                remarkDiv.style.fontSize = 5+"px";
                remarkDiv.style.fontWeight ="bold";

                var timeHeight = 15;
                var valueHeight = 21;
                if(!this.options.disvalue) {
                    spanValue.style.display="none";
                    valueHeight=this.options.pointHeight;
                }
                if(!this.options.distime) {
                    spanTime.style.display="none";
                    timeHeight=0;
                }
                //计算左边距离   88.295大格子的宽度  最后减7是应BA要求,使描点落在小格子中间.
                var left = this.utils.getDiffDays(showPoint.time,this.options.firstTime) * 88.295 +
                    this.utils.getDiffDays(showPoint.time,this.options.firstTime) * 2 +
                    this.utils.getHoursInterval(this.utils.getHours(showPoint.time)) * this.options.valueWidth - 9-7;
//            console.info("口表数据中的第"+i+"个点的time值"+showPoint.time);
//            console.info("口表数据中的第"+i+"个点的left值"+left);
                showPoint.style.left = left+"px";
                spanValue.style.left = left+parseInt((this.options.pointWidth-this.options.valueWidth)/2)+"px";
                spanTime.style.left = left+parseInt((this.options.pointWidth-this.options.timeWidth)/2)+"px";
                remarkDiv.style.left = left-5.56+"px";

                //当显示点高度最大高度将显示最大值
                if(showPoint.height > this.options.maxHeight){
                    showPoint.height = this.options.maxHeight;
                }
                spanValue.innerHTML = showPoint.value;
                spanTime.innerHTML = showPoint.time;
                showPoints.push(showPoint);
                values.push(spanValue);
                times.push(spanTime);
                This.entity.appendChild(showPoint);
                This.entity.appendChild(spanValue);
                This.entity.appendChild(spanTime);
                This.entity.appendChild(remarkDiv);
                var pointTop = 0;
                //1:口表
                if(this.options.valueType === 1){
                    //计算点位置   根据点值和类型确定在某个峰值的大格中   再计算大格中的小格    (13.890*5+6)为一个大格的高度    13.890小格高度*个数 + 边线高度
                    pointTop = this.utils.getCelsiusByInterval(showPoint.value) * (13.890*5+6) +
                        this.utils.getDecimal(showPoint.value,1)/2 * this.options.valueWidth;
//                console.info("口表数据中的第"+i+"个点的高度值"+pointTop);
//                console.info("口表数据中的第"+i+"个点的数值"+showPoint.value);
//                console.info("大格子高度"+this.utils.getCelsiusByInterval(showPoint.value) * (13.890*5+6));
//                console.info("小格子高度"+this.utils.getDecimal(showPoint.value,1)/2*this.options.valueWidth);
                } else if(this.options.valueType === 2){ //2脉搏
                    var interval = this.utils.getPulseInterval(showPoint.value);
                    pointTop = interval * (13.890*5+6) +
                        this.utils.getPulseValue(showPoint.value,interval) * this.options.valueWidth;
                }else if(this.options.valueType === 3){

                }else if(this.options.valueType === 4){

                }else if(this.options.valueType === 5){ //5呼吸
                    var interval = this.utils.getBreathInterval(showPoint.value);
                    pointTop = interval * (13.890*5+6) +
                        this.utils.getBreathValue(showPoint.value,interval) * this.options.valueWidth;
                }
                //绘图区域高度  -  底部填充 - pointTop - timeHeight - 坐标点高度
                showPoints[i].style.top = (this.options.height-this.options.bottomDistance-pointTop-timeHeight-this.options.pointHeight/2)+"px";
//            console.info("描点高度计算");
//            console.info("this.options.height是"+this.options.height+"-this.options.bottomDistance"+this.options.bottomDistance
//            +"-pointTop"+pointTop+"-timeHeight"+timeHeight+"-this.options.pointHeight"+this.options.pointHeight/2);
//            alert(showPoints[i].style.top);
                values[i].style.top = (this.options.height-this.options.bottomDistance-pointTop-timeHeight-valueHeight)+"px";
                times[i].style.top = this.options.height-this.options.bottomDistance-timeHeight+"px";
            }
            var _leng = showPoints.length;
            var lineColor = this.options.lineColor;
            if(pointsType === "4"){
                lineColor = "red";
            }else if(pointsType === "5"){
                lineColor = "black";
            }
            for(var i=0;i<_leng;i++){
                if(i>0){
                    This.drawLine(parseInt(showPoints[i-1].style.left),
                        parseInt(showPoints[i-1].style.top),
                        parseInt(showPoints[i].style.left),
                        parseInt(showPoints[i].style.top),lineColor
                    );
                }
            }
//            This.Constructor.call(This);
        }
        This.Constructor.call(This);
    },
    //画线
    drawLine:function(startX,startY,endX,endY,lineColor)
    {
        var xDirection=(endX-startX)/Math.abs(endX-startX);
        var yDirection=(endY-startY)/Math.abs(endY-startY);
        var xDistance=endX-startX;
        var yDistance=endY-startY;
        var xPercentage=1/Math.abs(endX-startX);
        var yPercentage=1/Math.abs(endY-startY);
        if(Math.abs(startX-endX)>=Math.abs(startY-endY))
        {
            var _xnum=Math.abs(xDistance)
            for(var i=0;i<=_xnum;i++)
            {
                var point = document.createElement("div");
                point.style.position="absolute";
//                point.style.backgroundColor = this.options.lineColor;
                point.style.backgroundColor = lineColor;
                point.style.fontSize="0";
                point.style.width="0px";
                point.style.height="0px";
                point.style.border="1px dashed "+lineColor;    //为打印可以显示连线临时解决   原width height为2px

                startX+=xDirection;
                point.style.left=startX+this.options.pointWidth/2+"px";
                startY=startY+yDistance*xPercentage;
                point.style.top=startY+this.options.pointHeight/2+"px";
                this.entity.appendChild(point);
            }
        }
        else
        {
            var _ynum = Math.abs(yDistance)
            for(var i=0;i<=_ynum;i++)
            {
                var point=document.createElement("div");
                point.style.position="absolute";
                point.style.backgroundColor=lineColor;
                point.style.fontSize="0";
                point.style.width="0px";
                point.style.height="0px";
                point.style.border="1px dashed "+lineColor;   //为打印可以显示连线临时解决   原width height为2px

                startY+=yDirection;
                point.style.top=startY+this.options.pointWidth/2+"px";
                startX=startX+xDistance*yPercentage;
                point.style.left=startX+this.options.pointHeight/2+"px";
                this.entity.appendChild(point);
            }
        }
    },
    utils:{
        //计算脉搏算法
        getPulseInterval : function(pulse){
           var interval = 0;
            if(pulse >= 20 && pulse < 40){
                interval = 0;
            }
            if(pulse >= 40 && pulse < 60){
                interval = 1;
            }
            if(pulse >= 60 && pulse < 80){
                interval = 2;
            }
            if(pulse >= 80 && pulse < 100){
                interval = 3;
            }
            if(pulse >= 100 && pulse < 120){
                interval = 4;
            }
            if(pulse >= 120 && pulse < 140){
                interval = 5;
            }
            if(pulse >= 140 && pulse < 160){
                interval = 6;
            }
            if(pulse >= 160 && pulse < 180){
                interval = 7;
            }
            if(pulse >= 180){
                interval = 8;
            }
            return interval;
        },
        //计算体温算法
        getCelsiusByInterval : function(celsius){
            var interval = 0;
            if(celsius >= 34 && celsius < 35){
                interval = 0;
            }
            if(celsius >= 35 && celsius < 36){
                interval = 1;
            }
            if(celsius >= 36 && celsius < 37){
                interval = 2;
            }
            if(celsius >= 37 && celsius < 38){
                interval = 3;
            }
            if(celsius >= 38 && celsius < 39){
                interval = 4;
            }
            if(celsius >= 39 && celsius < 40){
                interval = 5;
            }
            if(celsius >= 40 && celsius < 41){
                interval = 6;
            }
            if(celsius >= 41 && celsius < 42){
                interval = 7;
            }
            if(celsius >= 42){
                interval = 8;
            }
            return interval;
        },
        //计算呼吸算法
        getBreathInterval : function(breath){
            var interval = 0;
            if(breath >= 10 && breath < 20){
                interval = 0;
            }
            if(breath >= 20 && breath < 30){
                interval = 1;
            }
            if(breath >= 30 && breath < 40){
                interval = 2;
            }
            return interval;
        },
        getDecimal : function(num,several){
            var numStr = num +"";
            if(numStr.indexOf(".") != -1){
                return  numStr.substr(numStr.indexOf(".")+1,several)
            }else{
                return 0;
            }
        },
        getPulseValue : function(num,interval){
            //起始位置刻度值
            var value = 20 * (interval+1);
            //当前单元格的刻度值/4
            return (num - value)/4;
        },
        getBreathValue : function(num,interval){
            //起始位置刻度值
            var value = 10 * (interval+1);
            //当前单元格的刻度值/2
            return (num - value)/2;
        },
        //返回两个日期的天数
        getDiffDays : function(fromDate ,toDate){
            return Math.floor((Date.parse(fromDate) - Date.parse(toDate))/(1000 * 60 * 60 * 24));
        },
        getHours : function(date){
            return new Date(Date.parse(date)).getHours();
        },
        getHoursInterval : function(date){
            var d = 1 ;
            if(date >= 0 && date <= 2){
                d =1;
            }else if( date > 2 && date <=6 ){
                d = 2
            }else if( date > 6 && date <=10 ){
                d = 3
            }else if(date > 10 && date <=14){
                d = 4
            }else if(date > 14 && date <=18){
                d = 5
            }else if(date > 18 && date <=22){
                d = 6
            }
            return d;
        }
    },
    Constructor:function()
    {
        this.entity.style.position="absolute";
        this.pointBox.innerHTML="";
        this.pointBox.appendChild(this.entity);
    }
}

