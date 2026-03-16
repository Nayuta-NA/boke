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
      primary: '#40e0d0',
      secondary: '#ff9a8b',
    }
  }
})