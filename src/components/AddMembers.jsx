import { useState } from 'react';
import { Form } from "react-bootstrap";
import { InputTags } from 'react-bootstrap-tagsinput';
import { useRecoilState, useRecoilValue } from 'recoil';

import { groupMembersState } from '../state/groupMembers';
import { groupNameState } from '../state/groupName';

import styled from 'styled-components';
import {CenteredOverlayForm } from './shared/CenteredOverlayForm';

import { useNavigate } from "react-router-dom";
import { ROUTES } from '../routes';

export const AddMembers = () =>{
    const [validated, setValidated] = useState(false);
    const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState);
    const [groupMembersString, setGroupMembersString] = useState('');
    const groupName = useRecoilValue(groupNameState);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        if(groupMembers.length >0){
            navigate(ROUTES.EXPENSE_MAIN);
        }else if(isSamsungInternet && groupMembersString.length > 0){
            setGroupMembers(groupMembersString.split(','));
        }
    }

    const isSamsungInternet = window.navigator.userAgent.includes('SAMSUNG');
    const header = `Invite members to ${groupName}!`
    
    // 인풋태그가 지원되지 않는 환경에서는 어떻게? -> 콤마를 구분자로 이름 구분
    return(
        <CenteredOverlayForm title={header} validated={validated} handleSubmit={handleSubmit}>
            { isSamsungInternet ?
                <Form.Control placeholder="이름 간 컴마(,)로 구분" onChange={({target}) => setGroupMembersString(target.value)} />
            :
                <InputTags values={groupMembers} data-testid="input-member-names" placeholder="이름 간 띄어 쓰기" onTags={(value) => setGroupMembers(value.values)} />
            }
            {validated && groupMembers.length===0 && <StyledMessage>그룹멤버들의 이름을 입력해 주세요.</StyledMessage>}
        </CenteredOverlayForm>
    );
};

const StyledMessage = styled.span`
    color : red;
    margin-top: 20px;
`