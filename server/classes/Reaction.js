const { resolve } = require('path');

class Reaction {
  placeholders = {
    qmark: './assets/qmark_bold.png',
    arrow: './assets/qmark_bold_arrow.png',
  };

  constructor({ rid, left, middle, right, theme, kind, difficulty, mechanism, qualification }) {
    this.rid = rid;
    this.left = left;
    this.middle = middle;
    this.right = right;
    this.theme = theme;
    this.kind = kind;
    this.difficulty = difficulty;
    this.mechanism = mechanism;
    this.qualification = qualification;
  }

  hideLeftSide () {
    this.left = resolve(this.placeholders.qmark);
    return this;
  }

  hideMiddleSide () {
    this.middle = resolve(this.placeholders.arrow);
    return this;
  }

  hideRightSide () {
    this.right = resolve(this.placeholders.qmark);
    return this;
  }

  hideRandomSide() {
    const r = Math.random();
    if (r < 0.34) return this.hideLeftSide();
    else if (r < 0.68) return this.hideMiddleSide();
    else return this.hideRightSide();
  }
}

module.exports = Reaction;
