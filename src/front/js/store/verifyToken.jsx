useEffect(() => {
    const verifyToken = async () => {
        const token = localStorage.getItem("tokenFinanciaE");
        if (token) {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Token inválido o expirado");
                }
            } catch (error) {
                console.error(error.message);
                localStorage.removeItem("tokenFinanciaE");
                setStore({ token: null });
            }
        }
    };

    verifyToken();
}, []);
