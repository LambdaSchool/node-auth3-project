exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(tbl) {
    tbl.increment();
    tbl
      .string("username")
      .notNullable()
      .unique();
    tbl.string("password").notNullable();
    tbl.string("department").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
