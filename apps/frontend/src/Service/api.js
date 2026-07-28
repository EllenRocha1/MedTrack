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

const parseResponseBody = async (response) => {
    const text = await response.text();
    if (!text) {
        return true;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

const getErrorMessage = (errorData, fallbackMessage) => {
    if (Array.isArray(errorData)) {
        return errorData.map((item) => item.mensagem || item.message).filter(Boolean).join(' ') || fallbackMessage;
    }

    if (typeof errorData === 'string') {
        return errorData;
    }

    return errorData?.message || errorData?.mensagem || fallbackMessage;
};

const createApiError = (response, errorData, fallbackMessage = 'Erro ao fazer a requisição') => {
    const error = new Error(getErrorMessage(errorData, fallbackMessage));
    error.status = response.status;
    error.data = errorData;

    if (Array.isArray(errorData)) {
        error.details = errorData;
    }

    return error;
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
                const errorData = await parseErrorResponse(response);
                throw createApiError(response, errorData, "Erro ao buscar dados");
            }

            return parseResponseBody(response);
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
            throw createApiError(response, errorData);
        }

        return parseResponseBody(response);

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
            throw createApiError(response, errorData);
        }

        return parseResponseBody(response);

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
            throw createApiError(response, errorData);
        }

        return parseResponseBody(response);
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
            throw createApiError(response, errorData);
        }

        return parseResponseBody(response);
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
            const errorData = await parseErrorResponse(response);
            throw createApiError(response, errorData);
        }
        return true
    }
};

export default api;
