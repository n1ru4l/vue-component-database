'use strict'

const { stripIndent } = require(`common-tags`)

const data = [
  {
    id: 1,
    title: `sample-component-1`,
    description: `This is a sample component`,
    component: stripIndent`
      <template>
        <div>Sample component 1 {{sumVariable}} <button v-on:click="doSth">Click me!</button></div>
      </template>
      <script>
          module.exports = {
            data: () =>  ({
              sumVariable: 'foo'
            }),
            methods: {
              doSth() {
                this.sumVariable = this.sumVariable.split('').reverse().join('')
              }
            }
          }
      </script>
      <style scoped>
        button {
          color: green;
        }
      </style>
    `,
    author_id: 14338007,
  },
  {
    id: 2,
    title: `input-component`,
    description: `This is a sample component`,
    component: stripIndent`
      <template>
        <div>
          Input value: {{sumVariable}} <br>
          <input v-model="sumVariable" type="text">
        </div>
      </template>
      <script>
          module.exports = {
            data: () =>  ({
              sumVariable: 'foo'
            }),
            methods: {
              doSth() {
                this.sumVariable = this.sumVariable.split('').reverse().join('')
              }
            }
          }
      </script>
      <style scoped>
        button {
          color: green;
        }
      </style>
    `,
    author_id: 14338007,
  },
  {
    id: 3,
    title: `increment-component`,
    description: `This is a sample component`,
    component: stripIndent`
      <template>
        <div>Increment component {{number}}<button v-on:click="doSth">Click me!</button></div>
      </template>
      <script>
        module.exports = {
          data: () =>  ({
            number: 0
          }),
          methods: {
            doSth() {
              this.number++
            }
          }
        }
      </script>
      <style scoped>
        button {
          color: green;
        }
      </style>
    `,
    author_id: 14338007,
  },
  {
    id: 4,
    title: `add-component`,
    description: `A component that uses ES2015 code like 'export default' shich is not supported by V8 yet.`,
    component: stripIndent`
      <template>
        <div>
          <h1>Enter two numbers</h1>
          <div>
            <input v-model="num1"> + <input v-model="num2"> = <span>{{sum}}</span>
          </div>
        </div>
      </template>
      <script>
        export default {
          data: () => ({
            num1: 1,
            num2: 2,
          }),
          computed: {
            sum() {
              return parseInt(this.num1, 10) + parseInt(this.num2, 10)
            },
          },
        }
      </script>
      <style scoped>
        input {
          background-color: red;
        }
        span {
          background-color: green;
        }
      </style>
    `,
    author_id: 14338007,
  },
  {
    id: 5,
    title: `todo-list`,
    description: `Basic ToDo List Component`,
    component: stripIndent`
      <template>
        <div class="todo-list">
          <h1>ToDo List</h1>
          <ul class="todo-list__list">
            <li
              v-for="todoItem in todoItems"
              v-bind:class="{ 'todo-list-item--done' : todoItem.done }"
            >
              <input
                v-model="todoItem.content"
                type="text"
                class="todo-list-item__input"
              >
              <input
                v-model="todoItem.done"
                type="checkbox"
              >
            </li>
            <input
              v-model="newItemContent"
              type="text"
            >
            <button
              :disabled="isAddDisabled"
              v-on:click="addNewItem"
            >Add</button>
          </ul>
        </div>
      </template>
      <script>
        export default {
          data: () => ({
            todoItems: [
              {
                id: 1,
                content: 'Buy milk',
                done: false,
              },
              {
                id: 2,
                content: 'Take over the world',
                done: false,
              }
            ],
            newItemContent: '',
          }),
          methods: {
            addNewItem() {
              this.todoItems.push({
                id: this.todoItems.length + 1,
                content: this.newItemContent,
                done: false,
              })
              this.newItemContent = ''
            }
          },
          computed: {
            isAddDisabled() {
              return !this.newItemContent
            }
          }
        }
      </script>
      <style scoped>
        .todo-list {
          padding: 20px;
        }
        
        .todo-list__list {
          padding: 0;
        }
        
        .todo-list-item__input {
          border: 0;
        }
        
        .todo-list-item--done .todo-list-item__input {
          text-decoration: line-through;
        }
      </style>
    `,
    author_id: 14338007,
  },
]

exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(`components`).del()
  await knex(`components`).insert(data)
}
