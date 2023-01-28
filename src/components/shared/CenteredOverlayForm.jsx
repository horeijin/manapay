import { Container, Row, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { OverlayWrapper } from "./OverlayWrapper";
import {ServiceLogo} from './ServiceLogo';

const StyledCentralizedContainer = styled(Container)`
  width: 50vw;
  @media (max-width: 500px) {
    width: 80vw;
  }
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
`;


const StyledTitle = styled.h2`
  text-align: right;
  overflow-wrap: break-word;
  word-break: keep-all;

  font-weight: 700;
  line-height: 35px;
`;

const StyledCentralizedContent = styled(Row)`
  align-items: center;
  justify-contents: center;
  height: 60vw;
`;
const StyledButton = styled(Button).attrs({
  type: "submit",
})`
  background-color: #357cc4;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: #357cc4;
    filter: rgba(0, 0, 0, 0.3);
  }
`;

export const CenteredOverlayForm = ({
  title,
  children,
  validated,
  handleSubmit,
}) => {
  return (
    <StyledCentralizedContainer>
      <ServiceLogo/>

      <OverlayWrapper>
        {/* {children} */}

        <Container>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <StyledCentralizedContent>
              <Row className="align-items-start">
                <StyledTitle>{title}</StyledTitle>
              </Row>
              <Row className="align-items-center">{children}</Row>
              <Row className="align-items-end">
                <StyledButton>SAVE</StyledButton>
              </Row>
            </StyledCentralizedContent>
          </Form>
        </Container>
      </OverlayWrapper>
    </StyledCentralizedContainer>
  );
};
