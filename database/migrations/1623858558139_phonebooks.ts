import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Phonebooks extends BaseSchema {
  protected tableName = 'phonebooks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().index()
      table.string('phone_number').notNullable().index()
      table.string('email').notNullable().index().unique()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
