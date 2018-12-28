/**
 * Module dependencies
 */

const _ = require('lodash')

/**
 * Module
 */

class Contact {
  constructor(store) {
    this.store = store
    if (!this.store.data.contact) {
      this.store.data.contact = {}
      this.store.save()
    }
  }

  prepareData(data) {
    return _.pickBy({
      email: data.email,
      github: data.github,
      linkedin: data.linkedin,
      title: data.title,
    })
  }

  read() {
    const data = this.store.data.contact
    if (!data) {
      throw new Error('No data for "contact" page!')
    }

    return data
  }

  update(payload) {
    const data = this.prepareData(payload)
    this.store.data.contact = data
    this.store.save()

    return this.store.data.contact
  }
}

module.exports = Contact
