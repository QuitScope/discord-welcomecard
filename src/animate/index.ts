import type { AnimationType } from '../types.js';
import type { FrameState } from '../render/drawFrame.js';
import { textAlpha } from './text.js';
import { avatarGlow } from './avatar.js';
import { backgroundShift } from './background.js';
import { ringShift } from './ring.js';
import { textSlide } from './slide.js';
import { avatarBounce } from './bounce.js';

export function frameStateFor(animations: AnimationType[], progress: number): FrameState {
  return {
    textAlpha: animations.includes('text') ? textAlpha(progress) : 1,
    avatarGlow: animations.includes('avatar') ? avatarGlow(progress) : 1,
    backgroundShift: animations.includes('background') ? backgroundShift(progress) : 0,
    ringShift: animations.includes('ring') ? ringShift(progress) : 0,
    textSlide: animations.includes('slide') ? textSlide(progress) : 1,
    avatarBounce: animations.includes('bounce') ? avatarBounce(progress) : 0,
  };
}
