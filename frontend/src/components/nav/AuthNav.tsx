
import { Link } from "react-router-dom";
import { type AuthNavProps } from "../../types/interfaces";

const AuthNav = ({authPageType}: AuthNavProps) => {
    
    return (
        <nav className="w-screen bg-white border-b border-gray-100 text-gray-900">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-tight">Car Market</h1>
                <div className="flex gap-6 items-center text-sm">
                    <Link to={'/'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Home</Link>
                    {authPageType === 'login' && (
                        <Link to={'/register'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Register</Link>
                    )}
                    {authPageType === 'register' && (
                        <Link to={'/login'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Log in</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default AuthNav;