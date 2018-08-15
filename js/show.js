
var libName = "";

var qstnIndex = 0;
var ansShow = 0;
var maxAnsToShow = 0;

var qstnList;
var showList = [];

var bookMarkEnable = true;
var bookMarkCount = 0;
var bookMarkList = [];
var bookMarkStatus = false; // 记录题目的书签状态，当书签状态发生变化时进行记录

function initShowList()
{
	nightMode(false);
	
	var urlString = getURLPara(window.location.href, "href");
	xmlMain = loadXML(urlString);
	if (!xmlMain)
	{
		document.write("<p>无法获取题库信息。请尝试从<a href = 'http://GXSoftware.coding.me/QuickQuiz-M'>主界面</a>重新进入本页面！</p><p>若仍不能正常浏览，请关注微信公众号“热控团青在线”并留言反馈</p>");
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
	
	if (xmlMain != null)
	{
		libName = urlString.substr(urlString.lastIndexOf("/") + 1);
		qstnList = xmlMain.getElementsByTagName("qstn");
		
		initBookMarks();
		
		showLibraryInfo();
		refreshList();
	}
	else
	{
		document.write("很遗憾，您的浏览器不支持本题库文件解析，无法继续！");
	}
}

function showLibraryInfo()
{
	document.getElementById("title").innerHTML = 
		("题库名称：" + xmlMain.getElementsByTagName("title")[0].childNodes[0].nodeValue);
}

function showQuestionInfo(qstn)
{
	document.getElementById("qstnCount").innerHTML =
		("当前题目：" + (qstnIndex + 1) + "/" + showList.length);
		
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
			
		case "blank":
			qstnType = "填空题";
			break;
			
		case "text":
			qstnType = "简答题";
			break;
		}
	}
	
	document.getElementById("qstnType").innerHTML = "题目类型：" + qstnType;
}

function showQuestion()
{
	var qstn = qstnList[showList[qstnIndex]];
	showQuestionInfo(qstn);
	
	document.getElementById("desc").innerHTML =
		qstn.getElementsByTagName("desc")[0].childNodes[0].nodeValue;
		
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		showOptions(qstn);
		break;
		
	case "judge":
		showJudge(qstn);
		break;
		
	case "blank":
		showBlanks(qstn);
		break;
		
	case "text":
		showText(qstn);
		break;
	}
	
	if (bookMarkEnable)
	{
		document.getElementById("bookMarkOnly").style.display = bookMarkCount ? "" : "none";
		document.getElementById("bookMarkC").checked = bookMarkList[showList[qstnIndex]];
		document.getElementById("bookMarkCount").innerHTML = bookMarkCount;
		bookMarkStatus = bookMarkList[showList[qstnIndex]];
	}
	
	showAnswer(true);
}

function showOptions(qstn)
{
	document.getElementById("blanks").style.display = "none";
	document.getElementById("text").style.display = "none";
	
	var choiseList = document.getElementById("choise");
	choiseList.style.display = "";
	choiseList.style.listStyleType = "upper-latin";
	
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
		
		htmlNode = document.getElementById("option-" + optIndex[i]);
		htmlNode.style.display = "";
		htmlNode.innerHTML = optText;
	}
	
	// 隐藏剩余的选项
	for (; i < optIndex.length; i++)
	{
		htmlNode = document.getElementById("option-" + optIndex[i]);
		if (!htmlNode)
		{
			break;
		}
		
		htmlNode.style.display = "none";
	}
}

function showJudge(qstn)
{
	document.getElementById("blanks").style.display = "none";
	document.getElementById("text").style.display = "none";
	
	var judgeList = document.getElementById("choise")
	judgeList.style.display = "";
	judgeList.style.listStyleType = "disc";
	
	var optNode;
	var optIndex = ["c", "d", "e", "f", "g", "h"];
	
	document.getElementById("option-a").style.display = "";
	document.getElementById("option-a").innerHTML = "正确";
	
	document.getElementById("option-b").style.display = "";
	document.getElementById("option-b").innerHTML = "错误";
	
	// 隐藏多余的选项
	for (i = 0; i < optIndex.length; i++)
	{
		document.getElementById("option-" + optIndex[i]).style.display = "none";
	}
}

function showBlanks(qstn)
{
	document.getElementById("choise").style.display = "none";
	document.getElementById("text").style.display = "none";
	
	document.getElementById("blanks").style.display = "";
}

function showText(qstn)
{
	document.getElementById("choise").style.display = "none";
	document.getElementById("blanks").style.display = "none";
	
	var textPara = document.getElementById("text")
	textPara.style.display = "";
	textPara.innerHTML = "";
}

function showPreQstn()
{
	saveBookMark();
	
	if (bookMarkCount && document.getElementById("bookMarkS").checked)
	{
		var i = qstnIndex - 1;
		while(i != qstnIndex)
		{
			if (bookMarkList[showList[i]])
			{
				break;
			}
			
			i--;
			if (i < 0)
			{
				i = showList.length - 1;
			}
		}
		
		qstnIndex = i;
	}
	else
	{
		qstnIndex--;
		if (qstnIndex < 0)
		{
			qstnIndex = showList.length - 1;
		}
	}
	
	showQuestion();
}
	
function showNextQstn()
{
	saveBookMark();
	
	if (bookMarkCount && document.getElementById("bookMarkS").checked)
	{
		var i = qstnIndex + 1;
		while(i != qstnIndex)
		{
			if (bookMarkList[showList[i]])
			{
				break;
			}
			
			i++;
			if (i >= showList.length)
			{
				i = 0;
			}
		}
		
		qstnIndex = i;
	}
	else
	{
		qstnIndex++;
		if (qstnIndex >= showList.length)
		{
			qstnIndex = 0;
		}
	}
	
	showQuestion();
}

function showAnswer(clear)
{
	var qstn = qstnList[showList[qstnIndex]];
	
	switch(qstnList[showList[qstnIndex]].getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		showChoiseAnswer(qstn, clear);
		break;
		
	case "judge":
		showJudgeAnswer(qstn, clear);
		break;
		
	case "blank":
		showBlankAnswer(qstn, clear);
		break;
		
	case "text":
		showTextAnswer(qstn, clear);
		break;
	}
	
	scrollToShowBtn();
}

function showChoiseAnswer(qstn, clear)
{
	var optIndex = ["a", "b", "c", "d", "e", "f", "g", "h"];
	var max = Math.min(optIndex.length, qstnList[showList[qstnIndex]].getElementsByTagName("opt").length);
	var htmlNode, optNode;
	
	if (!clear)
	{
		ansShow = (ansShow + 1) % (maxAnsToShow + 1);
	}
	else
	{
		ansShow = 0;
		maxAnsToShow = 1;
	}
	
	for (i = 0; i < max; i++)
	{
		optNode = qstnList[showList[qstnIndex]].getElementsByTagName("opt")[i];
		htmlNode = document.getElementById("option-" + optIndex[i]);
		htmlNode.style.visibility = "";
		
		if (ansShow)
		{
			if (optNode.getAttribute("ans") == "t")
			{
				htmlNode.style.color = "green";
				htmlNode.style.fontWeight = "bold";
			}
			else
			{
				if (night)
				{
					htmlNode.style.visibility = "hidden";
				}
				else
				{
					htmlNode.style.color = "";
					htmlNode.style.fontWeight = "normal";
				}
			}
		}
		else
		{
			htmlNode.style.color = "";
			htmlNode.style.fontWeight = "normal";
		}
	}
	
	refreshBtnTxt(true);
}

function showJudgeAnswer(qstn, clear)
{
	var ansNode = qstnList[showList[qstnIndex]].getElementsByTagName("ans")[0];
	if (!ansNode)
	{
		return;
	}
	
	if (!clear)
	{
		ansShow = (ansShow + 1) % (maxAnsToShow + 1);
	}
	else
	{
		ansShow = 0;
		maxAnsToShow = 1;
	}
	
	var htmlNode = document.getElementById("option-a");
	htmlNode.style.visibility = "";
	if (ansShow)
	{
		if (ansNode.childNodes[0].nodeValue == "t")
		{
			htmlNode.style.color = "green";
			htmlNode.style.fontWeight = "bold";
		}
		else
		{
			if (night)
			{
				htmlNode.style.visibility = "hidden";
			}
			else
			{
				htmlNode.style.color = "";
				htmlNode.style.fontWeight = "normal";
			}
		}
	}
	else
	{
		htmlNode.style.color = "";
		htmlNode.style.fontWeight = "normal";
	}
	
	htmlNode = document.getElementById("option-b");
	htmlNode.style.visibility = "";
	if (ansShow)
	{
		if (ansNode.childNodes[0].nodeValue == "f")
		{
			htmlNode.style.color = "green";
			htmlNode.style.fontWeight = "bold";
		}
		else
		{
			if (night)
			{
				htmlNode.style.visibility = "hidden";
			}
			else
			{
				htmlNode.style.color = "";
				htmlNode.style.fontWeight = "normal";
			}
		}
	}
	else
	{
		htmlNode.style.color = "";
		htmlNode.style.fontWeight = "normal";
	}
	
	refreshBtnTxt(true);
}

function showBlankAnswer(qstn, clear)
{
	var ansNode = qstnList[showList[qstnIndex]].getElementsByTagName("blk");
	if (!ansNode || !ansNode.length)
	{
		return;
	}
	
	if (clear)
	{
		ansShow = 0;
		maxAnsToShow = ansNode.length;
	}
	else if ((ansShow < maxAnsToShow) && document.getElementById("wholeShow").checked)
	{
		ansShow = maxAnsToShow;
	}
	else
	{
		ansShow = (ansShow + 1) % (maxAnsToShow + 1);
	}
	
	var blanksList = document.getElementById("blanks");
	var blankNodes = blanksList.getElementsByTagName("li");
	var shown = blankNodes.length;
	var newBlank, blankText;
	
	if (!ansShow)
	{
		// 删除全部的子节点
		for(var i = blankNodes.length - 1; i >= 0; i--)
		{
			blanksList.removeChild(blankNodes[i]);
		}
	}
	else
	{
		// 添加新的节点
		for (var i = shown; i < ansShow; i++)
		{
			newBlank = document.createElement("li");
			blankText = document.createTextNode(ansNode[i].childNodes[0].nodeValue);
			newBlank.appendChild(blankText);
			blanksList.appendChild(newBlank);
		}
	}
	
	refreshBtnTxt(false);
}

function showTextAnswer(qstn, clear)
{
	var ansNode = qstnList[showList[qstnIndex]].getElementsByTagName("ans")[0];
	if (!ansNode)
	{
		return;
	}
	
	var ansText = ansNode.childNodes[0].nodeValue;
	
	if (clear)
	{
		ansShow = 0;
		maxAnsToShow = findReturnCount(ansText) + 1;
	}
	else if ((ansShow < maxAnsToShow) && document.getElementById("wholeShow").checked)
	{
		ansShow = maxAnsToShow;
	}
	else
	{
		ansShow = (ansShow + 1) % (maxAnsToShow + 1);
	}
	
	document.getElementById("text").innerHTML = cutStringByReturn(ansText, ansShow);

	refreshBtnTxt(false);
}

function findReturnCount(string)
{
	if (!string)
	{
		return 0;
	}
	
	var retString = replaceReturn(string);
	if (!retString)
	{
		return 0;
	}
	
	var returnStr = "<br />";
	
	var ret = 0, pos = retString.indexOf(returnStr);
	while(pos > -1)
	{
		ret++;
		pos = retString.indexOf(returnStr, pos + 1);
	}
	
	return ret;
}

function cutStringByReturn(string, times)
{
	if (!string || !times)
	{
		return "";
	}
	
	var retString = replaceReturn(string);
	if (!retString)
	{
		return "";
	}
	
	var newReturnStr = "<br />";
	var pos = retString.indexOf(newReturnStr);
	var findCount = 0;
	while(pos >= 0)
	{
		findCount++;
		if (findCount >= times)
		{
			break;
		}
		
		pos = retString.indexOf(newReturnStr, pos + 1);
	}
	
	if (pos >= 0)
	{
		retString = retString.substring(0, pos);
	}

	return retString;
}

function replaceReturn(string)
{
	if (!string)
	{
		return null;
	}
	
	var newReturnStr = "<br />";
	
	retString = string.replace(/\r\n/gm, newReturnStr);
	retString = retString.replace(/\r/gm, newReturnStr);
	retString = retString.replace(/\n/gm, newReturnStr);
	
	return retString;
}

function refreshBtnTxt(objective)
{
	document.getElementById("ansBtn").style.display = (ansShow == maxAnsToShow) ? "none" : "";
	document.getElementById("rmAnsBtn").style.display = (ansShow == 0) ? "none" : "";
	
	if (objective)
	{
		document.getElementById("wholeShow").style.display = "none";
		document.getElementById("wholeShowText").style.display = "none";
	}
	else
	{
		document.getElementById("wholeShow").style.display = "";
		document.getElementById("wholeShowText").style.display = "";
	}
}

function refreshList()
{
	var saveIndex = showList[qstnIndex];
	
	var tempList = showList.slice(0);
	showList.splice(0, showList.length);
	
	if (document.getElementById("schoiseCheck").checked)
	{
		addTypeQstn("s-choise");
	}
	
	if (document.getElementById("mchoiseCheck").checked)
	{
		addTypeQstn("m-choise");
	}
	
	if (document.getElementById("judgeCheck").checked)
	{
		addTypeQstn("judge");
	}
	
	if (document.getElementById("blankCheck").checked)
	{
		addTypeQstn("blank");
	}
	
	if (document.getElementById("textCheck").checked)
	{
		addTypeQstn("text");
	}
	
	if (!showList.length)
	{
		alert("没有您选择的题目类型，题目未做更新");
		showList = tempList.slice(0);
		
		return;
	}
	
	if (document.getElementById("random").checked)
	{
		var randString = document.getElementById("randseed").value;
		var randSeed = 0;
		if (!randString.length)
		{
			randSeed = parseInt(Math.random() * 99999999);
		}
		else
		{
			randSeed = bkdrHash(randString) % 100000000;
		}
		
		Math.seed = randSeed;
		
		var startString = document.getElementById("randstart").value;
		var endString = document.getElementById("randend").value;
		var startIndex = parseInt(startString);
		var endIndex = parseInt(endString);
		// 当起始和终止值无效时，将全部内容进行排序
		if ((startIndex !== startIndex && endIndex !== endIndex) || (!startString.length && !endString.length) || endIndex <= startIndex)
		{
			showList.sort(function(){ return 50 - Math.seededRandom(0, 100); });
		}
		// 否则，将按照开始和结束位置进行排序
		else
		{
			if (startIndex !== startIndex || startIndex < 0)
			{
				startIndex = 0;
			}
			else
			{
				startIndex--;
			}
			if (endIndex !== endIndex || endIndex >= showList.length)
			{
				endIndex = showList.length;
			}
			
			var tempList = showList.slice(startIndex, endIndex);
			tempList.sort(function(){ return 50 - Math.seededRandom(0, 100); });
			
			for (var i = 0; i < tempList.length; i++)
			{
				showList[i + startIndex] = tempList[i];
			}
		}
	}
	
	saveBookMarkRaw(saveIndex);
	
	qstnIndex = 0;
	showQuestion();
}

function addTypeQstn(typeStr)
{
	for (var i = 0; i < qstnList.length; i++)
	{
		if (qstnList[i].getAttribute("type") == typeStr)
		{
			showList.push(i);
		}
	}
}

function scrollToShowBtn()
{
	var checkShow = document.getElementById("wholeShow");
	if (ansShow && checkShow.style.display != "none" && !checkShow.checked)
	{
		var btn = document.getElementById("ansBtn");
		if (btn.style.display == "none")
		{
			btn = document.getElementById("rmAnsBtn");
		}

		window.scrollTo(0, btn.offsetTop + btn.offsetHeight - screen.availHeight * 0.8);
	}
	else
	{
		window.scrollTo(0, 0);
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
		idx = Math.min(idx, showList.length);
	}
	
	saveBookMark();
	
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
	
	for (i = (qstnIndex + 1) % showList.length; i != qstnIndex; i = (i + 1) % showList.length)
	{
		if (matchQstn(qstnList[showList[i]], searchTxt))
		{
			break;
		}
	}

	if (i == qstnIndex && !matchQstn(qstnList[showList[i]], searchTxt))
	{
		alert("未找到包含关键字“" + searchTxt + "”的题目");
		return;
	}
	
	saveBookMark();

	qstnIndex = i;
	showQuestion();
}

function initBookMarks()
{
	if (!localStorageEnable() || !qstnList.length)
	{
		bookMarkEnable = false;
		document.getElementById("bookMark").style.display = "none";
		return;
	}
	
	var i;
	for (i = 0; i < qstnList.length; i++)
	{
		bookMarkList.push(false);
	}
	
	var bookMarkString = window.localStorage.getItem(libName);
	
	bookMarkCount = 0;
	if (!bookMarkString || !bookMarkString.length)
	{
		return;
	}

	var bookMarkIndex = bookMarkString.split(",");
	var idx;
	for (i = 0; i < bookMarkIndex.length; i++)
	{
		idx = parseInt(bookMarkIndex[i]);
		if (!isNaN(idx))
		{
			bookMarkList[idx] = true;
			bookMarkCount++;
		}
	}
}

function saveBookMarkRaw(rawIndex)
{
	if (!bookMarkEnable || bookMarkStatus == document.getElementById("bookMarkC").checked)
	{
		return;
	}
	
	if (document.getElementById("bookMarkC").checked)
	{
		bookMarkList[rawIndex] = true;
		bookMarkCount++;
	}
	else
	{
		bookMarkList[rawIndex] = false;
		bookMarkCount--;
		if (bookMarkCount < 0)
		{
			bookMarkCount = 0;
		}
	}
	
	if (bookMarkCount)
	{
		var bookMarkString = "";
		for (var i = 0, count = 0; i < bookMarkList.length; i++)
		{
			if (bookMarkList[i])
			{
				bookMarkString += i;
				count++;
				if (count < bookMarkCount)
				{
					bookMarkString += ",";
				}
				else
				{
					break;
				}
			}
		}
		
		window.localStorage.setItem(libName, bookMarkString);
	}
	else
	{
		window.localStorage.removeItem(libName);
		document.getElementById("bookMarkS").checked = false;
	}
}

function saveBookMark()
{
	saveBookMarkRaw(showList[qstnIndex]);
}
