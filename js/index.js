
var xmlList;

function indexNightMode(tip)
{
	nightMode(tip);
	
	if (night)
	{
		document.getElementById("titleicon").src = "img/iconnight.png";
	}
	else
	{
		document.getElementById("titleicon").src = "img/icon.png";
	}
}

function initIndex()
{
	indexNightMode(false);
	
	// 拉取题目列表
	xmlList = loadXML("xml/list.xml");
	if (!xmlList)
	{
		document.write("<p>题目列表链接可能已经失效，请等待修复或反馈...</p><p>如需反馈，请关注微信公众号“热控团青在线”后留言</p>");
		return;
	}
	
	var key = xmlList.getElementsByTagName("key");
	if (!key || key[0].childNodes[0].nodeValue != "QuickQuiz-List")
	{
		document.write("<p>题目列表链接可能已经被破坏，请等待修复或反馈...</p><p>如需反馈，请关注微信公众号“热控团青在线”后留言</p>");
		return;
	}

	// 重建题目组列表
	var list = xmlList.getElementsByTagName("tag");
	var groupList = document.getElementById("selectGrp");
	
	var i;
	for (i = groupList.length - 1; i >= 0; i--)
	{
		groupList.remove(i);
	}
	
	var y;
	for (var i = 0; i < list.length; i++)
	{
		y = document.createElement('option');
		y.text = list[i].childNodes[0].nodeValue;
		groupList.add(y);
	}
	
	// 建立题目列表
	changeGrp();
	
	initSel();
	changeSel();
	
	// 尝试解决Safari回滚后不能回到顶端的问题（不一定能解决）
	window.scrollTo(0, 0);
}

function getSelLib()
{
	var selectIdx = document.getElementById("selectGrp").selectedIndex;
	var selectGrp = xmlList.getElementsByTagName("group")[selectIdx];
	
	selectIdx = document.getElementById("selectLib").selectedIndex;
	return selectGrp.getElementsByTagName("item")[selectIdx];
}

function setBtnHref(btn)
{
	if (!checkPassword())
	{
		return;
	}
	
	var url = btn.value;
	if (!url)
	{
		return;
	}
	
	var selLib = getSelLib();
	var hrefStr = selLib.getElementsByTagName("href")[0];
	if (!hrefStr)
	{
		alert("题目列表链接可能已经被破坏，请等待修复或反馈...");
		return;
	}
	
	setCookie("lib", hrefStr.childNodes[0].nodeValue, 720);
	url = url + "?" + "href=" + hrefStr.childNodes[0].nodeValue;
	
	// 如果需要输入密码，则在url中也加入密码
	if(document.getElementById("passdiv").style.display != "none")
	{
		url = url + "&" + "pass=" + document.getElementById("password").value;
		setCookie("pass", document.getElementById("password").value, 168);
	}
	else
	{
		delCookie("pass");
	}
	
	location.href = url;
}

function initSel()
{
	var href = getCookie("lib");
	if (!href)
	{
		return;
	}
	
	var hrefList = xmlList.getElementsByTagName("href");
	for (var i = 0; i < hrefList.length; i++)
	{
		// 找到了对应的题库
		if (href == hrefList[i].childNodes[0].nodeValue)
		{
			var item = hrefList[i].parentNode;
			var group = item.parentNode;
			
			var j = getIndex(xmlList.getElementsByTagName("group"), group);
			if (j < document.getElementById("selectGrp").length)
			{
				document.getElementById("selectGrp").selectedIndex = j;
			}
			
			changeGrp();
			break;
		}
	}
}

function changeSel()
{
	var selectLib = getSelLib();
	document.getElementById("passdiv").style.display =
		(selectLib.getElementsByTagName("password").length) ? "" : "none";
		
	if (selectLib.getElementsByTagName("password").length)
	{
		var passSave = getCookie("pass");
		if (passSave)
		{
			document.getElementById("password").value = passSave;
		}
	}
}

function checkPassword()
{
	var selectLib = getSelLib();
	var passwordNode = selectLib.getElementsByTagName("password");
	if (passwordNode.length)
	{
		var userStr = makeMD5(document.getElementById("password").value);
		if (userStr != passwordNode[0].childNodes[0].nodeValue)
		{
			alert("密码错误！");
			document.getElementById("password").value = "";
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return true;
	}
}

function changeGrp()
{
	var selectIdx = document.getElementById("selectGrp").selectedIndex;
	var selectGrp = xmlList.getElementsByTagName("group")[selectIdx];
	var selectList = document.getElementById("selectLib");
	var list = selectGrp.getElementsByTagName("desc");
	
	var i;
	for (i = selectList.length - 1; i >= 0; i--)
	{
		selectList.remove(i);
	}
	
	var y;
	for (var i = 0; i < list.length; i++)
	{
		y = document.createElement('option');
		y.text = list[i].childNodes[0].nodeValue;
		selectList.add(y);
	}
	
	// 如果曾经保存了浏览过的题库，则在选中对应题目组后自动选中
	var href = getCookie("lib");
	if (href)
	{
		var hrefList = selectGrp.getElementsByTagName("href");
		for (var i = 0; i < hrefList.length; i++)
		{
			if (href == hrefList[i].childNodes[0].nodeValue)
			{
				document.getElementById("selectLib").selectedIndex = i;
				break;
			}
		}
	}
	
	changeSel();
}

window.onpageshow = function(event)
{
	if (event.persisted)
	{
		window.location.reload();
		// 尝试解决Safari回滚后不能回到顶端的问题（不一定能解决）
		window.scrollTo(0, 0);
	}
}
