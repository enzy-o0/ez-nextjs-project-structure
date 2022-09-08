import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Select from '@paljs/ui/Select';
import { Card } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import styled from 'styled-components';
import LabelInput, { ModiInfoWrapper, RequiredStar } from '@src/components/atom/LabelInput';

import { SelectOptionType } from '@src/types';
import router from 'next/router';

interface IProps {
  isPaid: boolean;
  seq: string | string[];
  isReadOnly: boolean;
  setIsReadOnly: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: any;
  userDetailData: any;
}

export const SelectOptionGender: SelectOptionType[] = [
  { value: 'man', label: '남성' },
  { value: 'woman', label: '여성' },
];

const UserDetail: React.FC<IProps> = ({ isReadOnly, setIsReadOnly, seq, updateUser, userDetailData }) => {
  const [userDetail, setUserDetail] = useState(userDetailData.user);
  const [noColumn, setNoColumns] = useState({
    gender: '',
    age: '',
    email: '',
    etc: '',
  });

  useEffect(() => {
    if (userDetail.phone) {
      if (userDetail.phone.length === 10) {
        setUserDetail({
          ...userDetail,
          phone: userDetail.phone.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
        });
      }

      if (userDetail.phone.length === 13) {
        setUserDetail({
          ...userDetail,
          phone: userDetail.phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
        });
      }

      if (userDetail.phone.length === 12) {
        setUserDetail({
          ...userDetail,
          phone: userDetail.phone.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
        });
      }
    }
  }, [userDetail.phone]);

  // 전화번호 정규식
  const checkTel = useMemo(() => /^\d{3}-\d{3,4}-\d{4}$/.test(userDetail.phone), [userDetail.phone]);

  const onChangeUserDetail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUserDetail({ ...userDetail, [name]: value });
    },
    [userDetail],
  );

  const onChangeUserDetail2 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNoColumns({ ...noColumn, [name]: value });
    },
    [noColumn],
  );

  const validateEmailForm = () => {
    if (noColumn && noColumn.email.length === 0) {
      return true;
    } else {
      return /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(noColumn.email);
    }
  };

  const validateUserForm = () => {
    if (!userDetail.name || !userDetail.phone) {
      return false;
    }

    if (!checkTel) {
      return false;
    }

    if (!validateEmailForm()) {
      return false;
    }

    return true;
  };

  const onSubmitUserInfo = () => {
    setIsReadOnly(!isReadOnly);
    if (validateUserForm()) {
      setIsReadOnly(true);
      try {
        updateUser({
          variables: {
            seq: Number(seq),
            user: {
              name: userDetail.name,
            },
          },
        });

        alert('회원정보가 수정되었습니다.');
        router.reload(router.asPath);
      } catch (error) {
        alert(`문제가 발생했습니다. ${error}`);
      }
    } else {
      alert('필수값을 입력해주세요');
      setIsReadOnly(false);
    }
  };

  return (
    <Card style={{ padding: '16px', margin: 16 }}>
      <UserInfoWrapper>
        <div className="UserInfoWrapper" style={{ justifyContent: 'space-between' }}>
          <h3 className="main-title">회원정보</h3>
          <div>
            {isReadOnly && (
              <Button
                className="primary"
                style={{ marginRight: 32 }}
                onClick={() => {
                  setIsReadOnly(false);
                }}
              >
                수정
              </Button>
            )}
            {!isReadOnly && (
              <>
                <Button className="primary" style={{ marginRight: 16 }} onClick={onSubmitUserInfo}>
                  완료
                </Button>
                <Button
                  className="danger"
                  status="Danger"
                  onClick={() => {
                    setUserDetail(data.user);
                    setIsReadOnly(true);
                  }}
                >
                  취소
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="UserInfoWrapper">
          <LabelInput
            placeholder="이름"
            value={userDetail.name}
            label="이름"
            labelFor="name"
            onChange={onChangeUserDetail}
            name="name"
            isReadOnly={isReadOnly}
            isRequired={true}
            errorMessage="이름을 입력하세요."
            isValid={!!userDetail.name}
          />

          <ModiInfoWrapper>
            <label htmlFor="gender">
              성별 <RequiredStar>*</RequiredStar>
            </label>
            <SelectStyled
              isDisabled={isReadOnly}
              defaultValue={SelectOptionGender[1]}
              options={SelectOptionGender}
              placeholder="Select"
            />
          </ModiInfoWrapper>
        </div>
        <LabelInput
          placeholder="전화번호"
          value={userDetail.phone}
          label="전화번호"
          labelFor="phone"
          onChange={onChangeUserDetail}
          name="phone"
          isReadOnly={isReadOnly}
          isRequired={true}
          errorMessage="전화번호를 확인해주세요."
          isValid={checkTel}
        />
        <LabelInput
          style={{ width: '100%' }}
          placeholder="주소"
          value={userDetail.addr}
          // value={addressResult}
          label="주소"
          labelFor="addr"
          onChange={onChangeUserDetail}
          name="addr"
          isReadOnly={isReadOnly}
          isRequired={true}
          errorMessage="주소를 입력하세요."
          isValid={!!userDetail.addr}
          // isValid={!!addressResult}
        />
        <LabelInput
          placeholder="이메일"
          value={noColumn.email}
          label="이메일"
          labelFor="email"
          onChange={onChangeUserDetail2}
          name="email"
          isReadOnly={isReadOnly}
          isValid={validateEmailForm()}
          type="email"
          errorMessage="올바른 이메일 주소를 입력해주세요."
        />
        <Hr />
        <div>
          <Userdate>
            {userDetailData &&
              `가입날짜: ${userDetailData.user.create_date} | 수정날짜: ${
                userDetailData.user.update_date === null ? '-' : userDetailData.user.update_date
              }`}
          </Userdate>
        </div>
      </UserInfoWrapper>
    </Card>
  );
};

export default UserDetail;

const UserInfoWrapper = styled.div`
  .UserInfoWrapper {
    display: flex;
    &:first-child {
      margin-bottom: 18px;
    }
  }

  .main-title {
    font-size: 24px;
    line-height: 0;
    margin-bottom: 16px;
  }

  .content {
    display: flex;
    flex-direction: column;
    margin-right: 16px;
    margin-bottom: 30px;
  }

  label {
    font-size: 20px;
    margin-bottom: 8px;
  }

  input {
    padding: 1rem;
    font-size: 16px;
  }
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: gray;
  margin: 50px 0;
`;

const Userdate = styled.p`
  color: gray;
  font-size: 14px;
`;

const SelectStyled = styled(Select)`
  margin-bottom: 1rem;
  width: 200px;

  & > div {
    background-color: #fff;
  }
`;
