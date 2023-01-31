import { Col, Container, Row } from "react-bootstrap";

import { useRecoilValue } from "recoil";
import { groupNameState } from "../state/groupName";

import { AddExpenseform } from "./AddExpenseForm";
import { SettlementSummary } from './SettlementSummary';
import { ExpenseTable } from "./ExpenseTable";

import styled from "styled-components";
import { ServiceLogo } from './shared/ServiceLogo';
import { ShareFill } from "react-bootstrap-icons"

import { useGroupData } from "../hooks/useGroupData";



export const ExpenseMain = () => {

  useGroupData();

  const handleSharing = () => {
    if (navigator.userAgent.match(/iphone|android/i) && navigator.share) {
      navigator.share({
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("공유 링크가 클립 보드에 복사 되었습니다. 멤버들과 공유해 보세요!")
      })
    }
  };

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
      <StyledShareButton data-testid="share-btn" onClick={handleSharing}><ShareFill /></StyledShareButton>
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

const StyledShareButton = styled.div`
  border-radius: 50%;
  background-color: #357cc4;
  position: fixed;
  width: 55px;
  height: 55px;
  right: 40px;
  bottom: 45px;
  filter: drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.25));
  color: white;
  font-size: 30px;
  text-align: center;
  svg {
    padding-right: 3px;
    padding-top: 3px;
  }
`
