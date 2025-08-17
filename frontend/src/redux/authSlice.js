import SuggestedUsers from "@/components/ui/SuggestedUsers";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        SuggestedUsers:[],
        userProfile:null,
    },
    reducers: {
        //actions
        setAuthUser: ( state, action)=> {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        }
    }
});

export const {setAuthUser, setSuggestedUsers, setUserProfile} = authSlice.actions;
export default authSlice.reducer;
