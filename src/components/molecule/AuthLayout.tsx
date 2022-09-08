import { useState, useRef, ReactNode } from 'react';
import Link from 'next/link';
import { Menu, MenuRefObject } from '@paljs/ui/Menu';
import { Layout, LayoutContent, LayoutContainer, LayoutColumns, LayoutColumn } from '@paljs/ui/Layout';
import { SidebarBody, Sidebar, SidebarRefObject } from '@paljs/ui/Sidebar';
import Header from '@src/components/organism/Header';
import icons from '@paljs/icons';
import { useRouter } from 'next/router';
import { DefaultTheme } from 'styled-components';
import menuItems from '@src/components/Layouts/menuItem';

interface IProps {
  children: ReactNode;
  role: boolean;
}

const AuthLayout = ({ children }: IProps) => {
  const router = useRouter();
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');

  const sidebarRef = useRef<SidebarRefObject>(null);
  const menuRef = useRef<MenuRefObject>(null);

  const authLayout = router.pathname.startsWith('/auth');

  const getState = () => {
    return 'visible';
  };

  const changeTheme = (newTheme: DefaultTheme['name']) => {
    setTheme(newTheme);
    typeof localStorage !== 'undefined' && localStorage.setItem('theme', newTheme);
  };

  return (
    <Layout evaIcons={icons} dir={'ltr'} className={!authLayout ? 'auth-layout' : ''}>
      {!authLayout && (
        <Header
          dir={'ltr'}
          theme={{ set: changeTheme, value: theme }}
          toggleSidebar={() => sidebarRef.current?.toggle()}
        />
      )}
      <LayoutContainer>
        {!authLayout && (
          <Sidebar
            getState={getState}
            ref={sidebarRef}
            property="start"
            containerFixed
            responsive
            className="menu-sidebar"
          >
            <SidebarBody>
              <Menu
                nextJs
                className="sidebar-menu"
                Link={Link}
                ref={menuRef}
                items={menuItems}
                currentPath={router.pathname}
                toggleSidebar={() => sidebarRef.current?.hide()}
              />
            </SidebarBody>
          </Sidebar>
        )}
        <LayoutContent>
          <LayoutColumns>
            <LayoutColumn className="main-content">{children}</LayoutColumn>
          </LayoutColumns>
        </LayoutContent>
      </LayoutContainer>
    </Layout>
  );
};

export default AuthLayout;
