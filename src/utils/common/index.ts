import moment from 'moment';

// 날짜 포맷 함수
export const dateFormat = (setDate: Date) => {
  const date = moment(setDate).format('YYYY년 MM월 DD일 HH:mm');
  return date;
};

// 객체를 그룹으로 나누는 함수
export const groupBy = function (data: any, key: any) {
  return data?.reduce(function (carry: any, el: any) {
    var group = el[key];

    if (carry[group] === undefined) {
      carry[group] = [];
    }

    carry[group].push(el);
    return carry;
  }, {});
};
