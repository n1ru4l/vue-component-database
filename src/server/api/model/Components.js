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

  async findWhereId(id) {
    const [ component ] = await this.knex(`components`).where({ id })
    return component || null
  }

  async update(id, data) {
    await this.knex(`components`)
      .update(data)
      .where({ id })
    return this.findWhereId(id)
  }

  async create({
   title,
   description,
   component,
   authorId,
  } = {}) {
    const [ id ] = await this.knex(`components`).insert({
      title,
      description,
      component,
      author_id: authorId,
    }).returning(`id`)
    return this.findOne({ id })
  }

  async deleteById(id) {
    const result = await this.knex(`components`)
      .where({ id })
      .del()
    return result > 0 ? id : null
  }
}

module.exports = ComponentsModel
