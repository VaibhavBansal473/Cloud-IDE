import { Link } from 'react-router-dom';
import { Code2, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/authContext';
import axios from 'axios';

export default function Navbar() {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const logoutHandler = async () => {

    try {
      await axios.post("http://localhost:8000/api/user/auth/logout", {}, {
        withCredentials: true,
      })

      localStorage.removeItem("Cloud-IDE");
      setAuthUser(null);
      toast.success("logged out successfully");
      navigate("/");
      
    } catch (error) {
      toast.error("Something went wrong");
      window.location.reload();
    }
  }

  return (
    <nav className="border-b">
      <div className=" h-full w-full px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8 ml-10">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6" />
              <span className="text-xl font-bold">CodeJudge</span>
            </Link>
            <Link to="/problems" className="text-foreground/60 hover:text-foreground">
              Problems
            </Link>
          </div>
          {!authUser ? (
            <div className="flex items-center space-x-4 mr-10">
              <Link to="/signin">
                <Button variant="ghost" size="lg">
                  <User className="mr-2 h-6 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg">Sign Up</Button>
              </Link>

            </div>
          ) : (
            <Button variant="ghost" size="lg" className='text-white mr-10' onClick={logoutHandler}>
              <LogOut className="mr-2 h-7 w-5" />
              Logout
            </Button>
          )}

        </div>
      </div>
    </nav>
  );
}