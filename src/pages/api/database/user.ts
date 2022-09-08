import { connection } from './index';


// mysql connection

export const getSelectUsers = connection(async (conn: any) => {
  let [result] = await conn.query(
    `SELECT * from (select seq, sum(val) AS s from ( select seq, FROM table wc ) AS t1 group By seq) AS t2 RIGHT JOIN user ON t2.seq = user.seq`,
  );

  let gender = ['여성', '남성'];
  return result.map((e: any) => {
    return {
      ...e,
      user_phone: e.user_phone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3'),
      user_gender: gender[Math.floor(Math.random() * 2)],
      user_age: Math.floor(20 + Math.random() * 80),
    };
  });
});

// export const getSelectUser = connection(async (conn: any, seq: number) => {
//   let [result] = await conn.query(`SELECT * FROM user WHERE seq = ${seq}`);
//   result[0].user_phone = result[0].phone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
//   return result[0];
// });

export const setUpdateUser = connection(async (conn: any, seq: number, user: updateUserProps) => {
  // user.date = moment(now()).format('YYYY-MM-DD HH:mm:ss');

  let [result] = await conn.query(`UPDATE user SET ? WHERE seq=${seq}`, user);
  return result;
});
