import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import { CreateGroup } from './CreateGroup';


const renderComponent = () =>{
    render(
        <RecoilRoot>
            <CreateGroup />
        </RecoilRoot>
    );

    const input = screen.getByPlaceholderText('그룹명을 지어주세요');
    const saveButton = screen.getByText('SAVE');
    const errorMessage = screen.getByText('그룹명을 입력해 주세요.');
    return {
        input,
        saveButton,
        errorMessage
    }
};

describe('그룹 생성 페이지', () => {

    //테스트 케이스 01
    test('그룹명 입력 컴포넌트가 렌더링 되는가', ()=>{
        const {input, saveButton} = renderComponent();

        expect(input).not.toBeNull();
        expect(saveButton).not.toBeNull();

    });

    //테스트 케이스 02
    test('그룹명 입력하지 않고 저장 버튼 누르면 에러 메시지 노출하나', async()=>{
        const {saveButton, errorMessage} = renderComponent();

        await userEvent.click(saveButton);
        expect(errorMessage).toHaveAttribute('data-valid', 'false');
    });

    //테스트 케이스 03
    test('그룹명 입력 후, 저장 버튼 누르면 저장 성공', async()=>{
        const {input, saveButton, errorMessage} = renderComponent();
        
        await userEvent.type(input, 'aaa');
        await userEvent.click(saveButton);
        expect(errorMessage).toHaveAttribute('data-valid', 'true');
    });

});