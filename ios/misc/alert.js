var UIAlertController = ObjC.classes.UIAlertController;
var UIAlertAction = ObjC.classes.UIAlertAction;
var UIApplication = ObjC.classes.UIApplication;
var handler = new ObjC.Block({ retType: 'void', argTypes: ['object'], implementation: function () {} });

ObjC.schedule(ObjC.mainQueue, function () {
  var alert = UIAlertController.alertControllerWithTitle_message_preferredStyle_('From r2frida', 'Welcome to r2land folks!', 1);
  var defaultAction = UIAlertAction.actionWithTitle_style_handler_('OK', 0, handler);
  alert.addAction_(defaultAction);
  UIApplication.sharedApplication().keyWindow().rootViewController().presentViewController_animated_completion_(alert, true, NULL);
})
