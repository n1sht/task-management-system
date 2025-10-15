import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, User, ListTodo, Users } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold">
            Task Manager
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-2 hover:text-blue-200">
              <ListTodo size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/tasks" className="flex items-center space-x-2 hover:text-blue-200">
              <ListTodo size={20} />
              <span>Tasks</span>
            </Link>
            
            {user?.role === 'ADMIN' && (
              <Link to="/users" className="flex items-center space-x-2 hover:text-blue-200">
                <Users size={20} />
                <span>Users</span>
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span>{user?.email}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:text-blue-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
