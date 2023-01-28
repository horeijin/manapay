import { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Form, Button, Row, Col } from "react-bootstrap";

import { groupMembersState } from "../state/groupMembers";
import { expensesState } from "../state/expenses";

import styled from "styled-components";

export const AddExpenseform = () => {
  const members = useRecoilValue(groupMembersState);

  const today = new Date();
  const [date, setDate] = useState(
    [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("-")
  );
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const [payer, setPayer] = useState(null);
  const [validated, setValidated] = useState(false);

  const [isDescValid, setIsDescValid] = useState(false);
  const [isPayerValid, setIsPayerValid] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);

  //const expenses = useRecoilValue(expensesState);
  const setExpense = useSetRecoilState(expensesState);

  const myCheckValidity = () => {
    const descValid = desc.length > 0;
    setIsDescValid(descValid);

    const payerValid = payer !== null;
    setIsPayerValid(payerValid);

    const amountValid = !!amount && amount > 0;
    setIsAmountValid(amountValid);

    return descValid && payerValid && amountValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(date, desc, amount, payer);

    //const form = e.currentTarget;

    if (myCheckValidity() === false) {
      //에러 처리
    } else {
      const newExpense = { date, desc, amount, payer };
      setExpense((expense) => [...expense, newExpense]);
    }
    setValidated(true);
  };

  return (
    <StyledWrapper>
      <Form noValidate onSubmit={handleSubmit}>
        <StyledTitle>비용 추가하기</StyledTitle>

        {/* {expenses.map((expense) => (
        <span>
          {expense.date}, {expense.desc}, {expense.amount}, {expense.payer}
        </span>
      ))} */}

        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="date"
                placeholder="결제한 날짜를 선택해 주세요."
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="text"
                placeholder="비용에 대한 설명을 입력해 주세요."
                isInvalid={!isDescValid && validated}
                isValid={isDescValid}
                value={desc}
                onChange={({ target }) => setDesc(target.value)}
              />
              <Form.Control.Feedback type="invalid" data-valid={isDescValid}>
                비용 내용을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Control
                type="number"
                placeholder="비용은 얼마였나요?"
                isInvalid={!isAmountValid && validated}
                isValid={isAmountValid}
                value={amount}
                onChange={({ target }) => setAmount(target.value)}
              />
              <Form.Control.Feedback type="invalid" data-valid={isAmountValid}>
                1원 이상의 금액을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Select
                className="form-control"
                isValid={isPayerValid}
                isInvalid={!isPayerValid && validated}
                defaultValue=""
                onChange={({ target }) => setPayer(target.value)}
              >
                <option disabled value="">
                  누가 결제했나요?
                </option>
                {members &&
                  members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" data-valid={isPayerValid}>
                결제자를 선택해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-grid gap-2">
            <StyledSubmitButton>ADD</StyledSubmitButton>
          </Col>
        </Row>
      </Form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  padding: 40px;
  background-color: #7ea1c4;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
  input,
  select {
    background: #357cc4;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    border: 0;
    color: #f8f9fa;
    height: 45px;
    &:focus {
      color: #1b365c;
      background: #c5dff9;
      filter: brightness(80%);
    }
    ::placeholder {
      color: #f8f9fa;
    }
  }
`;
export const StyledTitle = styled.h3`
  color: #1b365c;
  text-align: center;
  font-weight: 700;
  font-size: 35px;
  line-height: 48px;
  letter-spacing: 0.25px;
  margin-bottom: 15px;
  @media screen and (max-width: 600px) {
    font-size: 8vw;
  }
`;
const StyledSubmitButton = styled(Button).attrs({ type: "submit" })`
  height: 60px;
  padding: 16px 32px;
  border: 0px;
  border-radius: 8px;
  background-color: #c5dff9;
  color: #1b365c;
  margin-top: 10px;
  &:hover,
  &:focus {
    background-color: #c5dff9;
    filter: rgba(0, 0, 0, 0.3);
  }
`;
