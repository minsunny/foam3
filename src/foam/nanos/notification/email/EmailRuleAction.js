/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.notification.email',
  name: 'EmailRuleAction',

  documentation: 'Rule to set proper email property and call emailService',

  implements: [
    'foam.nanos.ruler.RuleAction'
  ],

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.i18n.TranslationService',
    'foam.nanos.auth.User',
    'foam.nanos.auth.Subject',
    'foam.nanos.theme.Theme',
    'foam.nanos.theme.Themes',
    'foam.util.Emails.EmailsUtility',
    'java.util.Date',
    'java.util.HashMap'
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
      agency.submit(x, new ContextAgent() {
        @Override
        public void execute(X x) {
          //EmailsUtility.sendEmailFromTemplate(x, user, message, "reset-password", args);



          /*
          UserCapabilityJunction junction = (UserCapabilityJunction) obj;

          var subject = junction.getSubject(x);
          var subjectX = x.put("subject", subject);
          var capabilityDAO = ((DAO) subjectX.get("capabilityDAO")).inX(subjectX);
          var cap = (Capability) capabilityDAO.find(junction.getTargetId());
          if ( cap == null ) return;

          if ( ! cap.getVisibilityPredicate().f(subjectX) ) return;

          User user = (User) subject.getRealUser();

          TranslationService ts = (TranslationService) x.get("translationService");
          String locale = user.getLanguage().getCode().toString();
          String capabilityName = ts.getTranslation(locale, cap.getId() + ".name", cap.getName());
          String junctionStatus = ts.getTranslation(locale, "foam.nanos.crunch.CapabilityJunctionStatus." + junction.getStatus().getName() + ".label", junction.getStatus().getLabel());

          HashMap<String, Object> args = new HashMap<>();
          args.put("capNameEn", cap.getName());
          args.put("capName", capabilityName);
          args.put("junctionStatusEn", junction.getStatus().getName());
          args.put("junctionStatus", junctionStatus);

          TopLevelCapabilityStatusUpdateNotification notification = new TopLevelCapabilityStatusUpdateNotification();
          notification.setCapabilityName(cap.getName());
          notification.setCapabilitySource(cap.getId() + ".name");
          notification.setJunctionStatus(junction.getStatus().getLabel());
          notification.setJunctionSource("foam.nanos.crunch.CapabilityJunctionStatus." + junction.getStatus().getName() + ".label");

          // if the UserCapabilityJunction belongs to an actual user, send the notification to the user.
          // otherwise, send the notification to the group the user is under
          if ( user.getClass().equals(User.class) ) notification.setUserId(user.getId());
          else  notification.setGroupId(user.getGroup());

          notification.setNotificationType("Capability Status Update");
          notification.setCreated(new Date());
          notification.setEmailName("top-level-capability-status-update");
          notification.setEmailArgs(args);
          user.doNotify(x, notification);
          */
        }
      }, "Send Notification On Top Level Capability Status Update");
      `
    }
  ]
});
