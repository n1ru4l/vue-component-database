const knex = require(`../connectors/knex`)

class ComponentsModel {

  constructor() {

  }

  findAll() {
    return knex(`components`)
  }

  async findOne(args) {
    const [ component ] = await knex(`components`).where(args)
    return component || null
  }

  async create({
   title,
   description,
   component
  }  = {}) {
    const [ id ] = await knex(`components`).insert({
      title,
      description,
      component,
    })
      .returning(`id`)
    return await this.findOne({ id })
  }

  async deleteById(id) {
    const result = await knex(`components`)
      .where({ id })
      .del()
    return result > 0 ? id : null
  }
}

module.exports = ComponentsModel
