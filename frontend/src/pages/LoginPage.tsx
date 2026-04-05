import { useState } from "react";
import type { LoginInfo } from "../types/interfaces";
import { Link } from "react-router-dom";
import AuthNav from "../components/nav/AuthNav";


const LoginPage = () => {
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (loginInfo.password.length <= 8) {
            alert('Password needs to be longer');
            return;
        }

        //submitting info to amazon incongito services
    }

    return (
        <>
        <AuthNav authPageType="login" />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-400 mb-10 text-sm">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginInfo.username}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="your username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition mt-4"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-8 text-gray-400 text-sm text-center">
                    Don't have an account?{' '}
                    <Link to={'/register'} className="text-primary-600 hover:text-primary-700 font-medium">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
        </>
    )
}

export default LoginPage;