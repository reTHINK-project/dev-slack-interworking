System.register([],function(e){return{execute:function(){e(function(e){var o={};function t(n){if(o[n])return o[n].exports;var s=o[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}return t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var s in e)t.d(n,s,function(o){return e[o]}.bind(null,s));return n},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="",t(t.s=5)}({0:function(e,o,t){"use strict";let n,s,r;o.a=class{constructor(){console.log("[AbstractIdpProxy] constructor")}_init(e,o,t){let i=this;i.runtimeProtoStubURL=e,i.messageBus=o,i.config=t,n=t.idpProxy,s=t.convertUserProfile,r=t.accessTokenInput,i.messageBus.addListener("*",function(e){e.to===t.idpUrl&&i.requestToIdp(e)}),i._sendStatus("created")}requestToIdp(e){let o=this,t=e.body.params;switch(console.info("[AbstractIdpProxyProtoStub] receiving request: ",e),e.body.method){case"generateAssertion":n.generateAssertion(o.config,t.contents,t.origin,t.usernameHint).then(function(t){t.userProfile=s(t.userProfile),o.replyMessage(e,t)},function(t){o.replyMessage(e,t,401)});break;case"validateAssertion":n.validateAssertion(o.config,t.assertion,t.origin).then(function(t){o.replyMessage(e,t)},function(t){o.replyMessage(e,t)});break;case"refreshAssertion":n.refreshAssertion(t.identity).then(function(t){o.replyMessage(e,t)},function(t){o.replyMessage(e,t,value,401)});break;case"getAccessTokenAuthorisationEndpoint":n.getAccessTokenAuthorisationEndpoint(o.config,t.resources).then(function(t){o.replyMessage(e,t)},function(t){o.replyMessage(e,t,401)});break;case"getAccessToken":n.getAccessToken(o.config,t.resources,t.login).then(function(t){console.info("OIDC.getAccessToken result: ",t),t.input=r(t.input),o.replyMessage(e,t)},function(t){o.replyMessage(e,t,401)});break;case"refreshAccessToken":n.refreshAccessToken(o.config,t.token).then(function(t){console.info("OIDC.refreshAccessToken result: ",t),o.replyMessage(e,t)},function(t){o.replyMessage(e,t,401)});break;case"revokeAccessToken":n.revokeAccessToken(o.config,t.token).then(function(t){console.info("OIDC.revokeAccessToken result: ",t),o.replyMessage(e,t)},function(t){o.replyMessage(e,t,401)})}}replyMessage(e,o,t=200){let n={id:e.id,type:"response",to:e.from,from:e.to,body:{code:t}};t<300?n.body.value=o:n.body.description=o,console.log("[AbstractIdpProxyProtoStub.replyMessage] ",n),this.messageBus.postMessage(n)}_sendStatus(e,o){console.log("[AbstractIdpProxyProtoStub.sendStatus] ",e),this._state=e;let t={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};o&&(t.body.desc=o),this.messageBus.postMessage(t)}}},5:function(e,o,t){"use strict";t.r(o);let n,s,r;location.protocol,location.hostname,""!==location.port&&location.port;function i(e,o){o=o.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");let t=new RegExp("[\\#&?]"+o+"=([^&#]*)").exec(e);return null!==t&&t[1]}let c={getAccessTokenAuthorisationEndpoint:(e,o)=>(console.log("[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:config]",e),console.log("[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:resources]",o),r=e.authEndpoint,new Promise(function(e,t){e(r(o))},function(e){reject(e)})),getAccessToken:(e,o,t)=>(console.log("[OIDC.getAccessToken:config]",e),console.log("[OIDC.getAccessToken:login]",t),n=e.accessTokenEndpoint,s=e.domain,new Promise(function(n,r){let c="true"===i(t,"isValid"),a="true"===i(t,"consent");if(a&c){let e=a,r=31536e5+Math.floor(Date.now()/1e3);n(function(e,o,t,n,r){let i={domain:s,resources:e,accessToken:o,expires:t,input:n};return r&&(i.refresh=r),i}(o,e,r,t))}else r(e.accessTokenErrorMsg(c,a))},function(e){reject(e)}))},a=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:""),u={authorisationEndpoint:"https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/login?",revokeEndpoint:"https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/revoke?",domain:"edpdistribuicao.pt",invalidCPEErroMsg:"Lamentamos mas o CPE indicado não está localizado no Concelho de Lisboa",consentErroMsg:"Não deu consentimento para disponibilizar os seus dados de consumo de energia eléctrica"};function l(e){return u.authorisationEndpoint+"client_id="+e+"&redirect_uri="+a}function p(e){return{info:e}}function d(e,o){return e?u.consentErroMsg:u.invalidCPEErroMsg}var f=t(0);o.default=class extends f.a{constructor(){super()}_start(e,o,t){t.domain="edpdistribuicao.pt",t.idpUrl="domain-idp://edpdistribuicao.pt",t.idpProxy=c,t.idpInfo=u,t.apiInfo=u,t.authEndpoint=l,t.accessTokenInput=p,t.accessTokenEndpoint=l,t.accessTokenErrorMsg=d,super._init(e,o,t)}}}}))}}});