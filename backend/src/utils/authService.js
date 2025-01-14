import jwt from 'jsonwebtoken';

class AuthService {
  constructor(
    accessTokenSecret,
    accessTokenExpire,
    refreshTokenSecret,
    refreshTokenExpire,
  ) {
    this.accessTokenSecret = accessTokenSecret;
    this.accessTokenExpire = accessTokenExpire;
    this.refreshTokenSecret = refreshTokenSecret;
    this.refreshTokenExpire = refreshTokenExpire;
  }
  generateAccessToken(payload) {
    try {
      return jwt.sign(payload, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpire,
      });
    } catch (error) {
      console.log(error);
    }
  }
  generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpire,
      });
    } catch (error) {
      console.log(error);
    }
  }
  generateResetToken(payload) {
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      this.resetPasswordExpire = Date.now() + 15 * (60 * 1000);
      return resetToken;
    } catch (error) {
      console.log(error);
    }
  }
}

export default AuthService;
