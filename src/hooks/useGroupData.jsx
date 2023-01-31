import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";

import { useRecoilState } from "recoil";
import { groupNameState } from "../state/groupName";
import { groupIdState } from "../state/groupId";
import { groupMembersState } from "../state/groupMembers";
import { expensesState } from "../state/expenses";
//import { currencyCodeState } from "../state/currency";

export const useGroupData = () => {
  const { guid } = useParams();
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [groupMembers, setMembers] = useRecoilState(groupMembersState);
  const [expenses, setExpenses] = useRecoilState(expensesState);
  //const [currencyCode, setCurrencyCode] = useRecoilState(currencyCodeState);

  //그룹 정보 데이터 조회하는 API 호출
  const fetchAndSetGroupData = () => {
    API.get('groupsApi', `/groups/${guid}`).then(({data}) => {
        setGroupName(data.groupName);
        setGroupId(data.guid);
        //setCurrencyCode(data.currencyCode);
        setMembers(data.members);
        setExpenses(data.expenses || []);
    }).catch(error => {
        alert("데이터를 불러오는데 실패 했습니다.");
        console.log(error.response);
    })
  };

  useEffect(() => {
    if (guid?.length > 0) { 
        fetchAndSetGroupData();
    }}, [guid]); //guid가 바뀔 때마다 내부의 함수 실행

  return {
    groupId,
    groupName,
    //currencyCode,
    groupMembers,
    expenses,
  };
};