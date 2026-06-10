import type { AnimationType } from '../types.js';
import type { FrameState } from '../render/drawFrame.js';
import { textAlpha } from './text.js';
import { avatarGlow } from './avatar.js';
import { backgroundShift } from './background.js';

export function frameStateFor(animations: AnimationType[], progress: number): FrameState {
  return {
    textAlpha: animations.includes('text') ? textAlpha(progress) : 1,
    avatarGlow: animations.includes('avatar') ? avatarGlow(progress) : 1,
    backgroundShift: animations.includes('background') ? backgroundShift(progress) : 0,
  };
}
