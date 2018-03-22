/**
 * 上下键滚动条位置的设定
 */
var hrScrollBar = function () {
    return {
        eventType: {
            DOWN: "down",
            UP: "up",
            NONE: "none"
        },
        /**
         * 根据传入参数，设置滚动条的scrollTop
         * @param activeObject 当前激活对象
         * @param currentList 当前数组
         * @param scrollElement 出滚动条的DOM元素
         * @param event 上下键
         * @param selectedClass 选中的样式，不传入的话默认为bg-selected-color
         * @returns {*} 返回下一个要选择的数组中的对象
         */
        setScrollTop: function (activeObject, currentList, scrollElement, event, selectedClass) {
            var currentIndex = currentList.indexOf(activeObject);
            var top0 = $(scrollElement).offset().top;
            var activeClass = "bg-selected-color";
            if (arguments.length === 5) {
                activeClass = arguments[4];
            }
            var currentDom = $(scrollElement).find("." + activeClass);
            var totalHeight = $(scrollElement).height();
            var currentTop = currentDom.offset().top;
            var currentHeight = currentDom.height();
            var nextDom, nextHeight, nextIndex, nextTop;
            if (event === "down") {
                nextDom = currentDom.next();
                nextHeight = nextDom.height();
                nextIndex = currentIndex === currentList.length - 1 ? 0 : currentIndex + 1;
                nextTop = currentTop + currentHeight;
            } else if (event === "up") {
                nextDom = currentDom.prev();
                nextHeight = nextDom.height();
                nextIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1;
                nextTop = currentTop - nextHeight;
            } else if (event === "none") {
                nextHeight = currentDom.height();
                nextTop = currentTop;
                nextIndex = currentIndex;
            }
            if (event === "down" && currentIndex === currentList.length - 1) {
                $(scrollElement).scrollTop(0);
            } else if (event === "up" && currentIndex === 0) {
                $(scrollElement).scrollTop($(scrollElement)[0].scrollHeight - $(scrollElement)[0].offsetHeight + 5);
            } else {
                var difference = nextTop - top0;
                if (difference < 0) {
                    $(scrollElement).scrollTop($(scrollElement).scrollTop() + difference);
                } else if (difference > totalHeight - nextHeight) {
                    $(scrollElement).scrollTop($(scrollElement).scrollTop() + difference - totalHeight + nextHeight);
                }
            }
            return currentList[nextIndex];
        }
    }
}();