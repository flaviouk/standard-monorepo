import { Command, flags } from '@oclif/command'
import { red } from 'chalk'
import { getCircularDependencies } from '../core/packages'

export default class CircularDeps extends Command {
  static description = 'List all the circular dependencies in the monorepo'

  static examples = [
    '$ standard-monorepo circular-deps',
    '$ standard-monorepo circular-deps --fail # This is the default',
    '$ standard-monorepo circular-deps --no-fail',
  ]

  static args = []

  static flags = {
    help: flags.help({ char: 'h' }),
    fail: flags.boolean({
      description: 'fail if circular dependencies are found',
      default: true,
      allowNo: true,
    }),
  }

  async run() {
    const { flags } = this.parse(CircularDeps)

    const num = await getCircularDependencies(flags.fail)

    if (num === 0) {
      this.log('✅ No circular dependencies found in the project, good job!')
    } else {
      const msg = `Found ${red(
        num,
      )} circular dependencies in the project, please fix these as soon as possible.`

      this.log(msg)
      if (flags.fail) throw new Error('❌ Fail! ' + msg)
    }
  }
}
