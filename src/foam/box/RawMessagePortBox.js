/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.box',
  name: 'RawMessagePortBox',
  implements: [ 'foam.box.Box' ],

  requires: [ 'foam.json.Outputter' ],

  properties: [
    {
      name: 'port'
    },
    {
      class: 'FObjectProperty',
      of: 'foam.json.Outputter',
      name: 'outputter',
      factory: function() {
        // NOTE: Configuration must be consistent with parser in
        // foam.messageport.MessagePortService.
        return this.Outputter.create({
          pretty: false,
          formatDatesAsNumbers: true,
          outputDefaultValues: false,
          strict: true,
          propertyPredicate: function(o, p) { return ! p.networkTransient; }
        });
      }
    }
  ],
  methods: [
    function send(m) {
      this.port.postMessage(this.outputter.stringify((m)));
    }
  ]
});
