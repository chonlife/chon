import { useEffect } from 'react';

interface ViewportOptions {
  userScalable?: boolean;
  maximumScale?: number;
  minimumScale?: number;
  initialScale?: number;
}

/**
 * Custom hook for managing viewport meta tag settings
 * Useful for preventing zoom on mobile devices during forms/questionnaires
 */
export const useViewportControl = (
  enabled: boolean = false,
  options: ViewportOptions = {}
) => {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) return;

    // Store original content to restore later
    const originalContent = viewportMeta.getAttribute('content') || 'width=device-width, initial-scale=1.0';

    if (enabled) {
      const {
        userScalable = false,
        maximumScale = 1.0,
        minimumScale = 1.0,
        initialScale = 1.0
      } = options;

      const newContent = [
        'width=device-width',
        `initial-scale=${initialScale}`,
        `minimum-scale=${minimumScale}`,
        `maximum-scale=${maximumScale}`,
        `user-scalable=${userScalable ? 'yes' : 'no'}`
      ].join(', ');

      viewportMeta.setAttribute('content', newContent);
    } else {
      // Restore original content when disabled
      viewportMeta.setAttribute('content', originalContent);
    }

    // Cleanup function to restore original content when component unmounts
    return () => {
      if (viewportMeta) {
        viewportMeta.setAttribute('content', originalContent);
      }
    };
  }, [enabled, options]);
};

export default useViewportControl;
