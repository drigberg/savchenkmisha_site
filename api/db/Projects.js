/**
 * Module dependencies
 */

const uuid = require('uuid')
const _ = require('lodash')

/**
 * Module
 */

class Projects {
  constructor(store) {
    this.store = store
    if (!this.store.data.projects) {
      this.store.data.projects = {}
      this.store.save()
    }
  }

  prepareData(data) {
    return _.pickBy({
      id: data.id,
      title: data.title,
      description: data.description,
      images: data.images || []
    })
  }

  list() {
    return Object.values(this.store.data.projects)
  }

  read(id) {
    const project = this.store.data.projects[id]
    if (!project) {
      throw new Error(`Project not found with id ${id}`)
    }

    return project
  }

  insert(data) {
    const id = uuid.v4()

    const project = this.prepareData({
      ...data,
      id
    })

    this.store.data.projects[id] = project
    this.store.save()

    return project
  }

  update(id, data) {
    const project = this.prepareData({
      ...this.read(id),
      ...data
    })

    this.store.data.projects[id] = project

    this.store.save()

    return project
  }

  remove(id) {
    delete this.store.data.projects[id]
    this.store.save()

    return this.store.data.projects
  }

  removeAll() {
    this.store.data.projects = {}
    this.store.save()

    return this.store.data.projects
  }
}

module.exports = Projects
