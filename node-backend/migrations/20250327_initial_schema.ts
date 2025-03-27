import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Create users table
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username', 50).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('password', 255).notNullable();
        table.timestamps(true, true);
    });

    // Create events table
    await knex.schema.createTable('events', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.text('description');
        table.dateTime('date').notNullable();
        table.string('location', 255).notNullable();
        table.integer('created_by')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.timestamps(true, true);
    });

    // Create RSVPs table (bonus feature)
    await knex.schema.createTable('rsvps', (table) => {
        table.increments('id').primary();
        table.integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.integer('event_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('events')
            .onDelete('CASCADE');
        table.enum('status', ['attending', 'maybe', 'not_attending']).defaultTo('attending');
        table.timestamps(true, true);

        // Create a composite unique constraint
        table.unique(['user_id', 'event_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    // Drop tables in reverse order
    await knex.schema.dropTableIfExists('rsvps');
    await knex.schema.dropTableIfExists('events');
    await knex.schema.dropTableIfExists('users');
}