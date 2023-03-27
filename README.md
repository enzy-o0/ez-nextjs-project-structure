# next.js boilerplate

현업에서 Next.js 를 사용한 경험을 담은 boilerplate로,
프로젝트 구조, 사용한 프레임워크 및 라이브러리 사용 이유, 장단점을 다룬 repository입니다

---

#### Next.js를 선택한 이유

db에서 데이터를 가져와 api의 형태와 같이 구현해야 했기 때문에 API Routes가 제공되는 Next.js에 관심이 갔고,
SSR과 CSR의 장점을 혼합하여 사용할 수 있고, 간편한 라우팅 등 강력한 기능이 제공되기에 사용해보고 싶어 선택했습니다.

#### 프로젝트 실행

dev:
yarn dev

prod:
yarn build
yarn start

---

#### 프로젝트 생성

디자이너의 부재로, [Pal.js](https://paljs.com/ui/guides/start-from-nextjs-template/) 템플릿을 사용하였습니다.

템플릿 위로, typescript와 Apollo(graphql) + typeorm을 사용하여 api를 구현하였습니다.

---

#### 프로젝트 구조

```bash
💼src
├── 📂hooks  // 공통 hook
│   ├── ...
├── 📂styles  // 공통 style
│   ├── ...
├── 📂types // 공통 type
│   ├── ...
├── 📂utils // 공통 utils
│   ├── 📃common.ts
├── 📂components
│   ├── 📂atoms // 원자 단위의 컴포넌트
│   │   ├── ...
│   ├── 📂molecule // atoms 혼합 컴포넌트
│   │   ├── ...
│   ├── 📂orgainsms // molecule 혼합 컴포넌트
│   │   ├── ...
├── 📂 pages
│   ├── 📂api // API Routes
│   │   ├── 📂auth // Next Auth 라이브러리 설정
│   │   ├── 📂database // mysql connection 설정
│   │   ├── 📂models // TypeORM으로 생성된 모델
│   │   ├── 📂query // client에서 사용하는 gql
│   │   ├── 📂resolver // graphql resolver
│   │   ├── 📂schemas // graphql schemas
│   ├── 📃index.tsx
│   ├── 📃_app.tsx // auth에 따른 tab stack 구분
│   ├── 📃_doucment.tsx // bottom tab menu 모음
│   ├── 📃apolloCient.tsx // apolloClient 설정
├──...
```
