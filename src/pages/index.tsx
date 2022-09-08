import React from 'react';

const Home = () => {
  typeof window !== 'undefined' && localStorage.removeItem('title');

  return <p>ADMIN HOME</p>;
};

export default Home;

Home.auth = process.env.NEXT_PUBLIC_IS_AUTH;
