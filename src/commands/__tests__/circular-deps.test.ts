import CircularDeps from '../circular-deps'
jest.mock('../../core/allPackages')
import getAllPackages from '../../core/allPackages'
import { graphs } from '../../test/utils'

let stdout

beforeEach(() => {
  stdout = []
  jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val) => stdout.push(val))
})

describe('[command:circular-deps]', () => {
  it('should detect no circular dependencies', async () => {
    await CircularDeps.run([])
    expect(stdout).toMatchSnapshot()
  })

  it('should detect circular dependencies', async () => {
    // @ts-expect-error
    getAllPackages.mockImplementation(async () => graphs.ONE_CYCLE)

    try {
      await CircularDeps.run(['--fail'])
    } catch (err) {
      expect(err.toString()).toMatchSnapshot()
    }
  })

  it('should detect multiple circular dependencies', async () => {
    // @ts-expect-error
    getAllPackages.mockImplementation(async () => graphs.TWO_CYCLES)

    try {
      await CircularDeps.run(['--fail'])
    } catch (err) {
      expect(err.toString()).toMatchSnapshot()
    }
  })

  it('should fail silently', async () => {
    // @ts-expect-error
    getAllPackages.mockImplementation(async () => graphs.ONE_CYCLE)

    await CircularDeps.run(['--no-fail'])
    expect(stdout).toMatchSnapshot()
  })

  it('should pass if there are less circular dependencies than the maximum', async () => {
    // @ts-expect-error
    getAllPackages.mockImplementation(async () => graphs.TWO_CYCLES)

    await CircularDeps.run(['--max=5'])
    expect(stdout).toMatchSnapshot()
  })

  it('should fail if there are more circular dependencies than the maximum', async () => {
    // @ts-expect-error
    getAllPackages.mockImplementation(async () => graphs.TWO_CYCLES)

    try {
      await CircularDeps.run(['--max=1'])
    } catch (err) {
      expect(err.toString()).toMatchSnapshot()
    }
  })
})
