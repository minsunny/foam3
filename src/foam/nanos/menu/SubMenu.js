foam.CLASS({
  package: 'foam.nanos.menu',
  name: 'SubMenu',
  extends: 'foam.nanos.menu.AbstractMenu',

  requires: [ 'foam.nanos.menu.SubMenuView' ],

  methods: [
    function createView(X, menu, parent) {
      return this.SubMenuView.create({menu: menu, parent: parent}, X);
    },

    function launch(X, menu, parent) {
      var view = this.createView(X, menu, parent);
      view.open();
    }
  ]
});