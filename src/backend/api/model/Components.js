'use strict'

class ComponentsModel {

  constructor({
    knexConnector = null,
  }) {
    this.knex = knexConnector
  }

  findAll() {
    return this.knex(`components`)
  }

  async findOne(args) {
    const [ component ] = await this.knex(`components`).where(args)
    return component || null
  }

  async create({
   title,
   description,
   component
  } = {}) {
    const [ id ] = await this.knex(`components`).insert({
      title,
      description,
      component,
    })
      .returning(`id`)
    return await this.findOne({ id })
  }

  async deleteById(id) {
    const result = await this.knex(`components`)
      .where({ id })
      .del()
    return result > 0 ? id : null
  }
}

module.exports = ComponentsModel
