class ResizableTable {
  constructor(table) {
    this.table = table;
    this.pageX = undefined;
    this.curCol = undefined;
    this.nxtCol = undefined;
    this.curColWidth = undefined;
    this.offsetWidth = undefined;
    this.nxtColWidth = undefined;
    this.divs = [];
    this.resizableTable(table);
  }

  destroy() {
    this.removeAllDivs();
  }

  clearState() {
    this.pageX = undefined;
    this.curCol = undefined;
    this.nxtCol = undefined;
    this.curColWidth = undefined;
    this.offsetWidth = undefined;
    this.nxtColWidth = undefined;
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    this.curCol = e.target.parentElement;
    this.nxtCol = this.curCol.nextElementSibling;
    this.pageX = e.pageX;

    const padding = this.paddingDiff(this.curCol);

    this.offsetWidth = this.curCol.offsetWidth;
    this.curColWidth = this.offsetWidth - padding;
    if (this.nxtCol) {
      this.nxtColWidth = this.nxtCol.offsetWidth - padding;
    }
  }

  onMouseOver(e) {
    e.target.style.borderRight = '2px solid #c0c0c0';
  }

  onMouseOut(e) {
    e.target.style.borderRight = '';
  }

  onMouseMove(e) {
    if (this.curCol) {
      const diffX = e.pageX - this.pageX;

      if (this.nxtCol) {
        this.nxtCol.style.width = this.nxtColWidth - diffX + 'px';
      }

      this.curCol.style.width = this.curColWidth + diffX + 'px';
    }
  }

  onMouseUp(e) {
    this.clearState();
    e.stopPropagation();
    e.preventDefault();
  }

  setListeners(div) {
    div.addEventListener('mousedown', (e) => this.onMouseDown(e));
    div.addEventListener('mouseover', (e) => this.onMouseOver(e));
    div.addEventListener('mouseout', (e) => this.onMouseOut(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  removeListener(div) {
    div.removeEventListener('mousedown', (e) => this.onMouseDown(e));
    div.removeEventListener('mouseover', (e) => this.onMouseOver(e));
    div.removeEventListener('mouseout', (e) => this.onMouseOut(e));
    document.removeEventListener('mousemove', (e) => this.onMouseMove(e));
    document.removeEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  removeListeners() {
    this.divs.forEach((div) => this.removeListener(div));
  }

  createDiv(height) {
    const div = document.createElement('div');
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = '5px';
    div.style.position = 'absolute';
    div.style.cursor = 'col-resize';
    div.style.userSelect = 'none';
    div.style.height = height + 'px';
    div.style.zIndex = 100;
    return div;
  }

  removeDiv(div) {
    div.parentElement.removeChild(div);
  }

  removeAllDivs() {
    this.divs.forEach((div) => {
      this.removeListener(div);
      this.removeDiv(div);
    });
    this.div?.splice(0, this.divs.length);
  }

  paddingDiff(col) {
    const style = window.getComputedStyle(col, null);

    if (style.getPropertyValue('box-sizing') === 'border-box') {
      return 0;
    }

    const padLeft = style.getPropertyValue('padding-left');
    const padRight = style.getPropertyValue('padding-right');
    return parseInt(padLeft, 10) + parseInt(padRight, 10);
  }

  getStyleVal(el, css) {
    return window.getComputedStyle(el, null).getPropertyValue(css);
  }

  resizableTable() {
    const rows = this.table.getElementsByTagName('tr'),
      cols = rows[0] ? rows[0].children : undefined;
    if (!cols) return;

    // table.style.overflow = 'hidden'

    const tableHeight = this.table.offsetHeight;

    for (let row = 0; row < rows.length; ++row) {
      const cols = rows[row] ? rows[row].children : [];
      for (let col = 0; col < cols.length; ++col) {
        if (row === 0) {
          const div = this.createDiv(tableHeight);
          this.divs.push(div);
          cols[col].appendChild(div);
          this.setListeners(div);
          cols[col].style.position = 'relative';
        }
        cols[col].style.whiteSpace = 'nowrap';
        cols[col].style.textOverflow = 'ellipsis';
        // cols[col].style.overflow = 'hidden'
      }
    }
  }
}

function handleUpdate(el, binding) {
  const ctx = el.__tableResizable;
  const tables = el.getElementsByTagName('table');
  if (tables === undefined && ctx !== undefined) {
    // table turned into a grid?
    ctx.destroy();
    delete el.__tableResizable;
  } else if (tables !== undefined && ctx === undefined) {
    // new table
    setTimeout(() => {
      el.__tableResizable = new ResizableTable(tables[0]);
    }, 250);
  } else if (tables !== undefined && ctx !== undefined) {
    // use-case is columns added/removed
    // tear down old one and add new one
    ctx.destroy();
    delete el.__tableResizable;
    setTimeout(() => {
      el.__tableResizable = new ResizableTable(tables[0]);
    }, 250);
  }
}

export const TableResizable = {
  name: 'TableResizable',

  mounted(el, binding) {
    handleUpdate(el, binding);
  },

  bind(el, binding) {
    handleUpdate(el, binding);
  },

  inserted(el, binding) {
    handleUpdate(el, binding);
  },

  updated(el, binding) {
    handleUpdate(el, binding);
  },

  componentUpdated(el, binding) {
    handleUpdate(el, binding);
  },

  unbind(el) {
    const ctx = el.__tableResizable;
    if (ctx) {
      ctx.destroy();
      delete el.__tableResizable;
    }
  },

  beforeUnmount(el) {
    const ctx = el.__tableResizable;
    if (ctx) {
      ctx.destroy();
      delete el.__tableResizable;
    }
  }
};
