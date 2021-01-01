exports.up = function(knex) {
    return knex.schema.createTable('cohorts', table => {
        table.increments('id');
        table.string('logo_url');
        table.string('name');
        table.string('members');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('cohorts')
};