import { Link, useNavigate } from "react-router-dom";
import { type MarketNavProps } from "../../types/interfaces";
import { userPool } from "../../lib/cognito";
import { getFreshJwt } from "../../lib/getFreshJWT";
import { useEffect, useState } from "react";



const MarketNav = ({showMarketSearch, setShowMarketSearch}: MarketNavProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState<Boolean | null>(null);

    useEffect(() => {
        getFreshJwt().then(token => {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload) setIsLoggedIn(true);
            setIsAdmin((payload['cognito:groups'] ?? []).includes('Admin'));
        }).catch(() => setIsAdmin(false));
    },[])

    const logOut = () => {
        const user = userPool.getCurrentUser();
        if (user) user.signOut();
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <nav className="w-screen bg-white border-b border-gray-100 text-gray-900">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-tight">Car Market</h1>
                <div className="flex gap-6 items-center text-sm">
                    <button
                        onClick={() => setShowMarketSearch(!showMarketSearch)}
                        className="text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        {showMarketSearch ? 'Hide' : 'Show'} Filters
                    </button>
                    {isLoggedIn ? (
                        <>
                            <Link to={'/valuationRequest'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Get Valuation</Link>
                            <Link to={'/history'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">History</Link>
                            <button
                            onClick={() => logOut()}
                            className="text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            Log out
                        </button>
                        </>
                    ) : (
                        <>
                            <Link to={'/login'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Log in</Link>
                            <Link to={'/register'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Register</Link>
                        </>
                    )}
                    {isAdmin && (
                        <Link to={'/upload'} className="text-gray-900 hover:text-gray-600 transition-colors no-underline">Upload</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default MarketNav;