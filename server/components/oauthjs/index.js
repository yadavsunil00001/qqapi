'use strict';

import {App, User, AccessToken, AuthCode, RefreshToken} from '../../sqldb';

module.exports = require('oauth2-server')({
  model: {
    getAccessToken: function getAccessToken(bearerToken, callback) {
      AccessToken
        .findOne({
          where: { access_token: bearerToken },
          attributes: ['access_token', 'expires'],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'client_id', 'group_id', 'email_id'],
            },
          ],
        })
        .then(accessToken => {
          if (!accessToken) return callback(null, false);
          const token = accessToken.toJSON();
          token.user = token.User;
          callback(null, token);
          return
        })
        .catch(callback);
    },

    // serialize App accessing api
    getClient: function getClient(clientId, clientSecret, callback) {
      const options = {
        where: { client_id: clientId },
        attributes: ['id', ['client_id', 'clientId'], ['redirect_uri', 'redirectUri']],
      };
      if (clientSecret) options.where.client_secret = clientSecret;

      App
        .findOne(options)
        .then(function serializeClient(client) {
          if (!client) return callback(null, false);
          callback(null, client.toJSON());
          return
        })
        .catch(callback);
    },

    grantTypeAllowed: function grantTypeAllowed(clientId, grantType, callback) {
      callback(null, true);
      return;
    },

    saveAccessToken: function saveAccessToken(accessToken, client, expires, user, callback) {
      return AccessToken
        .build({ expires })
        .set('app_id', client.id)
        .set('access_token', accessToken)
        .set('user_id', user.id)
        .save()
        .then(token => callback(null, token))
        .catch(callback);
    },

    getAuthCode: function getAuthCode(authCode, callback) {
      AuthCode
        .findOne({
          where: { auth_code: authCode },
          attributes: [['app_id', 'clientId'], 'expires', ['user_id', 'userId']],
        })
        .then(function verifyAuthCode(authCodeModel) {
          if (!authCodeModel) return callback(null, false);
          callback(null, authCodeModel.toJSON());
          return
        })
        .catch(callback);
    },

    saveAuthCode: function saveAuthCode(authCode, client, expires, user, callback) {
      return AuthCode
        .build({ expires })
        .set('app_id', client.id)
        .set('auth_code', authCode)
        .set('user_id', user.id)
        .save()
        .then(code => callback(null, code))
        .catch(callback);
    },

    getUser: function getUser(username, password, callback) {
      return User
        .findOne({
          where: { username },
          attributes: ['id', 'name', 'client_id', 'group_id', 'email_id', 'password'],
        })
        .then(function verifyPass(user) {
          return user.verifyPassword(password, callback);
        })
        .catch(callback);
    },

    saveRefreshToken: function saveRefreshToken(refreshToken, client, expires, user, callback) {
      return RefreshToken
        .build({ expires })
        .set('app_id', client.id)
        .set('refresh_token', refreshToken)
        .set('user_id', user.id)
        .save()
        .then(token => callback(null, token))
        .catch(callback);
    },

    getRefreshToken: function getRefreshToken(refreshToken, callback) {
      return RefreshToken
        .findOne({
          where: { refresh_token: refreshToken },
          attributes: [['app_id', 'clientId'], ['user_id', 'userId'], 'expires'],
        })
        .then(function sendRefreshToken(refreshTokenModel) {
          if (!refreshTokenModel) return callback(null, false);
          callback(null, refreshTokenModel.toJSON());
        })
        .catch(callback);
    },

    generateToken: function generateToken(type, req, callback) {
      // reissue refreshToken if grantType is refresh_token
      if (type === 'refreshToken' && req.body.grant_type === 'refresh_token') {
        return callback(null, { refreshToken: req.body.refresh_token });
      }

      callback(null, false);
      return
    },
  },
  grants: ['authorization_code', 'password', 'refresh_token'],
  debug: true,
});
