export type StravaTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteId?: number;
};

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
};

export type StravaTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: { id: number };
};
