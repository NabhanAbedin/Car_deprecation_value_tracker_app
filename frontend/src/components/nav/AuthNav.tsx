
import { Link } from "react-router-dom";
import { type AuthNavProps } from "../../types/interfaces";

const AuthNav = ({authPageType}: AuthNavProps) => {
    
    return (
        <nav className="w-screen bg-primary-600 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Car Market</h1>
                <div className="flex gap-4 items-center">
                    <Link to={'/'} style={{color: 'white', textDecoration: 'none'}}>Home</Link>
                    {authPageType === 'login' && (
                        <Link to={'/register'} style={{color: 'white', textDecoration: 'none'}}>Register</Link>
                    )}
                    {authPageType === 'register' && (
                        <Link to={'/login'} style={{color: 'white', textDecoration: 'none'}}>Login</Link>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default AuthNav;