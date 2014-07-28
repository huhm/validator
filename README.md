表单校验插件   1.0.0 validator   
-------------------  
	ahthor:huhuimei2008@gmail.com
	[文档](http://huhm.github.io/validator/)
### 功能
	表单校验
	.control-group 上添加状态class
	.help-block：
		1.  .control-group 下有.help-block
		2.  .control-group 下无.help-block
			controls里面添加.help-block 校验信息div（若无.help-block）
	支持ajax(json/jsonp/自定义)
	支持部分、整体校验
	支持bindName 绑定一个表单元素进行校验

	Validator,Validator.FormHelper
### Require
	1.Jquery
	2.bootstrap 3.0.0 的css
	
### Use
	a.术语
		1.input元素：要校验的对象，支持：input:hidden, input:text, input:password , 
								input:file, textarea : textarea,
								 select, input:checkbox, input:radio, static(文本数据),input:*
	b.注意：
		表单元素以name区分,类似checkbox,radio有多个的，只用在某一个input上加data-validator属性即可
	c.调用方法：
		1.直接设置：
			var validator=new Validator($("formContainer"), {
					//showErrorCnt:1
				},{
					"inputName1":{//data-validator
						required:"请填写数字",//true|false  data-validator="required" or data-validator-required="请填写数字"
						tests:[//data-validator-tests="numberRange|maxLength"
							{
								method:"numberRange",
								param:[2,10],//data-validator-param-1="[2,10]" //参数
								msg:"错误信息"|null //data-validator-param-message="[2,10]"
							},{//Reg
								method:/^\d$/, //data-validator-reg-1="/^\d$/"
								msg:"格式错误-->默认消息" //data-validator-reg-message-1=""
							}
						],
						successTip:"校验成功",//data-validator-success
						//data-validator="/url"
						ajaxValidate:function(ajaxEndCallback, itemValue){
							  $.ajax("/url", {
								data:{ value: itemValue },
								dataType:"json",//data-validator-ajax-jsonp="true"
								type:"POST",
								success:function(data){
									if (data.error) {
										ajaxEndCallback(data.data);
									}
									else {
										ajaxEndCallback(true);
									}
								},
								error: function () {
									//ajaxEndCallback(trueOrMsg,catchError)
									ajaxEndCallback("服务器校验失败",true);
								}
							});
						}
					}
				});
		2.在input元素上添加校验属性,调用：
			 var validator=new Validator($("formContainer"), {
					showErrorCnt:1,//显示错误消息数,默认全部显示
					helpBlock：{
					}
				},null);
		3.全部校验：validator.TestAll(function(bIsTestOk,itemsMsgAryList,errorItemCnt){
						//校验完成回调
					});
		4.部分校验：validator.TestPart($("formPart"),
				function(bIsTestOk,itemsMsgAryList,errorItemCnt){
						//校验完成回调
				});
		5.校验一个: validator.Test("InputName",function(bIsTestOk,msgArray){
					//校验完成回调
				});
		6.清除校验状态:validator.Clear();//若加了参数inputname则为清除多个校验状态
		7.赋值[赋值对象可以为非校验项(有name属性即可)]：[FormHelper方法]
			a.赋值一个
				validator.SetValue('inputName',newValue,bTriggerValidate:是否触发校验);
			b.赋值一组
				validator.SetValues(valueObj,bTriggerValidate:是否触发校验)
		8.取值[FormHelper方法]
			validator.GetValue('inputName');
		9.销毁当前的校验(要重新启用开始使用
			validator.Init(validatorOption, formItemOptionMap)):
			validator.Destroy()
### Update 
	1.[添加] 修改、获取内建校验函数 Validator.BuildInValidator
	2.[修正2] 表单项类型为 radio和checkbox时,设置bug 改为dom $("...")[0].checked=true|false
	3.[fixed] 2013-12-4 email校验无法校验带-或有多级域名的 改为/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w
	4.[fixed] 2013-12-4 修正TestAll|TestPart校验项没有的时候未调用回调的问题
	5.[Update] dom和配置项仅一项起作用-->可同时设置(配置项优先级别要高)
	6.[Update] 2014-3-18 ajaxValidate属性的第一个参数ajaxEndCallback(true,"SuccessTip"),SuccessTip可覆盖配置中的SuccessTip
	7.[Update] 2014-3-18 添加内建校验函数contact
	8.[Update] 2014-4-21 添加bingName,绑定另一个input
	9.[Add] 2014-5-4 添加GetText方法，获取select等的text值
	9.[Add] 2014-6-24  SetValue,SetValues 最后一个参数支持自定义事件(设置完成后触发)
### TODO
	添加
        match: {
            /*
            * @type {String:name属性,}
            */
            refer: null,
            equal:true
        },

### Package 注意 
	1. 
常用正则
	验证数字：^[0-9]*$ 
	验证n位的数字：^\d{n}$ 
	验证至少n位数字：^\d{n,}$ 
	验证m-n位的数字：^\d{m,n}$ 
	验证零和非零开头的数字：^(0|[1-9][0-9]*)$ 
	验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$ 
	验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$ 
	验证非零的正整数：^\+?[1-9][0-9]*$ 
	验证非零的负整数：^\-[1-9][0-9]*$ 
	验证非负整数（正整数 + 0） ^\d+$ 
	验证非正整数（负整数 + 0） ^((-\d+)|(0+))$ 
	验证长度为3的字符：^.{3}$ 
	验证由26个英文字母组成的字符串：^[A-Za-z]+$ 
	验证由26个大写英文字母组成的字符串：^[A-Z]+$ 
	验证由26个小写英文字母组成的字符串：^[a-z]+$ 
	验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$ 
	验证由数字、26个英文字母或者下划线组成的字符串：^\w+$ 
	验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。 
	验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+ 
	验证汉字：^[\u4e00-\u9fa5],{0,}$ 
	验证Email地址：^\w+[-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$ 
	验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$ 
	验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。 
	验证身份证号（15位或18位数字）：^\d{15}|\d{18}$ 
	验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12” 
	验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。 
	整数：^-?\d+$ 
	非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$ 
	正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ 
	非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$ 
	负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$ 
	浮点数 ^(-?\d+)(\.\d+)?$