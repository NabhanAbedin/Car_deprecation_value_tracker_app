const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addUser = async (userId: string, email: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            email: email
        })
    });
}