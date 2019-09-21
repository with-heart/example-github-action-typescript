import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    // limit only to when issues are opened
    if (github.context.payload.action !== 'opened') return

    // check the payload
    const {issue} = github.context.payload
    if (!issue) return

    const token =
      process.env['THANKS_USER_TOKEN'] || process.env['GITHUB_TOKEN']
    if (!token) return

    // create the octokit client
    const octokit: github.GitHub = new github.GitHub(token)
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    // reply with the thanks message
    // https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    const thanksMessage = core.getInput('thanks-message')
    const issueCommentResponse = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: thanksMessage,
    })
    console.log(`Replied with thanks message: ${issueCommentResponse.data.url}`)

    // add a reaction
    // https://octokit.github.io/rest.js/#octokit-routes-reactions-create-for-issue
    const issueReactionResponse = await octokit.reactions.createForIssue({
      owner,
      repo,
      issue_number: issue.number,
      content: 'heart',
    })
    console.log(`Reacted: ${issueReactionResponse.data.content}`)
  } catch (error) {
    console.error(error.message)
    core.setFailed(`Thanks-action failure: ${error}`)
  }
}

run()

export default run
