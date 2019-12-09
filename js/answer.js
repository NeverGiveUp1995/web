(function (window) {
    var renderOptions = function (options) {
        var optionsStr = '<ul class="options">'
        if (options && Array.isArray(options)) {
            options.forEach(function (option, index) {
                optionsStr +=
                    '        <li class="option clearFix" key=' + index + '>\n' +
                    '            <div>' +
                    '                 <div><span>' + ((option.code + '').trim().charAt(0)) + '</span></div>\n' +
                    '                  <div>' + parseToHtml(katex, option.content) + '</div>\n' +
                    '            </div>' +
                    '            <div class="optionImg"> ' + renderImg('http://res.daily.gogoquestionbank.jyjy.cn/', option.contentPng) + ' </div>' +
                    '        </li>\n'
            })
        }
        optionsStr += '</ul>'
        return optionsStr
    }

    /**
     * 渲染题目
     * @param topic  ：题目数据
     * @param basePath：图片的基本路径
     */
    window.renderTopic = function (topic, imgBasePath) {
        console.log('renderTopic')
        if (!imgBasePath) {
            imgBasePath = 'http://res.daily.gogoquestionbank.jyjy.cn/'
        }

        //将topic保存起来，方便在点击事件触发的时候，使用
        window.topic = topic
        var wrapDom = document.getElementById('wrap')
        if (topic) {
            wrapDom.innerHTML =
                '<div class="parseDiv">' +
                '   <div class="topic-content">' + (
                    topic.content ? parseToHtml(katex, topic.content) : '暂无题干信息'
                ) + '</div>\n' +
                '    <div class="topicContentImg"> ' + renderImg(imgBasePath, topic.contentPng) + ' </div>' +
                '    ' + (renderOptions(topic.optionList)) + '' +
                '    </div>'
        } else {
            wrapDom.innerHTML = '<div class="no-data">暂无题目数据</div>'
        }

        var optionsDom = document.querySelectorAll('ul.options li')
        //文档中获取所有的选项，然后遍历选项并给每一个选项添加监听
        Array.prototype.slice.call(optionsDom).forEach(function (option, index) {

            option.onclick = function () {
                //多选版本【勿删】
                // var liDom = document.querySelector('ul.options li.option:nth-child(' + (index + 1) + ')')
                //如果类名中已经存在selected字符串，说明当前标签已经被选中了，将该字符串移除
                // liDom.className.match('selected')
                //     ? (function () {
                //         console.log("========")
                //         var newClassName = liDom.className.split(' ').filter(function (classNameItem) {
                //             return !classNameItem.match('selected')
                //         }).join(' ')
                //         console.log(newClassName)
                //         liDom.className = newClassName
                //     })()
                //     : liDom.className += ' selected'
                //单选
                Array.prototype.slice.call(optionsDom).forEach(function (opt, i) {
                    if (index === i) {
                        opt.className.match('selected')
                            ? (function () {
                                opt.className = opt.className.split(' ').filter(function (classNameItem) {
                                    return !classNameItem.match('selected')
                                }).join(' ')
                            })()
                            : opt.className += ' selected'
                        try {
                            //判断终端（ios或者Android）类型（然后调用终端对应的方法）
                            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                                var data = topic.id + ',' + (topic.optionList[index].code + '').trim().toUpperCase().charAt(0)
                                //判断是ios用户的时候执行某种操作
                                window.webkit.messageHandlers.setAnswer.postMessage(data)
                            } else if (/(Android)/i.test(navigator.userAgent)) {
                                //判断是安卓用户的时候执行某种操作
                                // android.setAnswer(topic.id, (topic.optionList[index].code + '').replace('.', '').toUpperCase().trim())
                                android.setAnswer(topic.id, (topic.optionList[index].code + '').trim().toUpperCase().charAt(0))
                            } else {
                                //其他类型的时候执行某种操作
                            }
                        } catch (e) {
                            // alert("作答失败，请切换其他题重新尝试！")
                        }
                    } else {
                        opt.className = opt.className.split(' ').filter(function (classNameItem) {
                            return !classNameItem.match('selected')
                        }).join(' ')
                    }
                })
            }

        })
    }
})(window)
