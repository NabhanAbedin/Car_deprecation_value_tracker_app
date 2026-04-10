import { useEffect, useState } from "react";
import AuthNav from "../components/nav/AuthNav";
import { useLocation, useNavigate } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../lib/cognito";

const VerifyPage = () => {
    const [verifyCode, setVerifyCode] = useState('');
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) navigate('/register');
    }, [email]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        
       const cognitoUser = new CognitoUser({Username: email, Pool: userPool});

       cognitoUser.confirmRegistration(verifyCode, true,(err, result) => {
        if (err) {
            alert(err.message);
            return;
        }

        navigate('/login');
       });
    };

    return (
        <>
        <AuthNav authPageType="login" />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify your email</h1>
                <p className="text-gray-400 mb-10 text-sm">Enter the code sent to your email</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="verifyCode" className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            id="verifyCode"
                            name="verifyCode"
                            value={verifyCode}
                            onChange={e => setVerifyCode(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="123456"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition mt-4"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default VerifyPage;
