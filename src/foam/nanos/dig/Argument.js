/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.dig',
  name: 'Argument',

  documentation: 'to specify parameters info on picked method on SUGAR',

  properties: [
   {
    class: 'String',
    name: 'name',
    documentation: 'Parameters defined name',
    visibility: foam.u2.Visibility.RO
   },
   {
     class: 'String',
     name: 'javaType',
     label: 'java Type',
     displayWidth: '100',
     documentation: 'Parameters defined javaType',
     visibility: foam.u2.Visibility.RO
    },
    {
      class: 'String',
      documentation: 'Parameters input value',
      name: 'value'
    },
    {
      class: 'FObjectProperty',
      of: this.javaType,
      name: 'objectType',
      label: 'Object Value',
      documentation: 'Parameters input value (Object Type Parameters)',
      factory: function() {
        var model = this.lookup(this.javaType.toString(), true);

        if ( this.javaType != 'String' && this.javaType != 'double' && this.javaType != 'boolean' && this.javaType != 'long' )
          return model.create(null, this);
        else return null;
      }
    }
  ],

  methods: [
  ]
});
