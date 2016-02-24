/**
 * Utilities and useful goodies for the VFB project
 *
 * @author nmilyaev
 * @param url
 * @param target
 * @param tip
 */

/** Sets the scope for anatomy search
 *
 */
function setScope(value) {
    var url = document.URL;
    //console.log("Create autocomplete!" + $("scope").value);
    //alert("Create autocomplete!" + $("scope").value);
    scope = $("scope").value;
    loadURL("/do/autocomplete_list.html?scope=" + scope, $("search_text"), null, "scope=" + scope, false);
    (function () {
        window.location = url
    }).delay(200);
    createAutocomplete();
}

/**
 * Creates autocomplete box for the homepage and anatomy finder
 */
function createAutocomplete() {
    $('search_text').dispose();

    var search_text = new Element('input', {type: 'text'});
    search_text.set("id", "search_text")
    search_text.inject($('search_panel'));

    autocomplete = new Meio.Autocomplete(search_text, "/do/autocomplete_list.html", {
        selectOnTab: false,
        onNoItemToList: function (elements) {
            elements.field.node.highlight('#ff0000');
        },
        onSelect: function (elements, value) {
            var id_container = $("id_container");
            id_container.set("value", value.id);
            window.location = '/site/stacks/index.htm?id=' + value.id + '&name=' + encodeURIComponent(search_text.value); //redirects
        },
        filter: {
            path: 'text',
            type: 'itune'
        }
    });
}

/** Loads external page's HTML from "url" in the specified "target" element. Initially, the target displays the "tip" text.
 * @param keepTip - whether remove the tip on completion of the request or keep it as part of the responce
 * @param params - specify optional HTTP request parameters, eg "action=count" */
function loadURL(url, target, tip, params, keepTip) {
    var request = new Request({
        url: url,
        method: 'get',
        onRequest: function () {
            target.set('html', tip + '<br/><img src="/thirdParty/smoothbox/loading.gif" height="30"/>');
        },
        onSuccess: function (responseText) {
            //alert('Request made. setting '+ target + " to  " + responseText );
            tip = (keepTip) ? tip + "<br/>" : "";
            target.set('html', tip + responseText);
        },
        onFailure: function () {
            target.set('html', tip);
        }
    });
    request.send(params);
};

/** Reads a given cookie value and converts it into an array. It is presumed that the cookie value is produces from array by join('-')
 * If given cookie does not exist, an empty array is returned
 * @param cookieName - name of the cookie value to be read
 */
function readCookieAsArray(cookieName) {
    //var cookieValue = Cookie.read(cookieName, {domain: 'www.virtualflybrain.org'});
    var cookieValue = Cookie.read(cookieName);
    var array = [];
    //alert("Read cookie: " + cookieValue);
    if (cookieValue !== undefined && cookieValue != null) {
        if (cookieValue.length > 0) {
            array = cookieValue.split('-');
        }
    }
    var array1 = array.filter(function (item, index) {
        return (item !== undefined && item != 'undefined' && item != null && item != '');
    });
    //alert("Array: " + array);
    return array1;
};

/** Saves and array as a given cookie. It is presumed that the cookie value is produces from array by join('-')
 * @param cookieName - name of the cookie value to be read
 * @param array - array to be converted into cookie
 */
function saveArrayAsCookie(array, cookieName) {
    //alert("Array: " + array);
    var array1 = array.filter(function (item, index) {
        return (item !== undefined && item != 'undefined' && item != null && item != '');
    });
    if (array1.length > 0) {
        var toCookie = array1.join('-');
    }
    //Cookie.write(cookieName, toCookie, {domain: 'www.virtualflybrain.org'});
    Cookie.write(cookieName, toCookie);
};

function hideQueryResults() {
    //$(query_result).addClass('hidden');
    var mySlide = new Fx.Slide('query_result');
    mySlide.slideOut();
}

function showQueryResults() {
    $('query_result').removeClass('hidden');
    var mySlide = new Fx.Slide('query_result');
    mySlide.slideIn();
}

/** Executes the "execute" command with parameters specified by "paramNames" and "paramValues"
 * The results are loaded into the "target" element
 *  * Number of members in paramNames MUSt be equal to paramValues.
 */
function dispatchAction(execute, paramNames, paramValues, target) {
    var params = 'execute=' + execute;
    paramNames.each(function (item, index) {
        params = params + "&" + item + "=" + paramValues[index];
    })
    var tip = "";
    var url = "/site/stacks/recentQuery.jsp";
    alert("query: " + url + "?" + params + ">>" + target);
    loadURL(url, $(target), tip, params, false);
}
/**
 * Just a useful little javascript function which will get a URL parameter and return it to you.
 * For example if the current URL is "...?opendocument&id=testid" then calling getURLParam("id") will return "testid".
 * @param strParamName
 * @returns
 */
function getURLParam(strParamName) {
    var strReturn = "";
    var strHref = window.location.href;
    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (
                aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                break;
            }
        }
    }
    return unescape(strReturn);
}

/**Parses the HTML parameters and returns these as a string array
 *
 */
function getAllParameters() {
    fullQString = window.location.search.substring(1);
    paramArray = fullQString.split("&");
    var finalArray = new Array();
    for (i = 0; i < paramArray.length; i++) {
        currentParameter = paramArray[i].split("=");
        finalArray[i] = Array(currentParameter[0], currentParameter[1]);
    }

    return finalArray;
}
