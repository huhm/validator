define(function(require, exports, module) {
     /**
     * 常用合法性方法
     * @return 正确返回true,错误返回string 错误信息
     **/
    var VALIDATE_METHOD = {
        /**
         * 手机号
         */
        telephone: function(val) {
            return /^[1][0-9]{10}$/.test(val) ? true : "请输入11位手机号码";
        },

        /*
         * 电话或手机号
         */
        contact: function(val) {
            if (/^[1][0-9]{10}$/.test(val)) {
                return true;
            }
            if (/^((\d{3,4})-(\d{7,8})|(\d{3,4})-(\d{7,8})-(\d{1,4}))$/.test(val)) {
                return true;
            }
            return "请输入手机号码或电话号码(区号-电话号码[-分机号])";
        },

        /**
         * 电话号码 "3-4位区号"+ "-"+  "7-8位直播号码"  +["-"+ "1－4位分机号"]
         */
        phone: function(val) {
            return /^((\d{3,4})-(\d{7,8})|(\d{3,4})-(\d{7,8})-(\d{1,4}))$/.test(val) ? true : "电话号码格式：区号-电话号码[-分机号]";
        },
        ///**
        //* 日期
        //*/
        //date: function (val) {
        //    // matches mm/dd/yyyy (requires leading 0's (which may be a bit silly, what do you think?)
        //    return /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})/.test(val) ? true : "日期格式错误";
        //},

        /**
         * 邮箱
         */
        email: function(val) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val) ? true : "邮箱格式错误";
        },

        /**
         * 最小长度
         */
        minLength: function(val, length) {
            return val.length >= length || ("至少要有" + length + "个字符");
        },
        /**
         * 最大长度
         */
        maxLength: function(val, length) {
            return val.length <= length || ("最多不超过" + length + "个字符");
        },

        /**
         * 最小字节数(有中文的情况)
         */
        minByteLength: function(val, length) {
            var bLength = val.replace(/[^\x00-\xff]/g, 'xx').length;
            return bLength >= length || ("至少要有" + length + "个字节");
        },

        /**
         * 最大字节数(有中文的情况)
         */
        maxByteLength: function(val, length) {
            var bLength = val.replace(/[^\x00-\xff]/g, 'xx').length;
            return bLength <= length || ("最多不超过" + length + "个字节");
        },

        /**
         * 整数,数字区间（parseInt后比较） ，十进制
         * @param minMaxSet [1,99999]  [1,null] [null,99999]
         */
        numberRange: function(val, minMaxSet) {
            //判断数字,可为负数
            if (/^[-]?[0-9]+$/.test(val)) {
                if (minMaxSet == null) {
                    return true;
                }
                var number = parseInt(val, 10);
                if (minMaxSet[0] != null && number < minMaxSet[0]) {
                    return "不可小于" + minMaxSet[0];
                }
                if (minMaxSet[1] != null && number > minMaxSet[1]) {
                    return "不可超过" + minMaxSet[1];
                }
                return true;
            }

            return "请输入整数";
        },


        /**
         * 浮点型数据区间（parseFloat后比较） ，十进制
         * @param minMaxSet [1,99999]  [1,null] [null,99999]
         */
        floatRange: function(val, minMaxSet) {
            //判断数字,可为负数
            if (/^[-]?[0-9]+[.]?[0-9]*$/.test(val)) { //Error
                if (minMaxSet == null) {
                    return true;
                }
                var floatNumber = parseFloat(val, 10);
                if (minMaxSet[0] != null && floatNumber < minMaxSet[0]) {
                    return "不可小于" + minMaxSet[0];
                }
                if (minMaxSet[1] != null && floatNumber > minMaxSet[1]) {
                    return "不可超过" + minMaxSet[1];
                }
                return true;
            }
            if (minMaxSet == null) {
                return "请输入浮点型数据";
            }
            return "请输入范围为[ " +
                (minMaxSet[0] == null ? "--" : minMaxSet[0]) +
                " , " +
                (minMaxSet[1] == null ? "--" : minMaxSet[1]) +
                " ]浮点型数据";

        },

        /*
         * 浮点精度判断
         * @param {Array} minMaxSet [min,max]
         *               小数点后的位数范围,为null时没有限制
         */
        floatPrecision: function(strVal, minMaxSet) {
            //判断数字,可为负数
            if (/^[-]?[0-9]+[.]?[0-9]*$/.test(strVal)) { //Error
                if (minMaxSet == null) {
                    return true;
                }
                var idx = strVal.indexOf("."),
                    decimalCnt = 0,
                    numCnt = strVal.length;
                if (idx >= 0) {
                    decimalCnt = numCnt - idx - 1;
                    numCnt = idx;
                }
                if (minMaxSet[0] != null) {
                    if (decimalCnt < minMaxSet[0]) {
                        return "至少要有" + minMaxSet[0] + "位小数";
                    }
                }
                if (minMaxSet[1] != null) {
                    if (decimalCnt > minMaxSet[1]) {
                        return "小数位不能超过" + minMaxSet[1] + "位";
                    }
                }
                return true;
            }
            if (minMaxSet == null) {
                return "请输入浮点型数据";
            }
            return "请输入小数位数为" + (minMaxSet[0] || "0") + " ~ " + (minMaxSet[1] || "--") + "位的浮点型数据";
        },

        /**
         * 相等
         */
        equal: function(val, val2) {
            return (val == val2) || "应输入" + val2;
        },

        /**
         * 不相等
         */
        notEqual: function(val, val2) {
            return (val != val2) || "值不能为" + val2;
        },

        /**
         * 名称通用
         * 中文、字母、数字、下划线
         */
        name: function(val) { //空格、-
            return /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]|_)*$/.test(val) || "只能由中文、字母、数字、下划线组成";
        },
        ///**
        //* 选择项项数（val="val1,val2"）
        //* @note 各option值不可有','否则会出错
        //*/
        //maxCheckboxCount: function (val, maxCount) {
        //    var ary = val.split(",");
        //    return (val == "" || ary.length <= maxCount) || ("不可超过" + maxCount + "项");
        //},
        //minCheckboxCount: function (val, minCount) {
        //    var ary = val.split(",");
        //    return (val !== "" && ary.length >= minCount) || ("不可低于" + minCount + "项");

        //},

        //[minCount,maxCount],[minCount,null],[null,maxCount]
        //minCount,maxCount为null时，不检查,
        checkboxCount: function(val, minMaxSet) {
            if (minMaxSet == null) {
                return true;
            }
            var ary = val.split(",");
            if (minMaxSet[0] != null) {
                if (val == "" || ary.length < minMaxSet[0]) {
                    return ("不可低于" + minMaxSet[0] + "项");
                }
            }
            if (minMaxSet[1] != null) {

                if (ary.length > minMaxSet[1]) {
                    return ("不可超过" + minMaxSet[1] + "项");
                }
            }
            return true;
        }
    };

    exports.Common = VALIDATE_METHOD;

    var Browser = {
        isIE: !! window.ActiveXObject
    };
    if (Browser.isIE) {
        if (document.documentMode == 10)
            Browser.IE = 10;
        else if (document.documentMode == 9)
            Browser.IE = 9;
        else if (window.postMessage)
            Browser.IE = 8;
        else if (window.XMLHttpRequest)
            Browser.IE = 7;
        else if (document.compatMode)
            Browser.IE = 6;
        else if (window.createPopup)
            Browser.IE = 5.5;
        else if (window.attachEvent)
            Browser.IE = 5;
        else if (document.all) {
            Browser.IE = 4;
        } else {
            Browser.IE = 0;
        }
    }


    /**
     * 表单帮助类
     */
    var FormHelper = function(container) {
        container = $(container);
        this.container = container;
    };

    /*
     * 获取输入对象
     */
    FormHelper.prototype.GetInputDom = function(itemName) {
        return this.container.find("[name='" + itemName + "']");
    };

    //获取[name=itemName]的元素type @type {String:name属性值|Jquery对象} nameOrJqDomObj
    FormHelper.prototype._GetInputTypeByDom = function(nameOrJqDomObj) {
        //根据InputElement确定type
        var inputEle;
        if (typeof nameOrJqDomObj === "string") {
            inputEle = this.GetInputDom(nameOrJqDomObj);
        } else { //Jquery对象
            inputEle = nameOrJqDomObj;
        }
        inputEle = inputEle.first();
        if (inputEle.length === 0) {
            return null;
        } else {
            switch (inputEle[0].tagName.toLowerCase()) { //以第0个元素的tagName为准
                case "input":
                    return {
                        "checkbox": "checkbox",
                        "radio": "radio",
                        "hidden": "hidden",
                        "file": "file",
                        "text": "text",
                        "password": "password"
                    }[inputEle.attr("type")] || "input"; //checkbox,radio,hidden,text,password,file....
                case "select":
                    return "select";
                case "textarea":
                    return "textarea";
                default: //static
                    return "static"; //普通文本
            }

        }
    };

    //获取[name=itemName]的元素值,不一定是要校验的元素
    FormHelper.prototype.GetValue = function(itemName) {
        var inputElement = this.GetInputDom(itemName);
        return this._GetValue(inputElement, true);
    };
    //获取select的text值
    FormHelper.prototype.GetText = function(itemName) {
        var inputElement = this.GetInputDom(itemName);
        if (inputElement == null || inputElement.length === 0) {
            return null;
        }
        var type = this._GetInputTypeByDom(inputElement);
        switch (type) {
            case "select": //防止disabled 获取失败
                return inputElement.find("option:selected").text();
                //返回选择的所有值（用,分隔）         
                //case "checkbox": //ui-form-controls
                //case "radio": //ui-form-controls
                //    var checkedbox = inputElement.filter(":checked");
                //    if (inputElement.length > 0) {
                //        var valAry = [];
                //        checkedbox.each(function (idx, item) {
                //            valAry.push($(item).val());
                //        });
                //        return valAry.join(",");
                //    }
                //    else {
                //        return null;
                //   }
                //   break; 
        }
        return null;
    }

    //获取[name=itemName]的元素值,不一定是要校验的元素
    FormHelper.prototype._GetValue = function(inputElement, _bIncludeAllEle) {
        var type = this._GetInputTypeByDom(inputElement);
        if (inputElement == null || inputElement.length === 0) {
            return null;
        }
        switch (type) {
            case "static":
                return inputElement.html(); //text()改为html,可自定义innerHtml
            case "select": //防止disabled 获取失败
                return inputElement.find("option:selected").val();
                //返回选择的所有值（用,分隔）         
            case "checkbox": //ui-form-controls
            case "radio": //ui-form-controls
                if (!_bIncludeAllEle) {
                    inputElement = this.GetInputDom(inputElement.attr("name"));
                }
                var checkedbox = inputElement.filter(":checked");
                if (inputElement.length > 0) {
                    var valAry = [];
                    checkedbox.each(function(idx, item) {
                        valAry.push($(item).val());
                    });
                    return valAry.join(",");
                } else {
                    return null;
                }
                break;
            case "input":
            case "text":
            case "file":
            case "hidden":
            case "password":
            case "textarea":
                return inputElement.val();
            default:
                window.console &&
                    window.console.warn &&
                    window.console.warn("Validator:未定义类型：" +
                        type + ",使用默认获取方式$ele.val();");
                return inputElement.val();
        }
    };

    /*获取表单中[name]的元素值,不一定是要校验的元素 
     * @return {Name:VALUE,...}
     */
    FormHelper.prototype.GetValues = function() {
        var inputDoms = this.container.find('[name]'),
            res = {};
        for (var i = 0, len = inputDoms.length; i < len; i++) {
            var ele = $(inputDoms[i]),
                name = ele.attr("name");
            if (res[name] === undefined) {
                res[ele.attr("name")] = this._GetValue(ele, false);
            }
        }
        return res;
    };

    /*
     * 设置form字段的值(可设置非校验项值)
     * @param {Bool|Null} True:触发表单项校验，默认:不触发
     */
    FormHelper.prototype.SetValue = function(itemName, newValue, bTriggerValidateOrTriggerEvent) {
        var inputEle = this.GetInputDom(itemName),
            type = this._GetInputTypeByDom(itemName);
        if (inputEle == null || inputEle.length === 0) {
            return false;
        }
        if (newValue == null) {
            newValue = "";
        };
        var valueType = typeof newValue;
        if (typeof newValue !== "string" && valueType !== "number") {

            window.console &&
                window.console.warn &&
                window.console.warn("非string|number值不支持：" +
                    itemName + ",value=" + newValue);
            return;
        }
        switch (type) {
            case "static":
                inputEle.html(newValue); //text()改为html,可自定义innerHtml
                break;
            case "checkbox":
                //if (typeof newValue === "string") {
                //#mod2
                var val2 = "," + newValue + ",";
                inputEle.each(function() {
                    if (val2.indexOf("," + $(this).val() + ",") >= 0) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                });
                //var valAry = newValue.split(",");
                //inputEle.removeAttr("checked");
                //if (valAry) {
                //    for (var i = 0, len = valAry.length; i < len; i++) {
                //        inputEle.filter('[value="' + valAry[i] + '"]').
                //            attr("checked", "checked");
                //    }
                //}
                //}
                //else {
                //    window.console &&
                //    window.console.warn &&
                //    window.console.warn("checkbox 非string值不支持：" +
                //        itemName + ",value="+newValue); 
                //throw "checkbox 非string值不支持";
                //}
                break;
            case "radio":
                inputEle.each(function() {
                    if ($(this).val() == newValue) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                });
                break;
            case "input":
            case "text":
            case "hidden":
            case "password":
            case "textarea":
                inputEle.val(newValue);
                break;
            case "select": //防止disabled时,获取失败
                if (Browser.isIE && Browser.IE < 7) { //IE6 以下  select 无法设置selected错误
                    var $op = inputEle.find('option[value="' + newValue + '"]');
                    setTimeout(function() {
                        $op.attr("selected", true);
                        dealEventTrigger();
                    }, 1);
                    return inputEle; 
                } else {
                    inputEle.val(newValue); 
                }
                break;
            case "file": //doNothing
                if (!newValue) { //清空
                    inputEle.val("");
                }
                break;
            default:
                window.console &&
                    window.console.warn &&
                    window.console.warn("Validator:未定义类型：" +
                        type + ",使用默认设置值方式$ele.val(newValue);");
                inputEle.val(newValue);
                break;
        }
        //处理事件触发
        function dealEventTrigger(){ 
            if (bTriggerValidateOrTriggerEvent) {
                if(typeof bTriggerValidateOrTriggerEvent!=="string"){ 
                    bTriggerValidateOrTriggerEvent="validate";
                }
                inputEle.trigger(bTriggerValidateOrTriggerEvent);
            }
        }
        dealEventTrigger();
        return inputEle;
    };

    /*
     * 设置表单字段值(可设置非校验项值)
     * @param {Bool|Null} True:触发表单项校验
     */
    FormHelper.prototype.SetValues = function(valueObj, bTriggerValidateOrTriggerEvent) {
        for (var key in valueObj) {
            this.SetValue(key, valueObj[key], bTriggerValidateOrTriggerEvent);
        }
    };

    
    var buildInValidators = VALIDATE_METHOD, //内置校验
        DefaultValidateOption = { //默认校验选项
            /*要校验的input对象name [NotNull]
             */
            name: null,
            /*
             * 要校验的对象类型 [Nullable] 为null时，根据name属性获取type)
             * @data data-validator
             * @default input
             * @value　有以下类型：
             *      1.static : 显示文本 $ele.html()
             * input[type] $ele.val()
             *      2.hidden:
             *      3.text : 普通文本框(type=text)
             *      4.password : 密码文本框
             *      5.file:文件
             *      6.textarea : textarea
             * 特殊获取值方式
             *      7.select : select
             *      8.checkbox : checkbox 获取所有选中的选项的值以','连接
             *      9.radio : radio  同checkbox
             *      10.input: input元素,type不为以上元素
             */
            type: "input",

            /* 
             * 绑定对象的名称 可以有多个用,隔开
             *  绑定对象值变化时，也会触发校验(且ajax校验时，只有当bindName的值和当前值都相同，且已经校验过，才不重复校验)
             *  pl-validator-bind="{name}"（绑定对象属性，该对象需要有name属性）
             * @data data-validator-bind="{绑定对象的name},{name2}"
             */
            bindName: null,
            /**
             * 是否开启校验
             * @type {Bool} 关闭校验将移除原校验结果
             */
            open: true,
            //

            /*
             * 单要校验的对象和触发对象不同时使用 [Nullable]
             * 注：pl-validator='name'-->带该属性的对象触发事件
             * @type {String} 为Selector,this.container.find(tipTarget)
             * @type {JqueryObj} 指定消息位置
             */
            triggerTarget: null,

            /**
             * 是否必填   [Nullable]
             * @data data-validator="required" 其他值则不必填
             * @data data-validator-required="错误消息|true"
             * @type {Boolean} 若为true则表示必填，显示错误信息为"不可为空"
             * @type {String:非空} 必填的错误信息
             **/
            required: false,

            /**
             * 校验方法 [Nullable]
             * @data data-validator-tests="内建校验方法名称"-->Item1集合
             *       data-validator-message="错误信息1|sf|" -->Item2集合
             *       data-validator-param-1=字符串:"'fff'"|数字:"10.2"|数组："[5,8]"--> Item3集合（若无则没有该属性）
             *   正则
             *       data-validator-reg-1="/^\d$/" eval("/^\d$/") -->/^\d$/
             *       data-validator-reg-message-1=""
             * @type {Array.<ValidateArray>|Array.<ValidateJson>}
             *     a.单个ValidateArray.<String|RegExp|Function:testRight,
             *           Undifined|String|Function:errorMsg,
             *           Undifined|Int|String:extralParam>}
             *       1.ValidateArray.Item1  String:表单静态方法
             *                            RegExp:自定义正则表达式
             *                            function(value):自定义函数校验，返回非true时校验失败(非true值可作为错误信息  上下文为validator对象
             *       2.ValidateArray.Item2  Undifined:采用默认的错误信息
             *                            String:错误信息
             *                            function(value,testReturn):获取错误信息的函数 上下文为formCreator对象
             *       3.ValidateArray.Item3   其他参数值
             *      b.单个ValidateJson {msg:同ValidateArray.Item2,
             *               param:同ValidateArray.Item3,
             *               method:同ValidateArray.Item1}
             **/
            tests: null,

            /**
             * 进行ajax验证  [Nullable]
             * @data data-validator-ajax="/url..?t=verifyName..." 无回调
             *               返回:{error:0|!0,data:"错误信息"},若error=0则校验成功
             *       data-validator-ajax-jsonp="true" ajax是否是jsonp,若为其他值则为json
             * @type {Function}
             * @param  ajaxEndCallback {Function} ajax验证完成的回调,调用需要参数{String:errorMsg|Boolean.True} 错误：ajaxEndCallback(errorMsg,hasThrowError)，正确ajaxEndCallback(true,successTip)
             * @param itemValue 当前表单字段的值
             * @context
             */
            ajaxValidate: null,

            /*
             * 校验成功时显示的文本 [Nullable]
             * @data data-validator-success="成功消息"
             */
            successTip: null,

            /*
             * 指定消息位置 [Nullable]
             * @data data-validator-tip="#tipContainer"|".help-block" 同{String}
             * @type {String} 为Selector,this.container.find(tipTarget)
             * @type {JqueryObj} 指定消息位置
             * @type {Function} 获取位置的函数（name,option,validatorContainer）,上下文为当前Validator对象
             */
            tipTarget: null,

            //代码运行时的变量：
            /*
             * 原helpblock内容，非null时需要还原
             */
            _oldHelpBlock: null,
            /*
             * 当前正在进行的校验,可查询字段最新状态
             */
            _validating: null, //{value:"校验值",status:TestingStatus状态}
            /*
             * 上已次完成的校验
             */
            _lastValidateResult: null //{value:"校验值",status:TestingStatus状态}

        };
    /*
     * status: 校验状态TestingStatus
     * result: 校验结果:失败原因
     */
    //status:当前校验项状态,可为:true(校验成功),msg(校验消息),校验中:"testing",null|Undifine:未校验
    var TestingStatus = {
        NotTest: 0, //未校验
        Testing: 1, //校验中
        CompleteTest: 2, //完成校验
        TestingCatchError: 3, //校验出错
        TestingFailBeforeAjax: 4, //非ajax校验失败
        TestingOk: 5, //校验成功
        TestingFail: 6 //校验失败
    };

    //校验的默认配置
    var DefaultConfig = {
        //校验状态class
        status: {
            //bootstrapV3 的 css
            error: "has-error",
            success: "has-success",
            warning: "has-warning",
            all: "has-error has-success has-warning"
        },
        /*
         * 显示的错误数(若为0则没有限制)
         */
        showErrorCnt: 0,
        ajax: {
            inputingOpen: false, //输入时校验是否开启
        },
        /*
         * 监听的事件 NotNull
         * $(container).on("click.Validator blur.Validator...")
         */
        //trigger: {

        //     //由这些事件触发的校验,错误时为warning
        //   //由这些事件触发的校验,错误时为error
        //},
        //不设置
        formItemSel: ".form-group", //表单项container(此处添加校验状态Class)
        helpBlock: {
            autoAdd: true, //若找不到helpBlock是否自动添加
            html: '<div class="help-block"></div>', //添加的消息容器
            selector: ".help-block", //消息容器选择器,从formItemSel下查找，若无则在container下添加
            container: ".controls" //消息容器添加的位置（无消息容器时添加）
        }
    };

    /* 
     * 校验类,校验和校验结果显示(继承FormHelper类)
     * @desc 要验证的input等输入要带有name,若为checkbox,radio以组为单位的，则给每个checkbox赋name
     * @param {JqueryObject|String:JquerySelector} container 要校验的对象的容器，可为Jquery选择器或Jquery对象
     * @param {Json} formItemOptionMap（key为name），若为null，则从dom中获取
     * @param {Json} validatorOption 校验的配置
     * @对外接口:
     */
    var Validator = function(container, validatorOption, formItemOptionMap) {
        container = $(container);
        this.container = container;
        this.Init(validatorOption, formItemOptionMap);
    };

    Validator.prototype = new FormHelper();
    Validator.prototype.constructor = Validator; //修正constructor指向错误

    /*从表单DOM中提取校验选项
     * @parma configItemJson {JSON|null} 手动配置的校验项（优先级别比dom中的要高）
     */
    Validator.prototype._getFormItemOptionFromDom = function(configItemJson) {
        var res = configItemJson || {}, that = this;
        this.container.find("[data-validator]").each(function() {
            var $this = $(this),
                name = $this.attr("name"),
                item = res[name] || {},
                tmp;
            item.name = name;
            item.type = item.type || that._GetInputTypeByDom($this);
            if (typeof item.required !== "string") { //required未赋值时，设置
                tmp = $this.attr("data-validator");
                if (tmp.toLowerCase().indexOf("required") > -1) {
                    item.required = true;
                }
                tmp = $this.attr("data-validator-required");
                if (tmp != null) {
                    item.required = $this.attr("data-validator-required") || true;
                    if (item.required === "true") {
                        item.required = true;
                    }
                }
            }
            tmp = $this.attr("data-validator-bind");
            if (tmp) {
                item.bindName = tmp;
            }
            //---tests---
            item.tests = item.tests || [];
            //tests.内建方法
            tmp = $this.attr("data-validator-tests");
            if (tmp) {
                var testNameAry = tmp.split("|");

                var msgAry = $this.attr("data-validator-message");
                if (msgAry) {
                    msgAry = msgAry.split("|");
                } else {
                    msgAry = [];
                }
                for (var i = 0, len = testNameAry.length; i < len; i++) {
                    if (testNameAry[i]) {
                        var tt = [];
                        tt.push(testNameAry[i]); //内建方法名
                        tt.push(!msgAry[i] ? null : msgAry[i]); //错误信息
                        //参数
                        var exParam = $this.attr("data-validator-param-" + (i + 1));
                        if (exParam) {
                            exParam = eval(exParam);
                        } else {
                            exParam = exParam;
                        }
                        tt.push(exParam);
                        item.tests.push(tt);
                    }
                }

            }
            //tests.Reg 
            tmp = $this.attr("data-validator-reg-1");
            var regNum = 1;
            while (tmp) {
                var regMsg = $this.attr("data-validator-reg-message-" + regNum);
                var tt = [];
                tt.push(eval(tmp)); //Reg表单
                tt.push(regMsg ? regMsg : null);
                tt.push(null);
                item.tests.push(tt);
                //下一个
                regNum++;
                tmp = $this.attr("data-validator-reg-" + regNum);
            }
            if (item.tests.length === 0) {
                item.tests = null;
            }
            //---end tests---
            tmp = $this.attr("data-validator-ajax");
            if (tmp) {
                var url = tmp,
                    dataType = $this.attr("data-validator-ajax-jsonp") === "true" ?
                        "jsonp" : "json"; //是否是jsonp
                item.ajaxValidate = function(ajaxEndCallback, itemValue) {
                    $.ajax(url, {
                        data: {
                            value: itemValue
                        },
                        dataType: dataType,
                        type: "POST",
                        success: function(data) {
                            if (data.error) {
                                ajaxEndCallback(data.data);
                            } else {
                                ajaxEndCallback(true);
                            }
                        },
                        error: function() {
                            ajaxEndCallback("服务器校验失败", true);
                        }
                    });
                };
            }
            tmp = $this.attr("data-validator-success");
            if (tmp != null) {
                item.successTip = tmp;
            }
            tmp = $this.attr("data-validator-tip");
            if (tmp) {
                item.tipTarget = tmp;
            }
            res[name] = item;
        });
        return res;
    };

    //初始化或刷新校验项option
    Validator.prototype._refreshOrAddOption = function(opName, op) {
        var oldOp = this.options[opName];
        if (oldOp) { //刷新原Option
            if (op.open === false && oldOp.open === true) { //关闭校验，移除原校验结果
                this.Clear(opName);
            }
            op = $.extend(true, oldOp, op);
        } else { //添加
            op.name = opName;
            var formItem = this.getFormItemObj(opName);
            if (!op.type) {
                op.type = this._GetInputTypeByDom(opName);
            }
            op = $.extend(true, {}, DefaultValidateOption, op);
            op._oldHelpBlock = formItem.find(this.validatorOption.helpBlock.selector).html();
            //要验证的表单项个数
            this.optionLength++;
        }
        if (op.triggerTarget) { //触发对象和校验对象不同
            var triggerTarget = op.triggerTarget;
            if (typeof triggerTarget === "string") {
                triggerTarget = this.container.find(triggerTarget);
            } else {
                triggerTarget = $(triggerTarget);
            }
            triggerTarget.attr("pl-validator", opName);
        }
        if (op.bindName) {
            var bindNames = op.bindName;
            var bindNameList = bindNames.split(',');
            for (var i = 0, len = bindNameList.length; i < len; i++) {
                var bindInput = this.container.find('[name="' + bindNameList[i] + '"]');
                bindInput.attr("pl-validator-bind", opName);
            }
        }
        this.options[opName] = op;
    };

    /*
     * 设置默认配置
     */
    Validator.SetDefault = function(newConfig) {
        $.extend(true, DefaultConfig, newConfig);
    };

    /*
     * 校验初始化,new时自动调用，也可在Destroy后调用
     * @添加的字段:1.option（表单项校验配置Map）
     *             2.optionLength(表单项配置数量)
     *             3.validatorOption(表单验证的option)
     * @监听的事件: 监听到container上
     *   1.
     *
     * @发布的事件：
     *   1.ValidateItem
     */
    Validator.prototype.Init = function(validatorOption, formItemOptionMap) {
        //全局配置
        this.validatorOption = $.extend(true, {},
            this.validatorOption || DefaultConfig,
            validatorOption || {});
        //从dom中获取其他的配置
        formItemOptionMap = this._getFormItemOptionFromDom(formItemOptionMap);
        //表单项配置Map
        this.options = {};
        var that = this;
        //要验证的表单项个数
        this.optionLength = 0;
        for (var key in formItemOptionMap) {
            this._refreshOrAddOption(key, formItemOptionMap[key]);
        }
        //附加事件  
        this.container.off("click.Validator focus.Validator keyup.Validator blur.Validator change.Validator validate.Validator").on("click.Validator focus.Validator keyup.Validator blur.Validator change.Validator validate.Validator", "[name],[pl-validator],[pl-validator-bind]", function(e) {
            var $this = $(this),
                opName = $this.attr("name"),
                plTriggerName = $this.attr("pl-validator"),
                validatorBind = $this.attr('pl-validator-bind');
            if (opName) {
                var inputType = that._GetInputTypeByDom($this),
                    objType = verifyInputEvent(inputType, e);
                that.Test(opName, null, objType.isInputing, e.timeStamp);
            }
            if (plTriggerName) { //由触发对象触发
                that.Test(plTriggerName, null, false, e.timeStamp);
            }
            if (validatorBind) {
                that.Test(validatorBind, null, false, e.timeStamp);
            }
        });
    };

    function verifyInputEvent(triggerType, e) {
        var NotKeyPressType = {
            "radio": 1,
            "checkbox": 1,
            "file": 1,
            "select": 1,
            "hidden": 1
        }; //非按键输入的类型
        var type = e.type,
            res = {};
        switch (type) {
            case "keyup": //
            case "focusin": //focus
                res.isInputing = true;
                break;
            case "click": //click
                res.isInputing = true;
                break;
            case "change": //change
                res.isInputing = !NotKeyPressType[triggerType];
                break;
            case "focusout": //blur 
            case "validate": //自定义事件
                res.isInputing = false;
                break;
        }
        //switch (triggerType) {
        //    case "hidden":
        //        break;
        //    case "file":
        //        break;
        //    case "radio":
        //    case "checkbox":
        //        break;
        //    case "select":
        //        break;
        //    case "textarea":
        //    case "text":
        //    case "password":
        //    default:
        //        break;
        //} 
        return res;
    }

    /*测试多个Item 
     * @param {Function}  可空 [validateEndCallback(bIsTestOk,itemsMsgAryList,errorItemCnt)]
     *           bIsTestOk:{bool}是否校验成功
     *           itemsMsgAryList{Array.<Array.String>}:每项校验失败的消息数组
     *           errorItemCnt {Int}: 校验失败的项数
     *   校验完成的回调，若带有ajax校验,直接返回的数据不正确，需通过回调获取是否校验成功
     * @return {Bool} 是否校验成功（不包含ajax校验的校验结果）
     */
    Validator.prototype.TestAll = function(validateEndCallback) {
        return this._testItems(this.options, this.optionLength, validateEndCallback);
    };

    Validator.prototype._testItems = function(itemsToTest, itemLength, validateEndCallback) {
        var completeCnt = 0,
            isAllItemSuccess = true, //是否通过测试
            itemsMsgAray = [], //所有表单项的错误消息集合 [[表单项1的错误消息],[表单项2的错误消息]]
            resNotIncludeAjax = true, //不包含ajax校验的校验结果
            hasTestItem = false;

        function _testCallback(bIsOk, msgAray) {
            completeCnt++;
            if (bIsOk != true) { //校验失败
                isAllItemSuccess = false;
                itemsMsgAray.push(msgAray);
            }
            if (completeCnt === itemLength) {
                validateEndCallback &&
                    validateEndCallback(isAllItemSuccess, itemsMsgAray, itemsMsgAray.length);
            }
        }
        for (var key in itemsToTest) {
            hasTestItem = true;
            var itemResNotIncludeAjax = this.Test(itemsToTest[key], _testCallback);
            if (itemResNotIncludeAjax !== true) { //校验失败
                resNotIncludeAjax = false;
            }
        }
        if (!hasTestItem && completeCnt === itemLength) {
            validateEndCallback &&
                validateEndCallback(isAllItemSuccess, itemsMsgAray, itemsMsgAray.length);
        }
        return resNotIncludeAjax;
    };
    /*
     * 测试一部分，同TestAll
     * @pram $partContainer {JqueryObj} 要测试的表单项的容器或表单项集合
     */
    Validator.prototype.TestPart = function($partContainerOrElementArray, validateEndCallback) {
        var options = this.options,
            itemLength = 0,
            itemsToTest = {};
        $partContainerOrElementArray.find("[name]").
        add($partContainerOrElementArray.filter("[name]")).each(function() {
            var key = $(this).attr("name"),
                op = options[key];
            if (op && !itemsToTest[key]) {
                itemLength++;
                itemsToTest[key] = op;
            }
        });
        return this._testItems(itemsToTest, itemLength, validateEndCallback);
    };

    /*
     * 测试单个Item
     * @param {String|{}} itemNameOrOption
     * @param {Function} 可空 [validateEndCallback(bIsTestOk,msgArray)]
     *           bIsTestOk:{bool}是否校验成功
     *           msgArray{Array.String}:校验失败的消息数组
     *   校验完成的回调，若带有ajax校验,直接返回的数据不正确，需通过回调获取是否校验成功
     * @param {Bool} 可空 _bIsInputing 可空 是否是正在输入时的校验(正在输入的校验不查ajax(ajax.inputingOpen==true))
     * @param {Int} 可空 _triggerTimeStamp 触发事件的时间戳
     * @return {Bool} 是否校验成功（不包含ajax校验的校验结果）
     */
    Validator.prototype.Test = function(itemNameOrOption, validateEndCallback, _bIsInputing, _triggerTimeStamp) {
        var op = itemNameOrOption,
            itemName = itemNameOrOption;
        if (typeof itemNameOrOption === "string") {
            op = this.options[itemNameOrOption];
        } else {
            itemName = op.name;
        }
        if (!op) { //没有该表单项
            validateEndCallback && validateEndCallback(true, []);
            return true;
        }
        if (op.open !== true) { //关闭校验
            validateEndCallback && validateEndCallback(true, []);
            return true;
        }
        var itemValue = this.GetValue(itemName),
            that = this,
            itemRlt = {
                error: 0,
                msg: []
            },
            bindValue;
        //有绑定对象
        if (op.bindName) {
            var bindNameList = op.bindName.split(',');
            var bindValueList = [];
            for (var i = 0, len = bindNameList.length; i < len; i++) {
                bindValueList.push(this.GetValue(bindNameList[i]));
            }
            bindValue = bindValueList.join("|");
        }
        //筛选，防止重复校验
        if (op._validating &&
            op._validating.bindValue === bindValue &&
            op._validating.value === itemValue &&
            op._validating.inputing === _bIsInputing &&
            _triggerTimeStamp &&
            _triggerTimeStamp - op._validating.timeStamp < 500) {
            //这个校验刚校验过
            if (!validateEndCallback) { //没有回调的时候，不重复校验 
                return true;
            }
        }
        //记录当前正在进行的校验
        op._validating = {
            value: itemValue,
            bindValue: bindValue,
            timeStamp: _triggerTimeStamp || 0,
            inputing: _bIsInputing
        };
        //开始校验        
        if (op.required) { //不可为null
            if (!itemValue) {
                itemRlt.error++;
                itemRlt.msg.push("不可为空");
            }
        }
        if (itemRlt.error === 0 && (itemValue || bindValue)) { //有值(绑定有值也可)
            //tests验证
            if (op.tests) {
                itemRlt = that._TestTests(op.tests, itemValue, op);
            }
            //ajax验证
            if (itemRlt.error === 0 && op.ajaxValidate) { //ajax验证(仅在当前验证通过时验证)
                //已经校验过且未校验异常(throw Error),且已进行ajax校验  的忽略校验
                if (op._lastValidateResult &&
                    op._lastValidateResult.bindValue === bindValue &&
                    op._lastValidateResult.value === itemValue &&
                    op._lastValidateResult.status > TestingStatus.TestingFailBeforeAjax) {
                    return setResult();
                } else {
                    if (this.validatorOption.ajax.inputingOpen || !_bIsInputing) {
                        //移除原校验结果，等待新的校验结果
                        this._RenderHelpBlock(op, 1, "<ul role='result'><li>正在校验...</li></ul>");
                        //ajax校验 
                        op.ajaxValidate.call(this, function(ajaxValidateIsOkOrMsg, hasCatchErrorOrSuccessTip) { //结果回调 
                            if (ajaxValidateIsOkOrMsg === true) { //校验成功
                                ajaxValidateIsOkOrMsg = {
                                    error: 0,
                                    msg: hasCatchErrorOrSuccessTip ? [hasCatchErrorOrSuccessTip] : []
                                };
                            } else {
                                ajaxValidateIsOkOrMsg = {
                                    error: 1,
                                    msg: [ajaxValidateIsOkOrMsg || "校验出错"]
                                };
                            }
                            var hasCatchError = false;
                            if (typeof hasCatchErrorOrSuccessTip === "boolean") {
                                hasCatchError = hasCatchErrorOrSuccessTip;
                            }
                            return setResult(ajaxValidateIsOkOrMsg, itemValue, bindValue, hasCatchError, true);
                        }, itemValue);
                    } else { //等输入完成校验
                        this._revertHelpBlock(op);
                    }
                    return true; //等ajax返回后再设置结果
                }
            }
        }
        return setResult(itemRlt, itemValue, bindValue); //没有ajaxValidate时
        function setResult(itemRlt, itemValue, bindValue, hasCatchError, _bIsAjaxResult) { //设置校验项Option的值，及回调    
            var hasRendered;
            if (arguments.length === 0) { //没有参数时，表示同上次一样 
                hasRendered = true;
                itemRlt = op._lastValidateResult.result;
            } else { //校验结果更新
                var newStatus = TestingStatus.TestingFailBeforeAjax;
                if (itemRlt.error === 0) {
                    newStatus = TestingStatus.TestingOk;
                } else if (hasCatchError) {
                    newStatus = TestingStatus.TestingCatchError;
                } else if (_bIsAjaxResult) {
                    newStatus = TestingStatus.TestingFail;
                }
                //校验完成，设置上个校验完成的状态
                hasRendered = false;
                op._lastValidateResult = {
                    value: itemValue,
                    bindValue: bindValue,
                    status: newStatus,
                    result: itemRlt,
                    //结果显示时的inputing状态
                    inputing: _bIsInputing
                };
            }
            that._ShowTestResult(op, _bIsInputing, hasRendered);
            if (itemRlt.error === 0) { //成功  
                validateEndCallback && validateEndCallback(true, []);
                return true;
            } else { //失败
                validateEndCallback && validateEndCallback(false, itemRlt.msg);
                return false;
            }
        }
    };

    /*
     * 校验 tests中的校验项，在required之后
     * @return { error:0|错误次数,msg:["错误信息",...]}
     */
    Validator.prototype._TestTests = function(itemTests, itemValue) {
        var errorMsgAry = [],
            errorCnt = 0;
        for (var i = 0, len = itemTests.length; i < len; i++) {
            var method, msg, param;
            if ($.isArray(itemTests[i])) { //
                method = itemTests[i][0];
                msg = itemTests[i][1];
                param = itemTests[i][2];
            } else {
                method = itemTests[i].method;
                msg = itemTests[i].msg;
                param = itemTests[i].param;
            }
            var trueOrErrorMsg;
            if (typeof method === "string") { //内建验证 
                trueOrErrorMsg = buildInValidators[method](itemValue, param);
            } else if (method instanceof RegExp) { //自定义正则
                trueOrErrorMsg = method.test(itemValue);
            } else if (typeof method === "function") { //自定义函数
                trueOrErrorMsg = method.call(this, itemValue, itemTests);
            }
            if (trueOrErrorMsg !== true) { //校验失败                
                if (msg) { //获取自定义错误信息
                    if (typeof msg === "string") {
                        trueOrErrorMsg = msg;
                    } else if (typeof msg === "function") {
                        trueOrErrorMsg = msg.call(this, itemValue, trueOrErrorMsg); //function(value,trueOrMsg)
                    }
                }
                if (!trueOrErrorMsg) {
                    trueOrErrorMsg = "格式错误"; //默认错误信息
                }
                errorMsgAry.push(trueOrErrorMsg);
                errorCnt++;
            }
        }
        return {
            error: errorCnt,
            msg: errorMsgAry
        };
    };

    //获取显示消息容器 itemNameOrOption 可为非校验项的name
    Validator.prototype.getTipObj = function(itemNameOrOption) {
        var itemName, op;
        if (typeof itemName === "string") {
            itemName = itemNameOrOption;
            op = this.options[itemName] || {};
        } else {
            itemName = itemNameOrOption.name;
            op = itemNameOrOption;
        }
        //显示错误信息 
        var tipTarget;
        if (op.tipTarget) { //用户自定义对象
            tipTarget = op.tipTarget;
            if (typeof tipTarget === "string") {
                tipTarget = this.container.find(tipTarget);
            } else if (typeof tipTarget === "function") {
                tipTarget = tipTarget.call(this, itemName, op, this.container);
            } else { //JqueryObject
                tipTarget = $(tipTarget);
            }
        } else { //默认
            var formItem = this.getFormItemObj(itemName);
            tipTarget = formItem.find(this.validatorOption.helpBlock.selector);
            if (tipTarget.length === 0) {
                if (this.validatorOption.helpBlock.autoAdd === true) {
                    //添加help-block
                    var hbC = formItem.find(this.validatorOption.helpBlock.container);
                    if (hbC.length === 0) {
                        hbC = formItem;
                    }
                    tipTarget = $(this.validatorOption.helpBlock.html).appendTo(hbC);
                }
            }
        }
        op.tipTarget = tipTarget;
        return tipTarget;
    };

    Validator.prototype.getFormItemObj = function(itemName) {
        return this.GetInputDom(itemName).closest(this.validatorOption.formItemSel);
    };

    /*
     * 还原表单项的HelpBlock
     */
    Validator.prototype._revertHelpBlock = function(
        itemNameOrOption, _formItemObj, _tipTarget) {
        var op = itemNameOrOption;
        if (typeof itemNameOrOption === "string") {
            op = this.options[itemNameOrOption];
        }
        if (!_formItemObj) {
            _formItemObj = this.getFormItemObj(op.name);
        }
        if (!_tipTarget) {
            _tipTarget = this.getTipObj(op);
        }
        _formItemObj.removeClass(this.validatorOption.status.all);
        _tipTarget.html(op._oldHelpBlock || "");
    };

    /*
     * 显示错误信息或正确信息(根据_lastValidateResult显示)
     * @param {String} itemOption 表单校验项配置
     * @param {Bool} 可空 _bIsInputing 是否是正在输入时的校验(决定校验消息是warning or error)
     * @param {Bool} 可空 _hasRendered 校验结果是否已经设置过，只需修改warning,error状态
     */
    Validator.prototype._ShowTestResult = function(itemOption, _bIsInputing, _hasRendered) {
        //显示错误信息  
        if (!itemOption._lastValidateResult) {
            this._revertHelpBlock(itemOption);
            return;
        }
        if (itemOption._lastValidateResult.result &&
            itemOption._lastValidateResult.result.error === 0) { //校验成功
            var successTip = itemOption.successTip;
            if (itemOption._lastValidateResult.result.msg.length > 0) {
                successTip = itemOption._lastValidateResult.result.msg[0];
            } else if (typeof successTip === "function") {

            }
            if (successTip != null &&
                itemOption._lastValidateResult.status === TestingStatus.TestingOk) { //校验完成且有成功消息
                this._RenderHelpBlock(itemOption, 0, "<ul role='result'><li>" + successTip + "</li></ul>");
            } else {
                this._revertHelpBlock(itemOption);
            }
        } else { //校验错误
            var renderType = 2; //error
            if (_bIsInputing) { //warning
                renderType = 1;
            }
            if (_hasRendered) { //仅根据_bIsInputing 设置状态
                this._RenderHelpBlock(itemOption, renderType);
            } else { //重新生成错误信息 
                var msgHtml = ["<ul role='result'>"],
                    msg = itemOption._lastValidateResult.result.msg,
                    showErrorCnt = this.validatorOption.showErrorCnt || msg.length; //要显示的消息数
                for (var i = 0; i < showErrorCnt; i++) {
                    msgHtml.push("<li>" + msg[i] + "</li>");
                }
                msgHtml.push("</ul>");
                this._RenderHelpBlock(itemOption, renderType, msgHtml.join(""));
            }
        }
    };

    /*
     * @param {Int} status   0:success  1:warning  2:error
     */
    Validator.prototype._RenderHelpBlock = function(itemOption, status, msg) {
        var tipTarget = this.getTipObj(itemOption),
            formItemObj = this.getFormItemObj(itemOption.name);

        //status : 0:success  1:warning  2:error
        if (status === 0) { //success
            formItemObj.removeClass(this.validatorOption.status.all).
            addClass(this.validatorOption.status.success);
            if (msg != null) {
                tipTarget.html(msg);
            }
        } else {
            formItemObj.removeClass(this.validatorOption.status.success);
            if (status === 1) {
                formItemObj.removeClass(this.validatorOption.status.error).
                addClass(this.validatorOption.status.warning);
            } else {
                formItemObj.removeClass(this.validatorOption.status.warning).
                addClass(this.validatorOption.status.error);
            }
            if (msg != null) {
                tipTarget.html(msg);
            }
        }
    };


    /*
     * 销毁当前的校验
     */
    Validator.prototype.Destroy = function() {
        //清除校验状态，校验消息
        this.Clear();
        //off 校验事件 
        this.container.off('click.Validator focus.Validator keyup.Validator blur.Validator change.Validator validate.Validator');
    };

    /*
     * 清除验证状态
     * @param {String} [itemName] itemName为空时，移除所有验证状态
     */
    Validator.prototype.Clear = function(itemName) {
        var that = this;
        if (itemName) {
            clear(itemName);
        } else {
            for (var key in that.options) {
                clear(key);
            }
        }

        function clear(name) {
            var op = that.options[name];
            //消息容器回复
            that._revertHelpBlock(op || name);
            //更新该条的实时数据状态
            if (op) {
                op._validating = null;
                op._lastValidateResult = null;
            }

        }
    };

    /*
     * 获取或修改(如果不存在则添加)校验项的option
     * @param {String} optionName 校验项Name
     * @param {JSON|undefined} newOption 新的校验属性
     */
    Validator.prototype.ItemOption = function(optionName, newOption) {
        this._refreshOrAddOption(optionName, newOption);
    };

    /*
     * 修改内建校验函数
     */
    Validator.BuildInValidator = function(name, valiFunc) {
        if (valiFunc) {
            buildInValidators[name] = valiFunc;
        } else {
            return buildInValidators[name];
        }
    };

    Validator.FormHelper = FormHelper;
    return Validator;
});