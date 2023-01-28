import { useState } from 'react';
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
    const groupName = useRecoilValue(groupNameState);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        if(groupMembers.length >0){
            navigate(ROUTES.EXPENSE_MAIN);
        }
    }

    const header = `Invite members to ${groupName}!`

    return(
        <CenteredOverlayForm title={header} validated={validated} handleSubmit={handleSubmit}>
            <InputTags values={groupMembers} data-testid="input-member-names" placeholder='이름 간 띄어쓰기' onTags={(value)=>{setGroupMembers(value.values)}}></InputTags>
            {validated && groupMembers.length===0 && <StyledMessage>그룹멤버들의 이름을 입력해 주세요.</StyledMessage>}
        </CenteredOverlayForm>
    );
};

const StyledMessage = styled.span`
    color : red;
    margin-top: 20px;
`