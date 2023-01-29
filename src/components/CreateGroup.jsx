import { useState } from 'react';
import { Form } from "react-bootstrap";
import { useSetRecoilState, useRecoilState } from 'recoil';

import { groupNameState } from '../state/groupName';
import { groupIdState } from '../state/groupId';
import { CenteredOverlayForm } from './shared/CenteredOverlayForm';

import { useNavigate } from "react-router-dom";
import { ROUTE_UTILS } from '../routes';

import { API } from "aws-amplify";


export const CreateGroup = () =>{
    const [validated, setValidated] = useState(false); //검증하는 절차를 거쳤나? 안 거쳤나?
    const [validGroupName, setValidGroupName] = useState(false);
    const [groupName, setGroupName] = useRecoilState(groupNameState);
    const setGroupId = useSetRecoilState(groupIdState);

    const navigate = useNavigate();

    const saveGroupName = () => {
        API.post('groupsApi', '/groups', {
            body: {
                groupName,
            }
        })
        .then(({ data }) => {
            const { guid } = data;
            setGroupId(guid);
            navigate(ROUTE_UTILS.ADD_MEMBERS(guid));
        })
        .catch((error) => {
            console.error(error)
            alert(error.response.data.error);
        })
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
    
        const form = e.currentTarget
        if (form.checkValidity()) {
            setValidGroupName(true);
            saveGroupName();
        } else {
            e.stopPropagation();
            setValidGroupName(false);
        }
        setValidated(true);
    }

    return(
        <CenteredOverlayForm title='Input your Group name, Please...' validated={validated} handleSubmit={handleSubmit}>
            <Form.Group controlId='validationGroupName'>
                <Form.Control type="text" required placeholder="그룹명을 지어주세요" onChange={(e)=>{setGroupName(e.target.value)}}/>
                <Form.Control.Feedback type="invalid" data-valid={validGroupName}>
                    그룹명을 입력해 주세요.
                </Form.Control.Feedback>
            </Form.Group>
        </CenteredOverlayForm>
    );
};

