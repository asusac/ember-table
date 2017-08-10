import Controller from '@ember/controller';
import TreeNode from '../utils/tree-node';
import LinkedListTree from '../utils/linked-list-tree';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import { A as emberA } from '@ember/array';

export default Controller.extend({
  showTable: true,
  showPanel: false,

  getRow(title) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const row = EmberObject.create({
      'id': title
    });
    for (let j = 0; j < 26; j++) {
      row.set(alphabet[j], alphabet[j]);
    }
    return row;
  },

  rows: computed(function() {
    const topRow = new TreeNode(null, this.getRow('Top Row'));
    for (let i = 0; i < 10; i++) {
      const header = new TreeNode(topRow, this.getRow(`Header ${i}`));
      for (let j = 0; j < 10; j++) {
        const group = new TreeNode(header, this.getRow(`Group ${j}`));
        for (let k = 0; k < 10; k++) {
          group.addChild(new TreeNode(group, this.getRow(`Leaf ${k}`)));
        }

        header.addChild(group);
      }

      topRow.addChild(header);
    }

    const root = new TreeNode(null, null);
    root.addChild(topRow);

    return new LinkedListTree(root);
  }),

  columns: computed(function() {
    const arr = emberA();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const columnWidth = 180;

    arr.pushObject(EmberObject.create({
      columnName: 'Column id',
      valuePath: 'id',
      isFixedColumn: true,
      width: columnWidth
    }));

    for (let j = 0; j < 26; j++) {
      arr.pushObject(EmberObject.create({
        columnName: `Col ${alphabet[j % 26]}`,
        valuePath: alphabet[j % 26],
        width: columnWidth
      }));
    }

    return arr;
  }),

  actions: {
    onCheckboxClicked(value) {
      this.set('showTable', value);
    },

    onPanelClicked(value) {
      this.set('showPanel', value);
    },

    onCellClicked(row) {
      if (!row.collapse) {
        this.get('rows').collapseNode(row);
      } else {
        this.get('rows').expand(row);
      }
    }
  }
});
