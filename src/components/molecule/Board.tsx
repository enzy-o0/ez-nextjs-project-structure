import { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col } from '@paljs/ui';
import styled from 'styled-components';
import Table from '../atom/Table';
import Pagination from '../atom/Pagination';

interface IProps {
  data: object[];
  tableHeader: {};
  curPage?: number;
}

const Board = ({ tableHeader, data, curPage }: IProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cntUsersPaging = 10;

  useEffect(() => {
    curPage && setCurrentPage(Number(curPage));
  }, [curPage]);

  const pagingData = useMemo(() => {
    const idxUsersPagingLast: number = currentPage * cntUsersPaging;
    const idxUsersPagingFirst: number = idxUsersPagingLast - cntUsersPaging;

    if (data && data.length !== 0) {
      return data.slice(idxUsersPagingFirst, idxUsersPagingLast);
    } else if (data.length === 0) {
      return [];
    }
  }, [data, currentPage]);

  return (
    <>
      <BoardWrapper>
        <Row>
          <Col breakPoint={{ xs: 12, md: 12 }}>
            <p>Total: {data.length}개 </p>
            <Card>{pagingData && <Table data={pagingData} header={tableHeader} currentPage={currentPage} />}</Card>
          </Col>
        </Row>
        <Pagination
          currentPage={currentPage}
          postsPerPage={cntUsersPaging}
          totalPosts={data.length}
          paginate={setCurrentPage}
        />
      </BoardWrapper>
    </>
  );
};

export default Board;

const BoardWrapper = styled.div`
  padding: 16px;
`;
