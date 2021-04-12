import HomeIcon from '@material-ui/icons/HomeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';


export type SubMenu = {
  label: string,
  path: string,
  user?: boolean,
  client?: boolean,
}

export type Menu = {
  label: string,
  path: string,  
  user?: boolean,
  client?: boolean,
  icon: any,
  items: SubMenu[]
}

const sidebarItems : Menu[] = [
  {
    label: 'Início',
    path: '/app/home',
    user: true,
    client: true,
    icon: HomeIcon,
    items: null,
  },
  {
    label: 'Cadastro',
    path: '/app/cadastro',
    user: true,
    client: true,
    icon: CategoryIcon,
    items: [
      {
        label: 'Clientes',
        path: 'clientes',
        user: true
      },
      {
        label: 'Instrumentos',
        path: 'instrumentos',
        user: true,
        client: true,
      },
      {
        label: 'Usuários',
        path: 'usuarios',
        user: true,
      }
    ],
  },
];

export default sidebarItems;
