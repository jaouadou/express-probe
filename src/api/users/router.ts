/**
 * User router.
 * -----------
 *
 * Handle all user endpoints.
 */

import { UserController } from './controllers'
import { UserLoginDTO, UsertCreateDTO, UserSignupDTO, UserUpdateDTO, RefreshTokenDTO } from './DTO'
import { RouterBase } from '../../core'
import { Auth, Validate, RequestLimiter } from '../../middleware'
import { scopes } from '../../auth'

export class UserRouter extends RouterBase {
  constructor(
    private controller: UserController = new UserController(),
  ) {
    super('users')
    this.initializeRouter()
  }

  initializeRouter() {
    this._router.post(
      '/admin',
      Auth.isAuthenticated(), Auth.is(scopes.SUPER_ADMIN),
      Validate.inBody(UsertCreateDTO),
      this.controller.createAdmin,
    )

    this._router.post(
      '/superadmin',
      Auth.isAuthenticated(), Auth.is(scopes.SUPER_ADMIN),
      Validate.inBody(UsertCreateDTO),
      this.controller.createSuperAdmin,
    )

    this._router.post(
      '/signup',
      RequestLimiter(3),
      Validate.inBody(UserSignupDTO),
      this.controller.signup,
    )

    this._router.post(
      '/refresh-token',
      RequestLimiter(3),
      Validate.inBody(RefreshTokenDTO),
      this.controller.refreshToken,
    )

    this._router.post(
      '/login',
      RequestLimiter(8),
      Validate.inBody(UserLoginDTO),
      this.controller.login,
    )

    this._router.post(
      '/',
      Auth.isAuthenticated(), Auth.is([scopes.ADMIN, scopes.SUPER_ADMIN]),
      Validate.inBody(UsertCreateDTO),
      this.controller.create,
    )

    this._router.get(
      '/',
      Auth.isAuthenticated(), Auth.is([scopes.ADMIN, scopes.SUPER_ADMIN]),
      this.controller.list,
    )

    this._router.get(
      '/:id',
      Auth.isAuthenticated(), Auth.isOwnerOrSatff('id', 'params'),
      this.controller.retrieve,
    )

    this._router.patch(
      '/:id',
      Auth.isAuthenticated(), Auth.isOwnerOrSuperAdmin('id', 'params'),
      Validate.inBody(UserUpdateDTO),
      this.controller.patchOrUpdate,
    )

    this._router.delete(
      '/:id',
      Auth.isAuthenticated(), Auth.isOwnerOrSuperAdmin('id', 'params'),
      this.controller.delete,
    )
  }
}
