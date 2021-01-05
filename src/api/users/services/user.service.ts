/**
 * User service.
 * -------------
 *
 * This class handle all bussines logic
 * directly related with User entitie.
 */

import { Model } from 'mongoose'
import { User, RefreshToken } from '../models'
import { UserEmitter } from '../events'
import { IToken, IUser } from '../interfaces'
import { UserSignupDTO, RefreshTokenDTO, UserLoginDTO } from '../DTO'
import { Cache } from '../../../services/cache'
import { Service } from '../../../core'
import { ApiError } from '../../../lib'
import { JWT, scopes } from '../../../auth'

export class UserService extends Service {
  constructor(
    private model: Model<IUser> = User,
    private emmiter: UserEmitter = new UserEmitter(),
    cache: Cache = new Cache('users'),
  ) {
    super(model, cache, { name: 'user' })
  }

  async createAdmin(userDTO: UserSignupDTO) {
    return super.insert({ ...userDTO, type: scopes.ADMIN, isActive: true })
  }

  async createSuperAdmin(userDTO: UserSignupDTO) {
    return super.insert({ ...userDTO, type: scopes.SUPER_ADMIN, isActive: true })
  }

  async signup(userDTO: UserSignupDTO) {
    try {
      const user = await super.insert(userDTO)
      this.emmiter.emmitCreated(user.email, user.name)
      return user
    } catch (error) {
      this.logger.error('Error on signup new user', error)
      return Promise.reject(error)
    }
  }

  async login(credentials: UserLoginDTO) {
    try {
      const user = await this.model.findOne({ email: credentials.email }) as IUser
      const canLoggedIn = user && await user.comparePassword(credentials.password)
      if (canLoggedIn) {
        const accessToken = await JWT.sign({ email: user.email, scope: user.type })
        const refreshToken = await RefreshToken.create({ email: user.email } as IToken)
        return { accessToken, refreshToken: refreshToken.token, user }
      }
      ApiError.raise.unauthorized('invalid credentials')
    } catch (error) {
      this.logger.error('Error on login user', error)
      return Promise.reject(error)
    }
  }

  async refreshAuthToken(refreshDTO: RefreshTokenDTO) {
    try {
      const { email, refreshToken } = refreshDTO
      const tokenStored = await RefreshToken.findOne({ token: refreshToken }) as IToken
      const user = await this.model.findOne({ email }) as IUser
      const userActive = user && user.isActive
      if (userActive && tokenStored && tokenStored.email === email && !tokenStored.isInvalid) {
        const accessToken = await JWT.sign({ email, scope: user.type })
        return { accessToken, refreshToken: tokenStored.token, user }
      }
      ApiError.raise.unauthorized()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(query: { id: IUser['id']}) {
    try {
      const _query = this._parseQuery(query)
      const user = await this.model.findOne(_query)
      if (user && user.isActive) {
        user.isActive = false
        await user.save()
        return null
      }
      ApiError.raise.notFound('user not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
