import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Problems from '@/pages/Problems';
import Problem from '@/pages/Problem';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import AdminSignIn from './pages/admin/AdminSignIn';
import AdminProblemList from './pages/admin/AdminProblemList';
import AdminAddProblem from './pages/admin/AddProblem';
import AdminModifyProblem from './pages/admin/ModifyProblem';
import { SuperAdminSignIn } from './pages/Sadmin/SuperAdminSignin';
import { AddAdminForm } from './pages/Sadmin/AddAdmin';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/problems" element={<Problems />} />
              <Route path="/problem/:problemId" element={<Problem />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<AdminPortal/>} />
            <Route path="/admin/signin" element={<AdminSignIn/>} />
            <Route path="/admin/problems" element={<AdminProblemList/>} />
            <Route path="/admin/problem/add" element={<AdminAddProblem/>} />
            <Route path="/admin/problems/:problemId/modify" element={<AdminModifyProblem/>} />
            <Route path="/superadmin/signin" element={<SuperAdminSignIn/>} />
            <Route path="/superadmin/addAdmin" element={<AddAdminForm/>} />


          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
