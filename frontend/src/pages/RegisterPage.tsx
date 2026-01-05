import { useState } from "react";
import type { RegisterInfo } from "../types/interfaces";
import { Link } from "react-router-dom";


const RegisterPage = () => {
    const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setRegisterInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (registerInfo.password.length <= 8) {
            alert('Password needs to be longer');
            return;
        }

        if (registerInfo.password !== registerInfo.confirmPassword) {
            alert('passwords dont match')
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
                 value={registerInfo.username}
                 onChange={handleChange}
                  />
            </div>
            <div>
                <label htmlFor="password"></label>
                <input
                 type="text"
                 id="password"
                 name="password"
                 value={registerInfo.password}
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
                <p>Have an account? Login <Link to={'/login'}>here</Link></p>
            </div>
        </form>
    )
}

export default RegisterPage;