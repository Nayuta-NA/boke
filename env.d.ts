/// <reference types="vite/client" />

declare module 'pinia-plugin-persistedstate' {
  import { PiniaPluginContext } from 'pinia'
  
  interface PersistedStateOptions {
    storage?: Storage
    paths?: string[]
    key?: string
    serializer?: {
      serialize: (value: any) => string
      deserialize: (value: string) => any
    }
  }

  export function createPersistedState(options?: PersistedStateOptions): (context: PiniaPluginContext) => void
}