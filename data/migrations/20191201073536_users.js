
exports.up = function (knex) {
    return knex.schema.createTable('user', tbl => {
        tbl.increments()
        tbl.text('username').notNullable()
        tbl.text('password').notNullable()
        tbl.timestamp('created_at').defaultsTo(knex.fn.now())
        tbl.timestamp('updated_at').defaultsTo(knex.fn.now())
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user')
};
