(function (window) {

    window.topics = []
    /**
     *
     * @param data：数据
     * @param pageNum:当前数据的页码
     * @param imgBasePath ：图片基本路径
     */
    window.append = function (data, pageNum, imgBasePath) {
        if (!imgBasePath) {
            imgBasePath = 'http://res.daily.gogoquestionbank.jyjy.cn/'
        }
        //如果数据不是数组，直接中断程序，报错
        if (!Array.isArray(data)) {
            throw Error('在调用apend（data）方法时，发现传入的数据不是一个数组类型')
        }
        //整个列表的ul dom对象
        var topicListDom = document.querySelectorAll('#topicList>ul')
        var ulDom = topicListDom.length > 0
            ? ulDom = topicListDom[0]
            : ulDom = null
        //如果调用该方法，传入页码是1或者“1”，先清空所有题目，再重新添加
        if (ulDom && pageNum === 1 || pageNum === '1') {
            ulDom.innerHTML = ''
            window.topics = []
        }
        data.forEach(function (topicItem, index) {
            //将题目id改为数组下表，以序号的方式展示
            topicItem.index = topics.length + index + 1
            ulDom.innerHTML +=
                '  <li class="topicItem clearFix" key =' + index + '>' +
                '            <div class="topicNum">' + topicItem.index + '</div>' +
                '            <div class="topicContent">' + parseToHtml(katex, topicItem.content) + '</div>' +
                '            <div class="topicContentImg"> ' + renderImg(imgBasePath, topicItem.contentPng) + ' </div>' +
                '            <ul class="options">' + renderOption(katex, topicItem.options) + '</ul>\n' +
                '            <div class="footer">' +
                '                <ul class="clearFix">' +
                '                    <li class="start"></li>' +
                '                    <li class="similarTopic"> 相似题训练 </li>' +
                '                </ul>\n' +
                '            </div>\n' +
                '   </li>'
        })
        data.forEach(function (topic) {
            topics.push(topic)
        })
        var topicItemDoms = document.querySelectorAll(`#topicList .topicItem[key] .similarTopic`)
        var topicDoms = document.querySelectorAll(`#topicList .topicItem[key]`)


        Array.prototype.slice.call(topicDoms).forEach(function (topic, index) {
            topic.onclick = function () {
                //1.将点击的题目和题目列表放入缓存中存起来
                saveDataToStorage(TOPIC_DETAIL_DATA, topics[index])
                saveDataToStorage(TOPIC_LIST, topics)
                //2.跳转地址到题目详情的页面
                window.location.href = window.location.href.replace('topicList', "topicDetail").split('?')[0]
            }
        })

        Array.prototype.slice.call(topicItemDoms).forEach(function (item, index) {
            item.onclick = function (e) {
                e = window.event || e
                e.stopPropagation()
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    //判断是ios用户的时候执行某种操作
                    window.webkit.messageHandlers.yellowResponse.postMessage(topics[index].id + '')
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    //判断是安卓用户的时候执行某种操作
                    android.setData(topics[index].id + '')
                } else {
                    //其他类型的时候执行某种操作

                }
            }
        })


    }
    var initArr = getDataFromStorage(TOPIC_LIST)

    //初始化题目列表
    if (Array.isArray(initArr)) {
        append(initArr)
    }

})(window)
