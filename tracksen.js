var emitter = require('events').EventEmitter;
var     eMS = new emitter();
var    sent = [[]];
var   redis = require('redis');

var sentinels1 = { 26379:"127.0.0.1", 26380:"127.0.0.1" };
var sentinels2 = { 26379:"127.0.0.1", 26380:"127.0.0.1" }; // track same set twice if utile
//var sentinelsm = { port:"ip", nextport:"nextip", "...":"..." };
//  :
//  : redis sentinels
//  :
var sents = [
sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,sentinels1,
];


function msCmd(s, j, c) { s[j].send_command('SENTINEL', c, function(d1, d2) { eMS.emit(c[0], s, j, d1, d2); }) };

function eMasters(s, j, d1, d2) {
    var na, mh, mp, sl;
    na = d2[0][(d2[0].indexOf('name'))+1];   // positions of elements varying
    mh = d2[0][(d2[0].indexOf('ip'))+1];
    mp = d2[0][(d2[0].indexOf('port'))+1];
    sl = d2[0][(d2[0].indexOf('num-slaves'))+1];
    console.log("aMaster:"+na+":"+mh+":"+mp+":"+sl);
    if (sl > 0) {
       s[j+2] = ['slaves', na]; getMSI(s, j, 1);
    } else {
       getMSI(s, j, 0);
    }
}
function eSlaves(s, j, d1, d2) {
    var i = d2.length;
    if (i > 0) {
       var na, st, mh, mp;
       while (--i >= 0) {
           na = d2[i][(d2[i].indexOf('name'))+1];  //
           st = d2[i][(d2[i].indexOf('flags'))+1];
           mh = d2[i][(d2[i].indexOf('master-host'))+1];
           mp = d2[i][(d2[i].indexOf('master-port'))+1];
           console.log("aSlave:"+na+":"+mh+":"+mp+":"+st);
       }
    }
    getMSI(s, j, 0);
}
function eReset(s, j, d1, d2)               { getMSI(s, j, 0); }
function eIsMasterDownByAddr(s, j, d1, d2)  { getMSI(s, j, 0); }
function eGetMasterAddrByName(s, j, d1, d2) { getMSI(s, j, 0); }

function getMSI(s, j, f)      { s[j+1]=f;     s[j].psubscribe('*');    }
function onPsubscribe(s, j)   { if (s[j+1]) { s[j].punsubscribe();  }  }
function onPunsubscribe(s, j) { if (s[j+1]) { msCmd(s, j, s[j+2]);  }  }
function onConnect(s, j)      { s[j+2] = ['masters']; getMSI(s, j, 1); }
function onClose(s, j)        { console.log("onClose:");  }
function onIdle(s, j)         { console.log("onIdle:");   }
function onEnd(s, j)          { console.log("onEnd:");    }
function onDrain(s, j)        { console.log("onDrain:");  }
function onReady(s, j)        { console.log("onReady:");  }
function onError(s, j, e)     { console.log("BREAK:"+e);  }
function onReconnecting(s, j) { console.log("onReconn:"); }
function onPmessage(s, j, c, m) {
 eMS.emit(((c.replace(/^\-/,'_')).replace(/^\+/,'x')).substr(0,4), s, j, c, m);
}
function _til(s, j, c, m) { console.log(c+":"+m); }
function _sdo(s, j, c, m) { console.log(c+":"+m); }
function _odo(s, j, c, m) { console.log(c+":"+m); }
function _dup(s, j, c, m) { console.log(c+":"+m); }
function _cmd(s, j, c, m) { console.log(c+":"+m); }
function _sla(s, j, c, m) { console.log(c+":"+m); }
function _scr(s, j, c, m) { console.log(c+":"+m); }
function _pub(s, j, c, m) { console.log(c+":"+m); }
function _fai(s, j, c, m) { console.log(c+":"+m); }
function _pro(s, j, c, m) { console.log(c+":"+m); }
function xtil(s, j, c, m) { console.log(c+":"+m); }
function xsdo(s, j, c, m) { console.log(c+":"+m); }
function xodo(s, j, c, m) { console.log(c+":"+m); }
function xreb(s, j, c, m) { console.log(c+":"+m); }
function xsen(s, j, c, m) { console.log(c+":"+m); }
function xres(s, j, c, m) { console.log(c+":"+m); }
function xswi(s, j, c, m) { console.log(c+":"+m); }
function xsel(s, j, c, m) { console.log(c+":"+m); }
function xpro(s, j, c, m) { console.log(c+":"+m); }
function xpub(s, j, c, m) { console.log(c+":"+m); }
function xsla(s, j, c, m) { console.log(c+":"+m); }
function xscr(s, j, c, m) { console.log(c+":"+m); }
function xred(s, j, c, m) { console.log(c+":"+m); }
function xfai(s, j, c, m) { console.log(c+":"+m); }

function initS(s,ss) {
    var p = Object.keys(ss);
    var l = p.length * 3;
    for (var i = k = 0; i < l; i += 3, ++k) {
        (function(j) {
            s[j] = redis.createClient(p[k], ss[p[k]]);
            s[j].on("end",          function ()        { onEnd(s, j);              });
            s[j].on("idle",         function ()        { onIdle(s, j);             });
            s[j].on("close",        function ()        { onClose(s, j);            });
            s[j].on("ready",        function ()        { onReady(s, j);            });
            s[j].on("drain",        function ()        { onDrain(s, j);            });
            s[j].on("connect",      function ()        { onConnect(s, j);          });
            s[j].on("psubscribe",   function ()        { onPsubscribe(s, j);       });
            s[j].on("punsubscribe", function ()        { onPunsubscribe(s, j);     });
            s[j].on("reconnecting", function ()        { onReconnecting(s, j);     });
            s[j].on("error",        function (e)       { onError(s, j, e.message); });
            s[j].on("pmessage",     function (p, c, m) { onPmessage(s, j, c, m);   });
        })(i);
    }
}

eMS.on("reset",   eReset);
eMS.on("slaves",  eSlaves);
eMS.on("masters", eMasters);
eMS.on("is-master-down-by-addr",  eIsMasterDownByAddr);
eMS.on("get-master-addr-by-name", eGetMasterAddrByName);

eMS.on("_til", _til);
eMS.on("_sdo", _sdo);
eMS.on("_odo", _odo);
eMS.on("_dup", _dup);
eMS.on("_cmd", _cmd);
eMS.on("_sla", _sla);
eMS.on("_scr", _scr);
eMS.on("_pub", _pub);
eMS.on("_fai", _fai);
eMS.on("_pro", _pro);
eMS.on("xtil", xtil);
eMS.on("xsdo", xsdo);
eMS.on("xodo", xodo);
eMS.on("xreb", xreb);
eMS.on("xsen", xsen);
eMS.on("xres", xres);
eMS.on("xswi", xswi);
eMS.on("xred", xred);
eMS.on("xpro", xpro);
eMS.on("xsel", xsel);
eMS.on("xpub", xpub);
eMS.on("xsla", xsla);
eMS.on("xscr", xscr);
eMS.on("xfai", xfai);

for (var j = sents.length; --j >= 0; ) { initS(sent[j]=[],sents[j]); }


