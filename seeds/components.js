const data = [
  {
    id: 1,
    title: `Sample Component 1`,
    description: `This is a sample component`,
    component: `
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
    `
  },
  {
    id: 2,
    title: `Input component`,
    description: `This is a sample component`,
    component: `
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
    `
  },
  {
    id: 3,
    title: `Increment Component`,
    description: `This is a sample component`,
    component: `
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
    `
  },
]

exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(`components`).del()
  await knex(`components`).insert(data)
}
