import { Command, flags } from '@oclif/command'
import { pick } from 'lodash'
import getAllPackages from '../core/allPackages'
import { Package } from '../core/types'

export default class List extends Command {
  static description = 'List all the packages in the monorepo as json'

  static examples = [
    '$ standard-monorepo list',
    '$ standard-monorepo list >> list.json',
    '$ standard-monorepo list --only="name,version,private,location"',
    '$ standard-monorepo list --only="name,version,private,location,dependencies,devDependencies,peerDependencies,optionalDependencies"',
  ]

  static args = []

  static flags = {
    help: flags.help({ char: 'h' }),
    only: flags.string({
      description: 'fields to return for each package',
      default: 'name,version,private,location',
    }),
  }

  async run() {
    const { flags } = this.parse(List)
    const packages = await getAllPackages()

    const print = (packages: Package[]) =>
      this.log(
        JSON.stringify(
          packages.map((pkg) => pick(pkg, flags.only.split(','))),
          null,
          2,
        ),
      )

    return print(packages)
  }
}
