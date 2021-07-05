/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.dao',
  name: 'ResetDAODecorator',
  extends: 'foam.dao.ProxyDAO',

  documentation: `DAO decorator that resets the given dao and clears it's cache after put.`,
  
  requires: [
    'foam.dao.AbstractDAO',
    'foam.dao.TTLSelectCachingDAO'
  ],

  properties: [
    {
      class: 'String',
      name: 'daoKey'
    }
  ],

  methods: [
    {
      name: 'put_',
      code: function(x, obj) {
        this.delegate.put_(x, obj).then((obj) => {
          if ( this.daoKey ) {
            var dao = this.__subContext__[this.daoKey];
            dao.cmd(this.TTLSelectCachingDAO.PURGE);
            dao.cmd(this.AbstractDAO.RESET_CMD);
          }
          return obj;
        });
      }
    }
  ]
});
