interface Deps {
  [dependencyName: string]: string
}

export interface Package {
  name: string
  version: string
  private: boolean
  location: string
  dependencies: Deps
  devDependencies: Deps
  peerDependencies: Deps
  optionalDependencies: Deps
}

export interface PackageJson extends Omit<Package, 'location'> {
  workspaces:
    | string[]
    | {
        packages: string[]
        nohoist: string[]
      }
}

export interface Nodes {
  [node: string]: string[]
}
