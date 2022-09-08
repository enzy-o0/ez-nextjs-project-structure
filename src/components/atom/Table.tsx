import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import palette from '@src/styles/palette';

interface TableProp {
  data: object[];
  header: {};
  currentPage?: number;
}

const Table = ({ data, header, currentPage }: TableProp) => {
  const router = useRouter();
  const asPath = router.asPath.split('?');
  const headerLength = Object.keys(header).length;
  return (
    <>
      <TableWrapper>
        <thead className="table-header">
          <TableHead head={Object.values(header)} />
        </thead>
        <tbody>
          {data.length != 0 ? (
            <>
              {data.map((obj: {}, idx: number) => {
                return (
                  <tr
                    className="table-border"
                    key={`tr${idx}`}
                    onClick={() => {
                      router.push(`${asPath[0]}/${obj.seq}`);
                    }}
                  >
                    <TableTd data={obj} head={Object.keys(header)} index={idx} currentPage={currentPage} />
                  </tr>
                );
              })}
            </>
          ) : (
            <NoDataMessage colSpan={headerLength}>데이터가 없습니다.</NoDataMessage>
          )}
        </tbody>
      </TableWrapper>
    </>
  );
};

const TableHead = ({ head }: any) => {
  return (
    <tr style={{ backgroundColor: '#a0d099' }} className="table-header-border">
      {head &&
        head.map((item: any, idx: number) => (
          <td key={idx} className="table-header">
            {item}
          </td>
        ))}
    </tr>
  );
};

const TableTd = ({ data, head, index, currentPage }: any) => {
  return (
    <>
      {head &&
        head.map((item: any, idx: number) => {
          if (idx === 0) {
            return (
              <td key={idx} className="table-style">
                {currentPage ? (currentPage - 1) * 10 + index + 1 : index + 1}
              </td>
            );
          }
          return (
            <td key={idx} className="table-style">
              {data[item]}
            </td>
          );
        })}
    </>
  );
};

export default React.memo(Table);

const TableWrapper = styled.table`
  border-collapse: collapse;
  border: none;
  width: 100%;
  table-layout: fixed;

  .table-header-border {
    border-bottom: 2px solid ${palette.primary900};
  }

  .table-border {
    border-bottom: 1px solid ${palette.primary100};
    cursor: pointer;

    :hover {
      background-color: ${palette.primary50};
    }
  }

  .table-header {
    text-align: center;
    padding: 10px;
  }

  .table-style {
    text-align: center;
    padding: 10px;
  }
`;

const NoDataMessage = styled.td`
  width: 100%;
  text-align: center;
  padding: 10px;
`;
