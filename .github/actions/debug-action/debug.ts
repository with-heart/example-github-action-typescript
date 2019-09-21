import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    const creature = core.getInput('amazing-creature')

    if (creature === 'mosquito') {
      core.setFailed('Sorry, mosquitos are not amazing 🚫🦟')
      return
    }

    const {name} = github.context.payload.pusher
    const message = `👋 Hello ${name}! You are an amazing ${creature}! 🙌`

    core.debug(message)
    core.setOutput('amazing-message', message)
  } catch (error) {
    core.setFailed(`Debug-action failure: ${error}`)
  }
}

run()

export default run
