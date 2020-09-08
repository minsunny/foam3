/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.medusa',
  name: 'MedusaUniqueDAO',
  extends: 'foam.dao.ProxyDAO',

  // REVIEW: this may only be occuring during development.
  documentation: `Enforce unique indexes on nodes`,

  javaImports: [
    'foam.nanos.logger.PrefixLogger',
    'foam.nanos.logger.Logger'
  ],

  properties: [
    {
      name: 'logger',
      class: 'FObjectProperty',
      of: 'foam.nanos.logger.Logger',
      visibility: 'HIDDEN',
      javaFactory: `
        return new PrefixLogger(new Object[] {
          this.getClass().getSimpleName()
        }, (Logger) getX().get("logger"));
      `
    }
  ],
  
  methods: [
    {
      name: 'put_',
      javaCode: `
      MedusaEntry entry = (MedusaEntry) obj;
      getLogger().debug("put", entry.getIndex());
      if ( getDelegate().find_(x, entry.getId()) != null ) {
        getLogger().error("put", "duplicate index", entry);
        throw new DaggerException("Duplicate index: "+entry.getIndex());
      }
      return getDelegate().put_(x, entry);
      `
    }
  ]
});