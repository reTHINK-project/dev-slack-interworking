System.register([],function(e){return{execute:function(){e(function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=39)}({39:function(e,r,t){"use strict";t.r(r);r.default=class{constructor(){}set name(e){this._name=e}get name(){return this._name}get runtimeHypertyURL(){return this.hypertyURL}_start(e,r,t,n){let o=this;o._factory=n,o._syncher=n.createSyncher(e,r,t),o._manager=n.createChatManager(e,r,t,o._syncher),o.discovery=o._manager.discovery,o.identityManager=o._manager.identityManager,o.search=o._manager.search,o._domain=o._manager._domain,o._myUrl=e,o.hypertyURL=e,o._runtimeURL=t.runtimeURL,o._bus=r,o._backup=!!t.hasOwnProperty("backup")&&t.backup,o._heartbeat=t.hasOwnProperty("heartbeat")?t.heartbeat:void 0,o._syncher.onNotification(function(e){console.log("[GroupChatManager] onNotification:",e),o.processNotification(e)}),o._resumeReporters(),o._resumeObservers()}register(e,r,t){const n={userProfile:{guid:t.guid,userURL:t.userURL,info:{code:r}}};let o={type:"forward",to:e,from:this.hypertyURL,identity:n,body:{type:"create",from:this.hypertyURL,identity:n}};this._bus.postMessage(o)}_getRegisteredUser(){let e=this;return new Promise((r,t)=>{e._manager.currentIdentity?r(e._manager.currentIdentity):e._manager.identityManager.discoverUserRegistered().then(e=>{console.log("[GroupChatManager] GET MY IDENTITY:",e),r(e)}).catch(e=>{console.error("[GroupChatManager] ERROR:",e),t(e)})})}_resumeReporters(){let e=this;e._syncher.resumeReporters({store:!0}).then(r=>{let t=Object.keys(r);t.length>0&&e._getRegisteredUser().then(n=>{t.forEach(t=>{console.log("[GroupChatManager.resumeReporter]: ",t);let o=e._factory.createChatController(e._syncher,e.discovery,e._domain,e.search,n,e._manager);o.dataObjectReporter=r[t],this._manager._reportersControllers[t]=o,e._resumeInterworking(o.dataObjectReporter),console.log("[GroupChatManager] chatController invitationsHandler: ",o.invitationsHandler),o.invitationsHandler.resumeDiscoveries(e._manager.discovery,o.dataObjectReporter)}),e._onResumeReporter&&e._onResumeReporter(this._manager._reportersControllers)})}).catch(e=>{console.info("[GroupChatManager.resumeReporters] :",e)})}_resumeObservers(){let e=this;e._syncher.resumeObservers({store:!0}).then(r=>{console.log("[GroupChatManager] resuming observers : ",r,e,e._onResume);let t=Object.keys(r);t.length>0&&e._getRegisteredUser().then(n=>{t.forEach(t=>{console.log("[GroupChatManager].syncher.resumeObserver: ",t);let o=r[t],a=e._factory.createChatController(e._syncher,e._manager.discovery,e._domain,e.search,n,e._manager);a.dataObjectObserver=o,this._manager._observersControllers[t]=a;let s=e._factory.createRegistrationStatus(o.url,e._runtimeURL,e._myUrl,e._bus),i=function(e,r,t){let n=t;e.sync().then(t=>{t||n.onLive(r,()=>{n.unsubscribeLive(r),i(e,r,n)})})};i(o,e._myUrl,s)}),e._onResumeObserver&&e._onResumeObserver(this._manager._observersControllers)})}).catch(e=>{console.info("[GroupChatManager] Resume Observer | ",e)})}_resumeInterworking(e){let r=this;if(e.data.participants){let t=e.data.participants,n=e.url,o=e.schema;console.log("[GroupChatManager._resumeInterworking for] ",t),Object.keys(t).forEach(a=>{let s=t[a].identity.userProfile.userURL.split("://");if("user"!==s[0]){console.log("[GroupChatManager._resumeInterworking for] ",a),s=s[0]+"://"+s[1].split("/")[1];let t={type:"create",from:r._myUrl,to:s,body:{resource:n,schema:o,value:e.metadata}};r._bus.postMessage(t,()=>{})}})}}create(e,r,t={}){return t.backup=this._backup,t.heartbeat=this._heartbeat,console.log("[GroupChatManager.create] extra: ",t),this._manager.create(e,r,t)}onInvitation(e){return this._manager.onInvitation(e)}onResumeReporter(e){this._onResumeReporter=e}onResumeObserver(e){this._onResumeObserver=e}join(e){return this._manager.join(e)}myIdentity(e){return console.log("[GroupChatManager.myIdentity] ",e),this._manager.myIdentity(e)}processNotification(e){return this._manager.processNotification(e)}onInvitation(e){return this._manager.onInvitation(e)}}}}))}}});