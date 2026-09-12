import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          'environment-image'?: string;
          'exposure'?: string | number;
          scale?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'manual';
        },
        HTMLElement
      >;
    }
  }
}