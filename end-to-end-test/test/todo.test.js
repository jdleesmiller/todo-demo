const assert = require('assert')
const puppeteer = require('puppeteer')

const { Task } = require('storage')
const cleanup = require('storage/test/support/cleanup')

const BASE_URL = process.env.BASE_URL

before(async function() {
  global.browser = await puppeteer.launch({
    executablePath: 'google-chrome-unstable',
    headless: process.env.PUPPETEER_HEADLESS !== 'false'
  })
})

after(async function() {
  await global.browser.close()
})

beforeEach(cleanup.database)

describe('TO DO', function() {
  beforeEach(async function() {
    await Task.query().insert([{ description: 'foo' }, { description: 'bar' }])
  })

  it('lists, creates and completes tasks', async function() {
    const page = await global.browser.newPage()
    await page.goto(BASE_URL)

    await waitForNumberOfTasksToBe(page, 2)
    let tasks = await page.$$('.todo-task')

    // Complete task foo.
    assert.strictEqual(await getTaskText(tasks[0]), 'foo')
    let complete = await tasks[0].$('button')
    complete.click()
    await waitForNumberOfTasksToBe(page, 1)

    // Create a new task, baz.
    await page.type('.todo-new-task input[type=text]', 'baz')
    await page.click('.todo-new-task button')
    await page.waitForSelector('.todo-task button')
    await waitForNumberOfTasksToBe(page, 2)

    // Complete task baz.
    tasks = await page.$$('.todo-task')
    assert.strictEqual(await getTaskText(tasks[1]), 'baz')
    complete = await tasks[1].$('button')
    complete.click()
    await waitForNumberOfTasksToBe(page, 1)

    // Only bar should remain.
    tasks = await page.$$('.todo-task')
    assert.strictEqual(await getTaskText(tasks[0]), 'bar')
  })
})

async function waitForNumberOfTasksToBe(page, n) {
  await page.waitForFunction(
    `document.querySelectorAll(".todo-task").length == ${n}`
  )
}

async function getTaskText(elementHandle) {
  return elementHandle.$eval('span', node => node.innerText)
}
