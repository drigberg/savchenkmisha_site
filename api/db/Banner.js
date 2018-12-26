/**
 * Module dependencies
 */

const _ = require('lodash')

/**
 * Module
 */

class Banner {
  constructor(store) {
    this.store = store
    if (!this.store.data.banner) {
      this.store.data.banner = {}
      this.store.save()
    }
  }

  prepareData(data) {
    return _.pickBy({
      title: data.title,
      subtitle: data.subtitle,
      bio: data.bio
    })
  }

  read() {
    const data = this.store.data.banner
    if (!data) {
      throw new Error('No data for banner!')
    }

    return data
  }

  update(payload) {
    this.store.data.banner = this.prepareData(payload)
    this.store.save()

    return this.store.data.banner
  }
}

module.exports = Banner
