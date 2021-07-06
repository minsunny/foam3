/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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


(function() {
  var flags    = this.FOAM_FLAGS = this.FOAM_FLAGS || {};
  flags.node   = false;
  flags.web    = true;
  if ( ! flags.hasOwnProperty('java')  ) flags.java  = false;
  if ( ! flags.hasOwnProperty('swift') ) flags.swift = false;
  if ( ! flags.hasOwnProperty('debug') ) flags.debug = true;
  if ( ! flags.hasOwnProperty('js')    ) flags.js    = true;

  // set flags by url parameters
  var urlParams = new URLSearchParams(globalThis.location.search);
  if ( urlParams.get('node')  ) flags.node = urlParams.get('node') === 'true';
  if ( urlParams.get('web')   ) flags.web = urlParams.get('web') !== 'false';
  if ( urlParams.get('java')  ) flags.java = urlParams.get('java') === 'true';
  if ( urlParams.get('swift') ) flags.swift = urlParams.get('swift') === 'true';
  if ( urlParams.get('debug') ) flags.debug = urlParams.get('debug') !== 'false';
  if ( urlParams.get('js')    ) flags.js = urlParams.get('js') !== 'false';

  function createLoadBrowser() {
    var path = document.currentScript && document.currentScript.src;
    // document.currentScript isn't supported on all browsers, so the following
    // hack gets the job done on those browsers.
    if ( ! path ) {
      var scripts = document.getElementsByTagName('script');
      for ( var i = 0 ; i < scripts.length ; i++ ) {
        if ( scripts[i].src.match(/\/foam.js$/) ) {
          path = scripts[i].src;
          break;
        }
      }
    }
    path = path && path.length > 3 && path.substring(0, path.lastIndexOf('src/')+4) || '';
    if ( ! globalThis.FOAM_ROOT ) globalThis.FOAM_ROOT = path;
    var loadedMap = {};
    var scripts   = '';
    return function(filename, opt_batch) {
      if ( filename && loadedMap[filename] ) {
        console.warn(`Duplicated load of '${filename}'`);
        return;
      }
      loadedMap[filename] = true;
      if ( filename ) {
        scripts += '<script type="text/javascript" src="' + path + filename + '.js"></script>\n';
      }
      if ( ! opt_batch ) {
        document.writeln(scripts);
        scripts = '';
      }
    };
  }

  this.FOAM_FILES = async function(files) {
    var load = createLoadBrowser();
    files.
      map(function(f) { return f.name; }).
      forEach(f => load(f, true));
    load(null, false);
  //  delete this.FOAM_FILES;
  };

  createLoadBrowser()('files', false);
})();
