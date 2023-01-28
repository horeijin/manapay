import { render, screen, within } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import userEvent from "@testing-library/user-event";
import { ExpenseMain } from "./ExpenseMain";
import { groupMembersState } from "../state/groupMembers";

const renderComponent = () => {
  render(
    <RecoilRoot
      initializeState={(snap) => {
        snap.set(groupMembersState, ["피카츄", "꾸왁스"]);
      }}
    >
      <ExpenseMain />
    </RecoilRoot>
  );

  const dateInput = screen.getByPlaceholderText(/결제한 날짜/i);
  const descInput = screen.getByPlaceholderText(/비용에 대한 설명/i);
  const amountInput = screen.getByPlaceholderText(/비용은 얼마/i);
  const payerInput = screen.getByDisplayValue(/누가 결제/i);
  const addButton = screen.getByText("ADD");
  //const shareButton = screen.getByTestId("share-btn");

  const descErrorMessage = screen.getByText(
    "비용 내용을 입력해 주셔야 합니다."
  );
  const payerErrorMessage = screen.getByText("결제자를 선택해 주셔야 합니다.");
  const amountErrorMessage = screen.getByText(
    "1원 이상의 금액을 입력해 주셔야 합니다."
  );

  return {
    dateInput,
    descInput,
    amountInput,
    payerInput,
    addButton,
    // shareButton,
    descErrorMessage,
    payerErrorMessage,
    amountErrorMessage,
  };
};

describe("비용정산 메인 페이지", () => {
  //(1) 비용추가 컴포넌트 관련 테스트
  describe("비용추가 컴포넌트 관련 테스트", () => {
    test("비용추가 컴포넌트 렌더링 되는가", () => {
      const { dateInput, descInput, amountInput, payerInput, addButton } =
        renderComponent();

      expect(dateInput).toBeInTheDocument();
      expect(descInput).toBeInTheDocument();
      expect(amountInput).toBeInTheDocument();
      expect(payerInput).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });

    test("비용 입력하지 않고 추가 버튼 클릭시 에러 노출하나", async () => {
      const {
        addButton,
        descErrorMessage,
        payerErrorMessage,
        amountErrorMessage,
      } = renderComponent();

      expect(addButton).toBeInTheDocument();
      await userEvent.click(addButton);

      expect(descErrorMessage).toHaveAttribute("data-valid", "false");
      expect(payerErrorMessage).toHaveAttribute("data-valid", "false");
      expect(amountErrorMessage).toHaveAttribute("data-valid", "false");
    });

    test("비용 입력 후, 추가 버튼 누르면 추가 성공", async () => {
      const { descInput, amountInput, payerInput, addButton } =
        renderComponent();

      await userEvent.type(descInput, "장보기");
      await userEvent.type(amountInput, "30000");
      await userEvent.selectOptions(payerInput, "피카츄");
      await userEvent.click(addButton);

      const descErrorMessage = screen.queryByText(
        "비용 내용을 입력해 주셔야 합니다."
      );
      const payerErrorMessage =
        screen.queryByText("결제자를 선택해 주셔야 합니다.");
      const amountErrorMessage = screen.queryByText(
        "1원 이상의 금액을 입력해 주셔야 합니다."
      );

      expect(descErrorMessage).toHaveAttribute("data-valid", "true");
      expect(payerErrorMessage).toHaveAttribute("data-valid", "true");
      expect(amountErrorMessage).toHaveAttribute("data-valid", "true");
    });
  });

  //(2) 입력한 비용 리스트 보여주는 컴포넌트

  describe("비용 리스트 컴포넌트", () => {
    test("비용 리스트 컴포넌트 렌더링 되는가", () => {
      renderComponent();
      const expenseListComponent = screen.getByTestId("expenseList");

      expect(expenseListComponent).toBeInTheDocument();
    });
  });


  //(3) 새로운 비용데이터 입력
  describe("새로운 비용 데이터가 입력되었을 때", () => {
    const addNewExpense = async () => {
      const { dateInput, descInput, payerInput, amountInput, addButton } =
        renderComponent();
      await userEvent.type(dateInput, "2023-01-28");
      await userEvent.type(descInput, "장보기");
      await userEvent.type(amountInput, "30000");
      await userEvent.selectOptions(payerInput, "피카츄");
      await userEvent.click(addButton);
    };

    //아래의 테스트들 실행되기 전에 addNewExpense 함수 포함
    beforeEach( async() => {
      await addNewExpense();
    })

    test("날짜, 내용, 결제자, 금액 데이터가 정산 리스트에 추가 되는가", () => {
      //await addNewExpense();

      const expenseListComponent = screen.getByTestId("expenseList");
      const dateValue = within(expenseListComponent).getByText("2023-01-28");
      expect(dateValue).toBeInTheDocument();

      const descValue = within(expenseListComponent).getByText("장보기");
      expect(descValue).toBeInTheDocument();

      const payerValue = within(expenseListComponent).getByText("피카츄");
      expect(payerValue).toBeInTheDocument();

      const amountValue = within(expenseListComponent).getByText("30000 원");
      expect(amountValue).toBeInTheDocument();
    });  

    //정산 결과 보여주는 컴포넌트 테스트 코드임!
    test('정산 결과가 업데이트 되는가', () => {
      const totalText = screen.getByText(/2 명이서 총 30000 원 지출/i);
      expect(totalText).toBeInTheDocument();
      

      const transactionText = screen.getByText(/꾸왁스가 피카츄에게 15000 원/i);
      expect(transactionText).toBeInTheDocument();
    });

    const htmlToImage = require('html-to-image');
    test('정산 결과를 이미지 파일로 저장 가능한가', async() => {
      //await addNewExpense();

      const spiedToPng = jest.spyOn(htmlToImage, 'toPng'); //htmlToImage의 함수를 지켜보기 등록

      const downloadBtn = screen.getByTestId("btn-download");
      expect(downloadBtn).toBeInTheDocument();
      
      await userEvent.click(downloadBtn);

      expect(spiedToPng).toHaveBeenCalledTimes(1); //1번 불렸는지 확인

    });

    afterEach(() => { jest.resetAllMocks()}); //spiedToPng 해지
  });

  //(4) 정산 결과 보여주는 컴포넌트
  describe('정산 결과 컴포넌트', () => {
    test('정산 결과 컴포넌트가 렌더링 되는가', () => {
      renderComponent();

      const component = screen.getByText(/정산 결과/i);
      expect(component).toBeInTheDocument();
    })
  })

});
