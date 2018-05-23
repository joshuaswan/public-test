var JobVO = function () {
    this.detail = {};
    this.triggers = [];
};

var JobDetailVO = function () {
    this.jobName = "";
    this.jobGroupName = "";
//    this.jobClass = "com.thoughtworks.i1.quartz.jobs.JobForTest";
    this.jobClass = "com.thoughtworks.i1.quartz.jobs.JobForUrl";
    this.description = "";
    this.jobDatas = [];
}   ;

var TriggerVO = function () {
    this.triggerFlag = 0;
    this.triggerName = "";
    this.triggerGroupName = "";
    this.startTime = 0;
    this.endTime = 0;
    this.triggerState = "";
    this.repeatCount = -1;
    this.repeatInterval = 10000;
    this.cron = "";
};

var JobDataVO = function (key, value) {
    this.key = key;
    this.value = value;
};

JobVO.prototype.addJobDetail = function (detail) {
    this.detail = detail;
};

JobVO.prototype.addTrigger = function (trigger) {
    this.triggers.push(trigger)
};

JobDetailVO.prototype.addJobData = function (key, value) {
    var tempJobData = new JobDataVO(key, value);
    this.jobDatas.push(tempJobData);
};

var HerenQuartz = {
    post: function (jobVO, callback) {
        $.ajax({
            type: 'post',
            url: getSysParaConfig("Quartz_Server_Url") + '/api/quartz-jobs/item',
            dataType: "json",
            data: jobVO,
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                console.log(JSON.stringify(data));
            }
        });
    }
};
