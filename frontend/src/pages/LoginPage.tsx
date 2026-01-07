import { useState } from "react";
import type { LoginInfo } from "../types/interfaces";
import { Link } from "react-router-dom";


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
        <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-primary-700 mb-6 text-center">Log In</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginInfo.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to={'/register'} className="text-primary-600 hover:text-primary-700 font-medium">
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;