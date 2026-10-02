import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientID) {
      throw new Error('GOOGLE_CLIENT_ID is not defined in configuration');
    }

    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    if (!clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET is not defined in configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: configService.get('SERVER_URL') + '/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { emails, photos, displayName } = profile;

    // Never link / create accounts by an e-mail that Google has not verified,
    // otherwise someone could take over an existing account.
    const email = emails?.[0]?.value;
    if (!email || profile._json?.email_verified !== true) {
      return done(null, false);
    }

    const user = {
      email,
      name: displayName,
      picture: photos?.[0]?.value,
    };

    done(null, user);
  }
}
