# todo

A cli that tracks tasks. The cli is designed to be globally installed so that you can add tasks from anywhere in your terminal.
Uses Drizzle ORM to abstract over a local sqlite database for storing tasks.

## Usage

```bash
# bun is buggy if you try to run this
tsx index.ts list -d

todo add "task name"
todo list
todo done 1

# list all tasks including completed ones
todo list --all

# delete a misspelled task
todo add "create a todo lsit"
todo list
todo delete 2
```