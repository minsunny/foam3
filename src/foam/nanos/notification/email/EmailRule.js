/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.notification.email',
  name: 'EmailRule',

  documentation: `Represents an email template that stores the default properties of a specific email,
  mimics the EmailMessage which is the end obj that is processed into email.`,

  javaImports: [
    'foam.i18n.Locale',
    'foam.i18n.TranslationService',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'foam.nanos.logger.Logger',
    'foam.nanos.notification.email.EmailTemplateEngine',
    'foam.util.SafetyUtil',
    'java.nio.charset.StandardCharsets'
  ],

  tableColumns: ['id', 'name', 'group', 'locale'],

  properties: [
    {
      class: 'String',
      name: 'id'
    },
    {
      class: 'String',
      name: 'name'
    },
    {
      class: 'String',
      name: 'templateName'
    },
    {
      class: 'Map',
      name: 'templateArguments',
      includeInDigest: true,
      section: 'templateInformation',
      order: 10,
      view: { class: 'foam.u2.view.MapView' }
    }
  ]
});

foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.notification.email.EmailRule',
  targetModel: 'foam.nanos.notification.email.EmailTemplate',
  forwardName: 'templates',
  inverseName: 'emailRule',
  cardinality: '1:*'
});
