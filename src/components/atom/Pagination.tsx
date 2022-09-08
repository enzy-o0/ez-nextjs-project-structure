import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import prevImage from 'public/assets/images/pager-prev-1.png';
import prevFirstImage from 'public/assets/images/pager-prev-2.png';
import nextImage from 'public/assets/images/pager-next-1.png';
import nextLastImage from 'public/assets/images/pager-next-2.png';
import palette from '@src/styles/palette';

interface PaginationProps {
  totalPosts: number;
  paginate: (x: number) => void;
  postsPerPage: number;
  currentPage: number;
}

const Pagination = ({ totalPosts, paginate, postsPerPage, currentPage }: PaginationProps) => {
  const router = useRouter();
  const asPath = router.asPath.split('?');
  const movePage = function (page: number) {
    const URLSearch = new URLSearchParams(location.search);
    URLSearch.set('curPage', String(page));
    return URLSearch.toString();
  };

  // 표출될 페이지 갯수
  const PAGESPERNUM = 5;
  // 전체 '페이지' 수
  let totalPage = Math.ceil(totalPosts / postsPerPage);
  // 전체 페이지 그룹 수
  let totalBlock = Math.ceil(totalPage / PAGESPERNUM);
  // 페이지 그룹
  let block = Math.ceil(currentPage / PAGESPERNUM);

  // 현재 글 번호
  // let curPostNum = totalPosts - postsPerPage * (currentPage - 1);

  // 화면에 보여지는 마지막 페이지 번호
  let lastPage = block * PAGESPERNUM;

  // 화면에 보여지는 첫번재 페이지 번호
  let firstPage = lastPage - PAGESPERNUM + 1;

  // 다음 페이지 그룹
  const next = lastPage + 1;
  // 이전 페이지 그룹
  const prev = firstPage - 1;

  const pageNumber: number[] = [];

  if (totalPage < 1) {
    firstPage = lastPage;
  }

  if (block >= totalBlock) {
    lastPage = totalPage;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pageNumber.push(i);
  }

  return (
    <>
      <PaginationWrapper className="pagination">
        {block > 1 ? (
          <PageNumber current={false} onClick={() => paginate(1)}>
            <Image src={prevFirstImage} />
          </PageNumber>
        ) : (
          ''
        )}
        {block > 1 ? (
          <PageNumber current={false} onClick={() => paginate(prev)}>
            <Image src={prevImage} />
          </PageNumber>
        ) : (
          ''
        )}
        {pageNumber.map((pageNum) => (
          <PageNumber
            key={pageNum}
            current={pageNum === currentPage}
            onClick={() => {
              paginate(pageNum);
              router.push(`${asPath[0]}?${movePage(pageNum)}`);
            }}
          >
            {pageNum}
          </PageNumber>
        ))}
        {block < totalBlock ? (
          <PageNumber current={false} onClick={() => paginate(next)}>
            <Image src={nextImage} />
          </PageNumber>
        ) : (
          ''
        )}
        {block < totalBlock ? (
          <PageNumber current={false} onClick={() => paginate(totalPage)}>
            <Image src={nextLastImage} />
          </PageNumber>
        ) : (
          ''
        )}
      </PaginationWrapper>
    </>
  );
};

export default React.memo(Pagination);

const PaginationWrapper = styled.ul`
  width: 100%;
  display: flex;
  justify-content: center;
  list-style: none;
`;

const PageNumber = styled.li<{ current: boolean }>`
  background: ${(props) => (props.current ? palette.primary900 : '#ffffff;')};
  color: ${(props) => (props.current ? '#ffffff;' : palette.primary900)};
  width: 30px;
  height: 30px;
  border: 1px solid #e4e9f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;
