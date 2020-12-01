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
standard-monorepo/0.1.0 darwin-x64 node-v10.15.2
$ standard-monorepo --help [COMMAND]
USAGE
  $ standard-monorepo COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`standard-monorepo commit [COMMIT]`](#standard-monorepo-commit-commit)
* [`standard-monorepo help [COMMAND]`](#standard-monorepo-help-command)

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

_See code: [src/commands/commit.ts](https://github.com/imflavio/standard-monorepo/blob/v0.1.0/src/commands/commit.ts)_

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
<!-- commandsstop -->
