import fs from 'fs'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import yaml from 'js-yaml'
import run from '../debug'

beforeEach(() => {
  jest.resetModules()

  const doc = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../action.yml', 'utf8'),
  )
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    process.env[envVar] = doc.inputs[name]['default']
  })

  github.context.payload = {pusher: {name: 'Mark'}} as WebhookPayload
})

afterEach(() => {
  const doc = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../action.yml', 'utf8'),
  )
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    delete process.env[envVar]
  })
})

describe('debug action debug messages', () => {
  it('outputs a debug message', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenCalledWith(
      '👋 Hello Mark! You are an amazing person! 🙌',
    )
  })

  it('sets the action output', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith(
      'amazing-message',
      '👋 Hello Mark! You are an amazing person! 🙌',
    )
  })

  it('does not output debug messages for non-amazing creatures', async () => {
    process.env['INPUT_AMAZING-CREATURE'] = 'mosquito'
    const debugMock = jest.spyOn(core, 'debug')
    const setFailedMock = jest.spyOn(core, 'setFailed')
    await run()
    expect(debugMock).toHaveBeenCalledTimes(0)
    expect(setFailedMock).toHaveBeenCalledWith(
      'Sorry, mosquitos are not amazing 🚫🦟',
    )
  })
})
