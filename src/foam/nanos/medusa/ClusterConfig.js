/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.medusa',
  name: 'ClusterConfig',

  documentation: 'Cluster node meta data used to group nodes and describe features.',

  implements: [
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.EnabledAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'userDAO',
  ],

  tableColumns: [
    'id',
    'enabled',
    'realm',
    'region',
    'zone',
    'type',
    'isPrimary',
    'status',
    'pingLatency',
    'connections',
    'lastModified'
  ],
  
  properties: [
    {
      documentation: 'Node local network or DNS name',
      name: 'id',
      class: 'String',
      label: 'Hostname',
      aliases: ['hostname', 'name'],
      required: true
    },
    {
      class: 'Boolean',
      name: 'enabled',
      documentation: 'Allows for prepatory configuration changes.',
      value: true
    },
    {
      documentation: 'Group of nodes. Encompases all nodes in all Regions for the same application.',
      name: 'realm',
      class: 'String',
      required: 'true',
    },
    {
      documentation: 'Geographic region, like a Data Center, of group nodes. A sub group in the Realm.',
      name: 'region',
      class: 'String',
    },
    {
      documentation: 'A sub-group of nodes in a region. An inner core of nodes in a Data Center.  0 (zero) has special meaning for Medusa Mediator clusters.',
      name: 'zone',
      class: 'Long',
      value: 0
    },
    {
      documentation: 'Type of a Medusa instance.',
      name: 'type',
      class: 'Enum',
      of: 'foam.nanos.medusa.MedusaType',
      value: 'MEDIATOR'
    },
    {
      documentation: 'True when this instance is the Primary.',
      name: 'isPrimary',
      class: 'Boolean',
      value: false,
      visibility: 'RO',
      storageTransient: true
    },
    {
      documentation: 'Status of a node',
      name: 'status',
      class: 'Enum',
      of: 'foam.nanos.medusa.Status',
      value: 'OFFLINE'
    },
    {
      name: 'accessMode',
      class: 'Enum',
      of: 'foam.nanos.medusa.AccessMode',
      documentation: 'Mode of a node (read-only, read-write or write-only)'
    },
    {
      class: 'Enum',
      of: 'foam.nanos.medusa.quorum.InstanceState',
      name: 'quorumStatus',
      value: 'NONE',
      storageTransient: true
    },
    {
      name: 'servicePort',
      class: 'Int',
      value: 8080
    },
    {
      name: 'socketPort',
      class: 'Int',
      value: 8082
    },
    {
      name: 'electionPort',
      class: 'Int',
      value: 8083
    },
    {
      documentation: 'Ping delay greater than this value will trigger alarms.',
      name: 'pingLatency',
      class: 'Long',
      visibility: 'RO',
      tableCellFormatter: function(value, obj, axiom) {
        this.add(obj.pingLatency).add('(ms)');
      },
      storageTransient: true
    },
    {
      documentation: 'Ping message on error',
      name: 'pingInfo',
      class: 'String',
      visibility: 'RO',
      storageTransient: true
    },
    {
      documentation: 'Ping delay greater than this value will trigger alarms.',
      name: 'maxPingLatency',
      class: 'Long',
      value: 500
    },
    {
      name: 'sessionId',
      class: 'String'
    },
    {
      name: 'connections',
      class: 'StringArray',
      storageTransient: true,
      visibilty: 'RO',
      javaFactory: 'return new String[0];'
    },
    {
      documentation: 'Creation date.',
      name: 'created',
      class: 'DateTime',
      visibility: 'RO',
    },
    {
      documentation: `The id of the user who created the transaction.`,
      name: 'createdBy',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            if ( user.email ) {
              this.add(user.email);
            }
          }
        }.bind(this));
      }
    },
    {
      documentation: 'User who created the entry',
      name: 'createdByAgent',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            if ( user.email ) {
              this.add(user.email);
            }
          }
        }.bind(this));
      }
    },
    {
      documentation: 'Last modified date.',
      name: 'lastModified',
      class: 'DateTime',
      visibility: 'RO',
    },
    {
      documentation: `The id of the user who created the transaction.`,
      name: 'lastModifiedBy',
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            if ( user.email ) {
              this.add(user.email);
            }
          }
        }.bind(this));
      }
    }
  ]
});
