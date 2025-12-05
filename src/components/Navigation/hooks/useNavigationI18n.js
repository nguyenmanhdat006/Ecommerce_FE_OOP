import { useTranslation } from 'react-i18next';

// Hook để lấy navigation links với i18n
export const useNavigationLinks = () => {
  const { t } = useTranslation();
  
  return [
    { text: t('navigation.shop'), href: "/", key: "shop" },
    { text: t('navigation.men'), href: "/men", key: "men" },
    { text: t('navigation.women'), href: "/women", key: "women" },
    { text: t('navigation.kids'), href: "/kids", key: "kids" },
  ];
};

// Hook để lấy actions với i18n
export const useNavigationActions = () => {
  const { t } = useTranslation();
  
  return [
    { text: t('navigation.login'), href: "/v2/login", isButton: false, key: "login" },
    { text: t('navigation.signUp'), href: "/v2/register", isButton: true, key: "signUp" },
  ];
};

