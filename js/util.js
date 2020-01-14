(function (window) {
        /**
         * 将数据转换为json字符串并存入缓存
         * @param keyName:键名
         * @param data:数据
         */
        window.saveDataToStorage = function (keyName, data) {
            sessionStorage.setItem(keyName, typeof data === 'string' ? data : JSON.stringify(data))
        }

        /**
         * 将数据从缓存中取出，并将其转换为js对象
         * @param keyName
         */
        window.getDataFromStorage = function (keyName) {
            var data = sessionStorage.getItem(keyName)
            if (data) {
                return JSON.parse(data)
            }
        }

        /**
         * 清除缓存
         */
        window.clearStorage = function () {
            sessionStorage.clear()
        }

        /**
         * 根据题目选项数据，渲染选项
         * @param katex :katex对象
         * @param options:选项数据
         * @param baseUrl ：显示的图片基本路径
         * @returns {string} html字符串
         */
        window.renderOption = function (katex, options, baseUrl) {
            if (arguments.length < 2) {
                console.error("缺少参数", Error().stack)
            }
            var optionsStr = ''
            if (options && Array.isArray(options)) {
                options.forEach(function (option, index) {
                    optionsStr += '<li class="option">' +
                        '<div class="optionContent">' + option.code + '' + parseToHtml(katex, option.content) + '</div>' +
                        '<div class="optionImg">' + renderImg('http://res.daily.gogoquestionbank.jyjy.cn/', option.contentPng) + '</div>' +
                        '</li>'
                })
            }
            return optionsStr
        }

        /**
         * 渲染图片
         * @param basePath：基本路径
         * @param imgSrc：图片路径
         * @returns {string}
         */
        window.renderImg = function (basePath, imgSrc) {
            if (basePath && imgSrc) {
                return "<div><img alt='' src=" + (basePath + imgSrc) + "></div>"
            }
            return '<div class="imgArea"></div>'
        }


        /**
         * 将LaTeX代码转换为html字符串，不考虑存在公式有嵌套的情况：$$xxx$xxx$xxxx$$ 或者 $$$xx$xxx$$
         * @param core:代码
         * @param katex :解析需要的katex库暴露的对象
         * @returns {string}
         */
        window.parseToHtml = function (katex, core) {
            var newCore = core
            if (arguments.length < 2) {
                console.log("缺少参数", Error().stack)
            }
            //定义一个记录代码中每个公式的始末位置的数组
            var latexIndexArr = []
            var resultHtml = '<span class="parseDiv">'
            if (core) {
                for (var index = 0; index < core.length; index++) {
                    var arrLastIndex = latexIndexArr.length - 1
                    /*
                    遍历到$符号,
                        1.数组中已经有数据：
                            判断最后一个对象是的endindex是否有值：
                                1）有值：说明正在查找新的公式的开始位置
                                    直接判断下一个字符是否也是$
                                            如果是$：创建{startIndex:index,isBlock:true}  index++ 并添加到数组
                                            如果不是$:创建{startIndex:index,isBlock:false}
                                2)没值：说明正在查找结尾的位置
                                    判断最后一个对象的isBlock是否是为true
                                        true：------------------------>直接记录该位置到最后一个对象的endIndex中，然后直接跳过下一个字符的查看（默认就是双$$的匹配，不考虑公式存在嵌套）
                                        false:------------------------>直接记录该位置到最后一个对象的endIndex中
                         2.数组中没有数据：
                                直接判断下一个字符是否也是$
                                    如果是$：创建{startIndex:index,isBlock:true}  index++
                        */
                    if (core[index] === '$') {
                        if (latexIndexArr.length > 0) {
                            if (latexIndexArr[arrLastIndex].endIndex) {
                                if (core[index + 1] === '$') {
                                    latexIndexArr.push({startIndex: index, isBlock: true})
                                    index++
                                } else {
                                    latexIndexArr.push({startIndex: index, isBlock: false})
                                }
                            } else {
                                if (latexIndexArr[arrLastIndex].isBlock) {
                                    latexIndexArr[arrLastIndex].endIndex = index
                                    index++
                                } else {
                                    latexIndexArr[arrLastIndex].endIndex = index
                                }
                            }
                        } else {
                            if (core[index + 1] === '$') {
                                latexIndexArr.push({startIndex: index, isBlock: true})
                                index++
                            } else {
                                latexIndexArr.push({startIndex: index, isBlock: false})
                            }
                        }
                    }
                }

                /*遍历存放公式位置标记的对象数组，然后将公式所在位置解析并替换
         注意：由于replace（）方法会影响原字符串，所以需要从最后一项开始往前遍历

      */
                for (var i = latexIndexArr.length - 1; i >= 0; i--) {
                    var latexFlag = latexIndexArr[i]
                    //用于存放带$符号的公式
                    var $latexContent = ''
                    //用于去掉$后解析
                    var latexContent = ''
                    if (latexFlag.isBlock) {
                        $latexContent = latexContent = core.substr(latexFlag.startIndex, latexFlag.endIndex - latexFlag.startIndex + 2)
                    } else {
                        $latexContent = latexContent = core.substr(latexFlag.startIndex, latexFlag.endIndex - latexFlag.startIndex + 1)
                    }
                    //将公式解析，并将返回结果存入变量renderResult
                    var renderResult = katex.renderToString(latexContent.replace(/\$/g, ""), {
                        throwOnError: false,
                        displayMode: latexFlag.isBlock,
                    })
                    //替换原公式
                    newCore = newCore.replace($latexContent, renderResult)
                }
            }
            resultHtml = resultHtml + (newCore ? newCore : "") + "</span>"
            return marked(resultHtml)
        }
    }
)(window)
