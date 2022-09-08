import React from 'react';
import { ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const ErrorStyle = styled.div`
  display: flex;
  height: 80vh;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 2rem; */
  p {
    margin-bottom: 3rem;
  }
  h1 {
    margin-bottom: 0.5rem;
  }
  a {
    font-size: 1.2rem;
    max-width: 20rem;
    background-color: #005500;
    padding: 1rem;
    background-image: none;
  }
`;
export default function Error(): JSX.Element {
  const router = useRouter();
  return (
    <ErrorStyle>
      <h1>페이지를 찾을 수 없습니다</h1>
      <ButtonLink fullWidth appearance="hero" onClick={() => router.push('/')} shape="Rectangle">
        홈으로 가기
      </ButtonLink>
    </ErrorStyle>
  );
}
