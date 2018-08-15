var xmlMain;

function loadXML(strURL)
{
	if (!strURL)
	{
		return null;
	}
	
	var xmlhttp;
	if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  	xmlhttp = new XMLHttpRequest();
  }
	else
  {// code for IE6, IE5
  	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  if (!xmlhttp)
  {
  	alert("解析模块不可使用!")
  	return null;
  }
  
	xmlhttp.open("GET", strURL, false);
	xmlhttp.send();
	
	return xmlhttp.responseXML;
}

function getURLPara(url, paraStr)
{
	if (!url || !paraStr)
	{
		return null;
	}
	
	var idx = url.indexOf("?");
	if (idx <= 0)
	{
		return null;
	}
	
	var strAll = url.substr(idx + 1);
	var strList = strAll.split("&");
	
	for (var i = 0; i < strList.length; i++)
	{
		if (strList[i].indexOf(paraStr) >= 0)
		{
			return strList[i].split("=")[1];
		}
	}
	
	return null;
}

function matchQstn(qstn, txt)
{
	if (qstn.getElementsByTagName("desc")[0].childNodes[0].nodeValue.indexOf(txt) >= 0)
	{
		return true;
	}
	
	switch(qstn.getAttribute("type"))
	{
	case "s-choise":
	case "m-choise":
		if (matchChildValue(qstn, "opt", txt))
		{
			return true;
		}
		break;
		
	case "blank":
		if (matchChildValue(qstn, "blk", txt))
		{
			return true;
		}
		break;
		
	case "text":
		if (qstn.getElementsByTagName("ans")[0].childNodes[0].nodeValue.indexOf(txt) >= 0)
		{
			return true;
		}
		break;
	}
	
	return false;
}

function matchChildValue(qstn, tag, txt)
{
	var optList = qstn.getElementsByTagName(tag);
	for (var i = 0; i < optList.length; i++)
	{
		if (optList[i].childNodes[0].nodeValue.indexOf(txt) >= 0)
		{
			return true;
		}
	}
	
	return false;
}

function showHideShowFunc(elementId, textId, textTag)
{
	var qstnSet = document.getElementById(elementId);
	if (!qstnSet.style.display)
	{
		qstnSet.style.display = "none";
		document.getElementById(textId).innerHTML = "&#9658" + textTag;
	}
	else
	{
		qstnSet.style.display = "";
		document.getElementById(textId).innerHTML = "&#9660" + textTag;
	}
}

function localStorageEnable()
{
	if(window.localStorage)
	{
		try
		{
			localStorage.setItem("key", "value");
			localStorage.removeItem("key");
			return true;
		}
		catch(e)
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

Math.seededRandom = function(max, min)
{
	max = max || 1;
	min = min || 0;

	Math.seed = (Math.seed * 9301 + 49297) % 233280;
	var rnd = Math.seed / 233280.0;

	return Math.ceil( min + rnd * (max - min) );
}

function bkdrHash(string)
{
    var seed = 131; // 31 131 1313 13131 131313 etc..
    var hash = 0, i = 0;
	
    while(i < string.length)
    {
        hash = hash * seed + string.charCodeAt(i);
        i++;
    }
	
    return (hash % 0x7FFFFFFF);
}

function setCookie(c_name, value, expirehours)
{
	if (!navigator.cookieEnabled)
	{
		return;
	}
	
	var exdate = new Date();
	exdate.setTime(exdate.getTime() + expirehours * 60 * 60 * 1000);
	document.cookie = c_name + "=" + escape(value) + ((!expirehours) ? "" : (";expires=" + exdate.toGMTString())) + ";path=/";
}

function getCookie(name)
{
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
	{
		return unescape(arr[2]);
	}
	else
	{
		return null;
	}
}

function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval)
	{
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
	}
}

function getIndex(list, item)
{
	for (var i = 0; i < list.length; i++)
	{
		if (item == list[i])
		{
			return i;
		}
	}
	
	return 0;
}