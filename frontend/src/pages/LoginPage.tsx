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
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Log In</h1>
            </div>
            <div>
                <label htmlFor="username"></label>
                <input
                 type="text"
                 id="username"
                 name="username"
                 value={loginInfo.username}
                 onChange={handleChange}
                  />
            </div>
            <div>
                <label htmlFor="password"></label>
                <input
                 type="text"
                 id="password"
                 name="password"
                 value={loginInfo.password}
                 onChange={handleChange}
                  />
            </div>
            <div>
                <button
                type="submit"
                >
                    Log In
                </button>
            </div>
            <div>
                <p>Dont have an account? Create one <Link to={'/register'}>here</Link></p>
            </div>
        </form>
    )
}

export default LoginPage;