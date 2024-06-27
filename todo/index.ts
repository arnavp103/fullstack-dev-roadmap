import { Command } from "commander";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { version } from "./package.json";

// Define the schema
const todos = sqliteTable("todos", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	completed: integer("completed", { mode: "boolean" })
		.notNull()
		.default(false),
	created: integer("created", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Initialize the database
const sqlite = new Database("todo.db");
const db = drizzle(sqlite);

// Create the table if it doesn't exist
db.run(sql`
	CREATE TABLE IF NOT EXISTS todos (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT NOT NULL,
	  completed INTEGER NOT NULL DEFAULT 0,
	  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	)
  `);

const program = new Command();

program
	.name("todo")
	.version(version)
	.description("A simple todo cli to track and manage tasks");

program
	.command("add <task>")
	.description("Add a new task as a string")
	.action(async (task: string) => {
		await db.insert(todos).values({ name: task });
		console.log(`Added task: ${task}`);
	});

program
	.command("list")
	.option("-a, --all", "List all tasks")
	.option("-d, --done", "List only completed tasks")
	.description("List tasks based on their status, defaulting to open tasks")
	.action(async options => {
		if (options.all && options.done) {
			console.error("Error: --all and --done cannot be used together");
			return;
		}

		let query = db
			.select()
			.from(todos)
			.where(sql`completed = 0`);

		if (options.all) {
			query = db.select().from(todos);
		}

		if (options.done) {
			query = db
				.select()
				.from(todos)
				.where(sql`completed = 1`);
		}

		const tasks = await query;
		tasks.forEach(task => {
			console.log(
				`${task.id}: ${task.name} ${
					task.completed ? "(completed)" : ""
				}`
			);
		});
	});

program
	.command("done <taskId>")
	.description("Mark a task as done")
	.action(async (taskId: string) => {
		const task = db
			.select()
			.from(todos)
			.where(sql`id = ${parseInt(taskId)}`)
			.get();

		// if undefined, task does not exist
		if (!task) {
			console.error(`Task ${taskId} not found`);
			return;
		}

		const taskName = task.name;

		await db
			.update(todos)
			.set({ completed: true })
			.where(sql`id = ${parseInt(taskId)}`);
		console.log(`Marked task ${taskId}: ${taskName} as done`);
	});

program
	.command("delete <taskId>")
	.description("Delete a task")
	.action(async (taskId: string) => {
		await db.delete(todos).where(sql`id = ${parseInt(taskId)}`);
		console.log(`Deleted task ${taskId}`);
	});

program.parse(process.argv);
