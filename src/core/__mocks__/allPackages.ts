import { createPackage } from '../../test/utils'

export default jest.fn(async () => [
  createPackage({ name: 'a' }),
  createPackage({ name: 'b' }),
  createPackage({ name: 'c' }),
])
