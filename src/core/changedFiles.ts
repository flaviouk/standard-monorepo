import execa from 'execa'
import { join } from 'path'

const getChangedFiles = async (
  since: string,
  forkPoint: boolean,
): Promise<string[]> => {
  const { stdout: ref } = forkPoint
    ? await execa.command('git merge-base --fork-point ' + since)
    : { stdout: since }
  const { stdout: fullPath } = await execa.command(
    'git rev-parse --show-toplevel',
  )
  const { stdout: changedFiles } = await execa.command(
    'git diff --name-only ' + ref,
  )
  return changedFiles.split('\n').map((filePath) => join(fullPath, filePath))
}

export default getChangedFiles
