import { Command, flags } from '@oclif/command'
import { isUndefined, pick } from 'lodash'
import { getAllPackages } from '../core/packages'

export default class List extends Command {
  static description = 'List all the packages in the monorepo as json'

  static examples = [
    '$ standard-monorepo list',
    '$ standard-monorepo list >> changed.json',
  ]

  static args = []

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    const packages = await getAllPackages()

    this.log(
      JSON.stringify(
        packages.map((pkg) =>
          pick(pkg, ['name', 'version', 'private', 'location']),
        ),
        null,
        2,
      ),
    )
  }
}
