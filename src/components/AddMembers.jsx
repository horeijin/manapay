import { useState } from 'react';
import { Form } from "react-bootstrap";
import { InputTags } from 'react-bootstrap-tagsinput';
import { useSetRecoilState } from 'recoil';

import { groupMembersState } from '../state/groupMembers';

import styled from 'styled-components';
import {CenteredOverlayForm } from './shared/CenteredOverlayForm';

import { useNavigate } from "react-router-dom";
import { ROUTE_UTILS } from '../routes';

import { API } from "aws-amplify";
import { useGroupData } from "../hooks/useGroupData"

export const AddMembers = () =>{
    const [validated, setValidated] = useState(false);
    const { groupId, groupName, groupMembers } = useGroupData();
    const [groupMembersString, setGroupMembersString] = useState('');
    const setGroupMembers = useSetRecoilState(groupMembersState);
    
    const navigate = useNavigate();

    

    const saveGroupMembers = () => {
        API.put('groupsApi', `/groups/${groupId}/members`, {
            body: {
                members: groupMembers
            }
        }).then(_response => {
            navigate(ROUTE_UTILS.EXPENSE_MAIN(groupId));
        }).catch(({ response }) => {
            alert(response);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        if(groupMembers.length >0){
            saveGroupMembers();
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