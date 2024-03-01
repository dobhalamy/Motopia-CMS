// Icons
import BuildIcon from '@material-ui/icons/Build';
import CarIcon from '@material-ui/icons/DirectionsCar';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import HomeIcon from '@material-ui/icons/Home';
import HeroImagesIcon from '@material-ui/icons/AspectRatio';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import BodyTypeIcon from '@material-ui/icons/ListAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import DehazeIcon from '@material-ui/icons/Dehaze';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CropRotateSharpIcon from '@material-ui/icons/CropRotateSharp';
import BookIcon from '@material-ui/icons/Book';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

// Components
import Admins from 'views/Admins/Admins.js';
import HomePageBanners from 'views/HomePage/HomePage';
import Carousel from 'views/Carousel';
import BodyTypeCards from 'views/BodyTypeCards/BodyTypeCards';
import PriceList from 'views/PriceList';
import Category from 'views/Category/Category';
import MenuItems from 'views/MenuItems/MenuItems';
import ReferralProgram from 'views/ReferalProgram';
import WarrantyImage from 'views/WarrantyImage/WarrantyImage';
import RDSCompanies from 'views/RDSCompanies';

import WebRotate360 from 'views/WebRotate360';

const dashboardRoutes = [
  {
    name: 'Static Public',
    icon: DehazeIcon,
    children: [
      {
        path: '/ride-share-cities',
        name: 'Ride Share Cities',
        icon: BodyTypeIcon,
        layout: '/admin',
      },
      {
        path: '/rideshare-home',
        name: 'Ride Share Home',
        icon: LocalTaxiIcon,
        layout: '/admin',
      },
      {
        path: '/hero-images',
        name: 'Home page gallery',
        icon: HeroImagesIcon,
        layout: '/admin',
      },
      {
        path: '/finance-info-pins',
        name: 'Finance Info Pins',
        icon: NotListedLocationIcon,
        layout: '/admin',
      },
      {
        path: '/trade-in',
        name: 'Trade In',
        icon: TrendingUpIcon,
        layout: '/admin',
      },
      {
        path: '/blog',
        name: 'Blog',
        icon: BookIcon,
        layout: '/admin',
      },
    ],
  },
  {
    name: 'Dynamic Public',
    icon: DehazeIcon,
    children: [
      {
        path: '/cars-list',
        name: 'Cars list',
        icon: CarIcon,
        layout: '/admin',
      },
    ],
  },
  {
    path: '/webrotate360',
    name: 'Webrotate 360',
    icon: CropRotateSharpIcon,
    component: WebRotate360,
    layout: '/admin',
  },
  {
    path: '/home-page',
    name: 'Home Page Promo',
    icon: HomeIcon,
    component: HomePageBanners,
    layout: '/admin',
  },
  {
    path: '/carousel',
    name: 'Carousel',
    icon: BodyTypeIcon,
    component: Carousel,
    layout: '/admin',
  },
  {
    path: '/ride-share-companies',
    name: 'Ride Share Companies',
    icon: EmojiTransportationIcon,
    component: RDSCompanies,
    layout: '/admin',
  },
  {
    path: '/type-setup',
    name: 'Body Type Settings',
    icon: SettingsIcon,
    component: BodyTypeCards,
    layout: '/admin',
  },
  {
    path: '/warranty',
    name: 'Warranty Settings',
    icon: SettingsIcon,
    component: WarrantyImage,
    layout: '/admin',
  },
  {
    path: '/price-list',
    name: 'Price List & Settings',
    icon: MoneyIcon,
    component: PriceList,
    layout: '/admin',
  },
  {
    path: '/categories',
    name: 'Categories',
    icon: AllInclusiveIcon,
    component: Category,
    layout: '/admin',
  },
  {
    path: '/menu-items',
    name: 'Menu Items',
    icon: DehazeIcon,
    component: MenuItems,
    layout: '/admin',
  },
  {
    path: '/promotion',
    name: 'Referal Program',
    icon: SupervisorAccountIcon,
    component: ReferralProgram,
    layout: '/admin',
  },
  {
    path: '/admins',
    name: 'Admins',
    icon: BuildIcon,
    component: Admins,
    layout: '/admin',
  },
];

export default dashboardRoutes;
