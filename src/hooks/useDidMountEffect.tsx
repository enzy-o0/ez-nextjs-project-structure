import { useEffect, useRef } from 'react';

// 첫 렌더링때도 state가 설정되어, useEffect 실행되는 것을 방지
const useDidMountEffect = (func: any, deps: any) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;
