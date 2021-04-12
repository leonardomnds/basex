import HomeIcon from '@material-ui/icons/HomeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
import DescriptionIcon from '@material-ui/icons/DescriptionRounded';


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
  {
    label: 'Calibrações',
    path: '/app/calibracoes',
    user: true,
    client: true,
    icon: DescriptionIcon,
    items: [
      {
        label: 'Nova Calibração',
        path: 'novo',
        user: true,
        client: true,
      },
      {
        label: 'Histórico',
        path: 'historico',
        user: true,
        client: true,
      },
    ],
  },
];

export default sidebarItems;
