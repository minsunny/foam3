foam.CLASS({
  package: 'foam.nanos.column',
  name: 'TableColumnOutputter',

  imports: [
    'currencyDAO',
  ],

  documentation: 'Class for returning 2d-array ( ie table ) for array of values ',

  methods: [
    {
      name: 'returnStringValueForProperty',
      type: 'String',
      documentation: 'Method that converts value to string',
      code: async function(prop, val, unitPropName) {
        if ( val ) {
          if ( foam.Array.isInstance(val) ) {
            var stringArr = [];
            for ( var i = 0 ; i < val.length ; i++ ) {
              stringArr.push(await this.valueToString(val[i]));
            }
            return stringArr.join(' ');
          }
          if ( foam.core.UnitValue.isInstance(prop) ) {
            if ( unitPropName ) {
              if ( prop.unitPropName === "destinationCurrency" ) {
                var currency = await this.currencyDAO.find(unitPropName);
                if ( !currency ) return unitPropName + ' ' +( val / 100 ).toString();
                return currency.format(val);
              }
              return unitPropName + ' ' + ( val / 100 ).toString();
            }
            return ( val / 100 ).toString();
          }
          if ( foam.core.Date.isInstance(prop) ) {
            return val.toISOString().substring(0, 10);
          }
          if ( foam.core.DateTime.isInstance(prop) ) {
            return val.toString().substring(0, 24);
          }
          if ( foam.core.Time.isInstance(prop) ) {
            return val.toString().substring(0, 8);
          }
          return await this.valueToString(val);
        }
        return ''; 
      }
    },
    async function valueToString(val) {
      if ( val.toSummary ) {
        if ( val.toSummary() instanceof Promise )
          return await val.toSummary();
        return val.toSummary();
      }
      return val.toString();
    },
    {
      name: 'arrayOfValuesToArrayOfStrings',
      code: async function(props, values) {
        var stringValues = [];
        for ( var value of values ) {
          var stringArrayForValue = [];
          for ( var i = 0 ; i < value.length ; i++ ) {
            stringArrayForValue.push(await this.returnStringValueForProperty(props[i], value[i]));
          }
          stringValues.push(stringArrayForValue);
        }
        return stringValues;
      }
    },
    async function objToArrayOfStringValues(x, of, propNames, obj) {
      var columnConfig = X.columnConfigToPropertyConverter;
      var values = [];
      for ( var propName of  propNames ) {
        values.push(await columnConfig.returnValueForPropertyName(x, of, propName, obj));
      }
      return values;
    },
    {
      name: 'objectToTable',
      code: async function(x, of, props, obj) {
        var values = this.objToArrayOfStringValues(x, of, props, obj);
        return this.returnTable(props, values);
      }
    },
    {
      name: 'returnTable',
      code: async function(props, values) {
        var table =  [ props.map( p => p.label ) ];
        var values = await this.arrayOfValuesToArrayOfStrings(props, values);
        table = table.concat(values);
        return table;
      }
    },
    {
      name: 'getAllPropertyNames',
      type: 'StringArray',
      code: function(cls) {
        var props = cls.getAxiomsByClass(foam.core.Property);
        var propNames = [];
        for ( var i = 0 ; i < props.length ; i++ ) {
          if ( ! props[i].networkTransient )
            propNames.push(props[i].name);
        }
        return propNames;
      }
    }
  ]
});