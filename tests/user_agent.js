/**
 * If we think of the SDK as being layered in this way
 *
 * Jitsi.Applet => Jitsi.Connection => Services (Register, Loader, Call)                                              *
 * The layer we're testing here is Services.
 * More specifically, we're testing Register
 *
 */
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
  name: 'Jitsi Service UserAgent Tests',

  setUp: function() {
    this.data = {
      "package":"registration",
      "type":"registered",
      "details":
      {
        "new-state":"Registered"
      }
    };

    this.principal = {
      userId: 'test@example.onsip.com',
      displayName: 'test',
      authUsername: 'test_test',
      password: 'test_passwd'
    };

    this.applet = Jitsi.Test.MockApplet.extend();
    this.conn = Jitsi.Connection.extend({appletAdapter: this.applet});
  },

  tearDown: function() {
    delete this.applet;
    delete this.conn;
  },

  testCreateRegisterService: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.conn.UserAgent,
                   "Jitsi.Service.UserAgent was not created, can't do much");
  },

  testRegisterWithCredentials: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.UserAgent.extend({credentials:this.principal});
    Assert.areEqual(service.userId, this.principal.userId);
  },

  testRegister: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.UserAgent;
    Assert.isTrue(service.register('','','',''));
  },

  testUnregister: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.UserAgent.extend({credentials:this.principal});
    Assert.isTrue(service.unregister());
  },

  testCreateCall: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.UserAgent.extend({credentials:this.principal});
    var to = '7777';
    var setupId = '12313213234325';
    Assert.isTrue(service.createCall(to, setupId));
  },

  /**
   * This unit test verifies two features
   *
   * First, a success verifies that our
   * Jitsi.Connection object has properly
   * registered for 'package' events
   * from the applet
   *
   * Second, a success verifies that
   * an application using the SDK
   * will receive registration events
   */
  testFireOnRegisterEvent: function () {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (item) {
      handlerFired = true;
    };

    this.conn.UserAgent.registerHandler('onRegisterEvent', handler);

    this.applet.fireEvent('packages', this.data);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.conn.UserAgent.unregisterHandler('onRegisterEvent');

    handlerFired = false;
    this.applet.fireEvent('packages', this.data);
    Assert.isFalse(handlerFired, 'handler should not fire');
  },

  testRegisterEventUAItem: function() {
    var Assert = YAHOO.util.Assert;
    var that = this;
    var handler = function(item){
      Assert.areEqual(item.type, that.type);
      Assert.isFunction(item.unregister);
    };

    this.conn.UserAgent.registerHandler('onRegisterEvent', handler);
    this.applet.fireEvent('packages', this.data);
  }

}));