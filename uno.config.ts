import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  presets: [
    presetUno(),
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
  },
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      'primary-hover': 'var(--primary-color-hover)',
      secondary: '#ff9a8b',
    }
  }
})