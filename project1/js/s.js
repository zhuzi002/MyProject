/**
 * Created by qsf
 */
// 压缩后的json库
if(typeof JSON!=='object'){JSON={}}(function(){'use strict';var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(n){return n<10?'0'+n:n}function this_value(){return this.valueOf()}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value}var gap,indent,meta,rep;function quote(string){rx_escapable.lastIndex=0;return rx_escapable.test(string)?'"'+string.replace(rx_escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key)}if(typeof rep==='function'){value=rep.call(holder,key,value)}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null'}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null'}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v}}if(typeof JSON.stringify!=='function'){meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' '}}else if(typeof space==='string'){indent=space}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify')}return str('',{'':value})}}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);rx_dangerous.lastIndex=0;if(rx_dangerous.test(text)){text=text.replace(rx_dangerous,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(rx_one.test(text.replace(rx_two,'@').replace(rx_three,']').replace(rx_four,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j}throw new SyntaxError('JSON.parse')}}}());
;(function (window, document, namespace) {
    var keys = {
        "start": "_s",
        "exit": "_e",
        "hash": "_h",
        "focus": "_f",
        "click": "click",
        "exception": "_ex",
        "bulk": "_b",
        "trace": "_t"
    }
    try {
        var KS = window[namespace];
        var version = 1;
        var cookieName = "KLDTECDS";
        var UA = navigator.userAgent;
        var queue = [];
        var lock = false;
        var _startTime = 0;
        /**
         * utils
         */
        var _ = {
            serialize: function (data) {
                if (typeof(data) != "object") {
                    return false;
                }
                var res = [];
                for (var k in data) {
                    var v = data[k];
                    if (typeof(v) != "object") {
                        res.push(k + '=' + v);
                    } else {
                        res.push(k + '=' + encodeURIComponent(JSON.stringify(v)));
                    }
                }
                return res.join("&");
            },
            extend: function (obj, adder) {
                for (var k in adder) {
                    obj[k] = adder[k];
                }
                return obj;
            },
            timeStamp: function() {
                var t  = new Date();
                if(t.getTime) {
                    return t.getTime();
                } else {
                    return t.valueOf();
                }
            },
            rand: function(m) {
                return parseInt(Math.random()*m);
            },
            md5: function (string) {
                function md5_RotateLeft(lValue, iShiftBits) {
                    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
                }

                function md5_AddUnsigned(lX, lY) {
                    var lX4, lY4, lX8, lY8, lResult;
                    lX8 = (lX & 0x80000000);
                    lY8 = (lY & 0x80000000);
                    lX4 = (lX & 0x40000000);
                    lY4 = (lY & 0x40000000);
                    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                    if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                    }
                    if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                    } else {
                        return (lResult ^ lX8 ^ lY8);
                    }
                }
                function md5_F(x, y, z) {
                    return (x & y) | ((~x) & z);
                }

                function md5_G(x, y, z) {
                    return (x & z) | (y & (~z));
                }

                function md5_H(x, y, z) {
                    return (x ^ y ^ z);
                }

                function md5_I(x, y, z) {
                    return (y ^ (x | (~z)));
                }

                function md5_FF(a, b, c, d, x, s, ac) {
                    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_GG(a, b, c, d, x, s, ac) {
                    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_HH(a, b, c, d, x, s, ac) {
                    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_II(a, b, c, d, x, s, ac) {
                    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_ConvertToWordArray(string) {
                    var lWordCount;
                    var lMessageLength = string.length;
                    var lNumberOfWords_temp1 = lMessageLength + 8;
                    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                    var lWordArray = Array(lNumberOfWords - 1);
                    var lBytePosition = 0;
                    var lByteCount = 0;
                    while (lByteCount < lMessageLength) {
                        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                        lBytePosition = (lByteCount % 4) * 8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                        lByteCount++;
                    }
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                    return lWordArray;
                };
                function md5_WordToHex(lValue) {
                    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                    for (lCount = 0; lCount <= 3; lCount++) {
                        lByte = (lValue >>> (lCount * 8)) & 255;
                        WordToHexValue_temp = "0" + lByte.toString(16);
                        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                    }
                    return WordToHexValue;
                };
                function md5_Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                };
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
                var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
                var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
                var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
                string = md5_Utf8Encode(string);
                x = md5_ConvertToWordArray(string);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;
                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                    d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                    c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                    b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                    a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                    d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                    c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                    b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                    a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                    d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                    c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                    b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                    a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                    d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                    c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                    b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                    a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                    d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                    c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                    b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                    a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                    d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                    c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                    b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                    a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                    d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                    c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                    b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                    a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                    d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                    c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                    b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                    a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                    d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                    c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                    b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                    a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                    d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                    c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                    b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                    a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                    d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                    c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                    b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                    a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                    d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                    c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                    b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                    a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                    d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                    c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                    b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                    a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                    d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                    c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                    b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                    a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                    d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                    c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                    b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                    a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                    d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                    c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                    b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                    a = md5_AddUnsigned(a, AA);
                    b = md5_AddUnsigned(b, BB);
                    c = md5_AddUnsigned(c, CC);
                    d = md5_AddUnsigned(d, DD);
                }
                return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
            }
        }
        _.env = {
            device: function () {
                var user_agent = UA;
                if (/iPad/.test(user_agent)) {
                    return 'iPad';
                } else if (/iPod/i.test(user_agent)) {
                    return 'iPod';
                } else if (/iPhone/i.test(user_agent)) {
                    return 'iPhone';
                } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
                    return 'BlackBerry';
                } else if (/Windows Phone/i.test(user_agent)) {
                    return 'Windows Phone';
                } else if (/Windows/i.test(user_agent)) {
                    return 'Windows';
                } else if (/Macintosh/i.test(user_agent)) {
                    return 'Macintosh';
                } else if (/Android/i.test(user_agent)) {
                    return 'Android';
                } else if (/Linux/i.test(user_agent)) {
                    return 'Linux';
                } else {
                    return '';
                }
            },
            properties: function () {
                return {
                    sh: screen.height,
                    sw: screen.width
                }
            }
        }
        _.cookie = {
            get: function (name) {
                var arr = null;
                if (document.cookie.length > 0){
                    arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                }
                if (arr != null){
                    return decodeURIComponent(arr[2]);
                }
                return null;
            },
            set: function (name, value, days) {
                var exp = new Date();
                if (!days) {
                    days = 30; // 默认为30天
                }
                exp.setTime(exp.getTime() + days * 24 * 3600 * 1000);
                document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + ";path=/";
            },

            remove: function (name, cross_subdomain) {
                _.cookie.set(name, '', -1, cross_subdomain);
            }
        };
        _.cid = (function () {
            var T = function () {
                var d = 1 * new Date()
                    , i = 0;
                while (d == 1 * new Date()) {
                    i++;
                }
                return d.toString(16) + i.toString(16);
            };
            var R = function () {
                return Math.random().toString(16).replace('.', '');
            };
            var _UA = function (n) {
                var ua = UA, i, ch, buffer = [], ret = 0;

                function xor(result, byte_array) {
                    var j, tmp = 0;
                    for (j = 0; j < byte_array.length; j++) {
                        tmp |= (buffer[j] << j * 8);
                    }
                    return result ^ tmp;
                }

                for (i = 0; i < ua.length; i++) {
                    ch = ua.charCodeAt(i);
                    buffer.unshift(ch & 0xFF);
                    if (buffer.length >= 4) {
                        ret = xor(ret, buffer);
                        buffer = [];
                    }
                }

                if (buffer.length > 0) {
                    ret = xor(ret, buffer);
                }

                return ret.toString(16);
            };

            return function () {
                var se = (screen.height * screen.width).toString(16);
                return _.md5((T() + '-' + R() + '-' + _UA() + '-' + se + '-' + T()));
            };
        })();
        _.state = {
            getDistinctId: function () {
                return this._value.cid;
            },
            setOnce: function (a, b) {
                if (!(a in this._value)) {
                    this.set(a, b);
                }
            },
            set: function (name, value, isSave) {
                this._value[name] = value;
                if (isSave) {
                    this.save(this.genKey(name), value);
                }
            },
            save: function (name, value) {
                _.cookie.set(name, value);
            },
            genKey: function (name) {
                return   cookieName + '_' + name;
            },
            get: function (name) {
                return this._value[name];
            },
            _value: {},
            init: function (opt) {
                var cidKey = this.genKey('cid');
                var countKey = this.genKey('count');
                var cid = _.cookie.get(cidKey);
                var count = _.cookie.get(countKey);
                if (cid + '' !== 'null') {
                    this.set('cid', cid);
                } else {
                    var _cid = _.cid();
                    this.set('cid',_cid, true);
                }
                if (count  + '' !== 'null') {
                    this.set('count', parseInt(count));
                } else {
                    this.set('count', 0, true); // 日志发送数目记录
                }
                if (opt.uid && typeof(opt.uid) == "string") {
                    this.set('uid', opt.uid, true);
                }
            }
        };

        _.state.init({
            uid: KS._uid
        });
        /*
         *
         * */
        var logger = {
            count: 0,
            init: function (config) {
                this.conf = config || {};
                this._getEnv();
                return this;
            },
            _getEnv: function () {
                var _env = _.env.properties();
                this.env = {
                    d: _env.sw + "*" + _env.sh
                }
            },
            _getImgSrc: function (params) {
                return this.conf.img + "?" + params;
            },
            _send: function (data, callback) {
                var self = this;
                if(lock){
                    window.setTimeout(function(){
                        self._send(data);
                    },100);
                    return;
                }
                lock = true;
                //事件类型
                var record = {e: data["type"]};
                //环境信息
                // record = _.extend(record, self.env);
                //产品标识
                // if (KS._sid) {
                //     record.sid = KS._sid;
                // }
                // //时间戳
                // var __t = new Date();
                // record["t"] = _.timeStamp();
                // cookie id
                record.cid = _.state.get('cid');
                // sid
                var uid = _.state.get('uid');
                if (uid) {
                    record['u_id'] = uid;
                }
                record['app_version'] = KS.$app_version;
                //日志版本
                record['lib'] = 'js';
                record['lib_version'] = self.conf.v;
                //标题
                //自定义内容
                if ( typeof (data.p) != 'undefined') {
                    record.p = data.p;
                };
                //
                self.count++;
                var count = _.state.get('count');
                record["_r"] = ++count;//_.rand(1000);
                _.state.set('count', count, true);
                var img = new Image();
                var src = self._getImgSrc(_.serialize(record));
                img.src = src;
                img.onload = function() {
                    lock = false;
                    callback && callback();
                }
                //document.body.appendChild(img);
            },
            log: function (type, data, callback) {
                var send = {"type": type};
                if (data) {
                    send["p"] = data;
                }
                this._send(send, callback);
            }
        }
        logger.init({
            "img": KS._img,
            "v": version,
            handle: KS
        });
        /**
         * 发送日志接口
         * @method
         * @param type 事件类型，默认的有 start, exit, hash
         * @return null
         */
        KS.log = function (type, data, callback) {
            if (typeof (type) !== "string") {
                return;
            }
            logger.log(type, data, callback);
        };
        /**
         * 设置用户唯一id，对应参数中的uid
         * @method
         * @param sid 用户唯一标识
         * @return null
         */
        KS.setUid = function (uid) {
            if (typeof (uid) !== "string") {
                return;
            }
            _.state.set('uid', uid);
        };

        /**
         * 将日志放入缓存
         * @method
         * @param event 事件标识
         * @param data 事件属性
         * @return null
         */

        KS.push = function (event, data) {
            if (typeof (keys[event]) != "undefined") {
                event = keys[event];
            }
            var sendData = {};
            sendData["e"] = event;
            if(data) {
                sendData["p"] = data;
            }
            if(event == "_s") {
                _startTime = sendData["t"];
            } else if(event == "_e") {
                sendData['l'] = sendData["t"] - _startTime;
            }
            queue.push(sendData);
        };
        /**
         * 将缓存中的日志发送到服务器
         * @method
         * @return null
         */
        KS.flush = function (callback) {
            if(queue.length>0){
                KS.log(keys["bulk"], queue, callback);
                queue = [];
            }
        };
    } catch (e) {
        KS.log(keys["exception"], {'msg': e.message});
    }
	
})(window, document, window["_KLDTECDataStatistic"]);