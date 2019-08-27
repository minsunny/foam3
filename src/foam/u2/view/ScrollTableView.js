/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

 foam.CLASS({
  package: 'foam.u2.view',
  name: 'ScrollTableView',
  extends: 'foam.u2.Element',

  requires: [
    'foam.dao.FnSink',
    'foam.mlang.sink.Count',
    'foam.u2.view.TableView'
  ],

  css: `
    ^scrollbarContainer {
      overflow: scroll;
    }
  `,

  constants: [
    {
      type: 'Integer',
      name: 'TABLE_HEAD_HEIGHT',
      value: 51
    }
  ],

  properties: [
    {
      class: 'foam.dao.DAOProperty',
      name: 'data'
    },
    'columns',
    {
      class: 'FObjectArray',
      of: 'foam.core.Action',
      name: 'contextMenuActions'
    },
    {
      class: 'Int',
      name: 'daoCount'
    },
    'selection',
    {
      class: 'Boolean',
      name: 'editColumnsEnabled',
      documentation: `
        Set to true if users should be allowed to choose which columns to use.
      `,
      value: true
    },
    {
      class: 'Int',
      name: 'rowHeight',
      documentation: 'The height of one row of the table in px.',
      value: 49
    },
    {
      name: 'table_',
      documentation: `
        A reference to the table element we use in various calculations.
      `
    },
    {
      name: 'scrollbarContainer_',
      documentation: `
        A reference to the scrollbar's container element so we can update the
        height after the view has loaded.
      `
    },
    {
      type: 'Int',
      name: 'scrollHeight',
      expression: function(daoCount, rowHeight) {
        return rowHeight * daoCount + this.TABLE_HEAD_HEIGHT;
      }
    },
    {
      type: 'Int',
      name: 'pageSize',
      value: 30,
      documentation: 'The number of items in each "page". There are three pages.'
    },
    {
      type: 'Boolean',
      name: 'enableDynamicTableHeight',
      value: true,
    },
    {
      class: 'Boolean',
      name: 'multiSelectEnabled',
      documentation: 'Pass through to UnstyledTableView.'
    },
    {
      class: 'Map',
      name: 'selectedObjects',
      documentation: `
        The objects selected by the user when multi-select support is enabled.
        It's a map where the key is the object id and the value is the object.
        Here we simply bind it to the selectedObjects property on TableView.
      `
    },
    {
      class: 'Int',
      name: 'scrollPos_'
    },
    {
      class: 'Int',
      name: 'numPages_',
      expression: function(daoCount, pageSize) {
        return Math.ceil(daoCount / pageSize);
      }
    },
    {
      class: 'Int',
      name: 'currentTopPage_',
      expression: function(numPages_, scrollPos_, scrollHeight) {
        var scrollPercent = scrollPos_ / scrollHeight;
        var topPage = Math.floor(scrollPercent * numPages_);
        var topPageProgress = (scrollPercent * numPages_) % 1;
        if ( topPageProgress < 0.5 ) topPage = topPage - 1;
        return Math.min(Math.max(0, numPages_ - 3), Math.max(0, topPage));
      }
    },
    {
      class: 'Map',
      name: 'renderedPages_'
    },
  ],

  reactions: [
    ['', 'propertyChange.currentTopPage_', 'updateRenderedPages_'],
    ['', 'propertyChange.table_', 'updateRenderedPages_'],
    ['', 'propertyChange.daoCount', 'refresh'],
  ],

  methods: [
    function init() {
      this.onDetach(this.data$proxy.listen(this.FnSink.create({ fn: this.updateCount })));
      this.updateCount();
    },

    function initE() {
      this.
        start('div', undefined, this.scrollbarContainer_$).
          addClass(this.myClass('scrollbarContainer')).
          on('scroll', this.onScroll).
          start(this.TableView, {
            data: foam.dao.NullDAO.create({of: this.data.of}),
            columns: this.columns,
            contextMenuActions: this.contextMenuActions,
            selection$: this.selection$,
            editColumnsEnabled: this.editColumnsEnabled,
            multiSelectEnabled: this.multiSelectEnabled,
            selectedObjects$: this.selectedObjects$
          }, this.table_$).
            style({
              height: this.scrollHeight$.map(h => h + 'px'),
              position: 'relative'
            }).
          end().
        end();

      /*
        to be used in cases where we don't want the whole table to
        take the whole page (i.e. we need multiple tables)
        and enableDynamicTableHeight can be switched off
      */
      if (this.enableDynamicTableHeight) {
        this.onDetach(this.onload.sub(this.updateTableHeight));
        window.addEventListener('resize', this.updateTableHeight);
        this.onDetach(() => {
          window.removeEventListener('resize', this.updateTableHeight);
        });
      }
    }
  ],

  listeners: [
    {
      name: 'refresh',
      isFramed: true,
      code: function() {
        Object.keys(this.renderedPages_).forEach(i => {
          this.renderedPages_[i].remove();
          delete this.renderedPages_[i];
        });
        this.updateRenderedPages_();
        if ( this.scrollbarContainer_ && this.scrollbarContainer_.el() ) {
          this.scrollbarContainer_.el().scrollTop = 0;
        }
      }
    },
    {
      name: 'updateCount',
      isFramed: true,
      code: function() {
        return this.data$proxy.select(this.Count.create()).then((s) => {
          this.daoCount = s.value;
        });
      }
    },
    {
      name: 'updateRenderedPages_',
      isFramed: true,
      code: function() {
        if ( ! this.table_ ) return;
        Object.keys(this.renderedPages_).forEach(i => {
          if ( i >= this.currentTopPage_ && i <= this.currentTopPage_ + 2 ) return;
          this.renderedPages_[i].remove();
          delete this.renderedPages_[i];
        });

        for ( var i = 0; i < Math.min(this.numPages_, 3) ; i++) {
          var page = this.currentTopPage_ + i;
          if ( this.renderedPages_[page] ) continue;
          var dao = this.data$proxy.limit(this.pageSize).skip(page * this.pageSize);
          var tbody = this.table_.slotE_(this.table_.rowsFrom(dao));
          tbody.style({
            position: 'absolute',
            width: '100%',
            'z-index': -1, // To ensure the rows stay behind the header.
            top: this.TABLE_HEAD_HEIGHT + page * this.pageSize * this.rowHeight + 'px'
          });
          this.table_.add(tbody);
          this.renderedPages_[page] = tbody;
        }

      }
    },
    {
      name: 'onScroll',
      isFramed: true,
      code: function(e) {
        this.scrollPos_ = e.target.scrollTop;
      }
    },
    {
      name: 'updateTableHeight',
      code: function() {
        // Find the distance from the top of the table to the top of the screen.
        var distanceFromTop = this.scrollbarContainer_.el().getBoundingClientRect().y;

        // Calculate the remaining space we have to make use of.
        var remainingSpace = window.innerHeight - distanceFromTop;

        // TODO: Do we want to do this?
        // Leave space for the footer.
        remainingSpace -= 44;

        this.scrollbarContainer_.style({ height: `${remainingSpace}px` });
      }
    }
  ]
});
