import React, { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { MainTitle } from '@src/styles/common';
// import client from '@src/pages/apolloClient';
import { Select } from '@paljs/ui';
import useDidMountEffect from '@src/hooks/useDidMountEffect';

// import { GET_USERS } from '../api/query/user';
import { SelectOptionType } from '@src/types';

import Search from '@src/components/molecule/Search';
import Board from '@src/components/molecule/Board';
import Breadcrumb from '@src/components/atom/Breadcrumb';

export const selectOptionSearch: SelectOptionType[] = [
  { value: 0, label: '이름' },
  { value: 1, label: '전화번호' },
  { value: 2, label: '주소' },
];

export const selectOptionGender: SelectOptionType[] = [
  { value: 'man', label: '남성' },
  { value: 'woman', label: '여성' },
];

export const selectOptionAge: SelectOptionType[] = Array.from(Array(10), (_, i) => {
  return {
    value: `${i + 1}`,
    label: `${(i + 1) * 10}대`,
  };
});

type TUserProps = {
  idx: number;
  id: string;
  phone: string;
  name: string;
  addr: string;
  gender: string;
  birth: string;
};

export const getServerSideProps: GetServerSideProps = async () => {
  // const { data } = await client.query({
  //   query: GET_USERS,
  // });

  const data = { users: [{}] };
  data.users = [
    {
      idx: 1,
      id: 'test',
      phone: '01000000000',
      name: 'test',
      addr: 'test',
      gender: '여',
      birth: '20220901',
    },
  ];

  const users = data.users.map((e: any) => {
    return {
      ...e,
      phone: e.phone ? e.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3') : '',
    };
  });

  return {
    props: {
      users: users,
    },
  };
};

type PageQuery = {
  curPage?: number;
  schType?: number;
  schKeyword?: string;
};

const Users = (props: { users: TUserProps[] }) => {
  const userTableHeader = {
    idx: '글번호',
    id: '아이디',
    phone: '전화번호',
    name: '이름',
    gender: '성별',
    birth: '생일',
  };

  const PAGETITLE = '회원';
  const router = useRouter();

  const [usersData, setUserData] = useState<object[]>(props.users);
  // 검색어 값 (query 'keyword')
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // 검색어 셀렉트 (query 'type')
  const [searchType, setSearchType] = useState<string>('0');

  // 선택된 필터 (나이, 성별, 유료 여부)
  const [usersFilteredGender, setUsersFilteredGender] = useState([]);
  const [usersFilteredAge, setUsersFilteredAge] = useState([]);
  const [usersFiltered, setUsersFiltered] = useState<object[]>([]);

  const { curPage, schType, schKeyword } = router.query as PageQuery;

  // query 'keyword', 'type'가 있을 시, 타는 함수
  // 뒤로가기 or url 새로고침
  const initFilteredSearchUsers = () => {
    if (schKeyword) {
      setSearchKeyword(schKeyword);
      setUserData(onFilterdSearchUsers(undefined, schKeyword, true));
    }
  };

  useEffect(() => {
    router.isReady && schKeyword && initFilteredSearchUsers();
  }, []);

  useDidMountEffect(() => {
    // 필터값 usersFiltered 에 보존
    setUsersFiltered(onFilteredUsers());
    // 필터 결과 userData에 표출
    setUserData(onFilteredUsers());
  }, [usersFilteredAge, usersFilteredGender]);

  const onClickSearch = () => {
    // 검색 후 키워드가 있을 때,
    if (searchKeyword) {
      setUserData(onFilterdSearchUsers());
    } else {
      router.replace('/users');

      if (usersFilteredAge.length || usersFilteredGender.length) {
        setUserData(onFilteredUsers());
      } else {
        setUserData(props.users);
      }
    }
  };

  // 엔터하면 검색
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      onClickSearch();
    }
  };

  const onFilterdSearchUsers = (schType?: number, schKeyword?: string, state?: boolean): object[] => {
    let users: object[] = [];

    let type: number;
    let keyword: string = '';

    if (!state) {
      // 필터가 이미 존재할 경우
      if (usersFilteredAge.length || usersFilteredGender.length) {
        // 할당되어 있던 필터객체들을 users에 재할당
        users = usersFiltered;
        type = Number(searchType);
        keyword = searchKeyword;
      } else {
        // 필터가 없을 경우, init 데이터를 users에 재할당
        users = props.users;
        type = Number(searchType);
        keyword = searchKeyword;
      }
    } else {
      users = props.users;
      type = Number(schType);
      keyword = schKeyword!;
    }

    router.replace(`users?curPage=1&schType=${type}&schKeyword=${keyword}`);

    const filteredData = users
      ? users.filter((e: any) => {
          if (
            (type === 0 && e.name.includes(keyword)) ||
            (type === 1 && e.phone.includes(keyword)) ||
            (type === 2 && e.addr.includes(keyword))
          ) {
            return e;
          } else {
            return false;
          }
        })
      : [];

    if (!filteredData.length) {
      // 결괏값이 없을 시 빈 배열
      return [];
    } else {
      return filteredData;
    }
  };

  const onFilteredUsers = () => {
    let filteredData: object[] = [];

    if (searchKeyword && schType) {
      // 서치 키워드가 있으면, 서치 이후 결과값을 필터
      filteredData = onFilterdSearchUsers(schType, searchKeyword, true);
    } else {
      // 없으면, init 데이터를 필터한다.
      filteredData = props.users;
    }

    if (usersFilteredGender.length) {
      filteredData = filteredData.filter((user: any) => {
        const filteredGender = usersFilteredGender.some((e: any) => {
          return user.gender === e.label;
        });

        return filteredGender;
      });
    }

    if (usersFilteredAge.length) {
      filteredData = filteredData.filter((user: any) => {
        const filteredAge = usersFilteredAge.some((e: any) => {
          return String(user.age).startsWith(e.value);
        });

        return filteredAge;
      });
    }
    return filteredData;
  };

  return (
    <>
      <Breadcrumb title={PAGETITLE} />
      <>
        <MainTitle>{PAGETITLE}</MainTitle>
        <SearchWrapper>
          <FilterWrapper>
            <SelectStyled
              options={selectOptionGender}
              isMulti
              multiple
              placeholder="성별 필터"
              onChange={(e: React.SetStateAction<never[]>) => {
                setUsersFilteredGender(e);
              }}
            />
            <SelectStyled
              options={selectOptionAge}
              isMulti
              multiple
              placeholder="나이 필터"
              onChange={(e: React.SetStateAction<never[]>) => {
                setUsersFilteredAge(e);
              }}
            />
          </FilterWrapper>
          <Search
            selectOptionSearch={selectOptionSearch}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            searchType={searchType}
            setSearchType={setSearchType}
            onKeyPress={onKeyPress}
            onClick={onClickSearch}
          />
        </SearchWrapper>
        <Board tableHeader={userTableHeader} data={usersData} curPage={curPage} />
      </>
    </>
  );
};
export default Users;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 16px;
`;

const FilterWrapper = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
`;

export const SelectStyled = styled(Select)`
  width: 60%;
  margin-right: 10px;
  & > div {
    background: #ffffff;
  }
`;

Users.auth = process.env.NEXT_PUBLIC_IS_AUTH;
