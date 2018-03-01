/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
import EventBus from 'vertx3-eventbus-client';
import {ContextReporter} from 'service-framework/dist/ContextManager';
import {Syncher} from 'service-framework/dist/Syncher';
import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';

class VertxAppProtoStub {
  /* private
    _continuousOpen: boolean

    _runtimeProtoStubURL: string
    _bus: MiniBus
    _msgCallback: (Message) => void
    _config: { url, runtimeURL }

    _sock: (WebSocket | SockJS)
    _reOpen: boolean
  */

  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {VertxAppProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    if (!config.url) throw new Error('The config.url is a needed parameter');
    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');

    let _this = this;
    this._alreadySubscribe = false;
    console.log("[VertxAppProtoStub] VERTX APP PROTOSTUB", _this);
    this._id = 0;
    this._continuousOpen = true;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._runtimeSessionURL = config.runtimeURL;
    this._reOpen = false;
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);
    this._contextReporter = new ContextReporter(runtimeProtoStubURL, bus, config, this._syncher);
    console.log('[VertxAppProtoStub] this._contextReporter', this._contextReporter);


    this._eb = new EventBus(config.eventbusUrl, {"vertxbus_ping_interval": config.vertxbus_ping_interval});
    console.log('[VertxAppProtoStub] Eventbus', _this._eb);

    _this._sendStatus('created');

    _this._eventBusUsage();
    _this._setUpContextReporter();



    // bus.addListener('*', (msg) => {
    //   console.log('[VertxAppProtoStub] Message : ', msg);
    // });

    bus.addListener('domain://msg-node.vertx-app/sm', (msg) => {
      console.log('[VertxAppProtoStub] Message on (domain://msg-node.vertx-app/sm) : ', msg);

      let msgResponse = {
        id: msg.id,
        type: 'response',
        from: msg.to,
        to: msg.from,
        body: {
          code: 200
        }
      };

      _this._bus.postMessage(msgResponse);

    });


    bus.addListener('school://vertx-app/announcement', (msg) => {
      console.log('[VertxAppProtoStub] Message on (school://vertx-app/announcement)', msg, _this._eb.state);
      if (_this._eb.state === 1) {
        _this._eb.publish('school://vertx-app/announcements', JSON.stringify(msg.body));
      }

      // _this._open(() => {
      //   if (_this._filter(msg)) {
      //     if (!msg.body) {
      //       msg.body = {};
      //     }
      //     msg.body.via = this._runtimeProtoStubURL;
      //     console.log('[VertxAppProtoStub: ProtoStub -> MN]', msg);
      //     _this._sock.send(JSON.stringify(msg));
      //   }
      // });
    });


  }

  _setUpContextReporter() {
    let _this = this;

    let objInit = _this._createNewObj();

    _this._contextReporter.create('testIntegration@vetxapp.com', objInit, ['kwh'], 'testIntegration@vetxapp.com', 'testIntegration@vetxapp.com', 'school://vertx-app').then(function(context) {
      console.log('[VertxAppProtoStub] CONTEXT RETURNED', context);
      context.onSubscription(function(event) {
        event.accept();
        console.log('[VertxAppProtoStub] new subs', event);
      });

    }).catch(function(err) {
      console.error('[VertxAppProtoStub] err', err);
    });
  }

  _eventBusUsage() {
    let _this = this;

    _this._eb.onopen = () => {
      console.log('[VertxAppProtoStub] _this._eb-> open');
      _this._eb.registerHandler('school://vertx-app/stream', function(error, message) {
        console.log('[VertxAppProtoStub] received a message: ' + JSON.stringify(message));

        let objUpdated = _this._createNewObj(JSON.stringify(message.body));
        _this._contextReporter.setContext('testIntegration@vetxapp.com', objUpdated.values);
      });
      _this._eb.registerHandler('school://vertx-app/subscription', function(error, message) {
        console.log('[VertxAppProtoStub] received a message: (toSubscription) ' + JSON.stringify(message));

        if (!_this._alreadySubscribe) {
          _this._alreadySubscribe = true;

          let body_obj = JSON.parse(message.body);
          let context_url = body_obj.url;
          let identity_url = body_obj.identity;

          let identityToUse = new MessageBodyIdentity(
            'Vertx Location',
            identity_url,
            undefined,
            'Vertx Location',
            '', 'vertx-app', undefined, undefined);

          let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
          _this._syncher.subscribe(schema_url, context_url, true, false, true, identityToUse).then(function(obj) {
            console.log('[VertxAppProtoStub] subscribe success', obj);
            obj.onChange('*', (event) => {
              console.log('[VertxAppProtoStub] onChange :', event);
              if (event.field === 'values') {
                  let valuesToPublish = {
                    url : obj.url,
                    values: event.data
                  };
                _this._eb.publish('school://vertx-app/location-changes', JSON.stringify(valuesToPublish));
                console.log('url to publish', obj.url);
                valuesToPublish.toContext = true;
                _this._eb.publish(obj.url, JSON.stringify(valuesToPublish));
              }
            });
          }).catch(function(error) {
            console.log('[VertxAppProtoStub] error', error);
          });

        }
      });
      _this._eb.publish('school://vertx-app', "write last value");
    }

    _this._eb.onerror = function(e) {
        console.log('[VertxAppProtoStub] General error: ', e); // this does happen
    }
  }

  _createNewObj(value) {
    let _this = this;

    return Object.assign({}, {
        id: '_' + Math.random().toString(36).substr(2, 9),// do we need this?
        values: [{
            value: value || 0,
            name: 'kwh',
            type: 'kwh',
            unit: 'kwh'
        }]
    });
  };




  /**
   * Get the configuration for this ProtoStub
   * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   */
  get config() { return this._config; }

  get runtimeSession() { return this._runtimeSessionURL; }

  /**
   * Try to open the connection to the MessageNode. Connection is auto managed, there is no need to call this explicitly.
   * However, if "disconnect()" is called, it's necessary to call this to enable connections again.
   * A status message is sent to "runtimeProtoStubURL/status", containing the value "connected" if successful, or "disconnected" if some error occurs.
   */
  connect() {
    let _this = this;

    _this._continuousOpen = true;
    _this._open(() => {});
  }

  /**
   * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless "connect()" is called.
   * A status message is sent to "runtimeProtoStubURL/status" with value "disconnected".
   */
  disconnect() {
    let _this = this;

    _this._continuousOpen = false;
    if (_this._sock) {
      _this._sendClose();
    }
  }

  //todo: add documentation
  _sendOpen(callback) {
    let _this = this;


    this._sendStatus('in-progress');

    _this._id++;
    let msg = {
      id: _this._id, type: 'open', from: _this._runtimeSessionURL, to: 'mn:/session'
    };

    if (_this._reOpen) {
      msg.type = 're-open';
    }

    //register and wait for open reply...
    let hasResponse = false;
    _this._sessionCallback = function(reply) {
      if (reply.type === 'response' & reply.id === msg.id) {
        hasResponse = true;
        if (reply.body.code === 200) {
          if (reply.body.runtimeToken) {
            //setup runtimeSession
            _this._reOpen = true;
            _this._runtimeSessionURL = _this._config.runtimeURL + '/' + reply.body.runtimeToken;
          }

          _this._sendStatus('live');
          callback();
        } else {
          _this._sendStatus('failed', reply.body.desc);
        }
      }
    };

    _this._sock.send(JSON.stringify(msg));
    setTimeout(() => {
      if (!hasResponse) {
        //no response after x seconds...
        _this._sendStatus('disconnected', 'Timeout from mn:/session');
      }
    }, 3000);
  }

  _sendClose() {
    let _this = this;

    _this._id++;
    let msg = {
      id: _this._id, type: 'close', from: _this._runtimeSessionURL, to: 'mn:/session'
    };

    //invalidate runtimeSession
    _this._reOpen = false;
    _this._runtimeSessionURL = _this._config._runtimeURL;

    _this._sock.send(JSON.stringify(msg));
  }

  _sendStatus(value, reason) {
    let _this = this;

    console.log('[VertxAppProtoStub status changed] to ', value);

    _this._state = value;

    let msg = {
      type: 'update',
      from: _this._runtimeProtoStubURL,
      to: _this._runtimeProtoStubURL + '/status',
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }

    _this._bus.postMessage(msg);
  }

  _waitReady(callback) {
    let _this = this;

    if (_this._sock.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        _this._waitReady(callback);
      });
    }
  }

  _filter(msg) {
    if (msg.body && msg.body.via === this._runtimeProtoStubURL) {
      return false;
    } else {
      return true;
    }

  }

  _deliver(msg) {
    if (!msg.body) msg.body = {};

    msg.body.via = this._runtimeProtoStubURL;
    console.log('[VertxAppProtoStub: MN -> ProtoStub]', msg);
    this._bus.postMessage(msg);
  }

  // add documentation

  _open(callback) {
    let _this = this;

    if (!this._continuousOpen) {
      //TODO: send status (sent message error - disconnected)
      return;
    }

    if (!_this._sock) {
      if (_this._config.url.substring(0, 2) === 'ws') {
        _this._sock = new WebSocket(_this._config.url);
      } else {
        _this._sock = new SockJS(_this._config.url);
      }

      _this._sock.onopen = function() {
        _this._sendOpen(() => {
          callback();
        });
      };

      _this._sock.onmessage = function(e) {
        let msg = JSON.parse(e.data);
        console.log('[VertxAppProtoStub: MN -> SOCKET ON MESSAGE]', msg);
        if (msg.from === 'mn:/session') {
          if (_this._sessionCallback) {
            _this._sessionCallback(msg);
          }
        } else {
          if (_this._filter(msg)) {
            _this._deliver(msg);
          }
        }
      };

      _this._sock.onclose = function(event) {
        let reason;

        //See https://tools.ietf.org/html/rfc6455#section-7.4
        if (event.code === 1000) {
          reason = 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
        } else if (event.code === 1001) {
          reason = 'An endpoint is \'going away\', such as a server going down or a browser having navigated away from a page.';
        } else if (event.code === 1002) {
          reason = 'An endpoint is terminating the connection due to a protocol error';
        } else if (event.code === 1003) {
          reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
        } else if (event.code === 1004) {
          reason = 'Reserved. The specific meaning might be defined in the future.';
        } else if (event.code === 1005) {
          reason = 'No status code was actually present.';
        } else if (event.code === 1006) {
          reason = 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
        } else if (event.code === 1007) {
          reason = 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
        } else if (event.code === 1008) {
          reason = 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
        } else if (event.code === 1009) {
          reason = 'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
        } else if (event.code === 1010) {
          reason = 'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' + event.reason;
        } else if (event.code === 1011) {
          reason = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
        } else if (event.code === 1015) {
          reason = 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
        } else {
          reason = 'Unknown reason';
        }

        delete _this._sock;
        _this._sendStatus('disconnected', reason);
      };
    } else {
      _this._waitReady(callback);
    }
  }
}

export default function activate(url, bus, config) {
  return {
    name: 'VertxAppProtoStub',
    instance: new VertxAppProtoStub(url, bus, config)
  };
}

/**
* Callback used to send messages
* @callback PostMessage
* @param {Message} msg - Message to send
*/
