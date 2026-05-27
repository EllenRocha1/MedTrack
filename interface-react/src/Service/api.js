export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

const parseErrorResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch {
            return response.statusText;
        }
    }

    const text = await response.text();
    return text || response.statusText;
};

const api  = {

    get: async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json(); // Tenta obter detalhes do erro
                throw new Error(errorData.message || "Erro ao buscar dados");
            }

            return response.json();
        } catch (error) {
            console.error("Erro na requisição GET:", error);
            throw error; // Propaga o erro para ser tratado no componente
        }
    },

    post: async (url, data) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await parseErrorResponse(response);
            if (response.status === 400 && Array.isArray(errorData)) {
                const validationMessage = errorData.map((item) => item.mensagem).join(' ');
                const error = new Error(validationMessage || 'Erro ao fazer a requisição');
                error.details = errorData;
                throw error;
            }
            throw new Error(typeof errorData === 'string' ? errorData : errorData?.message || 'Erro ao fazer a requisição');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : true;

    },

    postForm: async (url, data) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: data
        });

        if (!response.ok) {
            const errorData = await parseErrorResponse(response);
            if (response.status === 400 && Array.isArray(errorData)) {
                const error = new Error(errorData.map((item) => item.mensagem).join(' ') || 'Erro ao fazer a requisição');
                error.details = errorData;
                throw error;
            }
            throw new Error(typeof errorData === 'string' ? errorData : errorData?.message || 'Erro ao fazer a requisição');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : true;

    },

    put: async (url, data) => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await parseErrorResponse(response);
            if (response.status === 400 && Array.isArray(errorData)) {
                const error = new Error(errorData.map((item) => item.mensagem).join(' ') || 'Erro ao fazer a requisição');
                error.details = errorData;
                throw error;
            }
            throw new Error(typeof errorData === 'string' ? errorData : errorData?.message || 'Erro ao fazer a requisição');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : true;
    },

    patch: async (url, data) => {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            const errorData = await parseErrorResponse(response);
            if (response.status === 400 && Array.isArray(errorData)) {
                const error = new Error(errorData.map((item) => item.mensagem).join(' ') || 'Erro ao fazer a requisição');
                error.details = errorData;
                throw error;
            }
            throw new Error(typeof errorData === 'string' ? errorData : errorData?.message || 'Erro ao fazer a requisição');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : true;
    },

    delete: async (url) => {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 204) {
            throw new Error('Erro ao fazer a requisição');
        }
        return true
    }
};

export default api;
