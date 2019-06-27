System.register([],function(e){return{execute:function(){e(function(e){var n={};function t(o){if(n[o])return n[o].exports;var s=n[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,t),s.l=!0,s.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var s in e)t.d(o,s,function(n){return e[n]}.bind(null,s));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=6)}([function(e,n,t){"use strict";let o,s,r;n.a=class{constructor(){console.log("[AbstractIdpProxy] constructor")}_init(e,n,t){let i=this;i.runtimeProtoStubURL=e,i.messageBus=n,i.config=t,o=t.idpProxy,s=t.convertUserProfile,r=t.accessTokenInput,i.messageBus.addListener("*",function(e){e.to===t.idpUrl&&i.requestToIdp(e)}),i._sendStatus("created")}requestToIdp(e){let n=this,t=e.body.params;switch(console.info("[AbstractIdpProxyProtoStub] receiving request: ",e),e.body.method){case"generateAssertion":o.generateAssertion(n.config,t.contents,t.origin,t.usernameHint).then(function(t){t.userProfile=s(t.userProfile),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"validateAssertion":o.validateAssertion(n.config,t.assertion,t.origin).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t)});break;case"refreshAssertion":o.refreshAssertion(t.identity).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t,value,401)});break;case"getAccessTokenAuthorisationEndpoint":o.getAccessTokenAuthorisationEndpoint(n.config,t.resources).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"getAccessToken":o.getAccessToken(n.config,t.resources,t.login).then(function(t){console.info("OIDC.getAccessToken result: ",t),t.input=r(t.input),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"refreshAccessToken":o.refreshAccessToken(n.config,t.token).then(function(t){console.info("OIDC.refreshAccessToken result: ",t),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"revokeAccessToken":o.revokeAccessToken(n.config,t.token).then(function(t){console.info("OIDC.revokeAccessToken result: ",t),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)})}}replyMessage(e,n,t=200){let o={id:e.id,type:"response",to:e.from,from:e.to,body:{code:t}};t<300?o.body.value=n:o.body.description=n,console.log("[AbstractIdpProxyProtoStub.replyMessage] ",o),this.messageBus.postMessage(o)}_sendStatus(e,n){console.log("[AbstractIdpProxyProtoStub.sendStatus] ",e),this._state=e;let t={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};n&&(t.body.desc=n),this.messageBus.postMessage(t)}}},function(e,n,t){"use strict";let o,s,r,i,c,a,u,l;t.d(n,"a",function(){return k});function f(e,n){n=n.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");let t=new RegExp("[\\#&?]"+n+"=([^&#]*)").exec(e);return null===t?"":t[1]}function d(e,n){let t=new XMLHttpRequest;return"withCredentials"in t?t.open(e,n,!0):"undefined"!=typeof XDomainRequest?(t=new XDomainRequest).open(e,n):t=null,new Promise(function(e,n){t?(t.onreadystatechange=function(o){if(console.log("[OAUTH2.sendHTTPRequest] response ",o),4===t.readyState)if(200===t.status){let n=JSON.parse(t.responseText);e(n)}else 400===t.status?n("There was an error processing the token"):401===t.status?n("Not Authorised"):n("something else other than 200 was returned")},t.send()):n("CORS not supported")})}let p=function(e,n,t){return new Promise(function(s,r){d("GET",o(t)).then(function(o){console.log("[OAUTH2.generateAssertion] obtained user profile ",o);let r=btoa(JSON.stringify({tokenID:t.access_token,tokenIDJSON:o,publicKey:e}));console.log("[OAUTH2.generateAssertion] atob assertion:",atob(r));let c={assertion:r,idp:{domain:i,protocol:"OAUTH2"},expires:n,userProfile:o};console.log("[OAUTH2.generateAssertion] returning: ",JSON.stringify(c)),s(c)})})},g=function(e){let n=f(e,"expires_in");return n?n+=Math.floor(Date.now()/1e3):n=31536e5+Math.floor(Date.now()/1e3),n},h=function(e,n,t,o,s){let r={domain:i,resources:e,accessToken:n,expires:t,input:o};return s&&(r.refresh=s),r},k={validateAssertion:(e,n,t)=>(console.info("[OAUTH2.validateAssertion] assertion: ",atob(n)),o=e.userInfoEndpoint,i=e.domain,new Promise(function(t,o){let s=atob(n),r=JSON.parse(s);d("GET",e.validateAssertionEndpoint({access_token:r.tokenID,input:r.tokenIDJSON})).then(n=>{JSON.stringify(n)===JSON.stringify(r.tokenIDJSON)?t({identity:e.convertUserProfile(n).id,contents:r.publicKey}):o("invalid")}).catch(e=>{o(e)})})),generateAssertion:(e,n,t,c)=>{console.log("[OAUTH2.generateAssertion:config]",e),console.log("[OAUTH2.generateAssertion:contents]",n),console.log("[OAUTH2.generateAssertion:origin]",t),console.log("[OAUTH2.generateAssertion:hint]",c),o=e.userInfoEndpoint,s=e.tokenEndpoint,r=e.authorisationEndpoint,i=e.domain;return new Promise(function(e,t){if(c){let t=f(c,"expires_in");t?t+=Math.floor(Date.now()/1e3):t=31536e5+Math.floor(Date.now()/1e3);let o=f(c,"access_token");e(o?p(n,t,{access_token:o}):function(e,n,t){return new Promise(function(o,r){let i=f(t,"code");i||r("[OAUTH2.generateAssertionWithCode] code not returned by the authentication: ",t),d("POST",s(i)).then(function(t){t.hasOwnProperty("access_token")?o(p(e,n,t)):r("[OAUTH2.generateAssertionWithCode] access token not returned in the exchange code result: ",t)},function(e){r(e)})})}(n,t,c))}else t({name:"IdPLoginError",loginUrl:r(n)})},function(e){reject(e)})},getAccessTokenAuthorisationEndpoint:(e,n)=>{console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:config]",e),console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:resources]",n),a=e.accessTokenAuthorisationEndpoint;return new Promise(function(e,t){e(a(n))},function(e){reject(e)})},getAccessToken:(e,n,t)=>{console.log("[OAUTH2.getAccessToken:config]",e),console.log("[OAUTH2.getAccessToken:login]",t),c=e.accessTokenEndpoint,i=e.domain;return new Promise(function(e,o){let s=g(t),r=f(t,"access_token");e(r?h(n,r,s,t):function(e,n){return new Promise(function(t,o){let s=f(n,"code");s||o("[OAUTH2.getAccessTokenWithCodeToken] code not returned by the login result: ",n),d("POST",c(s,e)).then(function(n){if(console.info("[OAUTH2.getAccessTokenWithCodeToken] HTTP response: ",n),n.hasOwnProperty("access_token")){let o=g(n),s=!!n.hasOwnProperty("refresh_token")&&n.refresh_token;t(h(e,n.access_token,o,n,s))}else o("[OAUTH2.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ",n)},function(e){o(e)})})}(n,t))},function(e){reject(e)})},refreshAccessToken:(e,n)=>{console.log("[OAUTH2.refreshAccessToken:config]",e),console.log("[OAUTH2.refreshAccessToken:outdated token]",n),u=e.refreshAccessTokenEndpoint,i=e.domain;return new Promise(function(e,t){let o=n.refresh;o||t("[OAUTH2.refreshAccessToken] refresh token not available in the access token",n),d("POST",u(o)).then(function(s){if(console.info("[OAUTH2.refreshAccessToken] response: ",s),s.hasOwnProperty("access_token")){let t=function(e){let n=!!e.hasOwnProperty("expires_in")&&e.expires_in;return n?n+=Math.floor(Date.now()/1e3):n=31536e5+Math.floor(Date.now()/1e3),Number(n)}(s);e(h(n.resources,s.access_token,t,s,o))}else t("[OAUTH2.refreshAccessToken] new access token not returned in the response: ",s)},function(e){t(e)})},function(e){reject(e)})},revokeAccessToken:(e,n)=>{console.log("[OAUTH2.revokeAccessToken:config]",e),console.log("[OAUTH2.revokeAccessToken: token]",n),l=e.revokeAccessTokenEndpoint,i=e.domain;return new Promise(function(e,t){n.refresh||t("[OAUTH2.revokeAccessToken] refresh token not available in the access token",n),d("POST",l(n.accessToken)).then(function(n){console.info("[OAUTH2.revokeAccessToken] response: ",n),e(!0)},function(e){t(e)})},function(e){reject(e)})}}},,,,,function(e,n,t){"use strict";t.r(n);var o=t(1);let s,r,i=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:"");location.hostname.indexOf("alticelabs.com")>-1?(s="31748",r="521567cbdf0e4f7ab17ad7cce536022bd8cccf87"):(s="24124",r="ff4848fd0f605db8fe46f8080ac2fc185045b79e");let c={clientID:s,authorisationEndpoint:"https://www.strava.com/api/v3/oauth/authorize?",tokenEndpoint:"https://www.strava.com/oauth/token?",revokeEndpoint:"https://www.strava.com/oauth/deauthorize?",type:"code",scope:"read_all,activity:read_all",domain:"strava.com",secret:r};function a(e){let n=c.authorisationEndpoint+"redirect_uri="+i+"&response_type="+c.type+"&client_id="+c.clientID+"&scope="+c.scope+"&state="+e;return console.log("[StravaInfo.authorisationEndpoint] ",n),n}function u(e,n){return c.tokenEndpoint+"client_id="+c.clientID+"&code="+e+"&grant_type=authorization_code&client_secret="+c.secret+"&redirect_uri="+i}function l(e){return c.tokenEndpoint+"client_id="+c.clientID+"&refresh_token="+e+"&grant_type=refresh_token&client_secret="+c.secret}function f(e){return c.revokeEndpoint+"&token="+e}function d(e){let n=c.authorisationEndpoint+"redirect_uri="+i+"&response_type="+c.type+"&client_id="+c.clientID+"&scope="+c.scope+"&state="+e;return console.log("[StravaInfo.accessTokenAuthorisationEndpoint] ",n),n}function p(e){return{info:e}}var g=t(0);n.default=class extends g.a{constructor(){super()}_start(e,n,t){t.domain="strava.com",t.idpUrl="domain-idp://strava.com",t.idpProxy=o.a,t.apiInfo=c,t.accessTokenAuthorisationEndpoint=d,t.accessTokenEndpoint=u,t.refreshAccessTokenEndpoint=l,t.accessTokenInput=p,t.revokeAccessTokenEndpoint=f,t.authorisationEndpoint=a,super._init(e,n,t)}}}]))}}});