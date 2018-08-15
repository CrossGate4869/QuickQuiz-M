﻿
var qstnList = [];
var ansList = [], userList = [], markList = [];
var qstnIndex = 0;
var schCount = 0, mchCount = 0, jdgCount = 0;
var schMax = 0, mchMax = 0, jdgMax = 0;
var testTime = 0, startTest = false;

function testNightMode(tip)
{
	nightMode(tip);
	
	if (document.getElementById("test").style.display != "none")
	{
		showQuestion();
	}
}

function initQstnCount()
{
	nightMode(false);
	qstnList.splice(0, qstnList.length);
	
	xmlMain = loadXML(getURLPara(window.location.href, "href"));
	if (!xmlMain)
	{
		document.write("<p>无法获取题库信息。请尝试从<a href = 'https://gxsoftware.gitee.io/quickquiz-m'>主界面</a>重新进入本页面！</p><p>若仍不能正常浏览，请关注微信公众号“热控团青在线”并留言反馈</p>");
		return;
	}
	
	var str = xmlMain.getElementsByTagName("pswd")[0];
	if (str && str.childNodes[0].nodeValue.length)
	{
		var pass = getURLPara(window.location.href, "pass");
		var userStr = makeMD5(pass);
		if (userStr != xmlMain.getElementsByTagName("pswd")[0].childNodes[0].nodeValue)
		{
			document.write("<p>加密题库密码验证失败，请回退并使用其它公开权限题库！</p>");
			return;
		}
	}
	
	schMax = getQstnMax("s-choise");
	mchMax = getQstnMax("m-choise");
	jdgMax = getQstnMax("judge");
	
	document.getElementById("schMax").innerHTML = schMax ? ("（0-" + schMax + "）") : "（无）";
	document.getElementById("mchMax").innerHTML = mchMax ? ("（0-" + mchMax + "）") : "（无）";
	document.getElementById("jdgMax").innerHTML = jdgMax ? ("（0-" + jdgMax + "）") : "（无）";
}

function getQstnMax(typeStr)
{
	var ret = 0;
	var qstn = xmlMain.getElementsByTagName("qstn");
	
	for (i = 0; i < qstn.length; i++)
	{
		if (qstn[i].getAttribute("type") == typeStr)
		{
			ret++;
		}
	}
	
	return ret;
}

function checkInput()
{
	var count = parseInt(document.getElementById("schCount").value);
	if (isNaN(count))
	{
		count = 0;
	}
	else
	{
		count = Math.max(0, count);
		count = Math.min(count, schMax);
	}
	document.getElementById("schCount").value = count;
	
	count = parseInt(document.getElementById("mchCount").value);
	if (isNaN(count))
	{
		count = 0;
	}
	else
	{
		count = Math.max(0, count);
		count = Math.min(count, mchMax);
	}
	document.getElementById("mchCount").value = count;
	
	count = parseInt(document.getElementById("jdgCount").value);
	if (isNaN(count))
	{
		count = 0;
	}
	else
	{
		count = Math.max(0, count);
		count = Math.min(count, jdgMax);
	}
	document.getElementById("jdgCount").value = count;
	
	count = parseInt(document.getElementById("timeLimit").value);
	if (isNaN(count))
	{
		count = 0;
	}
	else
	{
		count = Math.max(0, count);
		count = Math.min(count, 180);
	}
	document.getElementById("timeLimit").value = count;
}

function resetPage()
{
	document.getElementById("count").style.display = "";
	document.getElementById("test").style.display = "none";
}

function makeQuiz()
{
	getQstnCount();
	
	qstnList.splice(0, qstnList.length);
	ansList.splice(0, ansList.length);
	
	addQuestion("s-choise", schCount);
	addQuestion("m-choise", mchCount);
	addQuestion("judge", jdgCount);
	testTime = testTime * 60;
	
	userList.length = qstnList.length;
	markList.length = qstnList.length;
	for (var i = 0; i < qstnList.length; i++)
	{
		userList[i] = "";
		markList[i] = false;
	}
	
	document.getElementById("count").style.display = "none";
	document.getElementById("test").style.display = "";
	
	document.getElementById("doingfunc").style.display = "";
	document.getElementById("onlyfalse").style.display = "none";
	document.getElementById("onlytxt").style.display = "none";
	
	showLibraryInfo();
	
	startTest = true;
	qstnIndex = 0;
	
	document.getElementById("switch").innerHTML = "结束答题";
	showQuestion();
	enableAllChoise(true);
	showTimeLeft(true);
}

function getQstnCount()
{
	schCount = parseInt(document.getElementById("schCount").value);
	mchCount = parseInt(document.getElementById("mchCount").value);
	jdgCount = parseInt(document.getElementById("jdgCount").value);
	
	testTime = parseInt(document.getElementById("timeLimit").value);
}

function addQuestion(typeStr, count)
{
	var i, lastCount = 0;
	var qstn = xmlMain.getElementsByTagName("qstn");
	var tmpList = [];
	
	for (i = 0; i < qstn.length; i++)
	{
		if (qstn[i].getAttribute("type") == typeStr)
		{
			lastCount++;
			tmpList.push(qstn[i]);
		}
	}
	tmpList.sort(function(){ return 0.5 - Math.random() });
	
	count = Math.min(lastCount, count);
	for (i = 0; i < count ; i++)
	{
		qstnList.push(tmpList[i]);
		addAnswer(tmpList[i]);
	}
}

function addAnswer(qstn)
{
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		addChoiseAns(qstn);
		break;
		
	case "judge":
		if (qstn.getElementsByTagName("ans")[0].childNodes[0].nodeValue == "t")
		{
			ansList.push("a");
		}
		else
		{
			ansList.push("b");
		}
		break;
	}
}

function addChoiseAns(qstn)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var optNode;
	var strAns = "";
	
	for (var i = 0; i < optIndex.length; i++)
	{
		optNode = qstn.getElementsByTagName("opt")[i];
		if (!optNode)
		{
			break;
		}
		
		if (optNode.getAttribute("ans") == "t")
		{
			strAns += optIndex[i];
		}
	}
	
	ansList.push(strAns);
}

function showTimeLeft(first)
{
	if (testTime <= 1 && first)
	{
		document.getElementById("timeLeft").innerHTML = "不限时";
	}
	else
	{
		if (testTime <= 0)
		{
			switchFunc(false);
		}
		
		if (!startTest)
		{
			document.getElementById("timeLeft").innerHTML = "剩余时间：已结束";
		}
		else
		{
			var h = parseInt(testTime / 3600);
			var m = parseInt((testTime % 3600) / 60);
			var s = parseInt(testTime % 60);
		
			document.getElementById("timeLeft").innerHTML = "剩余时间：" + h + ":" + m + ":" + s;
	
			testTime--;
			if (testTime < 0)
			{
				testTime = 0;
			}
			setTimeout('showTimeLeft(false)', 1000);
		}
	}
}

function showLibraryInfo()
{
	document.getElementById("title").innerHTML = 
		("题库名称：" + xmlMain.getElementsByTagName("title")[0].childNodes[0].nodeValue);
}

function showQuestionInfo()
{
	document.getElementById("qstnCount").innerHTML =
		("当前题目：" + (qstnIndex + 1) + "/" + qstnList.length);
		
	var qstn = qstnList[qstnIndex];
	var qstnType;
	
	var cust = parseInt(qstn.getAttribute("cust"));
	if (cust > 0)
	{
		qstnType = xmlMain.getElementsByTagName("cust")[cust - 1].childNodes[0].nodeValue;
	}
	else
	{
		switch(qstn.getAttribute("type"))
		{
		case "s-choise":
			qstnType = "单选题";
			break;
			
		case "m-choise":
			qstnType = "多选题";
			break;
			
		case "judge":
			qstnType = "判断题";
			break;
		}
	}
	
	document.getElementById("qstnType").innerHTML = "题目类型：" + qstnType;
}

function showQuestion()
{
	showQuestionInfo();
	
	var qstn = qstnList[qstnIndex];
	document.getElementById("desc").innerHTML =
		qstn.getElementsByTagName("desc")[0].childNodes[0].nodeValue;
		
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
		showSChoise(qstn);
		showUserAns("single-", "stxt-");
		break;
		
	case "m-choise":
		showMChoise(qstn);
		showUserAns("multi-", "mtxt-");
		break;
		
	case "judge":
		showJudge(qstn);
		showUserAns("single-", "stxt-");
		break;
	}
	
	document.getElementById("mark").checked = markList[qstnIndex];
}

function showPreQstn()
{
	saveCurUserAns();
	
	if (startTest || !document.getElementById("onlyfalse").checked)
	{
		qstnIndex--;
		if (qstnIndex < 0)
		{
			qstnIndex = qstnList.length - 1;
		}
	}
	else
	{
		for (var i = (qstnIndex + qstnList.length - 1) % qstnList.length; i != qstnIndex; i = (i + qstnList.length - 1) % qstnList.length)
		{
			if (ansList[i] != userList[i])
			{
				qstnIndex = i;
				break;
			}
		}
	}

	showQuestion();
}

function showNextQstn()
{
	saveCurUserAns();
	
	if (startTest || !document.getElementById("onlyfalse").checked)
	{
		qstnIndex++;
		if (qstnIndex >= qstnList.length)
		{
			qstnIndex = 0;
		}
	}
	else
	{
		for(var i = (qstnIndex + 1) % qstnList.length; i != qstnIndex; i = (i + 1) % qstnList.length)
		{
			if (ansList[i] != userList[i])
			{
				qstnIndex = i;
				break;
			}
		}
	}
	
	showQuestion();
}

function showSChoise(qstn)
{
	document.getElementById("single").style.display = "";
	document.getElementById("multi").style.display = "none";
	
	var i;
	var optNode, htmlNode;
	var optText;
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var max = Math.min(optIndex.length, qstn.getElementsByTagName("opt").length);
	
	// 显示各选项
	for (i = 0; i < max; i++)
	{
		optNode = qstn.getElementsByTagName("opt")[i];
		optText = optNode.childNodes[0].nodeValue;
		if (!optText)
		{
			continue;
		}
		
		document.getElementById("single-" + optIndex[i]).style.display = "";
		
		htmlNode = document.getElementById("stxt-" + optIndex[i]);
		htmlNode.style.display = "";
		htmlNode.innerHTML = optText + "<br />";
	}
	
	// 隐藏剩余的选项
	for (; i < optIndex.length; i++)
	{
		document.getElementById("single-" + optIndex[i]).style.display = "none";
		document.getElementById("stxt-" + optIndex[i]).style.display = "none";
	}
}

function showMChoise(qstn)
{
	document.getElementById("single").style.display = "none";
	document.getElementById("multi").style.display = "";
	
	var i;
	var optNode, htmlNode;
	var optText;
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var max = Math.min(optIndex.length, qstn.getElementsByTagName("opt").length);
	
	// 显示各选项
	for (i = 0; i < max; i++)
	{
		optNode = qstn.getElementsByTagName("opt")[i];
		optText = optNode.childNodes[0].nodeValue;
		if (!optText)
		{
			continue;
		}
		
		document.getElementById("multi-" + optIndex[i]).style.display = "";
		
		htmlNode = document.getElementById("mtxt-" + optIndex[i]);
		htmlNode.style.display = "";
		htmlNode.innerHTML = optText + "<br />";
	}
	
	// 隐藏剩余的选项
	for (; i < optIndex.length; i++)
	{
		document.getElementById("multi-" + optIndex[i]).style.display = "none";
		document.getElementById("mtxt-" + optIndex[i]).style.display = "none";
	}
}

function showJudge(qstn)
{
	document.getElementById("single").style.display = "";
	document.getElementById("multi").style.display = "none";
	
	var optNode;
	var optIndex = ["c", "d", "e", "f", "g", "h"];
	
	document.getElementById("single-a").style.display = "";
	document.getElementById("stxt-a").style.display = "";
	document.getElementById("stxt-a").innerHTML = "正确<br />";
	
	document.getElementById("single-b").style.display = "";
	document.getElementById("stxt-a").style.display = "";
	document.getElementById("stxt-b").innerHTML = "错误<br />";
	
	// 隐藏多余的选项
	for (i = 0; i < optIndex.length; i++)
	{
		document.getElementById("single-" + optIndex[i]).style.display = "none";
		document.getElementById("stxt-" + optIndex[i]).style.display = "none";
	}
}

function showUserAns(strNode, strText)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	
	for (var i = 0; i < optIndex.length; i++)
	{
		if (userList[qstnIndex].indexOf(optIndex[i]) >= 0)
		{
			document.getElementById(strNode + optIndex[i]).checked = true;
		}
		else
		{
			document.getElementById(strNode + optIndex[i]).checked = false;
		}
		
		var node = document.getElementById(strText + optIndex[i]);
		if (!startTest)
		{
			if (ansList[qstnIndex].indexOf(optIndex[i]) >= 0)
			{
				node.style.textDecoration = "";
				node.style.color = "green";
				node.style.fontWeight = "bold";
				if (night)
				{
					node.innerHTML = "&#10003 " + node.innerHTML;
				}
			}
			else if (userList[qstnIndex].indexOf(optIndex[i]) >= 0)
			{
				node.style.textDecoration = "line-through";
				node.style.color = "red";
				node.style.fontWeight = "";
			}
			else
			{
				node.style.textDecoration = "";
				node.style.color = "";
				node.style.fontWeight = "";
			}
		}
		else
		{
			node.style.textDecoration = "";
			node.style.color = "";
			node.style.fontWeight = "";
		}
	}
}

function saveCurUserAns()
{
	if (startTest)
	{
		var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
		var strAns = "";
		
		var strNode;
		switch(qstnList[qstnIndex].getAttribute("type"))
		{
		case "s-choise":
		case "judge":
			strNode = "single-";
			break;
			
		case "m-choise":
			strNode = "multi-";
			break;
		}
		
		for (var i = 0; i < optIndex.length; i++)
		{
			if (document.getElementById(strNode + optIndex[i]).checked)
			{
				strAns += optIndex[i];
			}
		}
		
		userList[qstnIndex] = strAns;
	}
	
	markList[qstnIndex] = document.getElementById("mark").checked;
}

function switchFunc(ask)
{
	if (startTest)
	{
		saveCurUserAns();
		
		if (ask)
		{
			var unDone = checkAllDone();
			if (unDone >= 0)
			{
				if (!confirm("您有尚未作答的题目。确认结束？"))
				{
					qstnIndex = unDone;
					showQuestion();
					return;
				}
			}
			else
			{
				if (!confirm("您确认要结束答题并开始评分吗？"))
				{
					return;
				}
			}
		}
			
		var currect = 0;
		for (var i = 0; i < qstnList.length; i++)
		{
			if (ansList[i] === userList[i])
			{
				currect++;
			}
		}
		
		var percent = currect / qstnList.length * 100;
		alert("共" + qstnList.length + "题，答对" + currect + "题\n正确率：" + percent.toFixed(2) + "%");
		
		document.getElementById("switch").innerHTML = "重新开始";
		document.getElementById("doingfunc").style.display = "none";
		
		if (currect != qstnList.length)
		{
			document.getElementById("onlyfalse").style.display = "";
			document.getElementById("onlytxt").style.display = "";
			
			for(var i = 0; i < qstnList.length; i++)
			{
				if (ansList[i] != userList[i])
				{
					qstnIndex = i;
					break;
				}
			}
		}
		
		startTest = false;
		showQuestion();
		enableAllChoise(false);
	}
	else
	{
		resetPage();
	}
}

function enableAllChoise(enable)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	
	for (var i = 0; i < optIndex.length; i++)
	{
		document.getElementById("single-" + optIndex[i]).disabled = enable ? null : true;
	}
	
	for (var i = 0; i < optIndex.length; i++)
	{
		document.getElementById("multi-" + optIndex[i]).disabled = enable ? null : true;
	}
}

function checkAllDone()
{
	for (var i = 0; i < qstnList.length; i++)
	{
		if (!userList[i].length)
		{
			return i;
		}
	}
	
	return -1;
}

function showNextUnDone()
{
	saveCurUserAns();
	
	if (!userList[qstnIndex].length)
	{
		return;
	}
	
	for (var i = (qstnIndex + 1) % userList.length; i != qstnIndex; i = (i + 1) % userList.length)
	{
		if (!userList[i].length)
		{
			qstnIndex = i;
			showQuestion();
			return;
		}
	}
	
	alert("您已经答完了全部题目。好好检查呀！:P");
}

function showNextMark()
{
	saveCurUserAns();
	
	for (var i = (qstnIndex + 1) % markList.length; i != qstnIndex; i = (i + 1) % markList.length)
	{
		if (markList[i])
		{
			qstnIndex = i;
			showQuestion();
			return;
		}
	}
}

function goToQstn()
{
	var idx = parseInt(document.getElementById("goTo").value);
	if (isNaN(idx))
	{
		document.getElementById("goTo").value = "";
		return;
	}
	else
	{
		idx = Math.max(1, idx);
		idx = Math.min(idx, qstnList.length);
	}
	
	qstnIndex = idx - 1;
	showQuestion();
	
	document.getElementById("goTo").value = "";
}

function searchQstn()
{
	var searchTxt = document.getElementById("search").value;
	if (!searchTxt)
	{
		return;
	}
	
	for (i = (qstnIndex + 1) % qstnList.length; i != qstnIndex; i = (i + 1) % qstnList.length)
	{
		if (matchQstn(qstnList[i], searchTxt))
		{
			break;
		}
	}

	if (i == qstnIndex && !matchQstn(qstnList[i], searchTxt))
	{
		alert("未找到包含关键字“" + searchTxt + "”的题目");
		return;
	}

	qstnIndex = i;
	showQuestion();
}
