import { jwtDecode } from "jwt-decode";


export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token && !isTokenExpired(token); // Verifica se o token está presente e se não expirou
};


const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const expirationTime = decoded.exp;
        return expirationTime < currentTime;
    } catch (error) {
        console.error("Erro ao verificar a expiração do token:", error);
        return true; // Se houver erro, assume-se que o token é inválido
    }
};

export const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("Token não encontrado!");
        return null;
    } else {
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);
            console.log("Categoria:", decoded.categoria);
            return decoded.categoria;
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return null;
        }
}

}

export const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("Token não encontrado!");
        return null;
    } else {
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);

            const userInfo = {
                sub: decoded.sub, // Identificador do usuário
                nome: decoded.nome, // Nome do usuário
                email: decoded.email,
                id: decoded.id// Supondo que o email do usuário esteja no campo "email"

            };

            console.log("Informações do usuário:", userInfo);
            return userInfo;
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return null;
        }
    }
};

export const getDepInfo = () => {
    const token = localStorage.getItem("dependenteToken"); // Token do dependente
    if (!token) {
        console.log("Token do dependente não encontrado!");
        return null;
    } else {
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Dependente Token:", decoded);

            const depInfo = {
                nomeUsuario: decoded.sub,
                telefone: decoded.telefone || "Telefone não disponível",
                nome: decoded.nome || "Nome não disponível",
                id: decoded.id


            };

            console.log("Informações do dependente:", depInfo);
            return depInfo;
        } catch (error) {
            console.error("Erro ao decodificar o token do dependente:", error);
            return null;
        }
    }
};


