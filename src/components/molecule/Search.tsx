import React from 'react';
import Select from '@paljs/ui/Select';
import { Button } from '@paljs/ui/Button';
import styled from 'styled-components';
import { SelectOptionType } from '@src/types';

interface SearchProps {
  selectOptionSearch?: SelectOptionType[];
  searchKeyword?: String;
  setSearchKeyword: (a: string) => void;
  searchType?: string;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
  onClick?: () => void;
  onKeyPress: any;
}

const Search = ({
  selectOptionSearch,
  searchKeyword,
  setSearchKeyword,
  searchType,
  setSearchType,
  onKeyPress,
  onClick,
}: SearchProps) => {
  return (
    <SearchWrapper>
      {selectOptionSearch && searchType && (
        <SelectStyled
          options={selectOptionSearch}
          defaultValue={selectOptionSearch[Number(searchType)]}
          placeholder="Select"
          onChange={({ value }: { value: string }) => {
            setSearchType(value);
          }}
        />
      )}
      <SearchForm>
        <SearchStyled
          onKeyPress={onKeyPress}
          value={String(searchKeyword)}
          onChange={({ target: { value } }) => {
            setSearchKeyword(value);
          }}
          placeholder="검색하세요..."
        />
        <Button className="primary" style={{ marginLeft: 16 }} onClick={onClick}>
          검색
        </Button>
      </SearchForm>
    </SearchWrapper>
  );
};

export default React.memo(Search);

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const SearchForm = styled.div`
  display: flex;
  /* margin-bottom: 12px; */
  align-items: center;
  justify-content: center;
`;

const SearchStyled = styled.input`
  height: 36px;
  width: 20rem;
  border: 1px solid #edf1f7;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
  border-color: #e4e9f2;
`;

export const SelectStyled = styled(Select)`
  width: 20%;
  margin-right: 10px;
  & > div {
    background: #ffffff;
  }
`;
