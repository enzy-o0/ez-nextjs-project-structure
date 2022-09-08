import { useState, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { MainTitle } from '@src/styles/common';
import Breadcrumb from '@src/components/atom/Breadcrumb';
import Data from '@public/data/test.json';
import palette from '@src/styles/palette';
import { Button } from '@paljs/ui';
import { FlexSpaceBetween } from '@src/styles/common';

// axios
//   .get('/data/test.json')
//   .then((result) => {
//     console.log(result.data);
//   })
//   .catch(() => {
//     console.log('실패했습니다');
//   });

const DynamicTable = () => {
  const PAGETITLE = 'DynamicTable';
  const modified = Object.entries(Data);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const onDoubleClickData = (e) => {
    if (!isReadOnly) {
      e.target.contentEditable = true;
    } else {
      console.log('읽기전용');
    }
  };

  const onBlurData = (e) => {
    if (!isReadOnly) {
      if (e.target.innerText === '') {
        e.target.innerText = e.target.dataset.default;
      }
    } else {
      console.log('읽기전용');
    }
  };

  return (
    <>
      <Breadcrumb title={PAGETITLE} />
      <FlexSpaceBetween>
        <MainTitle>{PAGETITLE}</MainTitle>
        <div>
          {isReadOnly && (
            <Button
              className="primary"
              style={{ marginRight: 16 }}
              onClick={() => {
                setIsReadOnly(false);
              }}
            >
              수정
            </Button>
          )}
          {!isReadOnly && (
            <>
              <Button className="primary" style={{ marginRight: 16 }}>
                완료
              </Button>
              <Button
                className="danger"
                status="Danger"
                onClick={() => {
                  setIsReadOnly(true);
                }}
              >
                취소
              </Button>
            </>
          )}
        </div>
      </FlexSpaceBetween>
      <div style={{ padding: 16 }}>
        <Tables
          isReadOnly={isReadOnly}
          modified={modified}
          onDoubleClickData={onDoubleClickData}
          onBlurData={onBlurData}
        />
      </div>
    </>
  );
};

const Tables = ({ modified, isReadOnly, onDoubleClickData, onBlurData }) => {
  return modified.slice(1).map((title, idx) => {
    return (
      <>
        <MainTitle style={{ marginLeft: 0 }}>
          {title[1].info}({title[0]})
        </MainTitle>
        {title[0] === '3' ? (
          <>
            <Table
              value={title[1].data}
              isReadOnly={isReadOnly}
              onDoubleClickData={onDoubleClickData}
              onBlurData={onBlurData}
            />
            <ObjectTable
              value={title[1].data.arrays}
              isReadOnly={isReadOnly}
              onDoubleClickData={onDoubleClickData}
              onBlurData={onBlurData}
            />
          </>
        ) : title[0] === '2' ? (
          <ObjectTable
            value={title[1].data}
            isReadOnly={isReadOnly}
            onDoubleClickData={onDoubleClickData}
            onBlurData={onBlurData}
          />
        ) : (
          <Table
            value={title[1].data}
            isReadOnly={isReadOnly}
            onDoubleClickData={onDoubleClickData}
            onBlurData={onBlurData}
          />
        )}
      </>
    );
  });
};

const Table = ({ value, isReadOnly, onDoubleClickData, onBlurData }) => {
  return (
    <>
      <TableWrapper>
        <thead>
          <tr>
            <th className="table-th-style" scope="row">
              속성
            </th>
            <th className="table-th-style" scope="row">
              데이터
            </th>
          </tr>
        </thead>
        <tbody>
          {value &&
            Object.entries(value).map((data, idx) => {
              return (
                <>
                  {typeof data[1] === 'string' && (
                    <>
                      <tr>
                        <td className="table-style table-proper-style" key={data[0]} data-key={data[0]} data-idx={idx}>
                          {data[0].replace(/\./g, '')}
                        </td>
                        <EditableCell value={data[1]} onBlurData={onBlurData} onDoubleClickData={onDoubleClickData} />
                      </tr>
                    </>
                  )}
                </>
              );
            })}
        </tbody>
      </TableWrapper>
    </>
  );
};

const ObjectTable = ({ value, isReadOnly, onDoubleClickData, onBlurData }) => {
  const [objectValue, setObjectValue] = useState(null);
  let arr = {};

  useEffect(() => {
    setObjectValue([...value]);
  }, []);

  const onClickRemoveTr = (idx) => {
    alert(`${idx + 1}번째 줄을 삭제하시곘습니까?`);
    let newArray = objectValue;
    newArray.splice(idx, 1);
    setObjectValue([...newArray]);
  };

  const onClickAddTr = () => {
    let addValue = {};
    Object.keys(objectValue[0]).map((e, idx) => {
      addValue[e] = '';
    });

    setObjectValue([...objectValue, addValue]);
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <TableWrapper>
          <thead>
            <tr>
              <th className="table-th-style" scope="row">
                항목
              </th>
              <th className="table-th-style" scope="row">
                데이터
              </th>
            </tr>
          </thead>
          <tbody>
            {objectValue &&
              Object.entries(objectValue).map((data, idx1) => {
                return (
                  <>
                    {Object.entries(data[1]).map((e, idx) => {
                      if (arr[e[0]]) {
                        arr[e[0]].push(e[1]);
                        idx === Object.entries(data[1]).length - 1 && arr[' '].push('-');
                      } else {
                        arr[e[0]] = new Array();
                        arr[e[0]].push(e[1]);
                        if (idx === Object.entries(data[1]).length - 1) {
                          arr[' '] = new Array();
                          arr[' '].push('-');
                        }
                      }
                    })}

                    <>
                      {idx1 === Object.entries(objectValue).length - 1 &&
                        Object.entries(arr).map((e, idxArr) => {
                          return (
                            <tr key={e[0]} className="array-tr-parent">
                              <td className="table-style table-proper-style">{e[0].replace(/\./g, '')}</td>
                              {e[1].map((e1, idx) => {
                                return (
                                  <tr
                                    className="array-tr"
                                    key={idx}
                                    onClick={() => Object.entries(arr).length - 1 === idxArr && onClickRemoveTr(idx)}
                                    // onDoubleClick={() => alert('double click')}
                                  >
                                    {Object.entries(arr).length - 1 === idxArr ? (
                                      <td className="table-btn">
                                        {!isReadOnly && (
                                          <Image
                                            src="/asset/images/img_minus_btn.svg"
                                            alt="minusbtn"
                                            width="30"
                                            height="30"
                                          />
                                        )}
                                      </td>
                                    ) : (
                                      <EditableCell
                                        value={e1}
                                        onBlurData={onBlurData}
                                        onDoubleClickData={onDoubleClickData}
                                      />
                                    )}
                                  </tr>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </>
                  </>
                );
              })}
          </tbody>
        </TableWrapper>
        {!isReadOnly && (
          <div
            style={{ width: '100%', textAlign: 'center', marginTop: 10 }}
            className="array-tr table-btn"
            onClick={() => onClickAddTr()}
          >
            <Image src="/asset/images/img_plus_btn.svg" alt="plusbtn" width="30" height="30" />
          </div>
        )}
      </div>
    </>
  );
};

const EditableCell = ({ value: initialValue, onDoubleClickData, onBlurData }) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <td
      className="table-style"
      data-default={value}
      contentEditable={false}
      suppressContentEditableWarning={true}
      onChange={onChange}
      onBlur={onBlurData}
      onDoubleClick={onDoubleClickData}
    >
      {value}
    </td>
  );
};

export default DynamicTable;

const TableWrapper = styled.table`
  display: flex;
  display: -webkit-box;
  display: -ms-flexbox;
  overflow-x: auto;
  overflow-y: hidden;
  table-layout: fixed;
  border-collapse: collapse;

  tr {
  }

  tbody {
    display: flex;
  }

  th,
  td {
    display: block;
    padding: 10px;
    height: 42px;
  }

  .array-tr {
    display: block;
  }

  .table-th-style {
    border: 1px solid ${palette.primary100};
    background-color: #a0d099;
    border-right: 2px solid ${palette.primary100};
    text-align: center;
  }

  .table-style {
    text-align: center;
    border: 1px solid ${palette.primary100};
  }

  .table-btn {
    text-align: center;
    cursor: pointer;
  }

  .table-proper-style {
    background-color: #a0d099;
    font-weight: bold;
  }

  .array-tr-parent:last-child {
    & > :first-child {
      visibility: hidden;
    }
  }
`;

DynamicTable.auth = process.env.NEXT_PUBLIC_IS_AUTH;
