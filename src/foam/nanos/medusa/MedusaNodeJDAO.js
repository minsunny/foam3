/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.medusa',
  name: 'MedusaNodeJDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: `Skip writing to underlying JDAO if only transientDate.`,

  properties: [
    {
      name: 'jdao',
      class: 'foam.dao.DAOProperty',
    }
  ],

  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function (cls) {
        cls.extras.push(`
          public MedusaNodeJDAO(foam.core.X x, foam.dao.DAO delegate, foam.dao.java.JDAO jdao) {
            setX(x);
            setOf(foam.nanos.medusa.MedusaEntry.getOwnClassInfo());
            setDelegate(delegate); // mdao
            setJdao(jdao);
          }
        `);
      }
    }
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
      MedusaEntry entry = (MedusaEntry) obj;
      if ( ! foam.util.SafetyUtil.isEmpty(entry.getData()) ) {
        return getJdao().put_(x, obj);
      }
//      return getDelegate().put_(x, obj);
      return obj;
      `
    }
  ]
});
