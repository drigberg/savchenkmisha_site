/**
 * Module dependencies
 */

const Ajv = require('ajv')
const uuid = require('uuid')

/**
 * Module variables
 */
const ajv = new Ajv()

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

    this.schema = {}
  }

  validate(data) {
    const valid = ajv.validate(this.schema, data)

    if (!valid) {
      console.log('Validation error:', ajv.errors)

      return {
        success: false,
        error: ajv.errors,
      }
    }

    return {
      success: true,
      error: null,
    }
  }

  list() {
    return this.store.data.projects
  }

  read(id) {
    const project = this.store.data.projects.find(item => item.id === id)
    if (!project) {
      throw new Error('Project not found')
    }

    return project
  }

  insert(data) {
    const project = Object.assign(
      {},
      data,
      {
        id: uuid.v1()
      }
    )

    this.store.data.projects.push(project)
    this.store.save()

    return project
  }

  update(id, data) {
    const project = this.read(id)
    Object.assign(project, data)
    this.store.save()

    return project
  }

  remove(id) {
    const project = this.read(id)

    this.store.data.projects.splice(this.store.data.projects.indexOf(project), 1)
    this.store.save()

    return this.store.data.projects
  }
}

module.exports = Projects