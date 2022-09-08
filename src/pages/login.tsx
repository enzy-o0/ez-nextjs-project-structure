import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState } from 'react';
import Auth from '@src/components/atom/Auth';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Login() {
  const { data: session, status } = useSession();

  const login = async (e: any) => {
    e.preventDefault();
    const id = e.target.id.value;
    const password = e.target.password.value;
    const response = await signIn('ADMIN', {
      id,
      password,
      redirect: true,
      callbackUrl: 'http://localhost:3000/',
    });

    console.log(response);
  };

  if (status === 'authenticated') {
    return (
      <>
        {session.id}님, 안녕하세요 <br />
        <Button status="Success" shape="SemiRound" fullWidth onClick={() => signOut()}>
          로그아웃
        </Button>
      </>
    );
  }

  const [loginAdmin, setLoginAdmin] = useState({
    id: 'test',
    password: 'test',
  });

  const { id, password } = loginAdmin;

  const onChange = (e) => {
    const { name, value } = e.target;

    setLoginAdmin({
      ...loginAdmin,
      [name]: value,
    });
  };

  return (
    <>
      <Auth title="로그인" subTitle="아이디와 비밀번호를 입력해주세요">
        <form onSubmit={login}>
          <InputGroup fullWidth>
            <input type="text" value={id} name="id" placeholder="영어이름, ex)genie" onChange={onChange} />
          </InputGroup>
          <InputGroup fullWidth>
            <input type="password" value={password} name="password" placeholder="비밀번호" onChange={onChange} />
          </InputGroup>
          <Button status="Success" type="submit" shape="SemiRound" fullWidth>
            로그인
          </Button>
        </form>
      </Auth>
    </>
  );
}
