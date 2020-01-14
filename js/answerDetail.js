/**
 * @description :批改详情
 * @author：涂玉
 * @email :18827511277@163.com
 * @creatTime : 2020/1/14
 */
(function (window) {

    /**
     * 根据题目选项数据，渲染选项
     * @param katex :katex对象
     * @param topic:选项数据
     * @param baseUrl ：显示的图片基本路径
     * @returns {string} html字符串
     */
    window.renderOptionList = function (katex, topic, baseUrl) {
        if (arguments.length < 2) {
            console.error("缺少参数", Error().stack)
        }
        var options = topic.optionList
        var optionsStr = ''
        var answerCodeClassName = ''//用戶答題的那道题的abcd的类名
        var answerTextClassName = ''//用戶答題的那道题的文本的类名
        if (options && Array.isArray(options)) {
            options.forEach(function (option, index) {
                answerCodeClassName = 'code'//用戶答題的那道题的abcd的类名
                answerTextClassName = 'optionText'//用戶答題的那道题的文本的类名
                if (option.code.substr(0, 1) === topic.studentAnswer) {
                    //回答正确
                    if (topic.studentAnswer === topic.answer) {
                        answerCodeClassName += ' bingo'
                        answerTextClassName += ' bingo'
                    } else {
                        answerCodeClassName += ' error'
                        answerTextClassName += ' error'
                    }
                }
                console.log(answerCodeClassName, answerTextClassName)
                optionsStr += '<li class="option">' +
                    '<div class="optionContent">' +
                    '   <div>' +
                    '       <div class="' + answerCodeClassName + '">' +
                    option.code.substr(0, 1) +
                    '       </div>' +
                    '       <div class="' + answerTextClassName + '">' +
                    '           <span>' + parseToHtml(katex, option.content) + '</span>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="optionImg">' + renderImg(baseUrl === undefined ? 'http://res.daily.gogoquestionbank.jyjy.cn/' : baseUrl, option.contentPng) + '</div>' +
                    '</li>'
            })
        }
        return optionsStr
    }

    /**
     * 根据数据渲染知识点内容区域
     * @returns {string}
     */
    var renderKnowledgeHtmlStr = function (knowName) {

        var knowledgeName =
            knowName
                ? knowName.match(',') ?
                knowName.split(',')
                : [knowName]
                : []
        var resultHtml = '<div class="knowledge">'
        if (knowledgeName.length > 0) {
            resultHtml +=
                '<p class="knowledgeLabel">知识点:</p>' +
                '<div class="knowLedgeItemWrap">\n'
            knowledgeName.forEach(function (knowLedgeItem, index) {
                resultHtml += '<span class="knowLedgeItem" key=' + index + '>' + knowLedgeItem + '</span>'
            })
        }
        resultHtml += '</div></div>'
        return resultHtml
    }
    /**
     * 渲染题目
     * @param topic  ：题目数据
     * @param needCorrect:是否需要批改
     * @param imgBasePath:渲染题目需要的图片的基本路径
     */
    window.renderTopic = function (topic, needCorrect, imgBasePath) {
        if (needCorrect) {
            //等下面的dom都渲染完成之後，添加滑块配置及监听
            setTimeout(function () {
                if ($('#ex1').length === 1) {
                    // 配置滑块的最大值
                    var $slider = $('#ex1').slider({
                        formatter: function (value) {
                            return '分值: ' + value;
                        },
                        // max: topic.totalScore !== undefined && topic.totalScore !== null ? topic.totalScore : 0,
                        max: 5,
                        // reversed: true,
                        // orientation: 'vertical'
                    }).on('slide', function (slideEvt) {
                        //当滚动时触发
                        //console.info(slideEvt);
                        //获取当前滚动的值，可能有重复
                        // console.info(slideEvt.value);
                    }).on('change', function (e) {
                        var score = e.value.newValue
                        //当值发生改变的时候触发
                        console.info(e.value.oldValue + '--' + e.value.newValue);
                        var $score = $('#score span')
                        $score.empty()
                        $score.append(score + '分')
                        try {
                            //判断终端（ios或者Android）类型（然后调用终端对应的方法）
                            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                                var data = score
                                //判断是ios用户的时候执行某种操作
                                window.webkit.messageHandlers.setScore.postMessage(data)
                            } else if (/(Android)/i.test(navigator.userAgent)) {
                                //判断是安卓用户的时候执行某种操作
                                // android.setAnswer(topic.id, (topic.optionList[index].code + '').replace('.', '').toUpperCase().trim())
                                android.setScore(score)
                            } else {
                                //其他类型的时候执行某种操作
                            }
                        } catch (e) {
                            // alert("作答失败，请切换其他题重新尝试！")
                        }
                    });
                }
            }, 0)
        }


        if (!imgBasePath) {
            imgBasePath = 'http://res.daily.gogoquestionbank.jyjy.cn/'
        }

        //将topic保存起来，方便在点击事件触发的时候，使用
        window.topic = topic
        var answerDetailWrapDom = document.getElementById('answerDetailWrap')//最外层dom
        var topicContentWrapDom = document.getElementById('topicContentWrap')//题目内容dom
        var stuAnswerDom = document.getElementById('stuAnswer')//学生答案区域
        var answerDom = document.getElementById('answer')//学生答案区域
        var scoreDom = document.getElementById('score')//分数区域
        var analysisDom = document.getElementById('analysis')//解析区域
        var knowledgeDom = document.getElementById('knowledge')//知识点区域
        var sliderDom = document.getElementById('slider')//打分滑块

        if (topic) {
            if (needCorrect) {
                sliderDom.innerHTML = '<input id="ex1" data-slider-id="ex1Slider" data-slider-min="0" type="text" data-slider-step="0.5" />'
            }

            topicContentWrapDom.innerHTML =
                '<div class="parseDiv">' +
                '   <div class="topic-content">' + (
                    topic.content ? parseToHtml(katex, topic.content) : '暂无题干信息'
                ) + '</div>\n' +
                '    <div class="topicContentImg"> ' + renderImg(imgBasePath, topic.contentPng) + ' </div>' +
                '    ' + (renderOptionList(katex, topic, imgBasePath)) + '' +
                '    </div>'

            //    渲染学生答案区域
            stuAnswerDom.innerHTML = topic.studentAnswer !== undefined && topic.studentAnswer !== null ? '学生作答情况：<span>' + topic.studentAnswer + '</span>' : ''
            answerDom.innerHTML = topic.answer !== undefined && topic.answer !== null ? '正确答案：<span>' + topic.answer + '</span>' : ''
            //渲染分数区域
            scoreDom.innerHTML = topic.score !== undefined && topic.score !== null ? '<div>评分：<span>' + topic.score + '分</span></div>' : '<div>评分：<span>未打分</span></div>'

            analysisDom.innerHTML = topic.analysis !== undefined && topic.analysis !== null
                ?
                '<span class="title">解析：</span>\n' +
                '<span class="content">\n' + parseToHtml(katex, topic.analysis) + '</span>'
                : ''
            //渲染知识点
            knowledgeDom.innerHTML = topic.knowName !== undefined && topic.knowName !== null
                ?
                '<ul>' +
                '   <li>' + renderKnowledgeHtmlStr(topic.knowName) + '</li>' +
                '</ul>'
                : ''
        } else {
            answerDetailWrapDom.innerHTML = '<div class="no-data">暂无题目数据</div>'
        }
    }

})(window)
