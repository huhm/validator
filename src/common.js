/** 
 * 验证合法性
 * @version 1.0.0
 * @desc:
 * @exports {Object.<validate>}
 * @dependencies:
 * @modify:
 * @note:
 * @use：
 */
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
});