import util from 'util'
import fs from 'fs'
import { Command, flags } from '@oclif/command'
import * as inquirer from 'inquirer'
import { padMessage } from '../core/message'

const readFile = util.promisify(fs.readFile)

const scopeRegex = /^((build|ci|docs|feat|fix|perf|refactor|chore|style|test)!?\(((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)\)): /
const unscopeRegex = /^(build|ci|docs|feat|fix|perf|refactor|chore|style|test)!?: /

const isLowerCased = (regex: RegExp, commit: string) => {
  const [match] = regex.exec(commit) || []
  const message = commit.replace(match, '')
  return message.toLowerCase() === message
}

export const validateCommit = (regex: RegExp, commit: string) =>
  regex.test(commit) && isLowerCased(regex, commit)

export const validateCommitWithScope = (commit: string) =>
  validateCommit(RegExp(scopeRegex), commit)

export const validateCommitWithoutScope = (commit: string) =>
  validateCommit(RegExp(unscopeRegex), commit)

export default class Commit extends Command {
  static description =
    'Conventional commit lint utility: https://www.conventionalcommits.org/'

  static examples = [
    '$ standard-monorepo commit # this will create a prompt like commitizen',
    '$ standard-monorepo commit --scope # this will create a prompt like commitizen',
    '$ standard-monorepo commit "feat: did things"',
    '$ standard-monorepo commit "feat!: did things"',
    '$ standard-monorepo commit "feat(ABC-123): did things" --scope',
    '$ standard-monorepo commit "feat!(ABC-123): did things" --scope',
    `"husky": {
  "hooks": {
    "commit-msg": "standard-monorepo commit $HUSKY_GIT_PARAMS"
  }
}`,
  ]

  static args = [
    {
      name: 'commit',
      description: 'The commit message',
    },
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    scope: flags.boolean({
      char: 's',
      description: 'should include scope in the commit message',
    }),
  }

  async run() {
    const { args, flags } = this.parse(Commit)

    if (!args.commit) {
      const responses = await inquirer.prompt(
        [
          {
            name: 'type',
            message: `Select the type of change you're committing`,
            type: 'list',
            choices: [
              'build',
              'ci',
              'docs',
              'feat',
              'fix',
              'perf',
              'refactor',
              'chore',
              'style',
              'test',
            ],
          },
          flags.scope && {
            name: 'scope',
            message: `Insert the scope for the change you're committing`,
            type: 'input',
          },
          {
            name: 'breakingChange',
            message: 'Is this a breaking change?',
            type: 'confirm',
            default: false,
          },
          {
            name: 'message',
            message: `Your commit message`,
            type: 'input',
          },
        ].filter(Boolean),
      )

      args.commit = [
        responses.type,
        responses.breakingChange && '!',
        flags.scope && responses.scope && `(${responses.scope})`,
        ': ',
        responses.message,
      ]
        .filter(Boolean)
        .join('')
    }

    const isGitHook = args.commit.startsWith('.git/')

    if (isGitHook) {
      args.commit = await readFile(args.commit, 'utf8')
    }

    const isValid = flags.scope
      ? validateCommitWithScope(args.commit)
      : validateCommitWithoutScope(args.commit)

    if (isValid)
      this.log(
        padMessage({
          type: 'success',
          text: 'Commit message meets the conventional commit standard',
        }),
      )
    else {
      this.error(
        padMessage({
          type: 'fail',
          text: [
            '\n',
            '####################################',
            args.commit,
            '####################################',
            '\n',
            'Make sure you follow the conventional commit format and provide the correct scope flag for your needs.',
          ].join('\n'),
        }),
      )
    }
  }
}
