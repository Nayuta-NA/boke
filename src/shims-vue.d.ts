declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.jsx' {
  import { ComponentType } from 'react'
  const component: ComponentType<any>
  export default component
}

declare module '@/components/ui/background-beams-with-collision' {
  import { ComponentType } from 'react'
  const component: ComponentType<{ 
    className?: string
    children?: React.ReactNode 
  }>
  export default component
}
