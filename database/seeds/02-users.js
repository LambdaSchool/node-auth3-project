
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 2, username: 'cameronsray', password: 'freckles 5101', department: 'student'},
      ]);
    });
};
