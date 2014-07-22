define(function(require, exports, module) {
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
    return FormHelper;
});