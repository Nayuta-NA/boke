{
  path: '/wall',
  name: 'wall',
  component: Wall,
  meta: { transition: 'slide', standalone: true } // 添加standalone属性以标识为独立页面
},
{
  path: '/home',
  name: 'home',
  component: Home,
  meta: { transition: 'fade' }
},
{
  path: '/about',
  name: 'about',
  component: About,
  meta: { transition: 'slide' }
}
