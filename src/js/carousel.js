function initializeAutoComplete() {
    new Autocomplete({
        el: ".typeahead",
        url: "http://www.craftsvilla.com/v2/getAutosuggestion",
        cache: !0,
        waitTime: 200,
        minLength: 0
    });
    document.querySelector("body").addEventListener("autocomplete:completed", function(e) {
        handleAutoCompleteCompleted(e)
    }),
    document.querySelector("body").addEventListener("autocomplete:selected", function(e) {
        handleAutoCompleteSelected(e)
    }),
    document.querySelector("#searchval").addEventListener("focus", function(e) {
        handleAutoCompleteFocus()
    }),
    document.querySelector("#msearchval").addEventListener("focus", function(e) {
        handleAutoCompleteFocus()
    }),
    $("body").on("mousedown", ".tt-suggestion", function(e) {
        handleAutoCompleteSelected(e)
    })
}
function handleAutoCompleteCompleted(e) {
    var t = ""
      , n = e.response.response
      , i = e.response.query;
    t = showSuggestionsMenu(n, "icon sprite-search-icon", null , "api", i);
    var o = document.querySelector(".tt-suggestions");
    o.innerHTML = t
}
function handleAutoCompleteSelected(e) {
    var t = getPageBaseUrl()
      , n = {
        RECENTLY_VIEWED_SEARCH_LIMIT: 5,
        TRENDING_LIMIT: 5
    }
      , i = {}
      , o = e.currentTarget;
    o.className.indexOf("tt-suggestion") < 0 && (o = $(o).find(".tt-suggestion.tt-cursor")[0]),
    o.getAttribute("data-result-type") && (i.type = o.getAttribute("data-result-type")),
    o.getAttribute("data-text") && (i.text = o.getAttribute("data-text"),
    utilObject.setCookie("selectedSearch", i.text)),
    o.getAttribute("data-category-id") && (i.category_id = o.getAttribute("data-category-id")),
    i.url_path = o.getAttribute("data-url"),
    "null" != o.getAttribute("data-storage-type") && storeRecentlySearchedTerms(i, n),
    "undefined" != typeof dataLayer && dataLayer.push({
        event: "SearchPerformedEvent",
        eventName: "SearchPerformed",
        source: "homeScreen",
        suggestionUsed: "yes",
        searchQuery: i.text
    }),
    "undefined" != typeof _satellite && (digitalData.page = {
        search: {
            searchTerm: i.text
        }
    },
    o.getAttribute("data-suggestion-type") && ("trending" == o.getAttribute("data-suggestion-type") ? _satellite.track("auto-suggested-trending-click") : "recent" == o.getAttribute("data-suggestion-type") ? _satellite.track("auto-suggested-recent-click") : _satellite.track("auto-suggested-search-click"))),
    "category" == i.type ? window.location = t + "/" + i.url_path : "context_suggest" == i.type ? window.location = t + "/searchresults?searchby=product&q=" + i.text + "&categoryId=" + i.category_id : "undefined" != i.url_path ? window.location = t + "/" + i.url_path : window.location = t + "/searchresults?searchby=product&q=" + i.text
}
function handleAutoCompleteFocus() {
    var e = ""
      , t = handleLocallyStoredData()
      , n = null ;
    if (n = isMobile ? document.querySelector("#msearchval") : document.querySelector("#searchval"),
    n.value.trim().length <= 0) {
        isMobile ? dropDownMenu = document.querySelector("#msearch_mini_form .tt-dropdown-menu") : dropDownMenu = document.querySelector("#search_mini_form .tt-dropdown-menu"),
        dropDownMenu.style.display = "block";
        var i = '<div class="tt-dataset-1"><span class="tt-suggestions" style="display:block;"></span></div>';
        dropDownMenu.innerHTML = i,
        e += t.html,
        e += handleTrendingData(),
        createDropDownMenu(e)
    }
}
function createDropDownMenu(e) {
    var t = document.querySelector(".tt-suggestions");
    t.innerHTML = e
}
function handleTrendingData() {
    var e = "";
    return e = showSuggestionsMenu(trendingData, "icon trending-search-icon", "TRENDING NOW", "trending", null )
}
function loadTrendingData(e) {
    var e = 10 - e;
    $.ajax({
        url: "http://www.craftsvilla.com/getTrendingSearchKeywords?limit=" + e,
        type: "GET",
        withCredentials: !1,
        success: function(e) {
            trendingData = e.data
        },
        error: function(e) {
            console.log("Error in ajax call", e)
        }
    })
}
function loadLocalData() {
    var e = null ;
    if (e = isMobile ? document.querySelector("#msearchval") : document.querySelector("#searchval"),
    isLocalStorage()) {
        if (null !== window.localStorage.getItem("recent_searches")) {
            var t = null ;
            try {
                return t = JSON.parse(window.localStorage.getItem("recent_searches")),
                t.length
            } catch (n) {
                return 0
            }
        }
        return 0
    }
}
function handleLocallyStoredData() {
    var e = {};
    e.length = 0,
    e.html = "";
    var t = null ;
    if (t = isMobile ? document.querySelector("#msearchval") : document.querySelector("#searchval"),
    0 == t.value.trim().length)
        if (isLocalStorage()) {
            if (null !== window.localStorage.getItem("recent_searches")) {
                var n = null ;
                try {
                    n = JSON.parse(window.localStorage.getItem("recent_searches")),
                    e.length = n.length
                } catch (i) {
                    throw new Error("Unable to parse the JSON")
                }
                n && (e.html = showSuggestionsMenu(n, "icon recent-search-icon", "RECENT SEARCHES", "recent", null ))
            }
        } else {
            var o = utilObject.getCookie("recent_searches");
            o && (o = JSON.parse(o),
            e.length = o.length,
            e.html = showSuggestionsMenu(o, "icon recent-search-icon", "RECENT SEARCHES", "recent", null ))
        }
    return e
}
function showSuggestionsMenu(e, t, n, i, o) {
    var r = ""
      , a = ""
      , s = null ;
    if ("trending" == i ? a = "trending" : s = "local",
    e && e.length) {
        var l = "";
        n && (l = '<div class="autosuggestions-search-title">' + n + "</div>"),
        e.forEach(function(e) {
            var n = e.text
              , o = ['<div class="tt-suggestion ' + a + '" data-url="' + e.url_path + '" data-result-type="' + e.type + '" data-text="' + e.text + '" data-category-id="' + e.category_id + '" data-storage-type="' + s + '" data-suggestion-type="' + i + '">', '<div class="custom_results_text custom_results">'].join("\n");
            t && (o = o.concat(['<i class="' + t + '"></i>'])),
            o = o.concat(['<span class="result_text">' + n + "</span>"]),
            e.category_name && (o = o.concat(['<span class="result_type">&nbsp;in&nbsp;' + e.category_name + "</span>"])),
            o = o.concat(["</div></div>"]),
            r = r.concat(o)
        }),
        r = l.concat(r)
    } else if ("api" == i) {
        var c = ['<div class="no-result-found">', '<div class="custom_results_text custom_results">', '<span class="result_text">No Items Found</span>', "</div></div>"].join("\n");
        r = c
    }
    return r
}
function isLocalStorage() {
    return window.localStorage
}
function storeRecentlySearchedTerms(e, t) {
    if (isLocalStorage()) {
        var n = {};
        n.recent_searches = [];
        var i = e.text + "_" + e.type;
        if (null == window.localStorage.getItem("recent_searches"))
            n.recent_searches.push(e);
        else {
            var o = null ;
            try {
                o = JSON.parse(window.localStorage.getItem("recent_searches"))
            } catch (r) {
                throw new Error("Unable to parse the JSON")
            }
            if (o) {
                n.recent_searches = n.recent_searches.concat(o);
                for (var a = !1, s = 0; s < o.length; s++) {
                    var l = o[s].text + "_" + o[s].type;
                    if (l == i) {
                        a = !0;
                        break
                    }
                }
                a || n.recent_searches.unshift(e),
                n.recent_searches.length >= t.RECENTLY_VIEWED_SEARCH_LIMIT ? n.recent_searches.length = t.RECENTLY_VIEWED_SEARCH_LIMIT : n.recent_searches
            }
        }
        window.localStorage.setItem("recent_searches", JSON.stringify(n.recent_searches))
    } else {
        var c = utilObject.getCookie("recent_searches") || "[]";
        c = JSON.parse(c);
        for (var a = !1, s = 0; s < o.length; s++) {
            var l = o[s].text + "_" + o[s].type;
            if (l == i) {
                a = !0;
                break
            }
        }
        a || c.unshift(e),
        c.length = c.length >= t.RECENTLY_VIEWED_SEARCH_LIMIT ? t.RECENTLY_VIEWED_SEARCH_LIMIT : c.length,
        utilObject.setCookie("recent_searches", JSON.stringify(c), 5e3)
    }
}
function getPageBaseUrl() {
    var e = window.location.hostname
      , t = "";
    return t = "www.craftsvilla.com" == e || "securestatic.craftsvilla.com" == e ? "http://www.craftsvilla.com" : "dev10.craftsvilla.com" == e || "securedev10.craftsvilla.com" == e ? "http://dev10.craftsvilla.com" : "dev9.craftsvilla.com" == e || "securedev9.craftsvilla.com" == e ? "http://dev9.craftsvilla.com" : "dev8.craftsvilla.com" == e || "securedev8.craftsvilla.com" == e ? "http://dev8.craftsvilla.com" : "dev7.craftsvilla.com" == e || "securedev7.craftsvilla.com" == e ? "http://dev7.craftsvilla.com" : "dev6.craftsvilla.com" == e || "securedev6.craftsvilla.com" == e ? "http://dev6.craftsvilla.com" : "http://local.craftsvilla.com"
}
function fillvalues(e) {
    var t = e.target.q.value
      , n = t.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    if (n = n.trim(),
    t = t.trim(),
    null == n || "" == n)
        return !1;
    var i = {
        RECENTLY_VIEWED_SEARCH_LIMIT: 5,
        TRENDING_LIMIT: 5
    }
      , o = {
        text: t,
        type: "suggestion"
    };
    utilObject.setCookie("selectedSearch", o.text),
    storeRecentlySearchedTerms(o, i)
}
function loadGtm() {
    var e = window.location.hostname
      , t = "";
    t = "www.craftsvilla.com" == e || "securestatic.craftsvilla.com" == e ? "5W7X48" : "NZFVN6",
    function(e, t, n, i, o) {
        e[i] = e[i] || [],
        e[i].push({
            "gtm.start": (new Date).getTime(),
            event: "gtm.js"
        });
        var r = t.getElementsByTagName(n)[0]
          , a = t.createElement(n)
          , s = "dataLayer" != i ? "&l=" + i : "";
        a.async = !0,
        a.src = "//www.googletagmanager.com/gtm.js?id=" + o + s,
        r.parentNode.insertBefore(a, r)
    }(window, document, "script", "dataLayer", "GTM-" + t)
}
function reloadPageConditional() {
    var e = "";
    return "undefined" != typeof utilObject && (e = utilObject.current_page),
    "Category Page" == e || "SubCategory Page" == e ? void (window.location.href = window.location.pathname) : void window.location.reload()
}
function validateCurrency(e) {
    var t = $("#mageCurrencyCode").attr("value");
    return setCookieWithDomain("currency", "INR", ".craftsvilla.com", 90),
    "INR" == t || (console.log("Currency mismatch! Page reloading."),
    !1)
}
function setInternational(e, t) {
    var n = JSON.parse(e);
    "1" == n.s ? (setCookieWithDomain("currency", "INR", ".craftsvilla.com", 90),
    setCookieWithDomain("internationalIP", "true", ".craftsvilla.com", 90),
    "popup" == t ? (digitalData.international = {},
    digitalData.international.popup = {
        response: "International"
    },
    "undefined" != typeof _satellite && _satellite.track("international-popup-response")) : "undefined" != typeof _satellite && _satellite.track("domestic-to-international"),
    window.location.href = "http://www.craftsvilla.com/us/") : console.log("Error: Currency Not Set. API Error.")
}
function setIndia(e, t) {
    var n = JSON.parse(e);
    "1" == n.s ? (setCookieWithDomain("currency", "INR", ".craftsvilla.com", 90),
    setCookieWithDomain("internationalIP", "false", ".craftsvilla.com", 90),
    "popup" == t ? (digitalData.international = {},
    digitalData.international.popup = {
        response: "India"
    },
    "undefined" != typeof _satellite && _satellite.track("international-popup-response")) : "undefined" != typeof _satellite && _satellite.track("international-to-domestic"),
    reloadPageConditional()) : console.log("Error: Currency Not Set. API Error.")
}
function handleHeaderLinkClick() {
    var e = getPageBaseUrl() + "/generalcheck/index/setCurrency"
      , t = getCookie("currency");
    t && "INR" != t ? $.ajax({
        type: "POST",
        url: e,
        data: JSON.stringify({
            currencyCode: "INR"
        }),
        xhrFields: {
            withCredentials: !0
        },
        success: function(e) {
            setIndia(e, "header")
        }
    }) : $.ajax({
        type: "POST",
        url: e,
        data: JSON.stringify({
            currencyCode: "INR"
        }),
        xhrFields: {
            withCredentials: !0
        },
        success: function(e) {
            setInternational(e, "header")
        }
    })
}
function handleLocationAPIResponse(e) {
    var t = getPageBaseUrl() + "/generalcheck/index/setCurrency"
      , n = JSON.parse(e);
    return 1 != n.s ? void console.log("Error: Location API Error.") : 0 == n.d.isInternational ? (console.log("IP-Location: Domestic"),
    $("#currency-switch-text").text("Go to International Site"),
    void $("#currency-switch-text-mobile").text("Go to International Site")) : (console.log("IP-Location: International"),
    $("#international-popup-handle").html(n.d.html.replace(/\\/g, "")),
    jQuery("#internationalModal").modal({
        show: !0,
        keyboard: !1,
        backdrop: "static"
    }),
    "undefined" != typeof _satellite && _satellite.track("international-popup-appear"),
    $("#international-btn").click(function(e) {
        e.preventDefault(),
        $.ajax({
            type: "POST",
            url: t,
            data: JSON.stringify({
                currencyCode: "INR"
            }),
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                setInternational(e, "popup")
            }
        })
    }),
    void $("#india-btn").click(function(e) {
        e.preventDefault(),
        $.ajax({
            type: "POST",
            url: t,
            data: JSON.stringify({
                currencyCode: "INR"
            }),
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                setIndia(e, "popup")
            }
        })
    }))
}
function loadInternationalPopup() {
    var e = getCookie("internationalIP")
      , t = getCookie("currency");
    if (!validateCurrency(t))
        return t && "undefined" != t || setCookieWithDomain("currency", "INR", ".craftsvilla.com", 90),
        void window.location.reload();
    var n = getPageBaseUrl() + "/generalcheck/index/isInternationCheck";
    return $("#currency-switch-text,#currency-switch-text-mobile").on("click", function(e) {
        e.preventDefault(),
        handleHeaderLinkClick()
    }),
    e ? void ("INR" == t ? ($("#currency-switch-text").text("Go to International Site"),
    $("#currency-switch-text-mobile").text("Go to International Site")) : ($("#currency-switch-text").text("Go to International Site"),
    $("#currency-switch-text-mobile").text("Go to International Site"))) : void $.get(n, function(e) {
        handleLocationAPIResponse(e)
    })
}
if (!function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = "length"in e && e.length
          , n = oe.type(e);
        return "function" !== n && !oe.isWindow(e) && (!(1 !== e.nodeType || !t) || ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e))
    }
    function i(e, t, n) {
        if (oe.isFunction(t))
            return oe.grep(e, function(e, i) {
                return !!t.call(e, i, e) !== n
            });
        if (t.nodeType)
            return oe.grep(e, function(e) {
                return e === t !== n
            });
        if ("string" == typeof t) {
            if (pe.test(t))
                return oe.filter(t, e, n);
            t = oe.filter(t, e)
        }
        return oe.grep(e, function(e) {
            return oe.inArray(e, t) >= 0 !== n
        })
    }
    function o(e, t) {
        do
            e = e[t];
        while (e && 1 !== e.nodeType);return e
    }
    function r(e) {
        var t = we[e] = {};
        return oe.each(e.match(be) || [], function(e, n) {
            t[n] = !0
        }),
        t
    }
    function a() {
        he.addEventListener ? (he.removeEventListener("DOMContentLoaded", s, !1),
        e.removeEventListener("load", s, !1)) : (he.detachEvent("onreadystatechange", s),
        e.detachEvent("onload", s))
    }
    function s() {
        (he.addEventListener || "load" === event.type || "complete" === he.readyState) && (a(),
        oe.ready())
    }
    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var i = "data-" + t.replace(Ee, "-$1").toLowerCase();
            if (n = e.getAttribute(i),
            "string" == typeof n) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : Se.test(n) ? oe.parseJSON(n) : n)
                } catch (o) {}
                oe.data(e, t, n)
            } else
                n = void 0
        }
        return n
    }
    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !oe.isEmptyObject(e[t])) && "toJSON" !== t)
                return !1;
        return !0
    }
    function u(e, t, n, i) {
        if (oe.acceptData(e)) {
            var o, r, a = oe.expando, s = e.nodeType, l = s ? oe.cache : e, c = s ? e[a] : e[a] && a;
            if (c && l[c] && (i || l[c].data) || void 0 !== n || "string" != typeof t)
                return c || (c = s ? e[a] = J.pop() || oe.guid++ : a),
                l[c] || (l[c] = s ? {} : {
                    toJSON: oe.noop
                }),
                ("object" == typeof t || "function" == typeof t) && (i ? l[c] = oe.extend(l[c], t) : l[c].data = oe.extend(l[c].data, t)),
                r = l[c],
                i || (r.data || (r.data = {}),
                r = r.data),
                void 0 !== n && (r[oe.camelCase(t)] = n),
                "string" == typeof t ? (o = r[t],
                null == o && (o = r[oe.camelCase(t)])) : o = r,
                o
        }
    }
    function d(e, t, n) {
        if (oe.acceptData(e)) {
            var i, o, r = e.nodeType, a = r ? oe.cache : e, s = r ? e[oe.expando] : oe.expando;
            if (a[s]) {
                if (t && (i = n ? a[s] : a[s].data)) {
                    oe.isArray(t) ? t = t.concat(oe.map(t, oe.camelCase)) : t in i ? t = [t] : (t = oe.camelCase(t),
                    t = t in i ? [t] : t.split(" ")),
                    o = t.length;
                    for (; o--; )
                        delete i[t[o]];
                    if (n ? !c(i) : !oe.isEmptyObject(i))
                        return
                }
                (n || (delete a[s].data,
                c(a[s]))) && (r ? oe.cleanData([e], !0) : ne.deleteExpando || a != a.window ? delete a[s] : a[s] = null )
            }
        }
    }
    function p() {
        return !0
    }
    function f() {
        return !1
    }
    function h() {
        try {
            return he.activeElement
        } catch (e) {}
    }
    function g(e) {
        var t = He.split("|")
          , n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length; )
                n.createElement(t.pop());
        return n
    }
    function m(e, t) {
        var n, i, o = 0, r = typeof e.getElementsByTagName !== Ce ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== Ce ? e.querySelectorAll(t || "*") : void 0;
        if (!r)
            for (r = [],
            n = e.childNodes || e; null != (i = n[o]); o++)
                !t || oe.nodeName(i, t) ? r.push(i) : oe.merge(r, m(i, t));
        return void 0 === t || t && oe.nodeName(e, t) ? oe.merge([e], r) : r
    }
    function v(e) {
        Ae.test(e.type) && (e.defaultChecked = e.checked)
    }
    function y(e, t) {
        return oe.nodeName(e, "table") && oe.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function b(e) {
        return e.type = (null !== oe.find.attr(e, "type")) + "/" + e.type,
        e
    }
    function w(e) {
        var t = Ve.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
        e
    }
    function x(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++)
            oe._data(n, "globalEval", !t || oe._data(t[i], "globalEval"))
    }
    function T(e, t) {
        if (1 === t.nodeType && oe.hasData(e)) {
            var n, i, o, r = oe._data(e), a = oe._data(t, r), s = r.events;
            if (s) {
                delete a.handle,
                a.events = {};
                for (n in s)
                    for (i = 0,
                    o = s[n].length; o > i; i++)
                        oe.event.add(t, n, s[n][i])
            }
            a.data && (a.data = oe.extend({}, a.data))
        }
    }
    function C(e, t) {
        var n, i, o;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(),
            !ne.noCloneEvent && t[oe.expando]) {
                o = oe._data(t);
                for (i in o.events)
                    oe.removeEvent(t, i, o.handle);
                t.removeAttribute(oe.expando)
            }
            "script" === n && t.text !== e.text ? (b(t).text = e.text,
            w(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML),
            ne.html5Clone && e.innerHTML && !oe.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ae.test(e.type) ? (t.defaultChecked = t.checked = e.checked,
            t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }
    function S(t, n) {
        var i, o = oe(n.createElement(t)).appendTo(n.body), r = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(o[0])) ? i.display : oe.css(o[0], "display");
        return o.detach(),
        r
    }
    function E(e) {
        var t = he
          , n = Ze[e];
        return n || (n = S(e, t),
        "none" !== n && n || (Ke = (Ke || oe("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),
        t = (Ke[0].contentWindow || Ke[0].contentDocument).document,
        t.write(),
        t.close(),
        n = S(e, t),
        Ke.detach()),
        Ze[e] = n),
        n
    }
    function k(e, t) {
        return {
            get: function() {
                var n = e();
                if (null != n)
                    return n ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    function N(e, t) {
        if (t in e)
            return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, o = pt.length; o--; )
            if (t = pt[o] + n,
            t in e)
                return t;
        return i
    }
    function D(e, t) {
        for (var n, i, o, r = [], a = 0, s = e.length; s > a; a++)
            i = e[a],
            i.style && (r[a] = oe._data(i, "olddisplay"),
            n = i.style.display,
            t ? (r[a] || "none" !== n || (i.style.display = ""),
            "" === i.style.display && De(i) && (r[a] = oe._data(i, "olddisplay", E(i.nodeName)))) : (o = De(i),
            (n && "none" !== n || !o) && oe._data(i, "olddisplay", o ? n : oe.css(i, "display"))));
        for (a = 0; s > a; a++)
            i = e[a],
            i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? r[a] || "" : "none"));
        return e
    }
    function $(e, t, n) {
        var i = lt.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }
    function A(e, t, n, i, o) {
        for (var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > r; r += 2)
            "margin" === n && (a += oe.css(e, n + Ne[r], !0, o)),
            i ? ("content" === n && (a -= oe.css(e, "padding" + Ne[r], !0, o)),
            "margin" !== n && (a -= oe.css(e, "border" + Ne[r] + "Width", !0, o))) : (a += oe.css(e, "padding" + Ne[r], !0, o),
            "padding" !== n && (a += oe.css(e, "border" + Ne[r] + "Width", !0, o)));
        return a
    }
    function _(e, t, n) {
        var i = !0
          , o = "width" === t ? e.offsetWidth : e.offsetHeight
          , r = et(e)
          , a = ne.boxSizing && "border-box" === oe.css(e, "boxSizing", !1, r);
        if (0 >= o || null == o) {
            if (o = tt(e, t, r),
            (0 > o || null == o) && (o = e.style[t]),
            it.test(o))
                return o;
            i = a && (ne.boxSizingReliable() || o === e.style[t]),
            o = parseFloat(o) || 0
        }
        return o + A(e, t, n || (a ? "border" : "content"), i, r) + "px"
    }
    function j(e, t, n, i, o) {
        return new j.prototype.init(e,t,n,i,o)
    }
    function L() {
        return setTimeout(function() {
            ft = void 0
        }),
        ft = oe.now()
    }
    function O(e, t) {
        var n, i = {
            height: e
        }, o = 0;
        for (t = t ? 1 : 0; 4 > o; o += 2 - t)
            n = Ne[o],
            i["margin" + n] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function I(e, t, n) {
        for (var i, o = (bt[t] || []).concat(bt["*"]), r = 0, a = o.length; a > r; r++)
            if (i = o[r].call(n, t, e))
                return i
    }
    function H(e, t, n) {
        var i, o, r, a, s, l, c, u, d = this, p = {}, f = e.style, h = e.nodeType && De(e), g = oe._data(e, "fxshow");
        n.queue || (s = oe._queueHooks(e, "fx"),
        null == s.unqueued && (s.unqueued = 0,
        l = s.empty.fire,
        s.empty.fire = function() {
            s.unqueued || l()
        }
        ),
        s.unqueued++,
        d.always(function() {
            d.always(function() {
                s.unqueued--,
                oe.queue(e, "fx").length || s.empty.fire()
            })
        })),
        1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
        c = oe.css(e, "display"),
        u = "none" === c ? oe._data(e, "olddisplay") || E(e.nodeName) : c,
        "inline" === u && "none" === oe.css(e, "float") && (ne.inlineBlockNeedsLayout && "inline" !== E(e.nodeName) ? f.zoom = 1 : f.display = "inline-block")),
        n.overflow && (f.overflow = "hidden",
        ne.shrinkWrapBlocks() || d.always(function() {
            f.overflow = n.overflow[0],
            f.overflowX = n.overflow[1],
            f.overflowY = n.overflow[2]
        }));
        for (i in t)
            if (o = t[i],
            gt.exec(o)) {
                if (delete t[i],
                r = r || "toggle" === o,
                o === (h ? "hide" : "show")) {
                    if ("show" !== o || !g || void 0 === g[i])
                        continue;
                    h = !0
                }
                p[i] = g && g[i] || oe.style(e, i)
            } else
                c = void 0;
        if (oe.isEmptyObject(p))
            "inline" === ("none" === c ? E(e.nodeName) : c) && (f.display = c);
        else {
            g ? "hidden"in g && (h = g.hidden) : g = oe._data(e, "fxshow", {}),
            r && (g.hidden = !h),
            h ? oe(e).show() : d.done(function() {
                oe(e).hide()
            }),
            d.done(function() {
                var t;
                oe._removeData(e, "fxshow");
                for (t in p)
                    oe.style(e, t, p[t])
            });
            for (i in p)
                a = I(h ? g[i] : 0, i, d),
                i in g || (g[i] = a.start,
                h && (a.end = a.start,
                a.start = "width" === i || "height" === i ? 1 : 0))
        }
    }
    function R(e, t) {
        var n, i, o, r, a;
        for (n in e)
            if (i = oe.camelCase(n),
            o = t[i],
            r = e[n],
            oe.isArray(r) && (o = r[1],
            r = e[n] = r[0]),
            n !== i && (e[i] = r,
            delete e[n]),
            a = oe.cssHooks[i],
            a && "expand"in a) {
                r = a.expand(r),
                delete e[i];
                for (n in r)
                    n in e || (e[n] = r[n],
                    t[n] = o)
            } else
                t[i] = o
    }
    function q(e, t, n) {
        var i, o, r = 0, a = yt.length, s = oe.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (o)
                return !1;
            for (var t = ft || L(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, r = 1 - i, a = 0, l = c.tweens.length; l > a; a++)
                c.tweens[a].run(r);
            return s.notifyWith(e, [c, r, n]),
            1 > r && l ? n : (s.resolveWith(e, [c]),
            !1)
        }, c = s.promise({
            elem: e,
            props: oe.extend({}, t),
            opts: oe.extend(!0, {
                specialEasing: {}
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: ft || L(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var i = oe.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                return c.tweens.push(i),
                i
            },
            stop: function(t) {
                var n = 0
                  , i = t ? c.tweens.length : 0;
                if (o)
                    return this;
                for (o = !0; i > n; n++)
                    c.tweens[n].run(1);
                return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]),
                this
            }
        }), u = c.props;
        for (R(u, c.opts.specialEasing); a > r; r++)
            if (i = yt[r].call(c, e, u, c.opts))
                return i;
        return oe.map(u, I, c),
        oe.isFunction(c.opts.start) && c.opts.start.call(e, c),
        oe.fx.timer(oe.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })),
        c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }
    function P(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
            t = "*");
            var i, o = 0, r = t.toLowerCase().match(be) || [];
            if (oe.isFunction(n))
                for (; i = r[o++]; )
                    "+" === i.charAt(0) ? (i = i.slice(1) || "*",
                    (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }
    function M(e, t, n, i) {
        function o(s) {
            var l;
            return r[s] = !0,
            oe.each(e[s] || [], function(e, s) {
                var c = s(t, n, i);
                return "string" != typeof c || a || r[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c),
                o(c),
                !1)
            }),
            l
        }
        var r = {}
          , a = e === Wt;
        return o(t.dataTypes[0]) || !r["*"] && o("*")
    }
    function F(e, t) {
        var n, i, o = oe.ajaxSettings.flatOptions || {};
        for (i in t)
            void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
        return n && oe.extend(!0, e, n),
        e
    }
    function B(e, t, n) {
        for (var i, o, r, a, s = e.contents, l = e.dataTypes; "*" === l[0]; )
            l.shift(),
            void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
        if (o)
            for (a in s)
                if (s[a] && s[a].test(o)) {
                    l.unshift(a);
                    break
                }
        if (l[0]in n)
            r = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    r = a;
                    break
                }
                i || (i = a)
            }
            r = r || i
        }
        return r ? (r !== l[0] && l.unshift(r),
        n[r]) : void 0
    }
    function W(e, t, n, i) {
        var o, r, a, s, l, c = {}, u = e.dataTypes.slice();
        if (u[1])
            for (a in e.converters)
                c[a.toLowerCase()] = e.converters[a];
        for (r = u.shift(); r; )
            if (e.responseFields[r] && (n[e.responseFields[r]] = t),
            !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
            l = r,
            r = u.shift())
                if ("*" === r)
                    r = l;
                else if ("*" !== l && l !== r) {
                    if (a = c[l + " " + r] || c["* " + r],
                    !a)
                        for (o in c)
                            if (s = o.split(" "),
                            s[1] === r && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
                                a === !0 ? a = c[o] : c[o] !== !0 && (r = s[0],
                                u.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"])
                            t = a(t);
                        else
                            try {
                                t = a(t)
                            } catch (d) {
                                return {
                                    state: "parsererror",
                                    error: a ? d : "No conversion from " + l + " to " + r
                                }
                            }
                }
        return {
            state: "success",
            data: t
        }
    }
    function z(e, t, n, i) {
        var o;
        if (oe.isArray(t))
            oe.each(t, function(t, o) {
                n || Vt.test(e) ? i(e, o) : z(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, i)
            });
        else if (n || "object" !== oe.type(t))
            i(e, t);
        else
            for (o in t)
                z(e + "[" + o + "]", t[o], n, i)
    }
    function U() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }
    function X() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }
    function V(e) {
        return oe.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    var J = []
      , G = J.slice
      , Q = J.concat
      , Y = J.push
      , K = J.indexOf
      , Z = {}
      , ee = Z.toString
      , te = Z.hasOwnProperty
      , ne = {}
      , ie = "1.11.3"
      , oe = function(e, t) {
        return new oe.fn.init(e,t)
    }
      , re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , ae = /^-ms-/
      , se = /-([\da-z])/gi
      , le = function(e, t) {
        return t.toUpperCase()
    };
    oe.fn = oe.prototype = {
        jquery: ie,
        constructor: oe,
        selector: "",
        length: 0,
        toArray: function() {
            return G.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : G.call(this)
        },
        pushStack: function(e) {
            var t = oe.merge(this.constructor(), e);
            return t.prevObject = this,
            t.context = this.context,
            t
        },
        each: function(e, t) {
            return oe.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(oe.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(G.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null )
        },
        push: Y,
        sort: J.sort,
        splice: J.splice
    },
    oe.extend = oe.fn.extend = function() {
        var e, t, n, i, o, r, a = arguments[0] || {}, s = 1, l = arguments.length, c = !1;
        for ("boolean" == typeof a && (c = a,
        a = arguments[s] || {},
        s++),
        "object" == typeof a || oe.isFunction(a) || (a = {}),
        s === l && (a = this,
        s--); l > s; s++)
            if (null != (o = arguments[s]))
                for (i in o)
                    e = a[i],
                    n = o[i],
                    a !== n && (c && n && (oe.isPlainObject(n) || (t = oe.isArray(n))) ? (t ? (t = !1,
                    r = e && oe.isArray(e) ? e : []) : r = e && oe.isPlainObject(e) ? e : {},
                    a[i] = oe.extend(c, r, n)) : void 0 !== n && (a[i] = n));
        return a
    }
    ,
    oe.extend({
        expando: "jQuery" + (ie + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === oe.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === oe.type(e)
        }
        ,
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !oe.isArray(e) && e - parseFloat(e) + 1 >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== oe.type(e) || e.nodeType || oe.isWindow(e))
                return !1;
            try {
                if (e.constructor && !te.call(e, "constructor") && !te.call(e.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (n) {
                return !1
            }
            if (ne.ownLast)
                for (t in e)
                    return te.call(e, t);
            for (t in e)
                ;
            return void 0 === t || te.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Z[ee.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && oe.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            }
            )(t)
        },
        camelCase: function(e) {
            return e.replace(ae, "ms-").replace(se, le)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, i) {
            var o, r = 0, a = e.length, s = n(e);
            if (i) {
                if (s)
                    for (; a > r && (o = t.apply(e[r], i),
                    o !== !1); r++)
                        ;
                else
                    for (r in e)
                        if (o = t.apply(e[r], i),
                        o === !1)
                            break
            } else if (s)
                for (; a > r && (o = t.call(e[r], r, e[r]),
                o !== !1); r++)
                    ;
            else
                for (r in e)
                    if (o = t.call(e[r], r, e[r]),
                    o === !1)
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(re, "")
        },
        makeArray: function(e, t) {
            var i = t || [];
            return null != e && (n(Object(e)) ? oe.merge(i, "string" == typeof e ? [e] : e) : Y.call(i, e)),
            i
        },
        inArray: function(e, t, n) {
            var i;
            if (t) {
                if (K)
                    return K.call(t, e, n);
                for (i = t.length,
                n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
                    if (n in t && t[n] === e)
                        return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, o = e.length; n > i; )
                e[o++] = t[i++];
            if (n !== n)
                for (; void 0 !== t[i]; )
                    e[o++] = t[i++];
            return e.length = o,
            e
        },
        grep: function(e, t, n) {
            for (var i, o = [], r = 0, a = e.length, s = !n; a > r; r++)
                i = !t(e[r], r),
                i !== s && o.push(e[r]);
            return o
        },
        map: function(e, t, i) {
            var o, r = 0, a = e.length, s = n(e), l = [];
            if (s)
                for (; a > r; r++)
                    o = t(e[r], r, i),
                    null != o && l.push(o);
            else
                for (r in e)
                    o = t(e[r], r, i),
                    null != o && l.push(o);
            return Q.apply([], l)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, i, o;
            return "string" == typeof t && (o = e[t],
            t = e,
            e = o),
            oe.isFunction(e) ? (n = G.call(arguments, 2),
            i = function() {
                return e.apply(t || this, n.concat(G.call(arguments)))
            }
            ,
            i.guid = e.guid = e.guid || oe.guid++,
            i) : void 0
        },
        now: function() {
            return +new Date
        },
        support: ne
    }),
    oe.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        Z["[object " + t + "]"] = t.toLowerCase()
    });
    var ce = function(e) {
        function t(e, t, n, i) {
            var o, r, a, s, l, c, d, f, h, g;
            if ((t ? t.ownerDocument || t : M) !== j && _(t),
            t = t || j,
            n = n || [],
            s = t.nodeType,
            "string" != typeof e || !e || 1 !== s && 9 !== s && 11 !== s)
                return n;
            if (!i && O) {
                if (11 !== s && (o = ye.exec(e)))
                    if (a = o[1]) {
                        if (9 === s) {
                            if (r = t.getElementById(a),
                            !r || !r.parentNode)
                                return n;
                            if (r.id === a)
                                return n.push(r),
                                n
                        } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(a)) && q(t, r) && r.id === a)
                            return n.push(r),
                            n
                    } else {
                        if (o[2])
                            return K.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((a = o[3]) && x.getElementsByClassName)
                            return K.apply(n, t.getElementsByClassName(a)),
                            n
                    }
                if (x.qsa && (!I || !I.test(e))) {
                    if (f = d = P,
                    h = t,
                    g = 1 !== s && e,
                    1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (c = E(e),
                        (d = t.getAttribute("id")) ? f = d.replace(we, "\\$&") : t.setAttribute("id", f),
                        f = "[id='" + f + "'] ",
                        l = c.length; l--; )
                            c[l] = f + p(c[l]);
                        h = be.test(e) && u(t.parentNode) || t,
                        g = c.join(",")
                    }
                    if (g)
                        try {
                            return K.apply(n, h.querySelectorAll(g)),
                            n
                        } catch (m) {} finally {
                            d || t.removeAttribute("id")
                        }
                }
            }
            return N(e.replace(le, "$1"), t, n, i)
        }
        function n() {
            function e(n, i) {
                return t.push(n + " ") > T.cacheLength && delete e[t.shift()],
                e[n + " "] = i
            }
            var t = [];
            return e
        }
        function i(e) {
            return e[P] = !0,
            e
        }
        function o(e) {
            var t = j.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function r(e, t) {
            for (var n = e.split("|"), i = e.length; i--; )
                T.attrHandle[n[i]] = t
        }
        function a(e, t) {
            var n = t && e
              , i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || V) - (~e.sourceIndex || V);
            if (i)
                return i;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function s(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }
        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function c(e) {
            return i(function(t) {
                return t = +t,
                i(function(n, i) {
                    for (var o, r = e([], n.length, t), a = r.length; a--; )
                        n[o = r[a]] && (n[o] = !(i[o] = n[o]))
                })
            })
        }
        function u(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        function d() {}
        function p(e) {
            for (var t = 0, n = e.length, i = ""; n > t; t++)
                i += e[t].value;
            return i
        }
        function f(e, t, n) {
            var i = t.dir
              , o = n && "parentNode" === i
              , r = B++;
            return t.first ? function(t, n, r) {
                for (; t = t[i]; )
                    if (1 === t.nodeType || o)
                        return e(t, n, r)
            }
            : function(t, n, a) {
                var s, l, c = [F, r];
                if (a) {
                    for (; t = t[i]; )
                        if ((1 === t.nodeType || o) && e(t, n, a))
                            return !0
                } else
                    for (; t = t[i]; )
                        if (1 === t.nodeType || o) {
                            if (l = t[P] || (t[P] = {}),
                            (s = l[i]) && s[0] === F && s[1] === r)
                                return c[2] = s[2];
                            if (l[i] = c,
                            c[2] = e(t, n, a))
                                return !0
                        }
            }
        }
        function h(e) {
            return e.length > 1 ? function(t, n, i) {
                for (var o = e.length; o--; )
                    if (!e[o](t, n, i))
                        return !1;
                return !0
            }
            : e[0]
        }
        function g(e, n, i) {
            for (var o = 0, r = n.length; r > o; o++)
                t(e, n[o], i);
            return i
        }
        function m(e, t, n, i, o) {
            for (var r, a = [], s = 0, l = e.length, c = null != t; l > s; s++)
                (r = e[s]) && (!n || n(r, i, o)) && (a.push(r),
                c && t.push(s));
            return a
        }
        function v(e, t, n, o, r, a) {
            return o && !o[P] && (o = v(o)),
            r && !r[P] && (r = v(r, a)),
            i(function(i, a, s, l) {
                var c, u, d, p = [], f = [], h = a.length, v = i || g(t || "*", s.nodeType ? [s] : s, []), y = !e || !i && t ? v : m(v, p, e, s, l), b = n ? r || (i ? e : h || o) ? [] : a : y;
                if (n && n(y, b, s, l),
                o)
                    for (c = m(b, f),
                    o(c, [], s, l),
                    u = c.length; u--; )
                        (d = c[u]) && (b[f[u]] = !(y[f[u]] = d));
                if (i) {
                    if (r || e) {
                        if (r) {
                            for (c = [],
                            u = b.length; u--; )
                                (d = b[u]) && c.push(y[u] = d);
                            r(null , b = [], c, l)
                        }
                        for (u = b.length; u--; )
                            (d = b[u]) && (c = r ? ee(i, d) : p[u]) > -1 && (i[c] = !(a[c] = d))
                    }
                } else
                    b = m(b === a ? b.splice(h, b.length) : b),
                    r ? r(null , a, b, l) : K.apply(a, b)
            })
        }
        function y(e) {
            for (var t, n, i, o = e.length, r = T.relative[e[0].type], a = r || T.relative[" "], s = r ? 1 : 0, l = f(function(e) {
                return e === t
            }, a, !0), c = f(function(e) {
                return ee(t, e) > -1
            }, a, !0), u = [function(e, n, i) {
                var o = !r && (i || n !== D) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i));
                return t = null ,
                o
            }
            ]; o > s; s++)
                if (n = T.relative[e[s].type])
                    u = [f(h(u), n)];
                else {
                    if (n = T.filter[e[s].type].apply(null , e[s].matches),
                    n[P]) {
                        for (i = ++s; o > i && !T.relative[e[i].type]; i++)
                            ;
                        return v(s > 1 && h(u), s > 1 && p(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(le, "$1"), n, i > s && y(e.slice(s, i)), o > i && y(e = e.slice(i)), o > i && p(e))
                    }
                    u.push(n)
                }
            return h(u)
        }
        function b(e, n) {
            var o = n.length > 0
              , r = e.length > 0
              , a = function(i, a, s, l, c) {
                var u, d, p, f = 0, h = "0", g = i && [], v = [], y = D, b = i || r && T.find.TAG("*", c), w = F += null == y ? 1 : Math.random() || .1, x = b.length;
                for (c && (D = a !== j && a); h !== x && null != (u = b[h]); h++) {
                    if (r && u) {
                        for (d = 0; p = e[d++]; )
                            if (p(u, a, s)) {
                                l.push(u);
                                break
                            }
                        c && (F = w)
                    }
                    o && ((u = !p && u) && f--,
                    i && g.push(u))
                }
                if (f += h,
                o && h !== f) {
                    for (d = 0; p = n[d++]; )
                        p(g, v, a, s);
                    if (i) {
                        if (f > 0)
                            for (; h--; )
                                g[h] || v[h] || (v[h] = Q.call(l));
                        v = m(v)
                    }
                    K.apply(l, v),
                    c && !i && v.length > 0 && f + n.length > 1 && t.uniqueSort(l)
                }
                return c && (F = w,
                D = y),
                g
            };
            return o ? i(a) : a
        }
        var w, x, T, C, S, E, k, N, D, $, A, _, j, L, O, I, H, R, q, P = "sizzle" + 1 * new Date, M = e.document, F = 0, B = 0, W = n(), z = n(), U = n(), X = function(e, t) {
            return e === t && (A = !0),
            0
        }, V = 1 << 31, J = {}.hasOwnProperty, G = [], Q = G.pop, Y = G.push, K = G.push, Z = G.slice, ee = function(e, t) {
            for (var n = 0, i = e.length; i > n; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ne = "[\\x20\\t\\r\\n\\f]", ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", oe = ie.replace("w", "w#"), re = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + oe + "))|)" + ne + "*\\]", ae = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + re + ")*)|.*)\\)|)", se = new RegExp(ne + "+","g"), le = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$","g"), ce = new RegExp("^" + ne + "*," + ne + "*"), ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"), de = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]","g"), pe = new RegExp(ae), fe = new RegExp("^" + oe + "$"), he = {
            ID: new RegExp("^#(" + ie + ")"),
            CLASS: new RegExp("^\\.(" + ie + ")"),
            TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + re),
            PSEUDO: new RegExp("^" + ae),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)","i"),
            bool: new RegExp("^(?:" + te + ")$","i"),
            needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)","i")
        }, ge = /^(?:input|select|textarea|button)$/i, me = /^h\d$/i, ve = /^[^{]+\{\s*\[native \w/, ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, be = /[+~]/, we = /'|\\/g, xe = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)","ig"), Te = function(e, t, n) {
            var i = "0x" + t - 65536;
            return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
        }, Ce = function() {
            _()
        };
        try {
            K.apply(G = Z.call(M.childNodes), M.childNodes),
            G[M.childNodes.length].nodeType
        } catch (Se) {
            K = {
                apply: G.length ? function(e, t) {
                    Y.apply(e, Z.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        x = t.support = {},
        S = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }
        ,
        _ = t.setDocument = function(e) {
            var t, n, i = e ? e.ownerDocument || e : M;
            return i !== j && 9 === i.nodeType && i.documentElement ? (j = i,
            L = i.documentElement,
            n = i.defaultView,
            n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", Ce, !1) : n.attachEvent && n.attachEvent("onunload", Ce)),
            O = !S(i),
            x.attributes = o(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            x.getElementsByTagName = o(function(e) {
                return e.appendChild(i.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            x.getElementsByClassName = ve.test(i.getElementsByClassName),
            x.getById = o(function(e) {
                return L.appendChild(e).id = P,
                !i.getElementsByName || !i.getElementsByName(P).length
            }),
            x.getById ? (T.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && O) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }
            ,
            T.filter.ID = function(e) {
                var t = e.replace(xe, Te);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ) : (delete T.find.ID,
            T.filter.ID = function(e) {
                var t = e.replace(xe, Te);
                return function(e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }
            ),
            T.find.TAG = x.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, i = [], o = 0, r = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = r[o++]; )
                        1 === n.nodeType && i.push(n);
                    return i
                }
                return r
            }
            ,
            T.find.CLASS = x.getElementsByClassName && function(e, t) {
                return O ? t.getElementsByClassName(e) : void 0
            }
            ,
            H = [],
            I = [],
            (x.qsa = ve.test(i.querySelectorAll)) && (o(function(e) {
                L.appendChild(e).innerHTML = "<a id='" + P + "'></a><select id='" + P + "-\f]' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && I.push("[*^$]=" + ne + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || I.push("\\[" + ne + "*(?:value|" + te + ")"),
                e.querySelectorAll("[id~=" + P + "-]").length || I.push("~="),
                e.querySelectorAll(":checked").length || I.push(":checked"),
                e.querySelectorAll("a#" + P + "+*").length || I.push(".#.+[+~]")
            }),
            o(function(e) {
                var t = i.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && I.push("name" + ne + "*[*^$|!~]?="),
                e.querySelectorAll(":enabled").length || I.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                I.push(",.*:")
            })),
            (x.matchesSelector = ve.test(R = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && o(function(e) {
                x.disconnectedMatch = R.call(e, "div"),
                R.call(e, "[s!='']:x"),
                H.push("!=", ae)
            }),
            I = I.length && new RegExp(I.join("|")),
            H = H.length && new RegExp(H.join("|")),
            t = ve.test(L.compareDocumentPosition),
            q = t || ve.test(L.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , i = t && t.parentNode;
                return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            X = t ? function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                1 & n || !x.sortDetached && t.compareDocumentPosition(e) === n ? e === i || e.ownerDocument === M && q(M, e) ? -1 : t === i || t.ownerDocument === M && q(M, t) ? 1 : $ ? ee($, e) - ee($, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n, o = 0, r = e.parentNode, s = t.parentNode, l = [e], c = [t];
                if (!r || !s)
                    return e === i ? -1 : t === i ? 1 : r ? -1 : s ? 1 : $ ? ee($, e) - ee($, t) : 0;
                if (r === s)
                    return a(e, t);
                for (n = e; n = n.parentNode; )
                    l.unshift(n);
                for (n = t; n = n.parentNode; )
                    c.unshift(n);
                for (; l[o] === c[o]; )
                    o++;
                return o ? a(l[o], c[o]) : l[o] === M ? -1 : c[o] === M ? 1 : 0
            }
            ,
            i) : j
        }
        ,
        t.matches = function(e, n) {
            return t(e, null , null , n)
        }
        ,
        t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== j && _(e),
            n = n.replace(de, "='$1']"),
            !(!x.matchesSelector || !O || H && H.test(n) || I && I.test(n)))
                try {
                    var i = R.call(e, n);
                    if (i || x.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return i
                } catch (o) {}
            return t(n, j, null , [e]).length > 0
        }
        ,
        t.contains = function(e, t) {
            return (e.ownerDocument || e) !== j && _(e),
            q(e, t)
        }
        ,
        t.attr = function(e, t) {
            (e.ownerDocument || e) !== j && _(e);
            var n = T.attrHandle[t.toLowerCase()]
              , i = n && J.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !O) : void 0;
            return void 0 !== i ? i : x.attributes || !O ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }
        ,
        t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        t.uniqueSort = function(e) {
            var t, n = [], i = 0, o = 0;
            if (A = !x.detectDuplicates,
            $ = !x.sortStable && e.slice(0),
            e.sort(X),
            A) {
                for (; t = e[o++]; )
                    t === e[o] && (i = n.push(o));
                for (; i--; )
                    e.splice(n[i], 1)
            }
            return $ = null ,
            e
        }
        ,
        C = t.getText = function(e) {
            var t, n = "", i = 0, o = e.nodeType;
            if (o) {
                if (1 === o || 9 === o || 11 === o) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += C(e)
                } else if (3 === o || 4 === o)
                    return e.nodeValue
            } else
                for (; t = e[i++]; )
                    n += C(t);
            return n
        }
        ,
        T = t.selectors = {
            cacheLength: 50,
            createPseudo: i,
            match: he,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(xe, Te),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(xe, Te),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(xe, Te).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = W[e + " "];
                    return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && W(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, i) {
                    return function(o) {
                        var r = t.attr(o, e);
                        return null == r ? "!=" === n : !n || (r += "",
                        "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r.replace(se, " ") + " ").indexOf(i) > -1 : "|=" === n && (r === i || r.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(e, t, n, i, o) {
                    var r = "nth" !== e.slice(0, 3)
                      , a = "last" !== e.slice(-4)
                      , s = "of-type" === t;
                    return 1 === i && 0 === o ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, n, l) {
                        var c, u, d, p, f, h, g = r !== a ? "nextSibling" : "previousSibling", m = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !l && !s;
                        if (m) {
                            if (r) {
                                for (; g; ) {
                                    for (d = t; d = d[g]; )
                                        if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType)
                                            return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [a ? m.firstChild : m.lastChild],
                            a && y) {
                                for (u = m[P] || (m[P] = {}),
                                c = u[e] || [],
                                f = c[0] === F && c[1],
                                p = c[0] === F && c[2],
                                d = f && m.childNodes[f]; d = ++f && d && d[g] || (p = f = 0) || h.pop(); )
                                    if (1 === d.nodeType && ++p && d === t) {
                                        u[e] = [F, f, p];
                                        break
                                    }
                            } else if (y && (c = (t[P] || (t[P] = {}))[e]) && c[0] === F)
                                p = c[1];
                            else
                                for (; (d = ++f && d && d[g] || (p = f = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[P] || (d[P] = {}))[e] = [F, p]),
                                d !== t)); )
                                    ;
                            return p -= o,
                            p === i || p % i === 0 && p / i >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var o, r = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return r[P] ? r(n) : r.length > 1 ? (o = [e, e, "", n],
                    T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                        for (var i, o = r(e, n), a = o.length; a--; )
                            i = ee(e, o[a]),
                            e[i] = !(t[i] = o[a])
                    }) : function(e) {
                        return r(e, 0, o)
                    }
                    ) : r
                }
            },
            pseudos: {
                not: i(function(e) {
                    var t = []
                      , n = []
                      , o = k(e.replace(le, "$1"));
                    return o[P] ? i(function(e, t, n, i) {
                        for (var r, a = o(e, null , i, []), s = e.length; s--; )
                            (r = a[s]) && (e[s] = !(t[s] = r))
                    }) : function(e, i, r) {
                        return t[0] = e,
                        o(t, null , r, n),
                        t[0] = null ,
                        !n.pop()
                    }
                }),
                has: i(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: i(function(e) {
                    return e = e.replace(xe, Te),
                    function(t) {
                        return (t.textContent || t.innerText || C(t)).indexOf(e) > -1
                    }
                }),
                lang: i(function(e) {
                    return fe.test(e || "") || t.error("unsupported lang: " + e),
                    e = e.replace(xe, Te).toLowerCase(),
                    function(t) {
                        var n;
                        do
                            if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return n = n.toLowerCase(),
                                n === e || 0 === n.indexOf(e + "-");
                        while ((t = t.parentNode) && 1 === t.nodeType);return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === L
                },
                focus: function(e) {
                    return e === j.activeElement && (!j.hasFocus || j.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !T.pseudos.empty(e)
                },
                header: function(e) {
                    return me.test(e.nodeName)
                },
                input: function(e) {
                    return ge.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function() {
                    return [0]
                }),
                last: c(function(e, t) {
                    return [t - 1]
                }),
                eq: c(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: c(function(e, t) {
                    for (var n = 0; t > n; n += 2)
                        e.push(n);
                    return e
                }),
                odd: c(function(e, t) {
                    for (var n = 1; t > n; n += 2)
                        e.push(n);
                    return e
                }),
                lt: c(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; --i >= 0; )
                        e.push(i);
                    return e
                }),
                gt: c(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; ++i < t; )
                        e.push(i);
                    return e
                })
            }
        },
        T.pseudos.nth = T.pseudos.eq;
        for (w in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            T.pseudos[w] = s(w);
        for (w in {
            submit: !0,
            reset: !0
        })
            T.pseudos[w] = l(w);
        return d.prototype = T.filters = T.pseudos,
        T.setFilters = new d,
        E = t.tokenize = function(e, n) {
            var i, o, r, a, s, l, c, u = z[e + " "];
            if (u)
                return n ? 0 : u.slice(0);
            for (s = e,
            l = [],
            c = T.preFilter; s; ) {
                (!i || (o = ce.exec(s))) && (o && (s = s.slice(o[0].length) || s),
                l.push(r = [])),
                i = !1,
                (o = ue.exec(s)) && (i = o.shift(),
                r.push({
                    value: i,
                    type: o[0].replace(le, " ")
                }),
                s = s.slice(i.length));
                for (a in T.filter)
                    !(o = he[a].exec(s)) || c[a] && !(o = c[a](o)) || (i = o.shift(),
                    r.push({
                        value: i,
                        type: a,
                        matches: o
                    }),
                    s = s.slice(i.length));
                if (!i)
                    break
            }
            return n ? s.length : s ? t.error(e) : z(e, l).slice(0)
        }
        ,
        k = t.compile = function(e, t) {
            var n, i = [], o = [], r = U[e + " "];
            if (!r) {
                for (t || (t = E(e)),
                n = t.length; n--; )
                    r = y(t[n]),
                    r[P] ? i.push(r) : o.push(r);
                r = U(e, b(o, i)),
                r.selector = e
            }
            return r
        }
        ,
        N = t.select = function(e, t, n, i) {
            var o, r, a, s, l, c = "function" == typeof e && e, d = !i && E(e = c.selector || e);
            if (n = n || [],
            1 === d.length) {
                if (r = d[0] = d[0].slice(0),
                r.length > 2 && "ID" === (a = r[0]).type && x.getById && 9 === t.nodeType && O && T.relative[r[1].type]) {
                    if (t = (T.find.ID(a.matches[0].replace(xe, Te), t) || [])[0],
                    !t)
                        return n;
                    c && (t = t.parentNode),
                    e = e.slice(r.shift().value.length)
                }
                for (o = he.needsContext.test(e) ? 0 : r.length; o-- && (a = r[o],
                !T.relative[s = a.type]); )
                    if ((l = T.find[s]) && (i = l(a.matches[0].replace(xe, Te), be.test(r[0].type) && u(t.parentNode) || t))) {
                        if (r.splice(o, 1),
                        e = i.length && p(r),
                        !e)
                            return K.apply(n, i),
                            n;
                        break
                    }
            }
            return (c || k(e, d))(i, t, !O, n, be.test(e) && u(t.parentNode) || t),
            n
        }
        ,
        x.sortStable = P.split("").sort(X).join("") === P,
        x.detectDuplicates = !!A,
        _(),
        x.sortDetached = o(function(e) {
            return 1 & e.compareDocumentPosition(j.createElement("div"))
        }),
        o(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || r("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        x.attributes && o(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || r("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }),
        o(function(e) {
            return null == e.getAttribute("disabled")
        }) || r(te, function(e, t, n) {
            var i;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }),
        t
    }(e);
    oe.find = ce,
    oe.expr = ce.selectors,
    oe.expr[":"] = oe.expr.pseudos,
    oe.unique = ce.uniqueSort,
    oe.text = ce.getText,
    oe.isXMLDoc = ce.isXML,
    oe.contains = ce.contains;
    var ue = oe.expr.match.needsContext
      , de = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
      , pe = /^.[^:#\[\.,]*$/;
    oe.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === i.nodeType ? oe.find.matchesSelector(i, e) ? [i] : [] : oe.find.matches(e, oe.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    oe.fn.extend({
        find: function(e) {
            var t, n = [], i = this, o = i.length;
            if ("string" != typeof e)
                return this.pushStack(oe(e).filter(function() {
                    for (t = 0; o > t; t++)
                        if (oe.contains(i[t], this))
                            return !0
                }));
            for (t = 0; o > t; t++)
                oe.find(e, i[t], n);
            return n = this.pushStack(o > 1 ? oe.unique(n) : n),
            n.selector = this.selector ? this.selector + " " + e : e,
            n
        },
        filter: function(e) {
            return this.pushStack(i(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(i(this, e || [], !0))
        },
        is: function(e) {
            return !!i(this, "string" == typeof e && ue.test(e) ? oe(e) : e || [], !1).length
        }
    });
    var fe, he = e.document, ge = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, me = oe.fn.init = function(e, t) {
        var n, i;
        if (!e)
            return this;
        if ("string" == typeof e) {
            if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null , e, null ] : ge.exec(e),
            !n || !n[1] && t)
                return !t || t.jquery ? (t || fe).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof oe ? t[0] : t,
                oe.merge(this, oe.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : he, !0)),
                de.test(n[1]) && oe.isPlainObject(t))
                    for (n in t)
                        oe.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            if (i = he.getElementById(n[2]),
            i && i.parentNode) {
                if (i.id !== n[2])
                    return fe.find(e);
                this.length = 1,
                this[0] = i
            }
            return this.context = he,
            this.selector = e,
            this
        }
        return e.nodeType ? (this.context = this[0] = e,
        this.length = 1,
        this) : oe.isFunction(e) ? "undefined" != typeof fe.ready ? fe.ready(e) : e(oe) : (void 0 !== e.selector && (this.selector = e.selector,
        this.context = e.context),
        oe.makeArray(e, this))
    }
    ;
    me.prototype = oe.fn,
    fe = oe(he);
    var ve = /^(?:parents|prev(?:Until|All))/
      , ye = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    oe.extend({
        dir: function(e, t, n) {
            for (var i = [], o = e[t]; o && 9 !== o.nodeType && (void 0 === n || 1 !== o.nodeType || !oe(o).is(n)); )
                1 === o.nodeType && i.push(o),
                o = o[t];
            return i
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }),
    oe.fn.extend({
        has: function(e) {
            var t, n = oe(e, this), i = n.length;
            return this.filter(function() {
                for (t = 0; i > t; t++)
                    if (oe.contains(this, n[t]))
                        return !0
            })
        },
        closest: function(e, t) {
            for (var n, i = 0, o = this.length, r = [], a = ue.test(e) || "string" != typeof e ? oe(e, t || this.context) : 0; o > i; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && oe.find.matchesSelector(n, e))) {
                        r.push(n);
                        break
                    }
            return this.pushStack(r.length > 1 ? oe.unique(r) : r)
        },
        index: function(e) {
            return e ? "string" == typeof e ? oe.inArray(this[0], oe(e)) : oe.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(oe.unique(oe.merge(this.get(), oe(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    oe.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return oe.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return oe.dir(e, "parentNode", n)
        },
        next: function(e) {
            return o(e, "nextSibling")
        },
        prev: function(e) {
            return o(e, "previousSibling")
        },
        nextAll: function(e) {
            return oe.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return oe.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return oe.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return oe.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return oe.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return oe.sibling(e.firstChild)
        },
        contents: function(e) {
            return oe.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : oe.merge([], e.childNodes)
        }
    }, function(e, t) {
        oe.fn[e] = function(n, i) {
            var o = oe.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n),
            i && "string" == typeof i && (o = oe.filter(i, o)),
            this.length > 1 && (ye[e] || (o = oe.unique(o)),
            ve.test(e) && (o = o.reverse())),
            this.pushStack(o)
        }
    });
    var be = /\S+/g
      , we = {};
    oe.Callbacks = function(e) {
        e = "string" == typeof e ? we[e] || r(e) : oe.extend({}, e);
        var t, n, i, o, a, s, l = [], c = !e.once && [], u = function(r) {
            for (n = e.memory && r,
            i = !0,
            a = s || 0,
            s = 0,
            o = l.length,
            t = !0; l && o > a; a++)
                if (l[a].apply(r[0], r[1]) === !1 && e.stopOnFalse) {
                    n = !1;
                    break
                }
            t = !1,
            l && (c ? c.length && u(c.shift()) : n ? l = [] : d.disable())
        }, d = {
            add: function() {
                if (l) {
                    var i = l.length;
                    !function r(t) {
                        oe.each(t, function(t, n) {
                            var i = oe.type(n);
                            "function" === i ? e.unique && d.has(n) || l.push(n) : n && n.length && "string" !== i && r(n)
                        })
                    }(arguments),
                    t ? o = l.length : n && (s = i,
                    u(n))
                }
                return this
            },
            remove: function() {
                return l && oe.each(arguments, function(e, n) {
                    for (var i; (i = oe.inArray(n, l, i)) > -1; )
                        l.splice(i, 1),
                        t && (o >= i && o--,
                        a >= i && a--)
                }),
                this
            },
            has: function(e) {
                return e ? oe.inArray(e, l) > -1 : !(!l || !l.length)
            },
            empty: function() {
                return l = [],
                o = 0,
                this
            },
            disable: function() {
                return l = c = n = void 0,
                this
            },
            disabled: function() {
                return !l
            },
            lock: function() {
                return c = void 0,
                n || d.disable(),
                this
            },
            locked: function() {
                return !c
            },
            fireWith: function(e, n) {
                return !l || i && !c || (n = n || [],
                n = [e, n.slice ? n.slice() : n],
                t ? c.push(n) : u(n)),
                this
            },
            fire: function() {
                return d.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!i
            }
        };
        return d
    }
    ,
    oe.extend({
        Deferred: function(e) {
            var t = [["resolve", "done", oe.Callbacks("once memory"), "resolved"], ["reject", "fail", oe.Callbacks("once memory"), "rejected"], ["notify", "progress", oe.Callbacks("memory")]]
              , n = "pending"
              , i = {
                state: function() {
                    return n
                },
                always: function() {
                    return o.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var e = arguments;
                    return oe.Deferred(function(n) {
                        oe.each(t, function(t, r) {
                            var a = oe.isFunction(e[t]) && e[t];
                            o[r[1]](function() {
                                var e = a && a.apply(this, arguments);
                                e && oe.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[r[0] + "With"](this === i ? n.promise() : this, a ? [e] : arguments)
                            })
                        }),
                        e = null
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? oe.extend(e, i) : i
                }
            }
              , o = {};
            return i.pipe = i.then,
            oe.each(t, function(e, r) {
                var a = r[2]
                  , s = r[3];
                i[r[1]] = a.add,
                s && a.add(function() {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock),
                o[r[0]] = function() {
                    return o[r[0] + "With"](this === o ? i : this, arguments),
                    this
                }
                ,
                o[r[0] + "With"] = a.fireWith
            }),
            i.promise(o),
            e && e.call(o, o),
            o
        },
        when: function(e) {
            var t, n, i, o = 0, r = G.call(arguments), a = r.length, s = 1 !== a || e && oe.isFunction(e.promise) ? a : 0, l = 1 === s ? e : oe.Deferred(), c = function(e, n, i) {
                return function(o) {
                    n[e] = this,
                    i[e] = arguments.length > 1 ? G.call(arguments) : o,
                    i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
                }
            };
            if (a > 1)
                for (t = new Array(a),
                n = new Array(a),
                i = new Array(a); a > o; o++)
                    r[o] && oe.isFunction(r[o].promise) ? r[o].promise().done(c(o, i, r)).fail(l.reject).progress(c(o, n, t)) : --s;
            return s || l.resolveWith(i, r),
            l.promise()
        }
    });
    var xe;
    oe.fn.ready = function(e) {
        return oe.ready.promise().done(e),
        this
    }
    ,
    oe.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? oe.readyWait++ : oe.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? !--oe.readyWait : !oe.isReady) {
                if (!he.body)
                    return setTimeout(oe.ready);
                oe.isReady = !0,
                e !== !0 && --oe.readyWait > 0 || (xe.resolveWith(he, [oe]),
                oe.fn.triggerHandler && (oe(he).triggerHandler("ready"),
                oe(he).off("ready")))
            }
        }
    }),
    oe.ready.promise = function(t) {
        if (!xe)
            if (xe = oe.Deferred(),
            "complete" === he.readyState)
                setTimeout(oe.ready);
            else if (he.addEventListener)
                he.addEventListener("DOMContentLoaded", s, !1),
                e.addEventListener("load", s, !1);
            else {
                he.attachEvent("onreadystatechange", s),
                e.attachEvent("onload", s);
                var n = !1;
                try {
                    n = null == e.frameElement && he.documentElement
                } catch (i) {}
                n && n.doScroll && !function o() {
                    if (!oe.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (e) {
                            return setTimeout(o, 50)
                        }
                        a(),
                        oe.ready()
                    }
                }()
            }
        return xe.promise(t)
    }
    ;
    var Te, Ce = "undefined";
    for (Te in oe(ne))
        break;
    ne.ownLast = "0" !== Te,
    ne.inlineBlockNeedsLayout = !1,
    oe(function() {
        var e, t, n, i;
        n = he.getElementsByTagName("body")[0],
        n && n.style && (t = he.createElement("div"),
        i = he.createElement("div"),
        i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
        n.appendChild(i).appendChild(t),
        typeof t.style.zoom !== Ce && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
        ne.inlineBlockNeedsLayout = e = 3 === t.offsetWidth,
        e && (n.style.zoom = 1)),
        n.removeChild(i))
    }),
    function() {
        var e = he.createElement("div");
        if (null == ne.deleteExpando) {
            ne.deleteExpando = !0;
            try {
                delete e.test
            } catch (t) {
                ne.deleteExpando = !1
            }
        }
        e = null
    }(),
    oe.acceptData = function(e) {
        var t = oe.noData[(e.nodeName + " ").toLowerCase()]
          , n = +e.nodeType || 1;
        return (1 === n || 9 === n) && (!t || t !== !0 && e.getAttribute("classid") === t)
    }
    ;
    var Se = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Ee = /([A-Z])/g;
    oe.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? oe.cache[e[oe.expando]] : e[oe.expando],
            !!e && !c(e)
        },
        data: function(e, t, n) {
            return u(e, t, n)
        },
        removeData: function(e, t) {
            return d(e, t)
        },
        _data: function(e, t, n) {
            return u(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return d(e, t, !0)
        }
    }),
    oe.fn.extend({
        data: function(e, t) {
            var n, i, o, r = this[0], a = r && r.attributes;
            if (void 0 === e) {
                if (this.length && (o = oe.data(r),
                1 === r.nodeType && !oe._data(r, "parsedAttrs"))) {
                    for (n = a.length; n--; )
                        a[n] && (i = a[n].name,
                        0 === i.indexOf("data-") && (i = oe.camelCase(i.slice(5)),
                        l(r, i, o[i])));
                    oe._data(r, "parsedAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each(function() {
                oe.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                oe.data(this, e, t)
            }) : r ? l(r, e, oe.data(r, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                oe.removeData(this, e)
            })
        }
    }),
    oe.extend({
        queue: function(e, t, n) {
            var i;
            return e ? (t = (t || "fx") + "queue",
            i = oe._data(e, t),
            n && (!i || oe.isArray(n) ? i = oe._data(e, t, oe.makeArray(n)) : i.push(n)),
            i || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = oe.queue(e, t)
              , i = n.length
              , o = n.shift()
              , r = oe._queueHooks(e, t)
              , a = function() {
                oe.dequeue(e, t)
            };
            "inprogress" === o && (o = n.shift(),
            i--),
            o && ("fx" === t && n.unshift("inprogress"),
            delete r.stop,
            o.call(e, a, r)),
            !i && r && r.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return oe._data(e, n) || oe._data(e, n, {
                empty: oe.Callbacks("once memory").add(function() {
                    oe._removeData(e, t + "queue"),
                    oe._removeData(e, n)
                })
            })
        }
    }),
    oe.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            n--),
            arguments.length < n ? oe.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = oe.queue(this, e, t);
                oe._queueHooks(this, e),
                "fx" === e && "inprogress" !== n[0] && oe.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                oe.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1, o = oe.Deferred(), r = this, a = this.length, s = function() {
                --i || o.resolveWith(r, [r])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; a--; )
                n = oe._data(r[a], e + "queueHooks"),
                n && n.empty && (i++,
                n.empty.add(s));
            return s(),
            o.promise(t)
        }
    });
    var ke = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Ne = ["Top", "Right", "Bottom", "Left"]
      , De = function(e, t) {
        return e = t || e,
        "none" === oe.css(e, "display") || !oe.contains(e.ownerDocument, e)
    }
      , $e = oe.access = function(e, t, n, i, o, r, a) {
        var s = 0
          , l = e.length
          , c = null == n;
        if ("object" === oe.type(n)) {
            o = !0;
            for (s in n)
                oe.access(e, t, s, n[s], !0, r, a)
        } else if (void 0 !== i && (o = !0,
        oe.isFunction(i) || (a = !0),
        c && (a ? (t.call(e, i),
        t = null ) : (c = t,
        t = function(e, t, n) {
            return c.call(oe(e), n)
        }
        )),
        t))
            for (; l > s; s++)
                t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)));
        return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
    }
      , Ae = /^(?:checkbox|radio)$/i;
    !function() {
        var e = he.createElement("input")
          , t = he.createElement("div")
          , n = he.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        ne.leadingWhitespace = 3 === t.firstChild.nodeType,
        ne.tbody = !t.getElementsByTagName("tbody").length,
        ne.htmlSerialize = !!t.getElementsByTagName("link").length,
        ne.html5Clone = "<:nav></:nav>" !== he.createElement("nav").cloneNode(!0).outerHTML,
        e.type = "checkbox",
        e.checked = !0,
        n.appendChild(e),
        ne.appendChecked = e.checked,
        t.innerHTML = "<textarea>x</textarea>",
        ne.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue,
        n.appendChild(t),
        t.innerHTML = "<input type='radio' checked='checked' name='t'/>",
        ne.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
        ne.noCloneEvent = !0,
        t.attachEvent && (t.attachEvent("onclick", function() {
            ne.noCloneEvent = !1
        }),
        t.cloneNode(!0).click()),
        null == ne.deleteExpando) {
            ne.deleteExpando = !0;
            try {
                delete t.test
            } catch (i) {
                ne.deleteExpando = !1
            }
        }
    }(),
    function() {
        var t, n, i = he.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            n = "on" + t,
            (ne[t + "Bubbles"] = n in e) || (i.setAttribute(n, "t"),
            ne[t + "Bubbles"] = i.attributes[n].expando === !1);
        i = null
    }();
    var _e = /^(?:input|select|textarea)$/i
      , je = /^key/
      , Le = /^(?:mouse|pointer|contextmenu)|click/
      , Oe = /^(?:focusinfocus|focusoutblur)$/
      , Ie = /^([^.]*)(?:\.(.+)|)$/;
    oe.event = {
        global: {},
        add: function(e, t, n, i, o) {
            var r, a, s, l, c, u, d, p, f, h, g, m = oe._data(e);
            if (m) {
                for (n.handler && (l = n,
                n = l.handler,
                o = l.selector),
                n.guid || (n.guid = oe.guid++),
                (a = m.events) || (a = m.events = {}),
                (u = m.handle) || (u = m.handle = function(e) {
                    return typeof oe === Ce || e && oe.event.triggered === e.type ? void 0 : oe.event.dispatch.apply(u.elem, arguments)
                }
                ,
                u.elem = e),
                t = (t || "").match(be) || [""],
                s = t.length; s--; )
                    r = Ie.exec(t[s]) || [],
                    f = g = r[1],
                    h = (r[2] || "").split(".").sort(),
                    f && (c = oe.event.special[f] || {},
                    f = (o ? c.delegateType : c.bindType) || f,
                    c = oe.event.special[f] || {},
                    d = oe.extend({
                        type: f,
                        origType: g,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && oe.expr.match.needsContext.test(o),
                        namespace: h.join(".")
                    }, l),
                    (p = a[f]) || (p = a[f] = [],
                    p.delegateCount = 0,
                    c.setup && c.setup.call(e, i, h, u) !== !1 || (e.addEventListener ? e.addEventListener(f, u, !1) : e.attachEvent && e.attachEvent("on" + f, u))),
                    c.add && (c.add.call(e, d),
                    d.handler.guid || (d.handler.guid = n.guid)),
                    o ? p.splice(p.delegateCount++, 0, d) : p.push(d),
                    oe.event.global[f] = !0);
                e = null
            }
        },
        remove: function(e, t, n, i, o) {
            var r, a, s, l, c, u, d, p, f, h, g, m = oe.hasData(e) && oe._data(e);
            if (m && (u = m.events)) {
                for (t = (t || "").match(be) || [""],
                c = t.length; c--; )
                    if (s = Ie.exec(t[c]) || [],
                    f = g = s[1],
                    h = (s[2] || "").split(".").sort(),
                    f) {
                        for (d = oe.event.special[f] || {},
                        f = (i ? d.delegateType : d.bindType) || f,
                        p = u[f] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        l = r = p.length; r--; )
                            a = p[r],
                            !o && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (p.splice(r, 1),
                            a.selector && p.delegateCount--,
                            d.remove && d.remove.call(e, a));
                        l && !p.length && (d.teardown && d.teardown.call(e, h, m.handle) !== !1 || oe.removeEvent(e, f, m.handle),
                        delete u[f])
                    } else
                        for (f in u)
                            oe.event.remove(e, f + t[c], n, i, !0);
                oe.isEmptyObject(u) && (delete m.handle,
                oe._removeData(e, "events"))
            }
        },
        trigger: function(t, n, i, o) {
            var r, a, s, l, c, u, d, p = [i || he], f = te.call(t, "type") ? t.type : t, h = te.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = u = i = i || he,
            3 !== i.nodeType && 8 !== i.nodeType && !Oe.test(f + oe.event.triggered) && (f.indexOf(".") >= 0 && (h = f.split("."),
            f = h.shift(),
            h.sort()),
            a = f.indexOf(":") < 0 && "on" + f,
            t = t[oe.expando] ? t : new oe.Event(f,"object" == typeof t && t),
            t.isTrigger = o ? 2 : 3,
            t.namespace = h.join("."),
            t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null ,
            t.result = void 0,
            t.target || (t.target = i),
            n = null == n ? [t] : oe.makeArray(n, [t]),
            c = oe.event.special[f] || {},
            o || !c.trigger || c.trigger.apply(i, n) !== !1)) {
                if (!o && !c.noBubble && !oe.isWindow(i)) {
                    for (l = c.delegateType || f,
                    Oe.test(l + f) || (s = s.parentNode); s; s = s.parentNode)
                        p.push(s),
                        u = s;
                    u === (i.ownerDocument || he) && p.push(u.defaultView || u.parentWindow || e)
                }
                for (d = 0; (s = p[d++]) && !t.isPropagationStopped(); )
                    t.type = d > 1 ? l : c.bindType || f,
                    r = (oe._data(s, "events") || {})[t.type] && oe._data(s, "handle"),
                    r && r.apply(s, n),
                    r = a && s[a],
                    r && r.apply && oe.acceptData(s) && (t.result = r.apply(s, n),
                    t.result === !1 && t.preventDefault());
                if (t.type = f,
                !o && !t.isDefaultPrevented() && (!c._default || c._default.apply(p.pop(), n) === !1) && oe.acceptData(i) && a && i[f] && !oe.isWindow(i)) {
                    u = i[a],
                    u && (i[a] = null ),
                    oe.event.triggered = f;
                    try {
                        i[f]()
                    } catch (g) {}
                    oe.event.triggered = void 0,
                    u && (i[a] = u)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = oe.event.fix(e);
            var t, n, i, o, r, a = [], s = G.call(arguments), l = (oe._data(this, "events") || {})[e.type] || [], c = oe.event.special[e.type] || {};
            if (s[0] = e,
            e.delegateTarget = this,
            !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (a = oe.event.handlers.call(this, e, l),
                t = 0; (o = a[t++]) && !e.isPropagationStopped(); )
                    for (e.currentTarget = o.elem,
                    r = 0; (i = o.handlers[r++]) && !e.isImmediatePropagationStopped(); )
                        (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i,
                        e.data = i.data,
                        n = ((oe.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, s),
                        void 0 !== n && (e.result = n) === !1 && (e.preventDefault(),
                        e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e),
                e.result
            }
        },
        handlers: function(e, t) {
            var n, i, o, r, a = [], s = t.delegateCount, l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (o = [],
                        r = 0; s > r; r++)
                            i = t[r],
                            n = i.selector + " ",
                            void 0 === o[n] && (o[n] = i.needsContext ? oe(n, this).index(l) >= 0 : oe.find(n, this, null , [l]).length),
                            o[n] && o.push(i);
                        o.length && a.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }),
            a
        },
        fix: function(e) {
            if (e[oe.expando])
                return e;
            var t, n, i, o = e.type, r = e, a = this.fixHooks[o];
            for (a || (this.fixHooks[o] = a = Le.test(o) ? this.mouseHooks : je.test(o) ? this.keyHooks : {}),
            i = a.props ? this.props.concat(a.props) : this.props,
            e = new oe.Event(r),
            t = i.length; t--; )
                n = i[t],
                e[n] = r[n];
            return e.target || (e.target = r.srcElement || he),
            3 === e.target.nodeType && (e.target = e.target.parentNode),
            e.metaKey = !!e.metaKey,
            a.filter ? a.filter(e, r) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, i, o, r = t.button, a = t.fromElement;
                return null == e.pageX && null != t.clientX && (i = e.target.ownerDocument || he,
                o = i.documentElement,
                n = i.body,
                e.pageX = t.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0),
                e.pageY = t.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)),
                !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a),
                e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0),
                e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== h() && this.focus)
                        try {
                            return this.focus(),
                            !1
                        } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === h() && this.blur ? (this.blur(),
                    !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return oe.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                    !1) : void 0
                },
                _default: function(e) {
                    return oe.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, i) {
            var o = oe.extend(new oe.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? oe.event.trigger(o, null , t) : oe.event.dispatch.call(t, o),
            o.isDefaultPrevented() && n.preventDefault()
        }
    },
    oe.removeEvent = he.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }
    : function(e, t, n) {
        var i = "on" + t;
        e.detachEvent && (typeof e[i] === Ce && (e[i] = null ),
        e.detachEvent(i, n))
    }
    ,
    oe.Event = function(e, t) {
        return this instanceof oe.Event ? (e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : f) : this.type = e,
        t && oe.extend(this, t),
        this.timeStamp = e && e.timeStamp || oe.now(),
        void (this[oe.expando] = !0)) : new oe.Event(e,t)
    }
    ,
    oe.Event.prototype = {
        isDefaultPrevented: f,
        isPropagationStopped: f,
        isImmediatePropagationStopped: f,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = p,
            e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = p,
            e && (e.stopPropagation && e.stopPropagation(),
            e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = p,
            e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    oe.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        oe.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = this, o = e.relatedTarget, r = e.handleObj;
                return (!o || o !== i && !oe.contains(i, o)) && (e.type = r.origType,
                n = r.handler.apply(this, arguments),
                e.type = t),
                n
            }
        }
    }),
    ne.submitBubbles || (oe.event.special.submit = {
        setup: function() {
            return !oe.nodeName(this, "form") && void oe.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target
                  , n = oe.nodeName(t, "input") || oe.nodeName(t, "button") ? t.form : void 0;
                n && !oe._data(n, "submitBubbles") && (oe.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }),
                oe._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble,
            this.parentNode && !e.isTrigger && oe.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return !oe.nodeName(this, "form") && void oe.event.remove(this, "._submit")
        }
    }),
    ne.changeBubbles || (oe.event.special.change = {
        setup: function() {
            return _e.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (oe.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }),
            oe.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1),
                oe.event.simulate("change", this, e, !0)
            })),
            !1) : void oe.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                _e.test(t.nodeName) && !oe._data(t, "changeBubbles") && (oe.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || oe.event.simulate("change", this.parentNode, e, !0)
                }),
                oe._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return oe.event.remove(this, "._change"),
            !_e.test(this.nodeName)
        }
    }),
    ne.focusinBubbles || oe.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            oe.event.simulate(t, e.target, oe.event.fix(e), !0)
        };
        oe.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this
                  , o = oe._data(i, t);
                o || i.addEventListener(e, n, !0),
                oe._data(i, t, (o || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this
                  , o = oe._data(i, t) - 1;
                o ? oe._data(i, t, o) : (i.removeEventListener(e, n, !0),
                oe._removeData(i, t))
            }
        }
    }),
    oe.fn.extend({
        on: function(e, t, n, i, o) {
            var r, a;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t,
                t = void 0);
                for (r in e)
                    this.on(r, t, n, e[r], o);
                return this
            }
            if (null == n && null == i ? (i = t,
            n = t = void 0) : null == i && ("string" == typeof t ? (i = n,
            n = void 0) : (i = n,
            n = t,
            t = void 0)),
            i === !1)
                i = f;
            else if (!i)
                return this;
            return 1 === o && (a = i,
            i = function(e) {
                return oe().off(e),
                a.apply(this, arguments)
            }
            ,
            i.guid = a.guid || (a.guid = oe.guid++)),
            this.each(function() {
                oe.event.add(this, e, i, n, t)
            })
        },
        one: function(e, t, n, i) {
            return this.on(e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, o;
            if (e && e.preventDefault && e.handleObj)
                return i = e.handleObj,
                oe(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler),
                this;
            if ("object" == typeof e) {
                for (o in e)
                    this.off(o, t, e[o]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t,
            t = void 0),
            n === !1 && (n = f),
            this.each(function() {
                oe.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                oe.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? oe.event.trigger(e, t, n, !0) : void 0
        }
    });
    var He = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
      , Re = / jQuery\d+="(?:null|\d+)"/g
      , qe = new RegExp("<(?:" + He + ")[\\s/>]","i")
      , Pe = /^\s+/
      , Me = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
      , Fe = /<([\w:]+)/
      , Be = /<tbody/i
      , We = /<|&#?\w+;/
      , ze = /<(?:script|style|link)/i
      , Ue = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Xe = /^$|\/(?:java|ecma)script/i
      , Ve = /^true\/(.*)/
      , Je = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , Ge = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: ne.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }
      , Qe = g(he)
      , Ye = Qe.appendChild(he.createElement("div"));
    Ge.optgroup = Ge.option,
    Ge.tbody = Ge.tfoot = Ge.colgroup = Ge.caption = Ge.thead,
    Ge.th = Ge.td,
    oe.extend({
        clone: function(e, t, n) {
            var i, o, r, a, s, l = oe.contains(e.ownerDocument, e);
            if (ne.html5Clone || oe.isXMLDoc(e) || !qe.test("<" + e.nodeName + ">") ? r = e.cloneNode(!0) : (Ye.innerHTML = e.outerHTML,
            Ye.removeChild(r = Ye.firstChild)),
            !(ne.noCloneEvent && ne.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || oe.isXMLDoc(e)))
                for (i = m(r),
                s = m(e),
                a = 0; null != (o = s[a]); ++a)
                    i[a] && C(o, i[a]);
            if (t)
                if (n)
                    for (s = s || m(e),
                    i = i || m(r),
                    a = 0; null != (o = s[a]); a++)
                        T(o, i[a]);
                else
                    T(e, r);
            return i = m(r, "script"),
            i.length > 0 && x(i, !l && m(e, "script")),
            i = s = o = null ,
            r
        },
        buildFragment: function(e, t, n, i) {
            for (var o, r, a, s, l, c, u, d = e.length, p = g(t), f = [], h = 0; d > h; h++)
                if (r = e[h],
                r || 0 === r)
                    if ("object" === oe.type(r))
                        oe.merge(f, r.nodeType ? [r] : r);
                    else if (We.test(r)) {
                        for (s = s || p.appendChild(t.createElement("div")),
                        l = (Fe.exec(r) || ["", ""])[1].toLowerCase(),
                        u = Ge[l] || Ge._default,
                        s.innerHTML = u[1] + r.replace(Me, "<$1></$2>") + u[2],
                        o = u[0]; o--; )
                            s = s.lastChild;
                        if (!ne.leadingWhitespace && Pe.test(r) && f.push(t.createTextNode(Pe.exec(r)[0])),
                        !ne.tbody)
                            for (r = "table" !== l || Be.test(r) ? "<table>" !== u[1] || Be.test(r) ? 0 : s : s.firstChild,
                            o = r && r.childNodes.length; o--; )
                                oe.nodeName(c = r.childNodes[o], "tbody") && !c.childNodes.length && r.removeChild(c);
                        for (oe.merge(f, s.childNodes),
                        s.textContent = ""; s.firstChild; )
                            s.removeChild(s.firstChild);
                        s = p.lastChild
                    } else
                        f.push(t.createTextNode(r));
            for (s && p.removeChild(s),
            ne.appendChecked || oe.grep(m(f, "input"), v),
            h = 0; r = f[h++]; )
                if ((!i || -1 === oe.inArray(r, i)) && (a = oe.contains(r.ownerDocument, r),
                s = m(p.appendChild(r), "script"),
                a && x(s),
                n))
                    for (o = 0; r = s[o++]; )
                        Xe.test(r.type || "") && n.push(r);
            return s = null ,
            p
        },
        cleanData: function(e, t) {
            for (var n, i, o, r, a = 0, s = oe.expando, l = oe.cache, c = ne.deleteExpando, u = oe.event.special; null != (n = e[a]); a++)
                if ((t || oe.acceptData(n)) && (o = n[s],
                r = o && l[o])) {
                    if (r.events)
                        for (i in r.events)
                            u[i] ? oe.event.remove(n, i) : oe.removeEvent(n, i, r.handle);
                    l[o] && (delete l[o],
                    c ? delete n[s] : typeof n.removeAttribute !== Ce ? n.removeAttribute(s) : n[s] = null ,
                    J.push(o))
                }
        }
    }),
    oe.fn.extend({
        text: function(e) {
            return $e(this, function(e) {
                return void 0 === e ? oe.text(this) : this.empty().append((this[0] && this[0].ownerDocument || he).createTextNode(e))
            }, null , e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, i = e ? oe.filter(e, this) : this, o = 0; null != (n = i[o]); o++)
                t || 1 !== n.nodeType || oe.cleanData(m(n)),
                n.parentNode && (t && oe.contains(n.ownerDocument, n) && x(m(n, "script")),
                n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && oe.cleanData(m(e, !1)); e.firstChild; )
                    e.removeChild(e.firstChild);
                e.options && oe.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return oe.clone(this, e, t)
            })
        },
        html: function(e) {
            return $e(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , i = this.length;
                if (void 0 === e)
                    return 1 === t.nodeType ? t.innerHTML.replace(Re, "") : void 0;
                if (!("string" != typeof e || ze.test(e) || !ne.htmlSerialize && qe.test(e) || !ne.leadingWhitespace && Pe.test(e) || Ge[(Fe.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(Me, "<$1></$2>");
                    try {
                        for (; i > n; n++)
                            t = this[n] || {},
                            1 === t.nodeType && (oe.cleanData(m(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (o) {}
                }
                t && this.empty().append(e)
            }, null , e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode,
                oe.cleanData(m(this)),
                e && e.replaceChild(t, this)
            }),
            e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = Q.apply([], e);
            var n, i, o, r, a, s, l = 0, c = this.length, u = this, d = c - 1, p = e[0], f = oe.isFunction(p);
            if (f || c > 1 && "string" == typeof p && !ne.checkClone && Ue.test(p))
                return this.each(function(n) {
                    var i = u.eq(n);
                    f && (e[0] = p.call(this, n, i.html())),
                    i.domManip(e, t)
                });
            if (c && (s = oe.buildFragment(e, this[0].ownerDocument, !1, this),
            n = s.firstChild,
            1 === s.childNodes.length && (s = n),
            n)) {
                for (r = oe.map(m(s, "script"), b),
                o = r.length; c > l; l++)
                    i = s,
                    l !== d && (i = oe.clone(i, !0, !0),
                    o && oe.merge(r, m(i, "script"))),
                    t.call(this[l], i, l);
                if (o)
                    for (a = r[r.length - 1].ownerDocument,
                    oe.map(r, w),
                    l = 0; o > l; l++)
                        i = r[l],
                        Xe.test(i.type || "") && !oe._data(i, "globalEval") && oe.contains(a, i) && (i.src ? oe._evalUrl && oe._evalUrl(i.src) : oe.globalEval((i.text || i.textContent || i.innerHTML || "").replace(Je, "")));
                s = n = null
            }
            return this
        }
    }),
    oe.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        oe.fn[e] = function(e) {
            for (var n, i = 0, o = [], r = oe(e), a = r.length - 1; a >= i; i++)
                n = i === a ? this : this.clone(!0),
                oe(r[i])[t](n),
                Y.apply(o, n.get());
            return this.pushStack(o)
        }
    });
    var Ke, Ze = {};
    !function() {
        var e;
        ne.shrinkWrapBlocks = function() {
            if (null != e)
                return e;
            e = !1;
            var t, n, i;
            return n = he.getElementsByTagName("body")[0],
            n && n.style ? (t = he.createElement("div"),
            i = he.createElement("div"),
            i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            n.appendChild(i).appendChild(t),
            typeof t.style.zoom !== Ce && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
            t.appendChild(he.createElement("div")).style.width = "5px",
            e = 3 !== t.offsetWidth),
            n.removeChild(i),
            e) : void 0
        }
    }();
    var et, tt, nt = /^margin/, it = new RegExp("^(" + ke + ")(?!px)[a-z%]+$","i"), ot = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (et = function(t) {
        return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null ) : e.getComputedStyle(t, null )
    }
    ,
    tt = function(e, t, n) {
        var i, o, r, a, s = e.style;
        return n = n || et(e),
        a = n ? n.getPropertyValue(t) || n[t] : void 0,
        n && ("" !== a || oe.contains(e.ownerDocument, e) || (a = oe.style(e, t)),
        it.test(a) && nt.test(t) && (i = s.width,
        o = s.minWidth,
        r = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = i,
        s.minWidth = o,
        s.maxWidth = r)),
        void 0 === a ? a : a + ""
    }
    ) : he.documentElement.currentStyle && (et = function(e) {
        return e.currentStyle
    }
    ,
    tt = function(e, t, n) {
        var i, o, r, a, s = e.style;
        return n = n || et(e),
        a = n ? n[t] : void 0,
        null == a && s && s[t] && (a = s[t]),
        it.test(a) && !ot.test(t) && (i = s.left,
        o = e.runtimeStyle,
        r = o && o.left,
        r && (o.left = e.currentStyle.left),
        s.left = "fontSize" === t ? "1em" : a,
        a = s.pixelLeft + "px",
        s.left = i,
        r && (o.left = r)),
        void 0 === a ? a : a + "" || "auto"
    }
    ),
    !function() {
        function t() {
            var t, n, i, o;
            n = he.getElementsByTagName("body")[0],
            n && n.style && (t = he.createElement("div"),
            i = he.createElement("div"),
            i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            n.appendChild(i).appendChild(t),
            t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
            r = a = !1,
            l = !0,
            e.getComputedStyle && (r = "1%" !== (e.getComputedStyle(t, null ) || {}).top,
            a = "4px" === (e.getComputedStyle(t, null ) || {
                width: "4px"
            }).width,
            o = t.appendChild(he.createElement("div")),
            o.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
            o.style.marginRight = o.style.width = "0",
            t.style.width = "1px",
            l = !parseFloat((e.getComputedStyle(o, null ) || {}).marginRight),
            t.removeChild(o)),
            t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
            o = t.getElementsByTagName("td"),
            o[0].style.cssText = "margin:0;border:0;padding:0;display:none",
            s = 0 === o[0].offsetHeight,
            s && (o[0].style.display = "",
            o[1].style.display = "none",
            s = 0 === o[0].offsetHeight),
            n.removeChild(i))
        }
        var n, i, o, r, a, s, l;
        n = he.createElement("div"),
        n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        o = n.getElementsByTagName("a")[0],
        (i = o && o.style) && (i.cssText = "float:left;opacity:.5",
        ne.opacity = "0.5" === i.opacity,
        ne.cssFloat = !!i.cssFloat,
        n.style.backgroundClip = "content-box",
        n.cloneNode(!0).style.backgroundClip = "",
        ne.clearCloneStyle = "content-box" === n.style.backgroundClip,
        ne.boxSizing = "" === i.boxSizing || "" === i.MozBoxSizing || "" === i.WebkitBoxSizing,
        oe.extend(ne, {
            reliableHiddenOffsets: function() {
                return null == s && t(),
                s
            },
            boxSizingReliable: function() {
                return null == a && t(),
                a
            },
            pixelPosition: function() {
                return null == r && t(),
                r
            },
            reliableMarginRight: function() {
                return null == l && t(),
                l
            }
        }))
    }(),
    oe.swap = function(e, t, n, i) {
        var o, r, a = {};
        for (r in t)
            a[r] = e.style[r],
            e.style[r] = t[r];
        o = n.apply(e, i || []);
        for (r in t)
            e.style[r] = a[r];
        return o
    }
    ;
    var rt = /alpha\([^)]*\)/i
      , at = /opacity\s*=\s*([^)]*)/
      , st = /^(none|table(?!-c[ea]).+)/
      , lt = new RegExp("^(" + ke + ")(.*)$","i")
      , ct = new RegExp("^([+-])=(" + ke + ")","i")
      , ut = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , dt = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , pt = ["Webkit", "O", "Moz", "ms"];
    oe.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = tt(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": ne.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, a, s = oe.camelCase(t), l = e.style;
                if (t = oe.cssProps[s] || (oe.cssProps[s] = N(l, s)),
                a = oe.cssHooks[t] || oe.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (o = a.get(e, !1, i)) ? o : l[t];
                if (r = typeof n,
                "string" === r && (o = ct.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(oe.css(e, t)),
                r = "number"),
                null != n && n === n && ("number" !== r || oe.cssNumber[s] || (n += "px"),
                ne.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                !(a && "set"in a && void 0 === (n = a.set(e, n, i)))))
                    try {
                        l[t] = n
                    } catch (c) {}
            }
        },
        css: function(e, t, n, i) {
            var o, r, a, s = oe.camelCase(t);
            return t = oe.cssProps[s] || (oe.cssProps[s] = N(e.style, s)),
            a = oe.cssHooks[t] || oe.cssHooks[s],
            a && "get"in a && (r = a.get(e, !0, n)),
            void 0 === r && (r = tt(e, t, i)),
            "normal" === r && t in dt && (r = dt[t]),
            "" === n || n ? (o = parseFloat(r),
            n === !0 || oe.isNumeric(o) ? o || 0 : r) : r
        }
    }),
    oe.each(["height", "width"], function(e, t) {
        oe.cssHooks[t] = {
            get: function(e, n, i) {
                return n ? st.test(oe.css(e, "display")) && 0 === e.offsetWidth ? oe.swap(e, ut, function() {
                    return _(e, t, i)
                }) : _(e, t, i) : void 0
            },
            set: function(e, n, i) {
                var o = i && et(e);
                return $(e, n, i ? A(e, t, i, ne.boxSizing && "border-box" === oe.css(e, "boxSizing", !1, o), o) : 0)
            }
        }
    }),
    ne.opacity || (oe.cssHooks.opacity = {
        get: function(e, t) {
            return at.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style
              , i = e.currentStyle
              , o = oe.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : ""
              , r = i && i.filter || n.filter || "";
            n.zoom = 1,
            (t >= 1 || "" === t) && "" === oe.trim(r.replace(rt, "")) && n.removeAttribute && (n.removeAttribute("filter"),
            "" === t || i && !i.filter) || (n.filter = rt.test(r) ? r.replace(rt, o) : r + " " + o)
        }
    }),
    oe.cssHooks.marginRight = k(ne.reliableMarginRight, function(e, t) {
        return t ? oe.swap(e, {
            display: "inline-block"
        }, tt, [e, "marginRight"]) : void 0
    }),
    oe.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        oe.cssHooks[e + t] = {
            expand: function(n) {
                for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++)
                    o[e + Ne[i] + t] = r[i] || r[i - 2] || r[0];
                return o
            }
        },
        nt.test(e) || (oe.cssHooks[e + t].set = $)
    }),
    oe.fn.extend({
        css: function(e, t) {
            return $e(this, function(e, t, n) {
                var i, o, r = {}, a = 0;
                if (oe.isArray(t)) {
                    for (i = et(e),
                    o = t.length; o > a; a++)
                        r[t[a]] = oe.css(e, t[a], !1, i);
                    return r
                }
                return void 0 !== n ? oe.style(e, t, n) : oe.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return D(this, !0)
        },
        hide: function() {
            return D(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                De(this) ? oe(this).show() : oe(this).hide()
            })
        }
    }),
    oe.Tween = j,
    j.prototype = {
        constructor: j,
        init: function(e, t, n, i, o, r) {
            this.elem = e,
            this.prop = n,
            this.easing = o || "swing",
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = i,
            this.unit = r || (oe.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = j.propHooks[this.prop];
            return e && e.get ? e.get(this) : j.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = j.propHooks[this.prop];
            return this.options.duration ? this.pos = t = oe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : j.propHooks._default.set(this),
            this
        }
    },
    j.prototype.init.prototype = j.prototype,
    j.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = oe.css(e.elem, e.prop, ""),
                t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                oe.fx.step[e.prop] ? oe.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[oe.cssProps[e.prop]] || oe.cssHooks[e.prop]) ? oe.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    },
    j.propHooks.scrollTop = j.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    oe.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    },
    oe.fx = j.prototype.init,
    oe.fx.step = {};
    var ft, ht, gt = /^(?:toggle|show|hide)$/, mt = new RegExp("^(?:([+-])=|)(" + ke + ")([a-z%]*)$","i"), vt = /queueHooks$/, yt = [H], bt = {
        "*": [function(e, t) {
            var n = this.createTween(e, t)
              , i = n.cur()
              , o = mt.exec(t)
              , r = o && o[3] || (oe.cssNumber[e] ? "" : "px")
              , a = (oe.cssNumber[e] || "px" !== r && +i) && mt.exec(oe.css(n.elem, e))
              , s = 1
              , l = 20;
            if (a && a[3] !== r) {
                r = r || a[3],
                o = o || [],
                a = +i || 1;
                do
                    s = s || ".5",
                    a /= s,
                    oe.style(n.elem, e, a + r);
                while (s !== (s = n.cur() / i) && 1 !== s && --l)
            }
            return o && (a = n.start = +a || +i || 0,
            n.unit = r,
            n.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]),
            n
        }
        ]
    };
    oe.Animation = oe.extend(q, {
        tweener: function(e, t) {
            oe.isFunction(e) ? (t = e,
            e = ["*"]) : e = e.split(" ");
            for (var n, i = 0, o = e.length; o > i; i++)
                n = e[i],
                bt[n] = bt[n] || [],
                bt[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? yt.unshift(e) : yt.push(e)
        }
    }),
    oe.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? oe.extend({}, e) : {
            complete: n || !n && t || oe.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !oe.isFunction(t) && t
        };
        return i.duration = oe.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in oe.fx.speeds ? oe.fx.speeds[i.duration] : oe.fx.speeds._default,
        (null == i.queue || i.queue === !0) && (i.queue = "fx"),
        i.old = i.complete,
        i.complete = function() {
            oe.isFunction(i.old) && i.old.call(this),
            i.queue && oe.dequeue(this, i.queue)
        }
        ,
        i
    }
    ,
    oe.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(De).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(e, t, n, i) {
            var o = oe.isEmptyObject(e)
              , r = oe.speed(t, n, i)
              , a = function() {
                var t = q(this, oe.extend({}, e), r);
                (o || oe._data(this, "finish")) && t.stop(!0)
            };
            return a.finish = a,
            o || r.queue === !1 ? this.each(a) : this.queue(r.queue, a)
        },
        stop: function(e, t, n) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop,
                t(n)
            };
            return "string" != typeof e && (n = t,
            t = e,
            e = void 0),
            t && e !== !1 && this.queue(e || "fx", []),
            this.each(function() {
                var t = !0
                  , o = null != e && e + "queueHooks"
                  , r = oe.timers
                  , a = oe._data(this);
                if (o)
                    a[o] && a[o].stop && i(a[o]);
                else
                    for (o in a)
                        a[o] && a[o].stop && vt.test(o) && i(a[o]);
                for (o = r.length; o--; )
                    r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(n),
                    t = !1,
                    r.splice(o, 1));
                (t || !n) && oe.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"),
            this.each(function() {
                var t, n = oe._data(this), i = n[e + "queue"], o = n[e + "queueHooks"], r = oe.timers, a = i ? i.length : 0;
                for (n.finish = !0,
                oe.queue(this, e, []),
                o && o.stop && o.stop.call(this, !0),
                t = r.length; t--; )
                    r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0),
                    r.splice(t, 1));
                for (t = 0; a > t; t++)
                    i[t] && i[t].finish && i[t].finish.call(this);
                delete n.finish
            })
        }
    }),
    oe.each(["toggle", "show", "hide"], function(e, t) {
        var n = oe.fn[t];
        oe.fn[t] = function(e, i, o) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(O(t, !0), e, i, o)
        }
    }),
    oe.each({
        slideDown: O("show"),
        slideUp: O("hide"),
        slideToggle: O("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        oe.fn[e] = function(e, n, i) {
            return this.animate(t, e, n, i)
        }
    }),
    oe.timers = [],
    oe.fx.tick = function() {
        var e, t = oe.timers, n = 0;
        for (ft = oe.now(); n < t.length; n++)
            e = t[n],
            e() || t[n] !== e || t.splice(n--, 1);
        t.length || oe.fx.stop(),
        ft = void 0
    }
    ,
    oe.fx.timer = function(e) {
        oe.timers.push(e),
        e() ? oe.fx.start() : oe.timers.pop()
    }
    ,
    oe.fx.interval = 13,
    oe.fx.start = function() {
        ht || (ht = setInterval(oe.fx.tick, oe.fx.interval))
    }
    ,
    oe.fx.stop = function() {
        clearInterval(ht),
        ht = null
    }
    ,
    oe.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    oe.fn.delay = function(e, t) {
        return e = oe.fx ? oe.fx.speeds[e] || e : e,
        t = t || "fx",
        this.queue(t, function(t, n) {
            var i = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(i)
            }
        })
    }
    ,
    function() {
        var e, t, n, i, o;
        t = he.createElement("div"),
        t.setAttribute("className", "t"),
        t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        i = t.getElementsByTagName("a")[0],
        n = he.createElement("select"),
        o = n.appendChild(he.createElement("option")),
        e = t.getElementsByTagName("input")[0],
        i.style.cssText = "top:1px",
        ne.getSetAttribute = "t" !== t.className,
        ne.style = /top/.test(i.getAttribute("style")),
        ne.hrefNormalized = "/a" === i.getAttribute("href"),
        ne.checkOn = !!e.value,
        ne.optSelected = o.selected,
        ne.enctype = !!he.createElement("form").enctype,
        n.disabled = !0,
        ne.optDisabled = !o.disabled,
        e = he.createElement("input"),
        e.setAttribute("value", ""),
        ne.input = "" === e.getAttribute("value"),
        e.value = "t",
        e.setAttribute("type", "radio"),
        ne.radioValue = "t" === e.value
    }();
    var wt = /\r/g;
    oe.fn.extend({
        val: function(e) {
            var t, n, i, o = this[0];
            return arguments.length ? (i = oe.isFunction(e),
            this.each(function(n) {
                var o;
                1 === this.nodeType && (o = i ? e.call(this, n, oe(this).val()) : e,
                null == o ? o = "" : "number" == typeof o ? o += "" : oe.isArray(o) && (o = oe.map(o, function(e) {
                    return null == e ? "" : e + ""
                })),
                t = oe.valHooks[this.type] || oe.valHooks[this.nodeName.toLowerCase()],
                t && "set"in t && void 0 !== t.set(this, o, "value") || (this.value = o))
            })) : o ? (t = oe.valHooks[o.type] || oe.valHooks[o.nodeName.toLowerCase()],
            t && "get"in t && void 0 !== (n = t.get(o, "value")) ? n : (n = o.value,
            "string" == typeof n ? n.replace(wt, "") : null == n ? "" : n)) : void 0
        }
    }),
    oe.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = oe.find.attr(e, "value");
                    return null != t ? t : oe.trim(oe.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, i = e.options, o = e.selectedIndex, r = "select-one" === e.type || 0 > o, a = r ? null : [], s = r ? o + 1 : i.length, l = 0 > o ? s : r ? o : 0; s > l; l++)
                        if (n = i[l],
                        !(!n.selected && l !== o || (ne.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && oe.nodeName(n.parentNode, "optgroup"))) {
                            if (t = oe(n).val(),
                            r)
                                return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var n, i, o = e.options, r = oe.makeArray(t), a = o.length; a--; )
                        if (i = o[a],
                        oe.inArray(oe.valHooks.option.get(i), r) >= 0)
                            try {
                                i.selected = n = !0
                            } catch (s) {
                                i.scrollHeight
                            }
                        else
                            i.selected = !1;
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    oe.each(["radio", "checkbox"], function() {
        oe.valHooks[this] = {
            set: function(e, t) {
                return oe.isArray(t) ? e.checked = oe.inArray(oe(e).val(), t) >= 0 : void 0
            }
        },
        ne.checkOn || (oe.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    });
    var xt, Tt, Ct = oe.expr.attrHandle, St = /^(?:checked|selected)$/i, Et = ne.getSetAttribute, kt = ne.input;
    oe.fn.extend({
        attr: function(e, t) {
            return $e(this, oe.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                oe.removeAttr(this, e)
            })
        }
    }),
    oe.extend({
        attr: function(e, t, n) {
            var i, o, r = e.nodeType;
            if (e && 3 !== r && 8 !== r && 2 !== r)
                return typeof e.getAttribute === Ce ? oe.prop(e, t, n) : (1 === r && oe.isXMLDoc(e) || (t = t.toLowerCase(),
                i = oe.attrHooks[t] || (oe.expr.match.bool.test(t) ? Tt : xt)),
                void 0 === n ? i && "get"in i && null !== (o = i.get(e, t)) ? o : (o = oe.find.attr(e, t),
                null == o ? void 0 : o) : null !== n ? i && "set"in i && void 0 !== (o = i.set(e, n, t)) ? o : (e.setAttribute(t, n + ""),
                n) : void oe.removeAttr(e, t))
        },
        removeAttr: function(e, t) {
            var n, i, o = 0, r = t && t.match(be);
            if (r && 1 === e.nodeType)
                for (; n = r[o++]; )
                    i = oe.propFix[n] || n,
                    oe.expr.match.bool.test(n) ? kt && Et || !St.test(n) ? e[i] = !1 : e[oe.camelCase("default-" + n)] = e[i] = !1 : oe.attr(e, n, ""),
                    e.removeAttribute(Et ? n : i)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!ne.radioValue && "radio" === t && oe.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        }
    }),
    Tt = {
        set: function(e, t, n) {
            return t === !1 ? oe.removeAttr(e, n) : kt && Et || !St.test(n) ? e.setAttribute(!Et && oe.propFix[n] || n, n) : e[oe.camelCase("default-" + n)] = e[n] = !0,
            n
        }
    },
    oe.each(oe.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Ct[t] || oe.find.attr;
        Ct[t] = kt && Et || !St.test(t) ? function(e, t, i) {
            var o, r;
            return i || (r = Ct[t],
            Ct[t] = o,
            o = null != n(e, t, i) ? t.toLowerCase() : null ,
            Ct[t] = r),
            o
        }
        : function(e, t, n) {
            return n ? void 0 : e[oe.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }),
    kt && Et || (oe.attrHooks.value = {
        set: function(e, t, n) {
            return oe.nodeName(e, "input") ? void (e.defaultValue = t) : xt && xt.set(e, t, n)
        }
    }),
    Et || (xt = {
        set: function(e, t, n) {
            var i = e.getAttributeNode(n);
            return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)),
            i.value = t += "",
            "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    },
    Ct.id = Ct.name = Ct.coords = function(e, t, n) {
        var i;
        return n ? void 0 : (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
    }
    ,
    oe.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: xt.set
    },
    oe.attrHooks.contenteditable = {
        set: function(e, t, n) {
            xt.set(e, "" !== t && t, n)
        }
    },
    oe.each(["width", "height"], function(e, t) {
        oe.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"),
                n) : void 0
            }
        }
    })),
    ne.style || (oe.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Nt = /^(?:input|select|textarea|button|object)$/i
      , Dt = /^(?:a|area)$/i;
    oe.fn.extend({
        prop: function(e, t) {
            return $e(this, oe.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = oe.propFix[e] || e,
            this.each(function() {
                try {
                    this[e] = void 0,
                    delete this[e]
                } catch (t) {}
            })
        }
    }),
    oe.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var i, o, r, a = e.nodeType;
            if (e && 3 !== a && 8 !== a && 2 !== a)
                return r = 1 !== a || !oe.isXMLDoc(e),
                r && (t = oe.propFix[t] || t,
                o = oe.propHooks[t]),
                void 0 !== n ? o && "set"in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get"in o && null !== (i = o.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = oe.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Nt.test(e.nodeName) || Dt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }),
    ne.hrefNormalized || oe.each(["href", "src"], function(e, t) {
        oe.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }),
    ne.optSelected || (oe.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex),
            null
        }
    }),
    oe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        oe.propFix[this.toLowerCase()] = this
    }),
    ne.enctype || (oe.propFix.enctype = "encoding");
    var $t = /[\t\r\n\f]/g;
    oe.fn.extend({
        addClass: function(e) {
            var t, n, i, o, r, a, s = 0, l = this.length, c = "string" == typeof e && e;
            if (oe.isFunction(e))
                return this.each(function(t) {
                    oe(this).addClass(e.call(this, t, this.className))
                });
            if (c)
                for (t = (e || "").match(be) || []; l > s; s++)
                    if (n = this[s],
                    i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace($t, " ") : " ")) {
                        for (r = 0; o = t[r++]; )
                            i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        a = oe.trim(i),
                        n.className !== a && (n.className = a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, i, o, r, a, s = 0, l = this.length, c = 0 === arguments.length || "string" == typeof e && e;
            if (oe.isFunction(e))
                return this.each(function(t) {
                    oe(this).removeClass(e.call(this, t, this.className))
                });
            if (c)
                for (t = (e || "").match(be) || []; l > s; s++)
                    if (n = this[s],
                    i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace($t, " ") : "")) {
                        for (r = 0; o = t[r++]; )
                            for (; i.indexOf(" " + o + " ") >= 0; )
                                i = i.replace(" " + o + " ", " ");
                        a = e ? oe.trim(i) : "",
                        n.className !== a && (n.className = a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(oe.isFunction(e) ? function(n) {
                oe(this).toggleClass(e.call(this, n, this.className, t), t)
            }
            : function() {
                if ("string" === n)
                    for (var t, i = 0, o = oe(this), r = e.match(be) || []; t = r[i++]; )
                        o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else
                    (n === Ce || "boolean" === n) && (this.className && oe._data(this, "__className__", this.className),
                    this.className = this.className || e === !1 ? "" : oe._data(this, "__className__") || "")
            }
            )
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace($t, " ").indexOf(t) >= 0)
                    return !0;
            return !1
        }
    }),
    oe.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        oe.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null , e, n) : this.trigger(t)
        }
    }),
    oe.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null , t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null , t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var At = oe.now()
      , _t = /\?/
      , jt = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    oe.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse)
            return e.JSON.parse(t + "");
        var n, i = null , o = oe.trim(t + "");
        return o && !oe.trim(o.replace(jt, function(e, t, o, r) {
            return n && t && (i = 0),
            0 === i ? e : (n = o || t,
            i += !r - !o,
            "")
        })) ? Function("return " + o)() : oe.error("Invalid JSON: " + t)
    }
    ,
    oe.parseXML = function(t) {
        var n, i;
        if (!t || "string" != typeof t)
            return null ;
        try {
            e.DOMParser ? (i = new DOMParser,
            n = i.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"),
            n.async = "false",
            n.loadXML(t))
        } catch (o) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || oe.error("Invalid XML: " + t),
        n
    }
    ;
    var Lt, Ot, It = /#.*$/, Ht = /([?&])_=[^&]*/, Rt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, qt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Pt = /^(?:GET|HEAD)$/, Mt = /^\/\//, Ft = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Bt = {}, Wt = {}, zt = "*/".concat("*");
    try {
        Ot = location.href
    } catch (Ut) {
        Ot = he.createElement("a"),
        Ot.href = "",
        Ot = Ot.href
    }
    Lt = Ft.exec(Ot.toLowerCase()) || [],
    oe.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Ot,
            type: "GET",
            isLocal: qt.test(Lt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": zt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": oe.parseJSON,
                "text xml": oe.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? F(F(e, oe.ajaxSettings), t) : F(oe.ajaxSettings, e)
        },
        ajaxPrefilter: P(Bt),
        ajaxTransport: P(Wt),
        ajax: function(e, t) {
            function n(e, t, n, i) {
                var o, u, v, y, w, T = t;
                2 !== b && (b = 2,
                s && clearTimeout(s),
                c = void 0,
                a = i || "",
                x.readyState = e > 0 ? 4 : 0,
                o = e >= 200 && 300 > e || 304 === e,
                n && (y = B(d, x, n)),
                y = W(d, y, x, o),
                o ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"),
                w && (oe.lastModified[r] = w),
                w = x.getResponseHeader("etag"),
                w && (oe.etag[r] = w)),
                204 === e || "HEAD" === d.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = y.state,
                u = y.data,
                v = y.error,
                o = !v)) : (v = T,
                (e || !T) && (T = "error",
                0 > e && (e = 0))),
                x.status = e,
                x.statusText = (t || T) + "",
                o ? h.resolveWith(p, [u, T, x]) : h.rejectWith(p, [x, T, v]),
                x.statusCode(m),
                m = void 0,
                l && f.trigger(o ? "ajaxSuccess" : "ajaxError", [x, d, o ? u : v]),
                g.fireWith(p, [x, T]),
                l && (f.trigger("ajaxComplete", [x, d]),
                --oe.active || oe.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e,
            e = void 0),
            t = t || {};
            var i, o, r, a, s, l, c, u, d = oe.ajaxSetup({}, t), p = d.context || d, f = d.context && (p.nodeType || p.jquery) ? oe(p) : oe.event, h = oe.Deferred(), g = oe.Callbacks("once memory"), m = d.statusCode || {}, v = {}, y = {}, b = 0, w = "canceled", x = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (2 === b) {
                        if (!u)
                            for (u = {}; t = Rt.exec(a); )
                                u[t[1].toLowerCase()] = t[2];
                        t = u[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return 2 === b ? a : null
                },
                setRequestHeader: function(e, t) {
                    var n = e.toLowerCase();
                    return b || (e = y[n] = y[n] || e,
                    v[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return b || (d.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (2 > b)
                            for (t in e)
                                m[t] = [m[t], e[t]];
                        else
                            x.always(e[x.status]);
                    return this
                },
                abort: function(e) {
                    var t = e || w;
                    return c && c.abort(t),
                    n(0, t),
                    this
                }
            };
            if (h.promise(x).complete = g.add,
            x.success = x.done,
            x.error = x.fail,
            d.url = ((e || d.url || Ot) + "").replace(It, "").replace(Mt, Lt[1] + "//"),
            d.type = t.method || t.type || d.method || d.type,
            d.dataTypes = oe.trim(d.dataType || "*").toLowerCase().match(be) || [""],
            null == d.crossDomain && (i = Ft.exec(d.url.toLowerCase()),
            d.crossDomain = !(!i || i[1] === Lt[1] && i[2] === Lt[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Lt[3] || ("http:" === Lt[1] ? "80" : "443")))),
            d.data && d.processData && "string" != typeof d.data && (d.data = oe.param(d.data, d.traditional)),
            M(Bt, d, t, x),
            2 === b)
                return x;
            l = oe.event && d.global,
            l && 0 === oe.active++ && oe.event.trigger("ajaxStart"),
            d.type = d.type.toUpperCase(),
            d.hasContent = !Pt.test(d.type),
            r = d.url,
            d.hasContent || (d.data && (r = d.url += (_t.test(r) ? "&" : "?") + d.data,
            delete d.data),
            d.cache === !1 && (d.url = Ht.test(r) ? r.replace(Ht, "$1_=" + At++) : r + (_t.test(r) ? "&" : "?") + "_=" + At++)),
            d.ifModified && (oe.lastModified[r] && x.setRequestHeader("If-Modified-Since", oe.lastModified[r]),
            oe.etag[r] && x.setRequestHeader("If-None-Match", oe.etag[r])),
            (d.data && d.hasContent && d.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", d.contentType),
            x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + zt + "; q=0.01" : "") : d.accepts["*"]);
            for (o in d.headers)
                x.setRequestHeader(o, d.headers[o]);
            if (d.beforeSend && (d.beforeSend.call(p, x, d) === !1 || 2 === b))
                return x.abort();
            w = "abort";
            for (o in {
                success: 1,
                error: 1,
                complete: 1
            })
                x[o](d[o]);
            if (c = M(Wt, d, t, x)) {
                x.readyState = 1,
                l && f.trigger("ajaxSend", [x, d]),
                d.async && d.timeout > 0 && (s = setTimeout(function() {
                    x.abort("timeout")
                }, d.timeout));
                try {
                    b = 1,
                    c.send(v, n)
                } catch (T) {
                    if (!(2 > b))
                        throw T;
                    n(-1, T)
                }
            } else
                n(-1, "No Transport");
            return x
        },
        getJSON: function(e, t, n) {
            return oe.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return oe.get(e, void 0, t, "script")
        }
    }),
    oe.each(["get", "post"], function(e, t) {
        oe[t] = function(e, n, i, o) {
            return oe.isFunction(n) && (o = o || i,
            i = n,
            n = void 0),
            oe.ajax({
                url: e,
                type: t,
                dataType: o,
                data: n,
                success: i
            })
        }
    }),
    oe._evalUrl = function(e) {
        return oe.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    oe.fn.extend({
        wrapAll: function(e) {
            if (oe.isFunction(e))
                return this.each(function(t) {
                    oe(this).wrapAll(e.call(this, t))
                });
            if (this[0]) {
                var t = oe(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]),
                t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; )
                        e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(oe.isFunction(e) ? function(t) {
                oe(this).wrapInner(e.call(this, t))
            }
            : function() {
                var t = oe(this)
                  , n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            }
            )
        },
        wrap: function(e) {
            var t = oe.isFunction(e);
            return this.each(function(n) {
                oe(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                oe.nodeName(this, "body") || oe(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    oe.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !ne.reliableHiddenOffsets() && "none" === (e.style && e.style.display || oe.css(e, "display"))
    }
    ,
    oe.expr.filters.visible = function(e) {
        return !oe.expr.filters.hidden(e)
    }
    ;
    var Xt = /%20/g
      , Vt = /\[\]$/
      , Jt = /\r?\n/g
      , Gt = /^(?:submit|button|image|reset|file)$/i
      , Qt = /^(?:input|select|textarea|keygen)/i;
    oe.param = function(e, t) {
        var n, i = [], o = function(e, t) {
            t = oe.isFunction(t) ? t() : null == t ? "" : t,
            i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = oe.ajaxSettings && oe.ajaxSettings.traditional),
        oe.isArray(e) || e.jquery && !oe.isPlainObject(e))
            oe.each(e, function() {
                o(this.name, this.value)
            });
        else
            for (n in e)
                z(n, e[n], t, o);
        return i.join("&").replace(Xt, "+")
    }
    ,
    oe.fn.extend({
        serialize: function() {
            return oe.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = oe.prop(this, "elements");
                return e ? oe.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !oe(this).is(":disabled") && Qt.test(this.nodeName) && !Gt.test(e) && (this.checked || !Ae.test(e))
            }).map(function(e, t) {
                var n = oe(this).val();
                return null == n ? null : oe.isArray(n) ? oe.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Jt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Jt, "\r\n")
                }
            }).get()
        }
    }),
    oe.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && U() || X()
    }
    : U;
    var Yt = 0
      , Kt = {}
      , Zt = oe.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var e in Kt)
            Kt[e](void 0, !0)
    }),
    ne.cors = !!Zt && "withCredentials"in Zt,
    Zt = ne.ajax = !!Zt,
    Zt && oe.ajaxTransport(function(e) {
        if (!e.crossDomain || ne.cors) {
            var t;
            return {
                send: function(n, i) {
                    var o, r = e.xhr(), a = ++Yt;
                    if (r.open(e.type, e.url, e.async, e.username, e.password),
                    e.xhrFields)
                        for (o in e.xhrFields)
                            r[o] = e.xhrFields[o];
                    e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType),
                    e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (o in n)
                        void 0 !== n[o] && r.setRequestHeader(o, n[o] + "");
                    r.send(e.hasContent && e.data || null ),
                    t = function(n, o) {
                        var s, l, c;
                        if (t && (o || 4 === r.readyState))
                            if (delete Kt[a],
                            t = void 0,
                            r.onreadystatechange = oe.noop,
                            o)
                                4 !== r.readyState && r.abort();
                            else {
                                c = {},
                                s = r.status,
                                "string" == typeof r.responseText && (c.text = r.responseText);
                                try {
                                    l = r.statusText
                                } catch (u) {
                                    l = ""
                                }
                                s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = c.text ? 200 : 404
                            }
                        c && i(s, l, c, r.getAllResponseHeaders())
                    }
                    ,
                    e.async ? 4 === r.readyState ? setTimeout(t) : r.onreadystatechange = Kt[a] = t : t()
                },
                abort: function() {
                    t && t(void 0, !0)
                }
            }
        }
    }),
    oe.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return oe.globalEval(e),
                e
            }
        }
    }),
    oe.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET",
        e.global = !1)
    }),
    oe.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = he.head || oe("head")[0] || he.documentElement;
            return {
                send: function(i, o) {
                    t = he.createElement("script"),
                    t.async = !0,
                    e.scriptCharset && (t.charset = e.scriptCharset),
                    t.src = e.url,
                    t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null ,
                        t.parentNode && t.parentNode.removeChild(t),
                        t = null ,
                        n || o(200, "success"))
                    }
                    ,
                    n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var en = []
      , tn = /(=)\?(?=&|$)|\?\?/;
    oe.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = en.pop() || oe.expando + "_" + At++;
            return this[e] = !0,
            e
        }
    }),
    oe.ajaxPrefilter("json jsonp", function(t, n, i) {
        var o, r, a, s = t.jsonp !== !1 && (tn.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && tn.test(t.data) && "data");
        return s || "jsonp" === t.dataTypes[0] ? (o = t.jsonpCallback = oe.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
        s ? t[s] = t[s].replace(tn, "$1" + o) : t.jsonp !== !1 && (t.url += (_t.test(t.url) ? "&" : "?") + t.jsonp + "=" + o),
        t.converters["script json"] = function() {
            return a || oe.error(o + " was not called"),
            a[0]
        }
        ,
        t.dataTypes[0] = "json",
        r = e[o],
        e[o] = function() {
            a = arguments
        }
        ,
        i.always(function() {
            e[o] = r,
            t[o] && (t.jsonpCallback = n.jsonpCallback,
            en.push(o)),
            a && oe.isFunction(r) && r(a[0]),
            a = r = void 0
        }),
        "script") : void 0
    }),
    oe.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e)
            return null ;
        "boolean" == typeof t && (n = t,
        t = !1),
        t = t || he;
        var i = de.exec(e)
          , o = !n && [];
        return i ? [t.createElement(i[1])] : (i = oe.buildFragment([e], t, o),
        o && o.length && oe(o).remove(),
        oe.merge([], i.childNodes))
    }
    ;
    var nn = oe.fn.load;
    oe.fn.load = function(e, t, n) {
        if ("string" != typeof e && nn)
            return nn.apply(this, arguments);
        var i, o, r, a = this, s = e.indexOf(" ");
        return s >= 0 && (i = oe.trim(e.slice(s, e.length)),
        e = e.slice(0, s)),
        oe.isFunction(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (r = "POST"),
        a.length > 0 && oe.ajax({
            url: e,
            type: r,
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(i ? oe("<div>").append(oe.parseHTML(e)).find(i) : e)
        }).complete(n && function(e, t) {
            a.each(n, o || [e.responseText, t, e])
        }
        ),
        this
    }
    ,
    oe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        oe.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    oe.expr.filters.animated = function(e) {
        return oe.grep(oe.timers, function(t) {
            return e === t.elem
        }).length
    }
    ;
    var on = e.document.documentElement;
    oe.offset = {
        setOffset: function(e, t, n) {
            var i, o, r, a, s, l, c, u = oe.css(e, "position"), d = oe(e), p = {};
            "static" === u && (e.style.position = "relative"),
            s = d.offset(),
            r = oe.css(e, "top"),
            l = oe.css(e, "left"),
            c = ("absolute" === u || "fixed" === u) && oe.inArray("auto", [r, l]) > -1,
            c ? (i = d.position(),
            a = i.top,
            o = i.left) : (a = parseFloat(r) || 0,
            o = parseFloat(l) || 0),
            oe.isFunction(t) && (t = t.call(e, n, s)),
            null != t.top && (p.top = t.top - s.top + a),
            null != t.left && (p.left = t.left - s.left + o),
            "using"in t ? t.using.call(e, p) : d.css(p)
        }
    },
    oe.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each(function(t) {
                    oe.offset.setOffset(this, e, t)
                });
            var t, n, i = {
                top: 0,
                left: 0
            }, o = this[0], r = o && o.ownerDocument;
            return r ? (t = r.documentElement,
            oe.contains(t, o) ? (typeof o.getBoundingClientRect !== Ce && (i = o.getBoundingClientRect()),
            n = V(r),
            {
                top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : i) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                    top: 0,
                    left: 0
                }, i = this[0];
                return "fixed" === oe.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(),
                t = this.offset(),
                oe.nodeName(e[0], "html") || (n = e.offset()),
                n.top += oe.css(e[0], "borderTopWidth", !0),
                n.left += oe.css(e[0], "borderLeftWidth", !0)),
                {
                    top: t.top - n.top - oe.css(i, "marginTop", !0),
                    left: t.left - n.left - oe.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || on; e && !oe.nodeName(e, "html") && "static" === oe.css(e, "position"); )
                    e = e.offsetParent;
                return e || on
            })
        }
    }),
    oe.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        oe.fn[e] = function(i) {
            return $e(this, function(e, i, o) {
                var r = V(e);
                return void 0 === o ? r ? t in r ? r[t] : r.document.documentElement[i] : e[i] : void (r ? r.scrollTo(n ? oe(r).scrollLeft() : o, n ? o : oe(r).scrollTop()) : e[i] = o)
            }, e, i, arguments.length, null )
        }
    }),
    oe.each(["top", "left"], function(e, t) {
        oe.cssHooks[t] = k(ne.pixelPosition, function(e, n) {
            return n ? (n = tt(e, t),
            it.test(n) ? oe(e).position()[t] + "px" : n) : void 0
        })
    }),
    oe.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        oe.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            oe.fn[i] = function(i, o) {
                var r = arguments.length && (n || "boolean" != typeof i)
                  , a = n || (i === !0 || o === !0 ? "margin" : "border");
                return $e(this, function(t, n, i) {
                    var o;
                    return oe.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                    Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? oe.css(t, n, a) : oe.style(t, n, i, a)
                }, t, r ? i : void 0, r, null )
            }
        })
    }),
    oe.fn.size = function() {
        return this.length
    }
    ,
    oe.fn.andSelf = oe.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return oe
    });
    var rn = e.jQuery
      , an = e.$;
    return oe.noConflict = function(t) {
        return e.$ === oe && (e.$ = an),
        t && e.jQuery === oe && (e.jQuery = rn),
        oe
    }
    ,
    typeof t === Ce && (e.jQuery = e.$ = oe),
    oe
}),
"undefined" == typeof jQuery)
    throw new Error("Bootstrap's JavaScript requires jQuery");
+function(e) {
    "use strict";
    var t = e.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 == t[0] && 9 == t[1] && t[2] < 1)
        throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery),
+function(e) {
    "use strict";
    function t() {
        var e = document.createElement("bootstrap")
          , t = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var n in t)
            if (void 0 !== e.style[n])
                return {
                    end: t[n]
                };
        return !1
    }
    e.fn.emulateTransitionEnd = function(t) {
        var n = !1
          , i = this;
        e(this).one("bsTransitionEnd", function() {
            n = !0
        });
        var o = function() {
            n || e(i).trigger(e.support.transition.end)
        };
        return setTimeout(o, t),
        this
    }
    ,
    e(function() {
        e.support.transition = t(),
        e.support.transition && (e.event.special.bsTransitionEnd = {
            bindType: e.support.transition.end,
            delegateType: e.support.transition.end,
            handle: function(t) {
                if (e(t.target).is(this))
                    return t.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var n = e(this)
              , o = n.data("bs.alert");
            o || n.data("bs.alert", o = new i(this)),
            "string" == typeof t && o[t].call(n)
        })
    }
    var n = '[data-dismiss="alert"]'
      , i = function(t) {
        e(t).on("click", n, this.close)
    };
    i.VERSION = "3.3.5",
    i.TRANSITION_DURATION = 150,
    i.prototype.close = function(t) {
        function n() {
            a.detach().trigger("closed.bs.alert").remove()
        }
        var o = e(this)
          , r = o.attr("data-target");
        r || (r = o.attr("href"),
        r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
        var a = e(r);
        t && t.preventDefault(),
        a.length || (a = o.closest(".alert")),
        a.trigger(t = e.Event("close.bs.alert")),
        t.isDefaultPrevented() || (a.removeClass("in"),
        e.support.transition && a.hasClass("fade") ? a.one("bsTransitionEnd", n).emulateTransitionEnd(i.TRANSITION_DURATION) : n())
    }
    ;
    var o = e.fn.alert;
    e.fn.alert = t,
    e.fn.alert.Constructor = i,
    e.fn.alert.noConflict = function() {
        return e.fn.alert = o,
        this
    }
    ,
    e(document).on("click.bs.alert.data-api", n, i.prototype.close)
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.button")
              , r = "object" == typeof t && t;
            o || i.data("bs.button", o = new n(this,r)),
            "toggle" == t ? o.toggle() : t && o.setState(t)
        })
    }
    var n = function(t, i) {
        this.$element = e(t),
        this.options = e.extend({}, n.DEFAULTS, i),
        this.isLoading = !1
    };
    n.VERSION = "3.3.5",
    n.DEFAULTS = {
        loadingText: "loading..."
    },
    n.prototype.setState = function(t) {
        var n = "disabled"
          , i = this.$element
          , o = i.is("input") ? "val" : "html"
          , r = i.data();
        t += "Text",
        null == r.resetText && i.data("resetText", i[o]()),
        setTimeout(e.proxy(function() {
            i[o](null == r[t] ? this.options[t] : r[t]),
            "loadingText" == t ? (this.isLoading = !0,
            i.addClass(n).attr(n, n)) : this.isLoading && (this.isLoading = !1,
            i.removeClass(n).removeAttr(n))
        }, this), 0)
    }
    ,
    n.prototype.toggle = function() {
        var e = !0
          , t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var n = this.$element.find("input");
            "radio" == n.prop("type") ? (n.prop("checked") && (e = !1),
            t.find(".active").removeClass("active"),
            this.$element.addClass("active")) : "checkbox" == n.prop("type") && (n.prop("checked") !== this.$element.hasClass("active") && (e = !1),
            this.$element.toggleClass("active")),
            n.prop("checked", this.$element.hasClass("active")),
            e && n.trigger("change")
        } else
            this.$element.attr("aria-pressed", !this.$element.hasClass("active")),
            this.$element.toggleClass("active")
    }
    ;
    var i = e.fn.button;
    e.fn.button = t,
    e.fn.button.Constructor = n,
    e.fn.button.noConflict = function() {
        return e.fn.button = i,
        this
    }
    ,
    e(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(n) {
        var i = e(n.target);
        i.hasClass("btn") || (i = i.closest(".btn")),
        t.call(i, "toggle"),
        e(n.target).is('input[type="radio"]') || e(n.target).is('input[type="checkbox"]') || n.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(t) {
        e(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type))
    })
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        var n, i = t.attr("data-target") || (n = t.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "");
        return e(i)
    }
    function n(t) {
        return this.each(function() {
            var n = e(this)
              , o = n.data("bs.collapse")
              , r = e.extend({}, i.DEFAULTS, n.data(), "object" == typeof t && t);
            !o && r.toggle && /show|hide/.test(t) && (r.toggle = !1),
            o || n.data("bs.collapse", o = new i(this,r)),
            "string" == typeof t && o[t]()
        })
    }
    var i = function(t, n) {
        this.$element = e(t),
        this.options = e.extend({}, i.DEFAULTS, n),
        this.$trigger = e('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'),
        this.transitioning = null ,
        this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
        this.options.toggle && this.toggle()
    };
    i.VERSION = "3.3.5",
    i.TRANSITION_DURATION = 350,
    i.DEFAULTS = {
        toggle: !0
    },
    i.prototype.dimension = function() {
        var e = this.$element.hasClass("width");
        return e ? "width" : "height"
    }
    ,
    i.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var t, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(o && o.length && (t = o.data("bs.collapse"),
            t && t.transitioning))) {
                var r = e.Event("show.bs.collapse");
                if (this.$element.trigger(r),
                !r.isDefaultPrevented()) {
                    o && o.length && (n.call(o, "hide"),
                    t || o.data("bs.collapse", null ));
                    var a = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[a](0).attr("aria-expanded", !0),
                    this.$trigger.removeClass("collapsed").attr("aria-expanded", !0),
                    this.transitioning = 1;
                    var s = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[a](""),
                        this.transitioning = 0,
                        this.$element.trigger("shown.bs.collapse")
                    };
                    if (!e.support.transition)
                        return s.call(this);
                    var l = e.camelCase(["scroll", a].join("-"));
                    this.$element.one("bsTransitionEnd", e.proxy(s, this)).emulateTransitionEnd(i.TRANSITION_DURATION)[a](this.$element[0][l])
                }
            }
        }
    }
    ,
    i.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var t = e.Event("hide.bs.collapse");
            if (this.$element.trigger(t),
            !t.isDefaultPrevented()) {
                var n = this.dimension();
                this.$element[n](this.$element[n]())[0].offsetHeight,
                this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1),
                this.$trigger.addClass("collapsed").attr("aria-expanded", !1),
                this.transitioning = 1;
                var o = function() {
                    this.transitioning = 0,
                    this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return e.support.transition ? void this.$element[n](0).one("bsTransitionEnd", e.proxy(o, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : o.call(this)
            }
        }
    }
    ,
    i.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }
    ,
    i.prototype.getParent = function() {
        return e(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(e.proxy(function(n, i) {
            var o = e(i);
            this.addAriaAndCollapsedClass(t(o), o)
        }, this)).end()
    }
    ,
    i.prototype.addAriaAndCollapsedClass = function(e, t) {
        var n = e.hasClass("in");
        e.attr("aria-expanded", n),
        t.toggleClass("collapsed", !n).attr("aria-expanded", n)
    }
    ;
    var o = e.fn.collapse;
    e.fn.collapse = n,
    e.fn.collapse.Constructor = i,
    e.fn.collapse.noConflict = function() {
        return e.fn.collapse = o,
        this
    }
    ,
    e(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(i) {
        var o = e(this);
        o.attr("data-target") || i.preventDefault();
        var r = t(o)
          , a = r.data("bs.collapse")
          , s = a ? "toggle" : o.data();
        n.call(r, s)
    })
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        var n = t.attr("data-target");
        n || (n = t.attr("href"),
        n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var i = n && e(n);
        return i && i.length ? i : t.parent()
    }
    function n(n) {
        n && 3 === n.which || (e(o).remove(),
        e(r).each(function() {
            var i = e(this)
              , o = t(i)
              , r = {
                relatedTarget: this
            };
            o.hasClass("open") && (n && "click" == n.type && /input|textarea/i.test(n.target.tagName) && e.contains(o[0], n.target) || (o.trigger(n = e.Event("hide.bs.dropdown", r)),
            n.isDefaultPrevented() || (i.attr("aria-expanded", "false"),
            o.removeClass("open").trigger("hidden.bs.dropdown", r))))
        }))
    }
    function i(t) {
        return this.each(function() {
            var n = e(this)
              , i = n.data("bs.dropdown");
            i || n.data("bs.dropdown", i = new a(this)),
            "string" == typeof t && i[t].call(n)
        })
    }
    var o = ".dropdown-backdrop"
      , r = '[data-toggle="dropdown"]'
      , a = function(t) {
        e(t).on("click.bs.dropdown", this.toggle)
    };
    a.VERSION = "3.3.5",
    a.prototype.toggle = function(i) {
        var o = e(this);
        if (!o.is(".disabled, :disabled")) {
            var r = t(o)
              , a = r.hasClass("open");
            if (n(),
            !a) {
                "ontouchstart"in document.documentElement && !r.closest(".navbar-nav").length && e(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(e(this)).on("click", n);
                var s = {
                    relatedTarget: this
                };
                if (r.trigger(i = e.Event("show.bs.dropdown", s)),
                i.isDefaultPrevented())
                    return;
                o.trigger("focus").attr("aria-expanded", "true"),
                r.toggleClass("open").trigger("shown.bs.dropdown", s)
            }
            return !1
        }
    }
    ,
    a.prototype.keydown = function(n) {
        if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName)) {
            var i = e(this);
            if (n.preventDefault(),
            n.stopPropagation(),
            !i.is(".disabled, :disabled")) {
                var o = t(i)
                  , a = o.hasClass("open");
                if (!a && 27 != n.which || a && 27 == n.which)
                    return 27 == n.which && o.find(r).trigger("focus"),
                    i.trigger("click");
                var s = " li:not(.disabled):visible a"
                  , l = o.find(".dropdown-menu" + s);
                if (l.length) {
                    var c = l.index(n.target);
                    38 == n.which && c > 0 && c--,
                    40 == n.which && c < l.length - 1 && c++,
                    ~c || (c = 0),
                    l.eq(c).trigger("focus")
                }
            }
        }
    }
    ;
    var s = e.fn.dropdown;
    e.fn.dropdown = i,
    e.fn.dropdown.Constructor = a,
    e.fn.dropdown.noConflict = function() {
        return e.fn.dropdown = s,
        this
    }
    ,
    e(document).on("click.bs.dropdown.data-api", n).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation()
    }).on("click.bs.dropdown.data-api", r, a.prototype.toggle).on("keydown.bs.dropdown.data-api", r, a.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", a.prototype.keydown)
}(jQuery),
+function(e) {
    "use strict";
    function t(t, i) {
        return this.each(function() {
            var o = e(this)
              , r = o.data("bs.modal")
              , a = e.extend({}, n.DEFAULTS, o.data(), "object" == typeof t && t);
            r || o.data("bs.modal", r = new n(this,a)),
            "string" == typeof t ? r[t](i) : a.show && r.show(i)
        })
    }
    var n = function(t, n) {
        this.options = n,
        this.$body = e(document.body),
        this.$element = e(t),
        this.$dialog = this.$element.find(".modal-dialog"),
        this.$backdrop = null ,
        this.isShown = null ,
        this.originalBodyPad = null ,
        this.scrollbarWidth = 0,
        this.ignoreBackdropClick = !1,
        this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    n.VERSION = "3.3.5",
    n.TRANSITION_DURATION = 300,
    n.BACKDROP_TRANSITION_DURATION = 150,
    n.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    n.prototype.toggle = function(e) {
        return this.isShown ? this.hide() : this.show(e)
    }
    ,
    n.prototype.show = function(t) {
        var i = this
          , o = e.Event("show.bs.modal", {
            relatedTarget: t
        });
        this.$element.trigger(o),
        this.isShown || o.isDefaultPrevented() || (this.isShown = !0,
        this.checkScrollbar(),
        this.setScrollbar(),
        this.$body.addClass("modal-open"),
        this.escape(),
        this.resize(),
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)),
        this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            i.$element.one("mouseup.dismiss.bs.modal", function(t) {
                e(t.target).is(i.$element) && (i.ignoreBackdropClick = !0)
            })
        }),
        this.backdrop(function() {
            var o = e.support.transition && i.$element.hasClass("fade");
            i.$element.parent().length || i.$element.appendTo(i.$body),
            i.$element.show().scrollTop(0),
            i.adjustDialog(),
            o && i.$element[0].offsetWidth,
            i.$element.addClass("in"),
            i.enforceFocus();
            var r = e.Event("shown.bs.modal", {
                relatedTarget: t
            });
            o ? i.$dialog.one("bsTransitionEnd", function() {
                i.$element.trigger("focus").trigger(r)
            }).emulateTransitionEnd(n.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(r)
        }))
    }
    ,
    n.prototype.hide = function(t) {
        t && t.preventDefault(),
        t = e.Event("hide.bs.modal"),
        this.$element.trigger(t),
        this.isShown && !t.isDefaultPrevented() && (this.isShown = !1,
        this.escape(),
        this.resize(),
        e(document).off("focusin.bs.modal"),
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),
        this.$dialog.off("mousedown.dismiss.bs.modal"),
        e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(n.TRANSITION_DURATION) : this.hideModal())
    }
    ,
    n.prototype.enforceFocus = function() {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e) {
            this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger("focus")
        }, this))
    }
    ,
    n.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy(function(e) {
            27 == e.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }
    ,
    n.prototype.resize = function() {
        this.isShown ? e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window).off("resize.bs.modal")
    }
    ,
    n.prototype.hideModal = function() {
        var e = this;
        this.$element.hide(),
        this.backdrop(function() {
            e.$body.removeClass("modal-open"),
            e.resetAdjustments(),
            e.resetScrollbar(),
            e.$element.trigger("hidden.bs.modal")
        })
    }
    ,
    n.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(),
        this.$backdrop = null
    }
    ,
    n.prototype.backdrop = function(t) {
        var i = this
          , o = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var r = e.support.transition && o;
            if (this.$backdrop = e(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body),
            this.$element.on("click.dismiss.bs.modal", e.proxy(function(e) {
                return this.ignoreBackdropClick ? void (this.ignoreBackdropClick = !1) : void (e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
            }, this)),
            r && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass("in"),
            !t)
                return;
            r ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : t()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var a = function() {
                i.removeBackdrop(),
                t && t()
            };
            e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", a).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : a()
        } else
            t && t()
    }
    ,
    n.prototype.handleUpdate = function() {
        this.adjustDialog()
    }
    ,
    n.prototype.adjustDialog = function() {
        var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
        })
    }
    ,
    n.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }
    ,
    n.prototype.checkScrollbar = function() {
        var e = window.innerWidth;
        if (!e) {
            var t = document.documentElement.getBoundingClientRect();
            e = t.right - Math.abs(t.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < e,
        this.scrollbarWidth = this.measureScrollbar()
    }
    ,
    n.prototype.setScrollbar = function() {
        var e = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "",
        this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
    }
    ,
    n.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad)
    }
    ,
    n.prototype.measureScrollbar = function() {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure",
        this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        return this.$body[0].removeChild(e),
        t
    }
    ;
    var i = e.fn.modal;
    e.fn.modal = t,
    e.fn.modal.Constructor = n,
    e.fn.modal.noConflict = function() {
        return e.fn.modal = i,
        this
    }
    ,
    e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(n) {
        var i = e(this)
          , o = i.attr("href")
          , r = e(i.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, ""))
          , a = r.data("bs.modal") ? "toggle" : e.extend({
            remote: !/#/.test(o) && o
        }, r.data(), i.data());
        i.is("a") && n.preventDefault(),
        r.one("show.bs.modal", function(e) {
            e.isDefaultPrevented() || r.one("hidden.bs.modal", function() {
                i.is(":visible") && i.trigger("focus")
            })
        }),
        t.call(r, a, this)
    })
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.tooltip")
              , r = "object" == typeof t && t;
            !o && /destroy|hide/.test(t) || (o || i.data("bs.tooltip", o = new n(this,r)),
            "string" == typeof t && o[t]())
        })
    }
    var n = function(e, t) {
        this.type = null ,
        this.options = null ,
        this.enabled = null ,
        this.timeout = null ,
        this.hoverState = null ,
        this.$element = null ,
        this.inState = null ,
        this.init("tooltip", e, t)
    };
    n.VERSION = "3.3.5",
    n.TRANSITION_DURATION = 150,
    n.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    },
    n.prototype.init = function(t, n, i) {
        if (this.enabled = !0,
        this.type = t,
        this.$element = e(n),
        this.options = this.getOptions(i),
        this.$viewport = this.options.viewport && e(e.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport),
        this.inState = {
            click: !1,
            hover: !1,
            focus: !1
        },
        this.$element[0]instanceof document.constructor && !this.options.selector)
            throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var o = this.options.trigger.split(" "), r = o.length; r--; ) {
            var a = o[r];
            if ("click" == a)
                this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
            else if ("manual" != a) {
                var s = "hover" == a ? "mouseenter" : "focusin"
                  , l = "hover" == a ? "mouseleave" : "focusout";
                this.$element.on(s + "." + this.type, this.options.selector, e.proxy(this.enter, this)),
                this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }
    ,
    n.prototype.getDefaults = function() {
        return n.DEFAULTS
    }
    ,
    n.prototype.getOptions = function(t) {
        return t = e.extend({}, this.getDefaults(), this.$element.data(), t),
        t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }),
        t
    }
    ,
    n.prototype.getDelegateOptions = function() {
        var t = {}
          , n = this.getDefaults();
        return this._options && e.each(this._options, function(e, i) {
            n[e] != i && (t[e] = i)
        }),
        t
    }
    ,
    n.prototype.enter = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        return n || (n = new this.constructor(t.currentTarget,this.getDelegateOptions()),
        e(t.currentTarget).data("bs." + this.type, n)),
        t instanceof e.Event && (n.inState["focusin" == t.type ? "focus" : "hover"] = !0),
        n.tip().hasClass("in") || "in" == n.hoverState ? void (n.hoverState = "in") : (clearTimeout(n.timeout),
        n.hoverState = "in",
        n.options.delay && n.options.delay.show ? void (n.timeout = setTimeout(function() {
            "in" == n.hoverState && n.show()
        }, n.options.delay.show)) : n.show())
    }
    ,
    n.prototype.isInStateTrue = function() {
        for (var e in this.inState)
            if (this.inState[e])
                return !0;
        return !1
    }
    ,
    n.prototype.leave = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        if (n || (n = new this.constructor(t.currentTarget,this.getDelegateOptions()),
        e(t.currentTarget).data("bs." + this.type, n)),
        t instanceof e.Event && (n.inState["focusout" == t.type ? "focus" : "hover"] = !1),
        !n.isInStateTrue())
            return clearTimeout(n.timeout),
            n.hoverState = "out",
            n.options.delay && n.options.delay.hide ? void (n.timeout = setTimeout(function() {
                "out" == n.hoverState && n.hide()
            }, n.options.delay.hide)) : n.hide()
    }
    ,
    n.prototype.show = function() {
        var t = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(t);
            var i = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (t.isDefaultPrevented() || !i)
                return;
            var o = this
              , r = this.tip()
              , a = this.getUID(this.type);
            this.setContent(),
            r.attr("id", a),
            this.$element.attr("aria-describedby", a),
            this.options.animation && r.addClass("fade");
            var s = "function" == typeof this.options.placement ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement
              , l = /\s?auto?\s?/i
              , c = l.test(s);
            c && (s = s.replace(l, "") || "top"),
            r.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(s).data("bs." + this.type, this),
            this.options.container ? r.appendTo(this.options.container) : r.insertAfter(this.$element),
            this.$element.trigger("inserted.bs." + this.type);
            var u = this.getPosition()
              , d = r[0].offsetWidth
              , p = r[0].offsetHeight;
            if (c) {
                var f = s
                  , h = this.getPosition(this.$viewport);
                s = "bottom" == s && u.bottom + p > h.bottom ? "top" : "top" == s && u.top - p < h.top ? "bottom" : "right" == s && u.right + d > h.width ? "left" : "left" == s && u.left - d < h.left ? "right" : s,
                r.removeClass(f).addClass(s)
            }
            var g = this.getCalculatedOffset(s, u, d, p);
            this.applyPlacement(g, s);
            var m = function() {
                var e = o.hoverState;
                o.$element.trigger("shown.bs." + o.type),
                o.hoverState = null ,
                "out" == e && o.leave(o)
            };
            e.support.transition && this.$tip.hasClass("fade") ? r.one("bsTransitionEnd", m).emulateTransitionEnd(n.TRANSITION_DURATION) : m();
        }
    }
    ,
    n.prototype.applyPlacement = function(t, n) {
        var i = this.tip()
          , o = i[0].offsetWidth
          , r = i[0].offsetHeight
          , a = parseInt(i.css("margin-top"), 10)
          , s = parseInt(i.css("margin-left"), 10);
        isNaN(a) && (a = 0),
        isNaN(s) && (s = 0),
        t.top += a,
        t.left += s,
        e.offset.setOffset(i[0], e.extend({
            using: function(e) {
                i.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                })
            }
        }, t), 0),
        i.addClass("in");
        var l = i[0].offsetWidth
          , c = i[0].offsetHeight;
        "top" == n && c != r && (t.top = t.top + r - c);
        var u = this.getViewportAdjustedDelta(n, t, l, c);
        u.left ? t.left += u.left : t.top += u.top;
        var d = /top|bottom/.test(n)
          , p = d ? 2 * u.left - o + l : 2 * u.top - r + c
          , f = d ? "offsetWidth" : "offsetHeight";
        i.offset(t),
        this.replaceArrow(p, i[0][f], d)
    }
    ,
    n.prototype.replaceArrow = function(e, t, n) {
        this.arrow().css(n ? "left" : "top", 50 * (1 - e / t) + "%").css(n ? "top" : "left", "")
    }
    ,
    n.prototype.setContent = function() {
        var e = this.tip()
          , t = this.getTitle();
        e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t),
        e.removeClass("fade in top bottom left right")
    }
    ,
    n.prototype.hide = function(t) {
        function i() {
            "in" != o.hoverState && r.detach(),
            o.$element.removeAttr("aria-describedby").trigger("hidden.bs." + o.type),
            t && t()
        }
        var o = this
          , r = e(this.$tip)
          , a = e.Event("hide.bs." + this.type);
        if (this.$element.trigger(a),
        !a.isDefaultPrevented())
            return r.removeClass("in"),
            e.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(n.TRANSITION_DURATION) : i(),
            this.hoverState = null ,
            this
    }
    ,
    n.prototype.fixTitle = function() {
        var e = this.$element;
        (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    }
    ,
    n.prototype.hasContent = function() {
        return this.getTitle()
    }
    ,
    n.prototype.getPosition = function(t) {
        t = t || this.$element;
        var n = t[0]
          , i = "BODY" == n.tagName
          , o = n.getBoundingClientRect();
        null == o.width && (o = e.extend({}, o, {
            width: o.right - o.left,
            height: o.bottom - o.top
        }));
        var r = i ? {
            top: 0,
            left: 0
        } : t.offset()
          , a = {
            scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
        }
          , s = i ? {
            width: e(window).width(),
            height: e(window).height()
        } : null ;
        return e.extend({}, o, a, s, r)
    }
    ,
    n.prototype.getCalculatedOffset = function(e, t, n, i) {
        return "bottom" == e ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - n / 2
        } : "top" == e ? {
            top: t.top - i,
            left: t.left + t.width / 2 - n / 2
        } : "left" == e ? {
            top: t.top + t.height / 2 - i / 2,
            left: t.left - n
        } : {
            top: t.top + t.height / 2 - i / 2,
            left: t.left + t.width
        }
    }
    ,
    n.prototype.getViewportAdjustedDelta = function(e, t, n, i) {
        var o = {
            top: 0,
            left: 0
        };
        if (!this.$viewport)
            return o;
        var r = this.options.viewport && this.options.viewport.padding || 0
          , a = this.getPosition(this.$viewport);
        if (/right|left/.test(e)) {
            var s = t.top - r - a.scroll
              , l = t.top + r - a.scroll + i;
            s < a.top ? o.top = a.top - s : l > a.top + a.height && (o.top = a.top + a.height - l)
        } else {
            var c = t.left - r
              , u = t.left + r + n;
            c < a.left ? o.left = a.left - c : u > a.right && (o.left = a.left + a.width - u)
        }
        return o
    }
    ,
    n.prototype.getTitle = function() {
        var e, t = this.$element, n = this.options;
        return e = t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    }
    ,
    n.prototype.getUID = function(e) {
        do
            e += ~~(1e6 * Math.random());
        while (document.getElementById(e));return e
    }
    ,
    n.prototype.tip = function() {
        if (!this.$tip && (this.$tip = e(this.options.template),
        1 != this.$tip.length))
            throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }
    ,
    n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }
    ,
    n.prototype.enable = function() {
        this.enabled = !0
    }
    ,
    n.prototype.disable = function() {
        this.enabled = !1
    }
    ,
    n.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }
    ,
    n.prototype.toggle = function(t) {
        var n = this;
        t && (n = e(t.currentTarget).data("bs." + this.type),
        n || (n = new this.constructor(t.currentTarget,this.getDelegateOptions()),
        e(t.currentTarget).data("bs." + this.type, n))),
        t ? (n.inState.click = !n.inState.click,
        n.isInStateTrue() ? n.enter(n) : n.leave(n)) : n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
    }
    ,
    n.prototype.destroy = function() {
        var e = this;
        clearTimeout(this.timeout),
        this.hide(function() {
            e.$element.off("." + e.type).removeData("bs." + e.type),
            e.$tip && e.$tip.detach(),
            e.$tip = null ,
            e.$arrow = null ,
            e.$viewport = null
        })
    }
    ;
    var i = e.fn.tooltip;
    e.fn.tooltip = t,
    e.fn.tooltip.Constructor = n,
    e.fn.tooltip.noConflict = function() {
        return e.fn.tooltip = i,
        this
    }
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.popover")
              , r = "object" == typeof t && t;
            !o && /destroy|hide/.test(t) || (o || i.data("bs.popover", o = new n(this,r)),
            "string" == typeof t && o[t]())
        })
    }
    var n = function(e, t) {
        this.init("popover", e, t)
    };
    if (!e.fn.tooltip)
        throw new Error("Popover requires tooltip.js");
    n.VERSION = "3.3.5",
    n.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }),
    n.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype),
    n.prototype.constructor = n,
    n.prototype.getDefaults = function() {
        return n.DEFAULTS
    }
    ,
    n.prototype.setContent = function() {
        var e = this.tip()
          , t = this.getTitle()
          , n = this.getContent();
        e.find(".popover-title")[this.options.html ? "html" : "text"](t),
        e.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n),
        e.removeClass("fade top bottom left right in"),
        e.find(".popover-title").html() || e.find(".popover-title").hide()
    }
    ,
    n.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }
    ,
    n.prototype.getContent = function() {
        var e = this.$element
          , t = this.options;
        return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
    }
    ,
    n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }
    ;
    var i = e.fn.popover;
    e.fn.popover = t,
    e.fn.popover.Constructor = n,
    e.fn.popover.noConflict = function() {
        return e.fn.popover = i,
        this
    }
}(jQuery),
+function(e) {
    "use strict";
    function t(n, i) {
        this.$body = e(document.body),
        this.$scrollElement = e(e(n).is(document.body) ? window : n),
        this.options = e.extend({}, t.DEFAULTS, i),
        this.selector = (this.options.target || "") + " .nav li > a",
        this.offsets = [],
        this.targets = [],
        this.activeTarget = null ,
        this.scrollHeight = 0,
        this.$scrollElement.on("scroll.bs.scrollspy", e.proxy(this.process, this)),
        this.refresh(),
        this.process()
    }
    function n(n) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.scrollspy")
              , r = "object" == typeof n && n;
            o || i.data("bs.scrollspy", o = new t(this,r)),
            "string" == typeof n && o[n]()
        })
    }
    t.VERSION = "3.3.5",
    t.DEFAULTS = {
        offset: 10
    },
    t.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }
    ,
    t.prototype.refresh = function() {
        var t = this
          , n = "offset"
          , i = 0;
        this.offsets = [],
        this.targets = [],
        this.scrollHeight = this.getScrollHeight(),
        e.isWindow(this.$scrollElement[0]) || (n = "position",
        i = this.$scrollElement.scrollTop()),
        this.$body.find(this.selector).map(function() {
            var t = e(this)
              , o = t.data("target") || t.attr("href")
              , r = /^#./.test(o) && e(o);
            return r && r.length && r.is(":visible") && [[r[n]().top + i, o]] || null
        }).sort(function(e, t) {
            return e[0] - t[0]
        }).each(function() {
            t.offsets.push(this[0]),
            t.targets.push(this[1])
        })
    }
    ,
    t.prototype.process = function() {
        var e, t = this.$scrollElement.scrollTop() + this.options.offset, n = this.getScrollHeight(), i = this.options.offset + n - this.$scrollElement.height(), o = this.offsets, r = this.targets, a = this.activeTarget;
        if (this.scrollHeight != n && this.refresh(),
        t >= i)
            return a != (e = r[r.length - 1]) && this.activate(e);
        if (a && t < o[0])
            return this.activeTarget = null ,
            this.clear();
        for (e = o.length; e--; )
            a != r[e] && t >= o[e] && (void 0 === o[e + 1] || t < o[e + 1]) && this.activate(r[e])
    }
    ,
    t.prototype.activate = function(t) {
        this.activeTarget = t,
        this.clear();
        var n = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]'
          , i = e(n).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active")),
        i.trigger("activate.bs.scrollspy")
    }
    ,
    t.prototype.clear = function() {
        e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    }
    ;
    var i = e.fn.scrollspy;
    e.fn.scrollspy = n,
    e.fn.scrollspy.Constructor = t,
    e.fn.scrollspy.noConflict = function() {
        return e.fn.scrollspy = i,
        this
    }
    ,
    e(window).on("load.bs.scrollspy.data-api", function() {
        e('[data-spy="scroll"]').each(function() {
            var t = e(this);
            n.call(t, t.data())
        })
    })
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.tab");
            o || i.data("bs.tab", o = new n(this)),
            "string" == typeof t && o[t]()
        })
    }
    var n = function(t) {
        this.element = e(t)
    };
    n.VERSION = "3.3.5",
    n.TRANSITION_DURATION = 150,
    n.prototype.show = function() {
        var t = this.element
          , n = t.closest("ul:not(.dropdown-menu)")
          , i = t.data("target");
        if (i || (i = t.attr("href"),
        i = i && i.replace(/.*(?=#[^\s]*$)/, "")),
        !t.parent("li").hasClass("active")) {
            var o = n.find(".active:last a")
              , r = e.Event("hide.bs.tab", {
                relatedTarget: t[0]
            })
              , a = e.Event("show.bs.tab", {
                relatedTarget: o[0]
            });
            if (o.trigger(r),
            t.trigger(a),
            !a.isDefaultPrevented() && !r.isDefaultPrevented()) {
                var s = e(i);
                this.activate(t.closest("li"), n),
                this.activate(s, s.parent(), function() {
                    o.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: t[0]
                    }),
                    t.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: o[0]
                    })
                })
            }
        }
    }
    ,
    n.prototype.activate = function(t, i, o) {
        function r() {
            a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1),
            t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0),
            s ? (t[0].offsetWidth,
            t.addClass("in")) : t.removeClass("fade"),
            t.parent(".dropdown-menu").length && t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0),
            o && o()
        }
        var a = i.find("> .active")
          , s = o && e.support.transition && (a.length && a.hasClass("fade") || !!i.find("> .fade").length);
        a.length && s ? a.one("bsTransitionEnd", r).emulateTransitionEnd(n.TRANSITION_DURATION) : r(),
        a.removeClass("in")
    }
    ;
    var i = e.fn.tab;
    e.fn.tab = t,
    e.fn.tab.Constructor = n,
    e.fn.tab.noConflict = function() {
        return e.fn.tab = i,
        this
    }
    ;
    var o = function(n) {
        n.preventDefault(),
        t.call(e(this), "show")
    };
    e(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
}(jQuery),
+function(e) {
    "use strict";
    function t(t) {
        return this.each(function() {
            var i = e(this)
              , o = i.data("bs.affix")
              , r = "object" == typeof t && t;
            o || i.data("bs.affix", o = new n(this,r)),
            "string" == typeof t && o[t]()
        })
    }
    var n = function(t, i) {
        this.options = e.extend({}, n.DEFAULTS, i),
        this.$target = e(this.options.target).on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)),
        this.$element = e(t),
        this.affixed = null ,
        this.unpin = null ,
        this.pinnedOffset = null ,
        this.checkPosition()
    };
    n.VERSION = "3.3.5",
    n.RESET = "affix affix-top affix-bottom",
    n.DEFAULTS = {
        offset: 0,
        target: window
    },
    n.prototype.getState = function(e, t, n, i) {
        var o = this.$target.scrollTop()
          , r = this.$element.offset()
          , a = this.$target.height();
        if (null != n && "top" == this.affixed)
            return o < n && "top";
        if ("bottom" == this.affixed)
            return null != n ? !(o + this.unpin <= r.top) && "bottom" : !(o + a <= e - i) && "bottom";
        var s = null == this.affixed
          , l = s ? o : r.top
          , c = s ? a : t;
        return null != n && o <= n ? "top" : null != i && l + c >= e - i && "bottom"
    }
    ,
    n.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset)
            return this.pinnedOffset;
        this.$element.removeClass(n.RESET).addClass("affix");
        var e = this.$target.scrollTop()
          , t = this.$element.offset();
        return this.pinnedOffset = t.top - e
    }
    ,
    n.prototype.checkPositionWithEventLoop = function() {
        setTimeout(e.proxy(this.checkPosition, this), 1)
    }
    ,
    n.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var t = this.$element.height()
              , i = this.options.offset
              , o = i.top
              , r = i.bottom
              , a = Math.max(e(document).height(), e(document.body).height());
            "object" != typeof i && (r = o = i),
            "function" == typeof o && (o = i.top(this.$element)),
            "function" == typeof r && (r = i.bottom(this.$element));
            var s = this.getState(a, t, o, r);
            if (this.affixed != s) {
                null != this.unpin && this.$element.css("top", "");
                var l = "affix" + (s ? "-" + s : "")
                  , c = e.Event(l + ".bs.affix");
                if (this.$element.trigger(c),
                c.isDefaultPrevented())
                    return;
                this.affixed = s,
                this.unpin = "bottom" == s ? this.getPinnedOffset() : null ,
                this.$element.removeClass(n.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == s && this.$element.offset({
                top: a - t - r
            })
        }
    }
    ;
    var i = e.fn.affix;
    e.fn.affix = t,
    e.fn.affix.Constructor = n,
    e.fn.affix.noConflict = function() {
        return e.fn.affix = i,
        this
    }
    ,
    e(window).on("load", function() {
        e('[data-spy="affix"]').each(function() {
            var n = e(this)
              , i = n.data();
            i.offset = i.offset || {},
            null != i.offsetBottom && (i.offset.bottom = i.offsetBottom),
            null != i.offsetTop && (i.offset.top = i.offsetTop),
            t.call(n, i)
        })
    })
}(jQuery),
!function() {
    var e = function() {
        return {
            debounce: function(e, t, n) {
                var i, o;
                return function() {
                    var r, a, s = this, l = arguments;
                    return r = function() {
                        i = null ,
                        n || (o = e.apply(s, l))
                    }
                    ,
                    a = n && !i,
                    clearTimeout(i),
                    i = setTimeout(r, t),
                    a && (o = e.apply(s, l)),
                    o
                }
            }
        }
    }()
      , t = function(e) {
        this.maxSize = "number" == typeof e ? e : 100,
        this.reset(),
        this.maxSize <= 0 && (this.set = this.get = null )
    };
    t.prototype.set = function(e, t) {
        var n, o = this.list.tail;
        this.size >= this.maxSize && (this.list.remove(o),
        delete this.hash[o.key]),
        (n = this.hash[e]) ? (n.val = t,
        this.list.moveToFront(n)) : (n = new i(e,t),
        this.list.add(n),
        this.hash[e] = n,
        this.size++)
    }
    ,
    t.prototype.get = function(e) {
        var t = this.hash[e];
        if (t)
            return this.list.moveToFront(t),
            t.val
    }
    ,
    t.prototype.reset = function() {
        this.size = 0,
        this.hash = {},
        this.list = new n
    }
    ;
    var n = function() {
        this.head = this.tail = null
    };
    n.prototype.add = function(e) {
        this.head && (e.next = this.head,
        this.head.prev = e),
        this.head = e,
        this.tail = this.tail || e
    }
    ,
    n.prototype.remove = function(e) {
        e.prev ? e.prev.next = e.next : this.head = e.next,
        e.next ? e.next.prev = e.prev : this.tail = e.prev
    }
    ,
    n.prototype.moveToFront = function(e) {
        this.remove(e),
        this.add(e)
    }
    ;
    var i = function(e, t) {
        this.key = e,
        this.val = t,
        this.prev = this.next = null
    }
      , o = function(e) {
        var n = {
            url: null ,
            cache: !0,
            waitTime: 0
        };
        this.utilObject = new Util,
        this.options = this.utilObject.extend(n, e || {}),
        this.options.cache ? this.cache = new t(10) : this.cache = null ,
        this.isMobile = this.utilObject.checkDevice(),
        this.attachEventHandlers(),
        this.hideDropDownHandler()
    };
    o.prototype.hideDropDownHandler = function() {
        var e = this;
        e.dropDownMenu.style.display = "none"
    }
    ,
    o.prototype.attachEventHandlers = function() {
        var e = this
          , t = "keydown keypress paste";
        this.isMobile ? this.options.el = document.querySelector("#msearch_mini_form .typeahead") : this.options.el = document.querySelector("#search_mini_form .typeahead");
        var n = this.options.el;
        this.utilObject.addMultipleEventSources(n, t, function(t) {
            return "keydown" !== t.type && "keypress" !== t.type || 40 != t.keyCode && 38 != t.keyCode && 13 != t.keyCode ? void e.handleInputChangeEvent() : void e.handleKeyPressEvent(t)
        }),
        this.attachClickAndHoverEvents(),
        n.addEventListener("blur", e.removeDropDownMenu)
    }
    ,
    o.prototype.sendXhrRequest = function(e) {
        var t = this
          , n = !1
          , i = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
        i.withCredentials = !1,
        i.open("GET", this.options.url + "?term=" + e),
        i.onload = i.onreadystatechange = function() {
            n || 200 != this.status || 4 != this.readyState || (n = !0,
            t.cache.set(e, this.responseText),
            t.handleResponse(this.responseText))
        }
        ,
        i.send()
    }
    ,
    o.prototype.handleInputChangeEvent = e.debounce(function() {
        this.fetchAutocompleteData()
    }, 200),
    o.prototype.handleKeyPressEvent = function(e) {
        var t = this;
        if (13 != e.keyCode)
            t.currentSuggestion = t.currentSuggestion || document.querySelector(".tt-suggestion"),
            40 == e.keyCode && t.firstTimeHit && (t.currentSuggestion.nextElementSibling || t.currentSuggestion.nextSibling) && (t.currentSuggestion = t.currentSuggestion.nextElementSibling || t.currentSuggestion.nextSibling),
            38 == e.keyCode && t.firstTimeHit && (t.currentSuggestion.previousElementSibling || t.currentSuggestion.previousSibling) && (t.currentSuggestion = t.currentSuggestion.previousElementSibling || t.currentSuggestion.previousSibling);
        else {
            if (13 != e.keyCode || !t.firstTimeHit)
                return;
            e.preventDefault(),
            e.stopPropagation();
            var n = t.getDataFromId();
            if (n)
                return void t.utilObject.customEvent("autocomplete:selected", n, t.currentSuggestion)
        }
        this.utilObject.customEvent("focus", null , t.currentSuggestion),
        t.firstTimeHit = !0
    }
    ,
    o.prototype.getDataFromId = function() {
        var e = this
          , t = null ;
        try {
            e.query && e.query.length > 0 && (t = JSON.parse(e.cache.hash[e.query].val))
        } catch (n) {
            t = null
        }
        return t && t.data && (t = t.data[e.utilObject.whichChild(e.currentSuggestion)]),
        t
    }
    ,
    o.prototype.fetchAutocompleteData = function() {
        this.query = this.options.el.value.trim(),
        this.query.length > this.options.minLength ? this.cache && this.cache.get(this.query) ? this.handleResponse(this.cache.get(this.query)) : this.sendXhrRequest(this.query) : this.removeDropDownMenu()
    }
    ,
    o.prototype.removeDropDownMenu = function() {
        document.querySelector(".tt-dataset-1") ? document.querySelector(".tt-dataset-1").remove() : null ,
        this.isMobile ? this.dropDownMenu = document.querySelector("#msearch_mini_form .tt-dropdown-menu") : this.dropDownMenu = document.querySelector("#search_mini_form .tt-dropdown-menu"),
        this.dropDownMenu.style.display = "none"
    }
    ,
    o.prototype.handleResponse = function(e) {
        var t;
        try {
            t = JSON.parse(e)
        } catch (n) {
            t = null
        }
        this.dropDownMenu.style.display = "block";
        var i = '<div class="tt-dataset-1"><span class="tt-suggestions" style="display:block;"></span></div>'
          , o = this.dropDownMenu;
        o.innerHTML = i,
        this.currentSuggestion = null ,
        this.firstTimeHit = !1;
        var r = {};
        if (t && t.data) {
            var a = t.data.slice(0, 10);
            r.response = a
        } else
            r.response = {};
        r.query = this.query,
        this.utilObject.customEvent("autocomplete:completed", r, document.querySelector("body"))
    }
    ,
    o.prototype.attachClickAndHoverEvents = function(t) {
        var n = this;
        this.isMobile ? this.dropDownMenu = document.querySelector("#msearch_mini_form .tt-dropdown-menu") : this.dropDownMenu = document.querySelector("#search_mini_form .tt-dropdown-menu"),
        this.dropDownMenu.addEventListener("focus", function(e) {
            for (var t = e.target.parentNode.firstChild; t && 1 === t.nodeType; )
                t !== this && t.className.indexOf("tt-suggestion") != -1 && (t.className = "tt-suggestion"),
                t = t.nextElementSibling || t.nextSibling;
            if (e.target.className.indexOf("tt-suggestion") != -1) {
                e.target.className = "tt-suggestion tt-cursor";
                var i = n.getDataFromId();
                i ? n.options.el.value = i.text : n.options.el.value = e.target.firstElementChild.children[1].textContent
            }
        }),
        this.dropDownMenu.addEventListener("mouseover", e.debounce(function(e) {
            if (e.preventDefault(),
            e.stopPropagation(),
            e.cancelBubble = !0,
            e.target != document.querySelector(".tt-dropdown-menu")) {
                var t = n.utilObject.sendDescendant(document.querySelector(".tt-suggestion"), e.target);
                if (n.currentSuggestion = t,
                t) {
                    for (var i = n.currentSuggestion.parentNode.firstChild; i && 1 === i.nodeType; )
                        i !== this && i.className.indexOf("tt-suggestion") != -1 && (i.className = "tt-suggestion"),
                        i = i.nextElementSibling || i.nextSibling;
                    n.currentSuggestion.className.indexOf("tt-suggestion") != -1 && (n.currentSuggestion.className = "tt-suggestion tt-cursor")
                }
            }
        }, 100))
    }
    ,
    window.Autocomplete = o
}(),
!function() {
    var e = function(e) {
        this.options = e,
        this.isMobile = this.checkDevice(),
        this.removeNotRequiredImages()
    };
    e.prototype.isBlankString = function(e) {
        return !e || /^\s*$/.test(e)
    }
    ,
    e.prototype.isString = function(e) {
        return "string" == typeof e
    }
    ,
    e.prototype.isNumber = function(e) {
        return "number" == typeof e
    }
    ,
    e.prototype.debounce = function(e, t, n) {
        var i, o;
        return function() {
            var r, a, s = this, l = arguments;
            return r = function() {
                i = null ,
                n || (o = e.apply(s, l))
            }
            ,
            a = n && !i,
            clearTimeout(i),
            i = setTimeout(r, t),
            a && (o = e.apply(s, l)),
            o
        }
    }
    ,
    e.prototype.extend = function(e, t) {
        for (var n in t)
            t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }
    ,
    e.prototype.addMultipleEventSources = function(e, t, n) {
        for (var t = t.split(" "), i = 0; i < t.length; i++)
            e.addEventListener(t[i], n)
    }
    ,
    e.prototype.customEvent = function(e, t, n) {
        var i;
        document.createEvent ? (i = document.createEvent("HTMLEvents"),
        i.response = t,
        i.initEvent(e, !0, !0)) : (i = document.createEventObject(),
        i.response = t,
        i.eventType = "HTMLEvents"),
        i.eventName = e,
        document.createEvent ? n.dispatchEvent(i) : n.fireEvent("on" + i.eventType, i)
    }
    ,
    e.prototype.sendDescendant = function(e, t) {
        for (var n = t.parentNode; null != n; ) {
            if (e.className.indexOf(n.className) >= 0)
                return n;
            n = n.parentNode
        }
        return null
    }
    ,
    e.prototype.whichChild = function(e) {
        for (var t = 0; null != (e = e.previousSibling); )
            ++t;
        return t
    }
    ,
    e.prototype.checkDevice = function() {
        return isMobile = !1,
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) && (isMobile = !0),
        isMobile
    }
    ,
    e.prototype.elementInViewport = function(e) {
        var t = e.getBoundingClientRect();
        return t.top >= 0 && t.left >= 0 && t.top <= (window.innerHeight || document.documentElement.clientHeight)
    }
    ,
    e.prototype.loadImage = function(e, t) {
        var n = new Image
          , i = e.getAttribute("data-src");
        n.onload = function() {
            e.parent ? e.parent.replaceChild(n, e) : e.src = i,
            t ? t(e) : null
        }
        ,
        null != i && (n.src = i),
        e.removeAttribute("data-src")
    }
    ,
    e.prototype.getImages = function(e) {
        return res = document.querySelectorAll(e),
        res
    }
    ,
    e.prototype.prefix_key = function(e, t) {
        var n = this
          , i = function(t) {
            return n.toFirstCapital(e) + ":" + t
        }
          , o = {
            discount: function(t) {
                return n.toFirstCapital(e) + ":Above " + t + "%"
            }
        }
          , r = o[e] || i;
        return t = t.map(function(e) {
            return r(e)
        }),
        t.join("|")
    }
    ,
    e.prototype.toFirstCapital = function(e) {
        return e.charAt(0).toUpperCase() + e.slice(1)
    }
    ,
    e.prototype.asyncLoader = function(e, t) {
        !function() {
            var n = document.createElement("script");
            n.type = "text/javascript",
            n.async = !0,
            n.src = e,
            n.withCredentials = !0;
            var i = document.getElementsByTagName("script")[0];
            if (i.parentNode.insertBefore(n, i),
            t) {
                var o = !1;
                n.onload = n.onreadystatechange = function() {
                    o || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (o = !0,
                    t(),
                    n.onload = n.onreadystatechange = null )
                }
            }
        }()
    }
    ,
    e.prototype.loadCss = function(e) {
        var t = document.createElement("link")
          , n = document.querySelector("body") || document.querySelector("head");
        t.setAttribute("rel", "stylesheet"),
        t.setAttribute("type", "text/css"),
        t.onload = function() {}
        ,
        n.appendChild(t),
        t.setAttribute("href", e)
    }
    ,
    e.prototype.preloadAssets = function(e) {
        var t = 0
          , n = 0
          , i = null
          , o = 0 === navigator.appName.indexOf("Microsoft");
        for (t = 0,
        n = e.length; t < n; t += 1)
            o ? (new Image).src = e[t] : (i = document.createElement("object"),
            i.data = e[t],
            i.width = 0,
            i.height = 0,
            document.body.appendChild(i))
    }
    ,
    e.prototype.getCookie = function(e) {
        for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
            for (var o = n[i]; " " == o.charAt(0); )
                o = o.substring(1);
            if (0 === o.indexOf(t))
                return o.substring(t.length, o.length)
        }
        return ""
    }
    ,
    e.prototype.setCookie = function(e, t, n) {
        var i = new Date;
        i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3);
        var o = "expires=" + i.toGMTString();
        document.cookie = e + "=" + t + "; " + o + ";domain=.craftsvilla.com; path=/"
    }
    ,
    e.prototype.pageLoadEvent = function() {
        var e = document.location.pathname
          , t = document.body.className.split(" ")[1];
        t.indexOf("searchresults") > -1 ? this.current_page = "Search Page" : t.indexOf("checkout-cart") > -1 ? this.current_page = "Cart Page" : t.indexOf("wishlist") > -1 ? this.current_page = "Wishlist Page" : t.indexOf("checkout-onepage-success") > -1 ? this.current_page = "Order Confirmation" : t.indexOf("catalog-category-feedservice") > -1 ? this.current_page = "Feed Page" : t.indexOf("catalogproduct-index-index") > -1 ? this.current_page = "Product Page" : t.indexOf("catalog-category-feed") > -1 ? this.current_page = "SubCategory Page" : t.indexOf("category") > -1 ? this.current_page = "Category Page" : t.indexOf("cms") > -1 ? this.current_page = "Home Page" : t.indexOf("customer-account-index") > -1 ? this.current_page = "customer account" : e.indexOf("checkout") > -1 ? this.current_page = "Checkout Page" : this.current_page = "Other Pages",
        dataLayer.push({
            event: "PageViews",
            eventName: "PageViews",
            Section: this.current_page,
            PageUrl: e
        }),
        dataLayer.push({
            site_page_type: this.current_page
        }),
        document.querySelector(".craftsvilla-smart-banner") || this.showSmartBanner()
    }
    ,
    e.prototype.showSmartBanner = function() {
        var e = navigator.userAgent.toLowerCase()
          , t = this
          , n = e.indexOf("android") > -1;
        if (n && ("Product Page" == this.current_page || "Category Page" == this.current_page || "Vendor Page" == this.current_page || "Feed Page" == this.current_page || "Home Page" == this.current_page) && !this.getCookie("sb-closed")) {
            this.isSmartBannerShown = !0;
            var i = $("#smart-title").val()
              , o = $("#smart-meta").val()
              , r = $("#smart-link").val()
              , a = $("#smart-star-class").val()
              , s = $("#smart-downloads").val()
              , l = $("#smart-text").val()
              , c = '<div class="craftsvilla-smart-banner visible-xs"><span class="btn-close-banner sm-ban-close sb-close">X</span><span class="j-app-icon"></span><div class="craftsvilla-content"><span class="banner-title">' + i + '</span><div class="meta-text">' + o + '</div><span class="rating-static ' + a + '"></span><span class="craftsvilla-app-downloads">' + s + '</span></div><a href="' + r + '" target="_blank" id="interstitial-url" class="btn-opn-app">' + l + "</a></div>";
            $("body").prepend(c),
            $(".sb-close").click(function(e) {
                e.preventDefault(),
                t.setCookie("sb-closed", !0, 30),
                $(".craftsvilla-smart-banner").remove(),
                $("body").css({
                    "padding-top": "0px"
                }),
                $(".craftsvilla-navbar").css({
                    top: "0px"
                }),
                $(".category-container").css({
                    "padding-top": "21px"
                }),
                $("#custom-header-dropdown > .dropdown-category").css({
                    "padding-top": "0px"
                }),
                $("#currency-list").css({
                    top: "0px"
                }),
                $(".category-page-container #sidebar").css({
                    padding: "0px"
                })
            }),
            $("body").css({
                "padding-top": "59px"
            }),
            $(".craftsvilla-navbar").css({
                top: "92px"
            }),
            $(".category-container").css({
                "padding-top": "121px"
            }),
            $("#custom-header-dropdown > .dropdown-category").css({
                "padding-top": "100px"
            }),
            $("#currency-list").css({
                top: "100px"
            }),
            $(".category-page-container > #sidebar").css({
                "padding-top": "95px",
                "padding-bottom": "95px",
                "padding-left": "0px",
                "padding-left": "0px"
            })
        }
    }
    ,
    e.prototype.getPageBaseUrl = function() {
        var e = window.location.hostname
          , t = "";
        return t = "www.craftsvilla.com" == e || "securestatic.craftsvilla.com" == e ? "http://www.craftsvilla.com" : "dev10.craftsvilla.com" == e || "securedev10.craftsvilla.com" == e ? "http://dev10.craftsvilla.com" : "dev9.craftsvilla.com" == e || "securedev9.craftsvilla.com" == e ? "http://dev9.craftsvilla.com" : "dev8.craftsvilla.com" == e || "securedev8.craftsvilla.com" == e ? "http://dev8.craftsvilla.com" : "dev7.craftsvilla.com" == e || "securedev7.craftsvilla.com" == e ? "http://dev7.craftsvilla.com" : "dev6.craftsvilla.com" == e || "securedev6.craftsvilla.com" == e ? "http://dev6.craftsvilla.com" : "http://local.craftsvilla.com"
    }
    ,
    e.prototype.setCookieWithDomain = function(e, t, n, i) {
        var o = new Date;
        o.setTime(o.getTime() + 24 * i * 60 * 60 * 1e3);
        var r = "expires=" + o.toGMTString();
        document.cookie = e + "=" + t + "; expires=" + r + "; path=/ ; domain=" + n
    }
    ,
    e.prototype.removeNotRequiredImages = function() {
        if (this.isMobile)
            for (var e = document.querySelectorAll("[data-mega-menu] img"), t = 0; t < e.length; t++) {
                var n = e[t].parentNode.firstElementChild;
                e[t].parentNode.removeChild(n)
            }
    }
    ,
    window.Util = e
}();
var utilObject = new Util;
utilObject.pageLoadEvent();
var trendingData = []
  , localData = [];
if (utilObject.getCookie("selectedSearch") && "Search Page" == utilObject.current_page) {
    var selectedSearch = utilObject.getCookie("selectedSearch")
      , typeahead = null ;
    typeahead = isMobile ? document.querySelector("#msearchval") : document.querySelector("#searchval"),
    typeahead.value = selectedSearch
}
var localDataLength = loadLocalData();
trendingData = loadTrendingData(localDataLength),
initializeAutoComplete(),
$(function(e) {
    if ($(window).width() < 1005)
        $("[first-click]").slice(0, 1).addClass("active").next().show(),
        $(document).on("click", "a[first-click]", function(e) {
            e.preventDefault(),
            $("a[first-click]").next().slideUp(400),
            $(this).next().stop(!0, !1).slideToggle(400),
            $(this).hasClass("active") ? $(this).removeClass("active") : ($("a[first-click]").removeClass("active"),
            $(this).addClass("active"))
        }),
        $(document).on("click", "a[click-menu]", function() {
            $("a[click-menu]").next().slideUp(200),
            $(this).next().stop(!0, !1).slideToggle(200),
            $(this).hasClass("active") ? $(this).removeClass("active") : ($("a[click-menu]").removeClass("active"),
            $(this).addClass("active"))
        }),
        $(".mobile-navbar, span[data-shop-by-close], div[mob-menu-overlay]").on("click", function(e) {
            e.stopPropagation(),
            $("body").toggleClass("animate-menu"),
            $("div[mob-menu-overlay]").fadeToggle("slow", "linear")
        });
    else {
        var t, n = !1;
        $("ul[data-mega-menu] > li").mouseenter(function(e) {
            if (n)
                clearTimeout(t),
                $(e.currentTarget).removeClass("active").addClass("active"),
                n = !0;
            else {
                var i = setTimeout(function() {
                    clearTimeout(t),
                    $(e.currentTarget).removeClass("active").addClass("active"),
                    n = !0
                }, 400);
                $(e.currentTarget).attr("timer", i)
            }
        }).mouseleave(function(e) {
            var i = $(e.currentTarget).attr("timer");
            clearTimeout(i),
            $(e.currentTarget).removeClass("active").removeAttr("timer"),
            n && (clearTimeout(t),
            t = setTimeout(function() {
                n = !1
            }, 100))
        });
        var i = !1;
        $(window).scroll(function() {
            var e = $(window).scrollTop();
            e > 90 && !i && ($(".craftsvilla-international").hide(),
            $(".navbar-fixed-top").css({
                top: "0px"
            }),
            $(".menu-wrapper").css({
                top: "57px"
            }),
            i = !0),
            e < 90 && i && ($(".craftsvilla-international").show(),
            $(".navbar-fixed-top").css({
                top: "24px"
            }),
            $(".menu-wrapper").css({
                top: "81px"
            }),
            i = !1)
        })
    }
}),
loadGtm(),
loadInternationalPopup();
