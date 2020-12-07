import { defaultTo, flattenDeep } from 'lodash'
import { join } from 'path'
import Glob from 'glob'

import { Package, PackageJson } from './types'

const root = process.cwd()

const findByGlob = async (glob: string) =>
  new Promise<Package[]>((resolve, reject) => {
    // @ts-expect-error
    new Glob(
      join(root + '/' + glob + '/package.json'),
      // @ts-expect-error
      { cache: 'FILE' },
      (err, pkgLocations: string[]) => {
        if (err) return reject(err)
        return resolve(
          pkgLocations.map((location) => {
            const {
              name,
              version,
              private: priv = false,
              dependencies = {},
              devDependencies = {},
              peerDependencies = {},
              optionalDependencies = {},
            } = require(location)
            if (!name) {
              throw Error('All packages must have a name: ' + location)
            }
            if (!version) {
              throw Error('All packages must have a version: ' + location)
            }
            return {
              name,
              version,
              private: priv,
              location,
              dependencies,
              devDependencies,
              peerDependencies,
              optionalDependencies,
            }
          }),
        )
      },
    )
  })

const getRootPackageJson = (): PackageJson =>
  require(join(root, 'package.json'))

const getAllPackages = async (): Promise<Package[]> => {
  const pkg = getRootPackageJson()

  const globs = defaultTo(
    Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages,
    [],
  )
  const packages = flattenDeep(await Promise.all(globs.map(findByGlob)))

  const seen = new Map()

  for (const { name, location } of packages) {
    if (seen.has(name)) seen.get(name).push(location)
    else seen.set(name, [location])
  }

  for (const [name, locations] of seen) {
    if (locations.length > 1) {
      throw new Error(
        [
          `Package name "${name}" used in multiple packages:`,
          ...locations,
        ].join('\n\t'),
      )
    }
  }

  return packages
}

export default getAllPackages
