export type Theme = 'light' | 'dark';
export type PresetName = 'centered' | 'neon' | 'minimal' | 'hero';
export type AnimationType = 'background' | 'text' | 'avatar' | 'ring' | 'slide' | 'bounce';
export type OutputFormat = 'png' | 'gif';
export type MemberCountPosition =
  | 'corner' // alias for bottom-right
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface FontOptions {
  family?: string;
  color?: string;
  usernameColor?: string;
  size?: number;
  subtitleSize?: number;
}

export interface CardOptions {
  preset: PresetName;
  username?: string;
  avatar?: string | Buffer;
  subtitle?: string;
  memberCount?: number;
  memberCountPosition?: MemberCountPosition;
  background?: string | Buffer;
  ringColor?: string;
  theme: Theme;
  font: FontOptions;
  animations: AnimationType[];
}
