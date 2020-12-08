# standard-monorepo

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/standard-monorepo.svg)](https://npmjs.org/package/standard-monorepo)
[![Downloads/week](https://img.shields.io/npm/dw/standard-monorepo.svg)](https://npmjs.org/package/standard-monorepo)
[![License](https://img.shields.io/npm/l/standard-monorepo.svg)](https://github.com/imflavio/standard-monorepo/blob/master/package.json)

<!-- toc -->
* [standard-monorepo](#standard-monorepo)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g standard-monorepo
$ standard-monorepo COMMAND
running command...
$ standard-monorepo (-v|--version|version)
standard-monorepo/0.3.0 darwin-x64 node-v14.15.1
$ standard-monorepo --help [COMMAND]
USAGE
  $ standard-monorepo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`standard-monorepo circular-deps`](#standard-monorepo-circular-deps)
* [`standard-monorepo commit [COMMIT]`](#standard-monorepo-commit-commit)
* [`standard-monorepo help [COMMAND]`](#standard-monorepo-help-command)
* [`standard-monorepo list`](#standard-monorepo-list)

## `standard-monorepo circular-deps`

```
USAGE
  $ standard-monorepo circular-deps

OPTIONS
  -h, --help                     show CLI help
  --max=max                      maximum allowed individual circular dependencies
  --maxTotalPaths=maxTotalPaths  maximum allowed circular dependencies paths

EXAMPLES
  $ standard-monorepo circular-deps
  $ standard-monorepo circular-deps --max=5 --maxTotalPaths=10 # default is 0 for both
```

_See code: [src/commands/circular-deps.ts](https://github.com/imflavio/standard-monorepo/blob/v0.3.0/src/commands/circular-deps.ts)_

## `standard-monorepo commit [COMMIT]`

```
USAGE
  $ standard-monorepo commit [COMMIT]

ARGUMENTS
  COMMIT  The commit message

OPTIONS
  -h, --help   show CLI help
  -s, --scope  should include scope in the commit message

EXAMPLES
  $ standard-monorepo commit # this will create a prompt like commitizen
  $ standard-monorepo commit --scope # this will create a prompt like commitizen
  $ standard-monorepo commit "feat: did things"
  $ standard-monorepo commit "feat!: did things"
  $ standard-monorepo commit "feat(ABC-123): did things" --scope
  $ standard-monorepo commit "feat!(ABC-123): did things" --scope
  "husky": {
     "hooks": {
       "commit-msg": "standard-monorepo commit $HUSKY_GIT_PARAMS"
     }
  }
```

_See code: [src/commands/commit.ts](https://github.com/imflavio/standard-monorepo/blob/v0.3.0/src/commands/commit.ts)_

## `standard-monorepo help [COMMAND]`

```
USAGE
  $ standard-monorepo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `standard-monorepo list`

```
USAGE
  $ standard-monorepo list

OPTIONS
  -h, --help   show CLI help
  --only=only  [default: name,version,private,location] fields to return for each package

EXAMPLES
  $ standard-monorepo list
  $ standard-monorepo list >> list.json
  $ standard-monorepo list --only="name,version,private,location"
  $ standard-monorepo list 
  --only="name,version,private,location,dependencies,devDependencies,peerDependencies,optionalDependencies"
```

_See code: [src/commands/list.ts](https://github.com/imflavio/standard-monorepo/blob/v0.3.0/src/commands/list.ts)_
<!-- commandsstop -->
