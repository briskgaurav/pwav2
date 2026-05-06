type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning';

export function haptic(type: HapticType = 'light') {
  console.warn('haptic triggered:', type);
  
  if (typeof window === 'undefined') return;

  // Android / Web vibration support
  if ('vibrate' in navigator) {
    const patterns: Record<HapticType, number | number[]> = {
      light: 30,
      medium: 40,
      heavy: 80,
      success: [20, 30, 20],
      warning: [60, 40, 60],
    };

    navigator.vibrate(patterns[type]);
  }
}
