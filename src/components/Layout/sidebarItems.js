import HomeIcon from '@material-ui/icons/HomeRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
// import AttachMoneyIcon from '@material-ui/icons/AttachMoneyRounded';
// import LocalOfferIcon from '@material-ui/icons/LocalOfferRounded';

// Usuários
//import UserListPage from '../../pages/app/cadastro/usuarios';
//import NewUserPage from '../../pages/app/cadastro/usuarios/new';

// Empresa
// eslint-disable-next-line import/no-cycle
//import NewCompanyPage from '../../pages/app/cadastro/empresa';

const sidebarItems = [
  {
    label: 'Início',
    path: '/app/home',
    icon: HomeIcon,
    items: null,
  },
  {
    label: 'Cadastro',
    path: '/app/cadastro',
    icon: CategoryIcon,
    items: [
      {
        label: 'Clientes',
        path: 'pessoas',
      }
    //   {
    //     label: 'Empresa',
    //     path: '/app/empresa',
    //     page: <NewCompanyPage />,
    //   },
    //   {
    //     label: 'Usuários',
    //     path: 'usuarios',
    //     page: <UserListPage />,
    //     items: [
    //       {
    //         path: 'novo',
    //         page: <NewUserPage />,
    //       },
    //       {
    //         path: 'editar/:id',
    //         page: <NewUserPage />,
    //       },
    //     ],
    //   },
    ],
  },
];

export default sidebarItems;
