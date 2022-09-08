import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Button } from '@paljs/ui/Button';
import { SelectOptionType } from '@src/types';
import { useRouter } from 'next/router';
import UserDetail from '@src/components/organism/users/userDetail/UserDetail';
import UserFarmland from '@src/components/organism/users/userDetail/UserFarmland';
import Breadcrumb from '@src/components/atom/Breadcrumb';
import { GET_FARMLAND } from '@src/pages/api/query/farmland';
import { GET_USER, UPDATE_USER } from '@src/pages/api/query/user';
import styled from 'styled-components';
import client from '@src/pages/apolloClient';
import { useMutation, useQuery } from '@apollo/react-hooks';

export const SelectOptionGenderType: SelectOptionType[] = [
  { value: 'man', label: '남성' },
  { value: 'woman', label: '여성' },
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userSeq } = context.params;

  const { data } = await client.query({
    query: GET_FARMLAND,
    variables: {
      userSeq: Number(userSeq),
    },
  });

  return {
    props: {
      farmLands: data.farmLand,
      userSeq: userSeq,
    },
  };
};
const User = (props: { farmLands; userSeq }) => {
  const PAGETITLE = '회원정보';
  const router = useRouter();
  const asPath = router.asPath;
  const asPathSplit = asPath.split('/');

  // 수정과 목록 화면 전환용
  const [isReadOnly, setIsReadOnly] = useState(true);

  // 버튼 클릭시, 유저 삭제할지
  const onClickRemoveUser = () => {
    const confirmResult = confirm('회원을 정말 탈퇴하시겠습니까?');
    if (confirmResult) {
      try {
        updateUser({
          variables: {
            userSeq: Number(props.userSeq),
            user: {
              status_withdrawal: 'Y',
            },
          },
        });

        alert('탈퇴되었습니다');
        asPathSplit.pop();
        router.push(asPathSplit.join('/'));
      } catch (error) {
        alert(`문제가 발생했습니다. ${error}`);
      }
    } else {
      //취소
      return false;
    }
  };

  // 버튼 클릭시, 패스워드 초기화
  const onClickResetPassword = () => {
    const confirmResult = confirm('비밀번호를 초기화 하시겠습니까?');
    if (confirmResult) {
      //확인
      console.log('성공');
    } else {
      //취소
      return false;
    }
  };

  const { data } = useQuery(GET_USER, {
    variables: {
      userSeq: Number(props.userSeq),
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_USER,
        variables: {
          userSeq: Number(props.userSeq),
        },
      },
    ],
  });

  return (
    <>
      <Breadcrumb title={PAGETITLE} />
      <Button
        style={{ marginLeft: 32, marginTop: 16 }}
        className="primary"
        onClick={() => router.push(`${asPath}/reservation`)}
      >
        방문예약
      </Button>

      {data && (
        <UserDetail
          isPaid={props.farmLands?.some((payment) => {
            return payment.status_payment === 'O';
          })}
          userDetailData={data}
          updateUser={updateUser}
          isReadOnly={isReadOnly}
          setIsReadOnly={setIsReadOnly}
          userSeq={props.userSeq}
        />
      )}
      {isReadOnly && props.farmLands && (
        <>
          <UserFarmland farmlandData={props.farmLands} userSeq={props.userSeq} />{' '}
          <ButtonWrapper>
            <Button onClick={onClickResetPassword} status="Warning" style={{ marginRight: '1rem' }}>
              비밀번호 초기화
            </Button>
            <Button className="danger" onClick={onClickRemoveUser} status="Danger">
              회원탈퇴
            </Button>
          </ButtonWrapper>
        </>
      )}
    </>
  );
};

export default User;

const ButtonWrapper = styled.div`
  text-align: right;
  margin-right: 16px;
`;

User.auth = process.env.NEXT_PUBLIC_IS_AUTH;
