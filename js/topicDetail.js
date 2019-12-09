window.onload = function () {

    var topic = getDataFromStorage(TOPIC_DETAIL_DATA)
    var topicWrapDom = document.getElementById('topicWrap')
    var imgBasePath = 'http://res.daily.gogoquestionbank.jyjy.cn/'

    /**
     * 根据数据渲染知识点内容区域
     * @returns {string}
     */
    var renderKnowledgeHtmlStr = function () {

        var knowledgeName =
            topic && topic.knowledgeName && topic.knowledgeName.match(',') ?
                topic.knowledgeName ?
                    topic.knowledgeName.split(',')
                    : [topic.knowledgeName]
                : []
        var resultHtml = '<div class="knowledge">'
        if (knowledgeName.length > 0) {
            resultHtml +=
                '<p class="knowledgeLabel">【知识点】</p>' +
                '<div class="knowLedgeItemWrap">\n'
            knowledgeName.forEach(function (knowLedgeItem, index) {
                resultHtml += '<span class="knowLedgeItem" key=' + index + '>' + knowLedgeItem + '</span>'
            })
        }
        resultHtml += '</div></div>'
        return resultHtml
    }

    /**
     * 渲染解析内容区域
     * @returns {string} ：html字符串
     */
    var renderAnalysisHtmlStr = function () {
        var analysis = topic ? topic.analysis : null

        if (analysis) {
            return (
                '<div class="analysis-text">' +
                '       <p>【题目解析】</p>\n' +
                '       <span>' + parseToHtml(katex, analysis) + '</span>\n' +
                '</div>'
            )
        } else {
            return '<div></div>'
        }
    }


    var renderAnswerHtmlStr = function () {
        return '' +
            '        <div class="answerWrap">' +
            '                <p>【作答情况】</p>' +
            '                <div class="answerItem my-answer">' +
            '                   <span class="' + (topic && topic.userAnswer === topic.answer ? "greenAnswer" : "errorAnswer") + '">我的答案：' + (topic && topic.userAnswer ? topic.userAnswer : '暂无数据') +
            '                   </span>' +
            '                 </div>\n' +
            '                <div class="answerItem right-answer"><span>正确答案：' + (topic ? topic.answer : '暂无数据') + '</span></div>\n' +
            '             </div>'
    }
    if (TOPIC_DETAIL_DATA) {
        var html = '' +
            '    <div class="wrap">' +
            '        <div class="topicContentWrap clearFix">\n' +
            '            <div class="topicContent">' + parseToHtml(katex, topic && topic.content) + '</div>\n' +
            '            <div class="topicContentImg"> ' + renderImg(imgBasePath, topic && topic.contentPng) + ' </div>' +
            '            <ul class="options">' + renderOption(katex, topic && topic.options) + '</ul>\n' +
            '        </div>\n' +
            '       <div class="answer">' +
            '       ' + renderAnswerHtmlStr() +
            '       </div>' +
            '        <div class="analysis">\n' +
            '           <div class="analysis-content">\n' +
            '                ' + renderAnalysisHtmlStr() +
            '           </div>\n' +
            '       ' + renderKnowledgeHtmlStr(topic) +
            '        </div>\n' +
            '    </div>\n'
        topicWrapDom.innerHTML = html
    } else {
        topicWrapDom.innerHTML = '<div class="error">暂时无法查看该题详情，请稍后重试！</div>'
    }
}

