import React, { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import client from '@src/pages/apolloClient';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userSeq, detailSeq } = context.params;
  // const { data: detailData } = await client.query({
  //   query: GET__DETAIL,
  //   variables: {
  //     seq: Number(detailSeq),
  //   },
  // });

  return {
    props: {
      params: context.params,
    },
  };
};

const Info = (props) => {
  return useMemo(() => <></>, [props]);
};

export default Info;

Info.auth = process.env.NEXT_PUBLIC_IS_AUTH;
