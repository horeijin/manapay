import { Col, Container, Row } from "react-bootstrap";

import { useRecoilValue } from "recoil";
import { groupNameState } from "../state/groupName";

import { AddExpenseform } from "./AddExpenseForm";
import { SettlementSummary } from './SettlementSummary';
import { ExpenseTable } from "./ExpenseTable";

import styled from "styled-components";
import { ServiceLogo } from './shared/ServiceLogo';

export const ExpenseMain = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={5} md={4}>
          <LeftPane />
        </Col>
        <Col>
          <RightPane />
        </Col>
      </Row>
    </Container>
  );
};

const LeftPane = () => (
  <Container>
    <StyledGapRow>
      <Row>
        <ServiceLogo />
      </Row>
      <Row>
        <AddExpenseform />
      </Row>
      <Row>
        <SettlementSummary />
      </Row>
    </StyledGapRow>
  </Container>
);

const RightPane = () => {
  const groupName = useRecoilValue(groupNameState);
  return (
    <StyledContainer>
      <Row>
        <StyledGroupName>{groupName || "Group Name"}</StyledGroupName>
      </Row>
      <Row>
        <ExpenseTable />
      </Row>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  padding: 100px 31px 100px 31px;
  @media screen and (max-width: 600px) {
    padding: 50px 25px;
  }
`

const StyledGroupName = styled.h2`
  margin-bottom: 80px;
  font-weight: 700;
  font-size: 45px;
  line-height: 45px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 10vw;
    margin-bottom: 30px;
  }
`

const StyledGapRow = styled(Row)`
  gap: 5vh;
  padding-top: 100px;
  justify-content: center;
  @media screen and (max-width: 600px) {
    padding-top: 30px;
  }
`
