/**
 * Module dependencies
 */

const _ = require("lodash");

/**
 * Module
 */

class About {
  constructor(store) {
    this.store = store;
    if (!this.store.data.about) {
      this.store.data.about = {};
      this.store.save();
    }
  }

  prepareData(data) {
    return _.pickBy({
      text: data.text,
      title: data.title,
      images: data.images
    });
  }

  read() {
    const data = this.store.data.about;
    if (!data) {
      throw new Error('No data for "about" page!');
    }

    return data;
  }

  update(payload) {
    this.store.data.about = this.prepareData(payload);
    this.store.save();

    return this.store.data.about;
  }
}

module.exports = About;
