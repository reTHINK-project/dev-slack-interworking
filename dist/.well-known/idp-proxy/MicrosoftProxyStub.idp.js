!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("activate",[],t):"object"==typeof exports?exports.activate=t():e.activate=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";function n(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}Object.defineProperty(t,"__esModule",{value:!0});var r={clientID:"000000004C18391F",redirectURI:location.origin,tokenEndpoint:"https://login.live.com/oauth20_authorize.srf?",type:"token",scope:"wl.signin,wl.basic",mode:"fragment"},i=function(e,t){return new Promise(function(t,o){var n=JSON.parse(atob(e));t({identity:n.email,contents:n.nonce})})},s=function(e,t,o){return new Promise(function(t,n){if(o){var i=o.split("/")[3].split("."),s=JSON.parse(atob(i[1]));t({assertion:i[1],idp:{domain:"microsoft.com",protocol:"OIDC"},infoToken:s})}else{n({name:"IdPLoginError",loginUrl:r.tokenEndpoint+"response_type="+r.type+"&client_id="+r.clientID+"&scope="+r.scope+"&nonce="+e+"&response_mode="+r.mode+"&redirect_uri="+r.redirectURI})}})},a={name:"MicrosoftProxyStub",language:"javascript",description:"IDPProxy for microsoft idp",signature:"",configuration:{},constraints:{browser:!0},interworking:!1,objectName:"microsoft.com"},u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,o){t&&n(e.prototype,t),o&&n(e,o)}(e,[{key:"_start",value:function(e,t,o){var n=this;n.runtimeProtoStubURL=e,n.messageBus=t,n.config=o,n.messageBus.addListener("*",function(e){"domain-idp://microsoft.com"===e.to&&n.requestToIdp(e)}),n._sendStatus("created")}},{key:"requestToIdp",value:function(e){var t=this,o=e.body.params;switch(e.body.method){case"generateAssertion":s(o.contents,o.origin,o.usernameHint).then(function(o){t.replyMessage(e,o)},function(o){t.replyMessage(e,o)});break;case"validateAssertion":i(o.assertion,o.origin).then(function(o){t.replyMessage(e,o)},function(o){t.replyMessage(e,o)})}}},{key:"replyMessage",value:function(e,t){var o={id:e.id,type:"response",to:e.from,from:e.to,body:{code:200,value:t}};this.messageBus.postMessage(o)}},{key:"_sendStatus",value:function(e,t){console.log("[GoogleIdpProxy.sendStatus] ",e),this._state=e;var o={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};t&&(o.body.desc=t),this.messageBus.postMessage(o)}},{key:"descriptor",get:function(){return a}},{key:"name",get:function(){return a.name}}]),e}();t.default=u}]).default});