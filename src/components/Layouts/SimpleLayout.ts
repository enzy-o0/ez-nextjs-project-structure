import { createGlobalStyle, css } from 'styled-components';
import GlobalStyle from '@paljs/ui/GlobalStyle';
import { breakpointDown } from '@paljs/ui/breakpoints';
import palette from '@src/styles/palette';

const SimpleLayout = createGlobalStyle`
${({ theme }) => css`
  ${GlobalStyle}
  html {
    font-size: 16px;
    margin: 0 !important;
  }

  body {
    margin: 0 !important;
  }

  Header {
    background: !important;
    background-color: ${palette.primary900} !important;
  }

  .control-icon > svg {
    color: white !important;
  }

  .primary {
    background-color: ${palette.primary900} !important;
    background-image: linear-gradient(to right, #7da2a9, #7da2a9);
    border-color: ${palette.primary900} !important;
  }

  .danger {
    background-color: #b50000 !important;
    background-image: linear-gradient(to right, #b50000, #b50000);
    border-color: #b50000 !important;
  }

  .scrollable::-webkit-scrollbar-thumb {
    background: ${palette.primary900} !important;
  }

  .column.small {
    flex: 0.15 !important;
  }

  .auth-layout {
    .main-content {
      padding: 0rem;
      padding-top: 0;
      ${breakpointDown('sm')`
        padding: 0;
      `}
    }
  }

  aside.settings-sidebar {
    transition: transform 0.3s ease;
    width: 19rem;
    overflow: hidden;
    transform: translateX(${theme.dir === 'rtl' && '-'}100%);
    &.start {
      transform: translateX(${theme.dir === 'ltr' && '-'}100%);
    }

    &.expanded,
    &.expanded.start {
      transform: translateX(0);
    }

    &.compacted.start {
      display: none;
    }

    .scrollable {
      width: 19rem;
      padding: 3.4rem 0.25rem;
    }

    .main-container {
      width: 19rem;
      transition: width 0.3s ease;
      overflow: hidden;

      .scrollable {
        width: 19rem;
      }
    }
  }

  ${breakpointDown('xs')`
    .main-content {
        padding: 0.75rem !important;
      }
  `}

  .with-margin {
    margin: 0 0.75rem 2rem 0;
  }
  .inline-block {
    display: inline-block;
  }
  .popover-card {
    margin-bottom: 0;
    width: 300px;
    box-shadow: none;
  }
  .btn {
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 500;
    border: 2px solid transparent;
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
  .ck-content {
    min-height: 20rem;
  }

  .menu-sidebar.compacted {
  }

  .layout {
    background: #ffffff !important;
  }

  .menu-title {
    a:active {
      color: ${palette.primary900} !important;
    }
  }

  .menu-item {
    a :active {
      color: ${palette.primary900} !important;
    }
  }

  .menu-item a.active .menu-icon {
    color: ${palette.primary900} !important;
  }

  .menu-item a.active {
    color: ${palette.primary900} !important;
  }

  .menu-item a:hover .menu-icon {
    color: ${palette.primary900} !important;
  }

  .menu-item a:hover {
    color: ${palette.primary900} !important;
  }

  ${breakpointDown('xs')`
    .main-container {
      background-color: #ffffff;
    }

    .menu-sidebar.expanded {
      position: static;
    }

    .menu-sidebar.compacted {
      display: none;
      
      & + div {
          margin-left: 0;
        }
      }
  `}

  ${breakpointDown('sm')`
    .main-container {
      background-color: #ffffff;
    }

    .menu-sidebar.expanded {
      position: static;
    }

    .menu-sidebar.compacted {
      display: none;
      & + div {
          margin-left: 0;
        }
      }
  `}

  ${breakpointDown('md')`
    .main-container {
      background-color: #ffffff;
    }

    .menu-sidebar.expanded {
      position: static;
    }

    .menu-sidebar.compacted {
        display: none;
        
        & + div {
          margin-left: 0;
        }
      }
  `}


${breakpointDown('lg')`
    .main-container {
      background-color: #ffffff;
    }

    .menu-sidebar.expanded {
      position: static;
    }

    .menu-sidebar.compacted {
        display: none;
        
        & + div {
          margin-left: 0;
        }
      }
  `}
`}


`;
export default SimpleLayout;
