import { Command, flags } from '@oclif/command'
import getAllPackages from '../core/allPackages'
import { Graph } from '../core/graph'

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
    max: flags.integer({
      description: 'maximum allowed circular dependencies',
      default: 0,
    }),
  }

  async run() {
    const { flags } = this.parse(CircularDeps)

    const packages = await getAllPackages()
    const graph = new Graph(packages)
    const circDeps = graph.detectCycle()

    if (circDeps.length === 0) {
      this.log(
        '[SUCCESS] No circular dependencies found in the project, good job!',
      )
    } else {
      const msg = `Found ${
        circDeps.length
      } circular dependencies in the project, please fix these as soon as possible.
${circDeps.map((cycle) => cycle.join(' -> ')).join('\n')}`

      if (flags.fail && circDeps.length > flags.max) this.error('[FAIL] ' + msg)
      else this.log('[WARNING] ' + msg)
    }
  }
}
