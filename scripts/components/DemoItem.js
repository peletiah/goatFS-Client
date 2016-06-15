import React from 'react';
var SortableItemMixin = require('react-anything-sortable').SortableItemMixin;

export default React.createClass({
  mixins: [SortableItemMixin],

  getDefaultProps() {
    return {
      className: 'demo-item'
    };
  },

  render() {
    const { className, children } = this.props;
    return this.renderWithSortable(
      <div className={className}>
        {children}
      </div>
    );
  }
});
