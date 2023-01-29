import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { CreateGroup } from './components/CreateGroup';
import { AddMembers } from './components/AddMembers';
import { ExpenseMain } from './components/ExpenseMain';
import { ROUTES } from './routes';

import { Amplify } from 'aws-amplify';
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);

const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.CREATE_GROUP} />} />
          <Route path={ROUTES.CREATE_GROUP} element={<CreateGroup />} />
          <Route path={ROUTES.ADD_MEMBERS} element={<AddMembers/>} />
          <Route path={ROUTES.EXPENSE_MAIN} element={<ExpenseMain/>} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
