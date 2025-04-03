

export interface RefreshToken {
    accessToken: string;
    refreshToken: string;
    expiration: Date;
    fullName: string;
    rolUser : string;
    userName?: string;
  }
