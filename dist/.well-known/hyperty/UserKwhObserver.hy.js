System.register([],function(e){return{execute:function(){e(function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=42)}({42:function(e,t,r){"use strict";r.r(t);t.default=class{constructor(){}set name(e){this._name=e}get name(){return this._name}get runtimeHypertyURL(){return this.hypertyURL}_start(e,t,r,n){this.hypertyURL=e,this._context=n.createContextObserver(e,t,r,["availability_context"])}start(){return this._context.start([{value:"unavailable"}],e=>{console.log("[UserKwhObserver.onDisconnected]: ",e),e.data.values[0].value="unavailable",e.sync()})}resumeDiscoveries(){return this._context.resumeDiscoveries()}onResumeObserver(e){return this._context.onResumeObserver(e)}discoverUsers(e,t){return this._context.discoverUsers(e,t)}observe(e){return this._context.observe(e)}unobserve(e){return this._context.unobserve(e)}}}}))}}});