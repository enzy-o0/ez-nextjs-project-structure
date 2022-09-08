import styled from 'styled-components';

// flex
export const FlexWrapper = styled.div`
  display: flex;
`;

export const FlexCenter = styled(FlexWrapper)`
  align-items: center;
`;

export const FlexSpaceBetween = styled(FlexCenter)`
  justify-content: space-between;
`;

export const FlexSpaceBetweenAlignTop = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
`;

export const MainTitle = styled.h3`
  font-size: 1.4375rem;
  margin-left: 16px;
  line-height: 0;
`;
