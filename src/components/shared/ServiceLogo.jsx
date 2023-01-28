import styled from "styled-components";

export const ServiceLogo = () =>{
    return(
        <StyledLogo>MANA Pay</StyledLogo>
    );
}

const StyledLogo = styled.h1`
  font-weight: 200;
  letter-spacing: 10px;
  color: gray;
  text-align: center;
  margin-bottom: 0.8em;
`;