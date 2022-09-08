import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface IProps {
  title: string;
}

const Breadcrumb: React.FC<IProps> = ({ title }) => {
  const router = useRouter();
  const currentPath = router.asPath;
  let pathname = currentPath.split('/');
  const titleLocalStorage: string | false | null = typeof window !== 'undefined' && localStorage.getItem('title');
  let titleArray: string[] = [];

  if (titleLocalStorage) {
    titleArray = JSON.parse(titleLocalStorage);
  }

  if (router.isReady && typeof window !== 'undefined') {
    titleArray = [];
    if (pathname.length === 2 && titleArray.length) {
    } else if (pathname.length === 3 && !Object.keys(router.query).length) {
      titleArray.push('');
    }

    if (pathname.length != titleArray.length && !titleArray.includes(title)) {
      titleArray.push(title);
    } else if (pathname.length - titleArray.length <= 0) {
      const diffDepth = pathname.length - titleArray.length - 1;
      titleArray = titleArray.slice(0, diffDepth);
    }

    localStorage.setItem('title', JSON.stringify(titleArray));
  }

  const onClickRouter = (idx: number) => {
    if (idx !== titleArray.length - 1) {
      let path = pathname.slice(1, idx + 2);
      let routerPath = `/${path.join('/')}`;
      router.push(routerPath);
    }
  };

  const arrayResult = titleArray.map((title, idx) => {
    return (
      <BreadcrumbItem key={title}>
        <BreadcrumbTitle
          onClick={() => {
            onClickRouter(idx);
          }}
        >
          {title}
        </BreadcrumbTitle>
        {title !== '' && titleArray.length !== idx + 1 && (
          <Image src="/asset/images/img_divider.svg" alt="이미지" width="8" height="8" />
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <BreadcrumbWrapper>
      <BreadcrumbContainer>{arrayResult}</BreadcrumbContainer>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;

const BreadcrumbWrapper = styled.nav`
  width: 100%;
  color: #303030;
  padding: 0 16px;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding-top: 8px;
  padding-bottom: 8px;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
`;

const BreadcrumbItem = styled.div`
  font-size: 12px;
  color: currentColor;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
`;

const BreadcrumbTitle = styled.span`
  font-weight: 600;
  display: inline-block;
  &:not(:last-child):hover {
    color: #598bff;
    text-decoration: underline;
    cursor: pointer;
  }
`;
