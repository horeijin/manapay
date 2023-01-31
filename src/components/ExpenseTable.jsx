import { Table } from "react-bootstrap";
import { useRecoilValue } from "recoil";

//import { currencyState } from "../state/currency";
import { expensesState } from "../state/expenses";
import { OverlayWrapper } from "./shared/OverlayWrapper";

import styled from "styled-components";

export const ExpenseTable = () => {
  const expenses = useRecoilValue(expensesState);
  //const currency = useRecoilValue(currencyState);

  return (
    <OverlayWrapper minHeight={"73vh"}>
      <StyledTable data-testid="expenseList" borderless hover responsive>
        <StyledThead>
          <tr>
            <th>DATE</th>
            <th>DESC</th>
            <th>PAYER</th>
            <th>AMOUNT</th>
          </tr>
        </StyledThead>
        <StyledBody>
          {expenses.map(({ date, desc, payer, amount }) => (
            <tr>
              <td>{date}</td>
              <td>{desc}</td>
              <td>{payer}</td>
              <td>{parseInt(amount)} 원</td>
            </tr>
          ))}
        </StyledBody>
      </StyledTable>
    </OverlayWrapper>
  );
};

const StyledTable = styled(Table)`
  min-width: 450px;
  @media screen and (max-width: 600px) {
    min-width: 300px;
  }
`;

const StyledThead = styled.thead`
  color: #1b365c;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  th {
    padding: 15px 8px;
    min-width: 60px;
  }
  @media screen and (max-width: 600px) {
    font-size: 4vw;
    line-height: 10px;
    th {
      padding: 10px 4px;
    }
  }
`;

const StyledBody = styled.tbody`
  td {
    font-weight: 400;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    @media screen and (max-width: 600px) {
      font-size: 4vw;
      line-height: 20px;
    }
  }
`;
