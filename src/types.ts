/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ImageAdjustments {
  x: number; // horizontal translation offset in percentage
  y: number; // vertical translation offset in percentage
  scale: number; // scale factor (e.g. 1.0)
  rotation: number; // in degrees (0, 90, 180, 270 or arbitrary)
  brightness: number; // 100 is normal
  contrast: number; // 100 is normal
  saturation: number; // 100 is normal
}

export type Orientation = 'vertical' | 'horizontal';

export interface FrameTemplate {
  id: string;
  name: string;
  orientation: Orientation;
  previewUrl: string; // Base64 or inline SVG
  isCustom: boolean; // uploaded by admin via logo double-click
}
