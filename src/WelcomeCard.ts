import type {
  AnimationType,
  CardOptions,
  FontOptions,
  MemberCountPosition,
  PresetName,
  Theme,
} from './types.js';
import { DEFAULT_OPTIONS } from './constants.js';
import { PRESETS } from './presets/index.js';
import { WelcomeCardError } from './errors.js';
import { renderPNG } from './render/toPNG.js';
import { renderGIF } from './render/toGIF.js';

export class WelcomeCard {
  private opts: CardOptions = { ...DEFAULT_OPTIONS };

  setPreset(preset: PresetName): this {
    if (!PRESETS[preset]) {
      throw new WelcomeCardError(
        `Unknown preset "${preset}". Allowed: ${Object.keys(PRESETS).join(', ')}`,
      );
    }
    this.opts.preset = preset;
    return this;
  }

  setUsername(username: string): this {
    this.opts.username = username;
    return this;
  }

  setAvatar(avatar: string | Buffer): this {
    this.opts.avatar = avatar;
    return this;
  }

  setSubtitle(subtitle: string): this {
    this.opts.subtitle = subtitle;
    return this;
  }

  setMemberCount(count: number): this {
    this.opts.memberCount = count;
    return this;
  }

  setMemberCountPosition(position: MemberCountPosition): this {
    this.opts.memberCountPosition = position;
    return this;
  }

  setBackground(background: string): this {
    this.opts.background = background;
    return this;
  }

  setTheme(theme: Theme): this {
    this.opts.theme = theme;
    return this;
  }

  setFont(font: FontOptions): this {
    this.opts.font = { ...this.opts.font, ...font };
    return this;
  }

  setAnimations(animations: AnimationType[]): this {
    this.opts.animations = animations;
    return this;
  }

  private validate(): void {
    if (!this.opts.username) {
      throw new WelcomeCardError('username is required — call .setUsername() before rendering.');
    }
  }

  async toPNG(): Promise<Buffer> {
    this.validate();
    return renderPNG(this.opts);
  }

  async toGIF(): Promise<Buffer> {
    this.validate();
    if (this.opts.animations.length === 0) {
      console.warn('[welcomecard] toGIF() called with no animations — output will be static.');
    }
    return renderGIF(this.opts);
  }
}
