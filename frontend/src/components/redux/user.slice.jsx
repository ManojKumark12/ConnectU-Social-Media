import { createSlice } from "@reduxjs/toolkit";
const initialState={
    userloggedin:false,
    user:{}
}
export const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.userloggedin=true;
            state.user=action.payload
        },
        removeUser:(state)=>{
            state.userloggedin=false;
            state.user={}
        }
    }
})
export const {addUser,removeUser}=UserSlice.actions;
export default UserSlice.reducer;