export const getIsAdmin = (): boolean => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload['cognito:groups'] ?? []).includes('Admin');
    } catch {
        return false;
    }
};