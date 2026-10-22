import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getToken} from "@/utils/secureStore";
import {API_ULR} from "@/constants/api";

interface UserProfile {
    id: number;
    email: string;
    name?: string;
}

interface AuthState {
    token: string | null;
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isLoading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getToken();
            if (!token) return rejectWithValue('No hay token disponible');

            const response = await fetch(`${API_ULR}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Error al obtener perfil');

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;