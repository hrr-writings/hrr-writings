(function () {
    let utils = {}

    function encodeFormData(data) {
		var pairs = [];
		var regexp = /%20/g;
		for(var name in data) {
			if (data.hasOwnProperty(name)) {
				var val = data[name].toString();
				var pair = encodeURIComponent(name).replace(regexp, "+")+"="+
					    encodeURIComponent(val).replace(regexp, "+");
				pairs.push(pair);
			}
		}
		return pairs.join("&");
	}
	var parseXml = function() { return null; }
	if (window.DOMParser) {
		parseXml = function(xmlStr) {
			return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
		};
	} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
		parseXml = function(xmlStr) {
			var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(xmlStr);
			return xmlDoc;
		};
	}

	utils.ajax = function(options) {
		var opts = {
			url: null,
			type: "GET",
			data: null,
			async: true,
			timeout: 5000,
			dataType: "text",
			success: null,
			error: null,
			complete: null,
			requestHeader: null,
			isLocal: false,
		};

		for (var p in options) opts[p] = options[p];
		if(!opts.url) return;
		var xmlhttp = new XMLHttpRequest();
		if (opts.async) {
			xmlhttp.timeout = opts.timeout;
		}

		opts.isLocal = (/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol)
			&& !(/^http:\/\//.test(opts.url)))? true : false;

		xmlhttp.onreadystatechange = function(e){
			if (xmlhttp.readyState===4) {
				if (xmlhttp.status===200 || opts.isLocal) {
					if(typeof opts.success === "function") {
						if(opts.dataType === "json") {
							xmlhttp.responseText ? opts.success(JSON.parse(xmlhttp.responseText)) : opts.error(new Error('JSON Parse Error'));
						} else if(opts.dataType === "xml") {
							if (xmlhttp.responseXML) {
								opts.success(xmlhttp.responseXML)
							} else {
								xmlhttp.responseText ? opts.success(parseXml(xmlhttp.responseText)) : opts.error(new Error('XML Parse Error'));
							}
						} else {
							opts.success(xmlhttp.responseText);
						}
					}
				} else {
					this.abort();
					if(typeof opts.error === "function") opts.error(xmlhttp.status);
				}
			}
		};
		if(typeof opts.complete === "function") {
			xmlhttp.onloadend = function(evt) {
				opts.complete(evt);
			}
		}
		if(opts.type === "GET" && opts.data) {
			opts.data = encodeFormData(opts.data);
			opts.url = opts.url +"?"+ opts.data;
			opts.data = null;
		}
		xmlhttp.open(opts.type, opts.url, opts.async);

		if(opts.type === "POST") {
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		}
		if(opts.requestHeader) {
			var headers = opts.requestHeader;
			for(var key in headers) {
				if (headers.hasOwnProperty(key)) {
					xmlhttp.setRequestHeader(key, headers[key]);
				}
			}
		}
		if(typeof opts.data === "object") opts.data = encodeFormData(opts.data);
		xmlhttp.send(opts.data);
	};

	// xml to json
	function extend (dist, source) {
		for (var p in source) {
			dist[p] = source[p];
		}
		return dist;
	}

	function each (arr, func) {
		for (var i=0, len=arr.length; i<len; i++) {
			func(i, arr[i]);
		}
	}

	function jsVar (s) {
		return String(s || '').replace(/-/g, "_");
	}

	function myArr (o) {
		if (Object.prototype.toString.call(o) !== "[object Array]") o = [o];
		o.length = o.length;
		return o;
	}

	utils.xmltoJson = function(xml) {

		function xml2json (xml, extended) {
			if (!xml) return;

			function parseXML(node, simple) {
				if (!node) return null;
				var txt = '',
					obj = null,
					att = null;
				var nt = node.nodeType,
					nn = jsVar(node.localName || node.nodeName);
				var nv = node.text || node.nodeValue || '';
				if (node.childNodes) {
					if (node.childNodes.length > 0) {
						each(node.childNodes, function(n, cn) {
							var cnt = cn.nodeType,
								cnn = jsVar(cn.localName || cn.nodeName);
							var cnv = cn.text || cn.nodeValue || '';
							if (cnt === 8) {
								return;
							} else if (cnt === 3 || cnt === 4 || !cnn) {
								if (cnv.match(/^\s+$/)) {
									return;
								};
								txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
							} else {
								obj = obj || {};
								if (obj[cnn]) {
									if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);

									obj[cnn][obj[cnn].length] = parseXML(cn, true);
									obj[cnn].length = obj[cnn].length;
								} else {
									obj[cnn] = parseXML(cn);
								};
							};
						});
					};
				};
				if (node.attributes) {
					if (node.attributes.length > 0) {
						att = {};
						obj = obj || {};
						each(node.attributes, function(a, at) {
							var atn = jsVar(at.name),
								atv = at.value;
							att[atn] = atv;
							if (obj[atn]) {
								obj[cnn] = myArr(obj[cnn]);

								obj[atn][obj[atn].length] = atv;
								obj[atn].length = obj[atn].length;
							} else {
								obj[atn] = atv;
							};
						});
					};
				};
				if (obj) {
					obj = extend((txt != '' ? new String(txt) : {}), obj || {});
					txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
					if (txt) obj.text = txt;
					txt = '';
				};
				var out = obj || txt;
				if (extended) {
					if (txt) out = {};
					txt = out.text || txt || '';
					if (txt) out.text = txt;
					if (!simple) out = myArr(out);
				};
				return out;
			};


			if (typeof xml === 'string') xml = text2xml(xml);

			if (!xml.nodeType) return;
			if (xml.nodeType === 3 || xml.nodeType === 4) return xml.nodeValue;

			var root = (xml.nodeType === 9) ? xml.documentElement : xml;

			var out = parseXML(root, true);

			xml = null;
			root = null;

			return out;
		}

		function text2xml (str) {
			var out;
			try {
				var xml = new DOMParser();
				xml.async = false;
			} catch (e) {
				throw new Error("XML Parser could not be instantiated")
			};
			try {
				out = xml.parseFromString(str, "text/xml");
			} catch (e) {
				throw new Error("Error parsing XML string")
			};
			return out;
		}

		return xml2json(xml);
	};


    window.utils = utils
})()