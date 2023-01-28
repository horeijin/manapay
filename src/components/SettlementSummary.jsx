import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { toPng } from 'html-to-image';
import { useRecoilValue } from "recoil";

import { expensesState } from "../state/expenses";
import { groupMembersState } from "../state/groupMembers";

import styled from "styled-components";
import { StyledTitle } from './AddExpenseForm';
import { Download } from 'react-bootstrap-icons';

//정산 계산하는 로직
export const calculateMinimumTransaction = (expenses, members, amountPerPerson) => {
    const minTransactions = [];

    //비용 없으면 그냥 0원이 결과
    if (!expenses || !members || !amountPerPerson || amountPerPerson === 0) {
        return minTransactions;
    }

    //1. 사람별로 내야하는 금액 계산
    const membersToPay = {}
    members.forEach(member => {
        membersToPay[member] = amountPerPerson
    });

    //2. 내야하는 금액 - 자기가 낸 금액 업데이트
    expenses.forEach(({ payer, amount }) => {
        membersToPay[payer] -= amount
    });

    //3. 낸 금액별로 오름차순 정렬
    const sortedMembersToPay = Object.keys(membersToPay).map(member => (
        { member: member, amount: membersToPay[member]}
    )).sort((a, b) => a.amount - b.amount);

    //4. 정렬된 배열의 양 끝단서 부터 포인터 지정해 정산
    var left = 0; //맨 왼쪽
    var right = sortedMembersToPay.length - 1; //맨 오른쪽

    while (left < right) { //포인터가 서로 교차되기까지 계속 정산

        //정산해야할 금액이 0인 사람은 그냥 스킵
        while (left < right && sortedMembersToPay[left].amount === 0) { left++ }
        while (left < right && sortedMembersToPay[right].amount === 0) { right-- }

        const toReceive = sortedMembersToPay[left]
        const toSend = sortedMembersToPay[right]
        const amountToReceive = Math.abs(toReceive.amount)
        const amountToSend = Math.abs(toSend.amount)

        if (amountToSend > amountToReceive) {
            minTransactions.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amountToReceive,
            })
            toReceive.amount = 0
            toSend.amount -= amountToReceive
            left++
        }
        else {
            minTransactions.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amountToSend
            })
            toSend.amount = 0
            toReceive.amount += amountToSend
            right--
        }
    }

    return minTransactions;
}

export const SettlementSummary = ()=>{

    const wrapperElement = useRef(null);

    const expenses = useRecoilValue(expensesState);
    const members = useRecoilValue(groupMembersState);

    const totalExpenseAmount = parseInt(expenses.reduce((prevAmount, curExpense) => prevAmount + parseInt(curExpense.amount), 0));
    const groupMembersCount = members ? members.length : 0;
    const splitAmount = totalExpenseAmount/groupMembersCount;
    
    //위의 계산 로직 함수
    const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount);

    //이미지 다운 함수
    const exportToImg = () => {
        if (wrapperElement.current === null) {
            return
        }
    
        //이미지 내보낼 때 버튼은 없애는 필터 옵션 적용
        toPng(wrapperElement.current, {filter: (node) => node.tagName !== 'BUTTON'}).then((dataURL) => {
            const link = document.createElement('a');
            link.download = 'settlement-summary.png';
            link.href = dataURL;
            link.click();
        }).catch((err) => {
            console.error(err);
        });
    
    }

    return(
        <StyledWrapper ref={wrapperElement}>
            <StyledTitle>정산 결과</StyledTitle>
            {totalExpenseAmount > 0 && groupMembersCount > 0 && (
                <>
                    <StyledSummary>
                        <span>{groupMembersCount} 명이서 총 {totalExpenseAmount} 원 지출</span>
                        <br />
                        <span>한 사람당 {splitAmount} 원 지출</span>
                    </StyledSummary>
                    <StyledUl>
                        {minimumTransaction.map(({sender, receiver, amount}, index)=>{
                            return(
                                <li key={`transaction-${index}`}>
                                    <span>{sender}가 {receiver}에게 {amount} 원 보내기</span>
                                </li>
                            );
                        })}
                    </StyledUl>
                    <StyledDownButton data-testid="btn-download" onClick={exportToImg}>
                        <Download />
                    </StyledDownButton>
                </>
            )}
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  padding: 40px;
  background-color: #357cc4;
  color: #FFFBFB;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center;
  font-size: 22px;
  position: relative;
`

const StyledUl = styled.ul`
  margin-top: 31px;
  font-weight: 600;
  line-height: 200%;
  list-style-type: disclosure-closed;
  li::marker {
    animation: blinker 1.5s linear infinite;
  }
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

const StyledSummary = styled.div`
  margin-top: 31px;
`

const StyledDownButton = styled(Button)`
  background: none;
  border: none;
  font-size: 25px;
  position: absolute;
  top: 15px;
  right: 15px;
  &:hover, &:active {
    background: none;
    color: #7ea1c4;
  }
`