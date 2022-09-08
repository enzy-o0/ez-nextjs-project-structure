import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutHeader } from '@paljs/ui/Layout';
import { Actions } from '@paljs/ui/Actions';
import User from '@paljs/ui/User';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { useSession, signOut } from 'next-auth/react';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  dir: 'ltr';
}

const Header: React.FC<HeaderProps> = (props) => {
  const { data: session, status } = useSession();

  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        <Actions
          size="Small"
          actions={[
            {
              icon: { name: 'menu-2-outline' },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link href="/">
                  <a className="logo" style={{ color: '#ffffff' }}>
                    ADMIN
                  </a>
                </Link>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: (
                <>
                  {status === 'authenticated' ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>
                        <User
                          image="url('/asset/images/logo_ais_logo.png')"
                          name={`${session?.user?.name}`}
                          title="master"
                          size="Medium"
                        />
                      </div>
                      <div className="logoutWrapper">
                        <Image
                          src="/asset/images/log-out-outline.svg"
                          alt="plusbtn"
                          width="30"
                          height="30"
                          onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown('sm')`
    .right{
      display: none;
    }
  `}

  .right > div {
    height: auto;
    display: flex;
    align-content: center;

    .user-name,
    .user-title {
      color: #ffffff;
    }
  }

  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }

  .left {
    display: flex;
    align-items: center;
    .github {
      font-size: 18px;
      margin-right: 5px;
    }
  }

  .logoutWrapper {
    margin-left: 16px;
    cursor: pointer;
  }
`;
