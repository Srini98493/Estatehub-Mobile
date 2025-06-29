import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserDetails {
  userDetails: object,
  isUserLoggedIn: boolean,
  ageRange : Array<object>,
  qiScore : Array<object> , 
  sensitiveContents : Array<object>,
  topics : Array<object>,
  tags : Array<object>,
  userTypes : Array<object>,
  profileImage: String,
  filterType: String,
  chatsectionId: String,
  registeredUserGuide : Array<object>,
  unregisteredUserGuide : Array<object>,
  gender : Array<object>,
  showRegPop: boolean,
  hasClosedRegPop: boolean,

}

const initialState: UserDetails = {
  userDetails: {},
  isUserLoggedIn: false,
  ageRange : [],
  qiScore : [],
  sensitiveContents:[],
  topics:[],
  tags:[],
  userTypes:[],
  profileImage: "",
  filterType: "",
  chatsectionId: "0",
  registeredUserGuide: [],
  unregisteredUserGuide: [],
  gender : [],
  showRegPop: false,
  hasClosedRegPop: false,
}

export const authSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<object>) => {
      state.userDetails = action.payload
      //Update Async Storage
      AsyncStorage.setItem("userDetails", JSON.stringify(action.payload));
    },
    setIsUserLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isUserLoggedIn = action.payload;
    },
   setAgeRange: (state,action:PayloadAction<Array<object>>) => {
    state.ageRange = action.payload;
   },
   setQiScore: (state,action:PayloadAction<Array<object>>) => {
    state.qiScore = action.payload;
   },
   setsensitiveContents: (state,action:PayloadAction<Array<object>>) =>{
    state.sensitiveContents = action.payload;
   },
   setTopics: (state,action:PayloadAction<Array<object>>) =>{
    state.topics = action.payload;
   },
   setTags: (state,action:PayloadAction<Array<object>>) =>{
    state.tags = action.payload;
   },
   setUserTypes: (state,action:PayloadAction<Array<object>>) =>{
    state.userTypes = action.payload;
   },
   setProfileImage: (state,action:PayloadAction<string>)=>{
    state.profileImage = action.payload;
   },
   setSelectedFiltertype: (state, action: PayloadAction<string>)=>{
    state.filterType = action.payload;
   },
   setChatSectionId: (state, action: PayloadAction<string>)=>{
    state.chatsectionId = action.payload
   },
   setUnregisteredUserGuide: (state, action: PayloadAction<Array<object>>)=>{
    state.unregisteredUserGuide = action.payload
   },
   setRegisteredUserGuide: (state, action: PayloadAction<Array<object>>)=>{
    state.registeredUserGuide = action.payload
   },
   setGender: (state, action: PayloadAction<Array<object>>)=>{
    state.gender = action.payload
   },
   setShowRegPop: (state, action: PayloadAction<boolean>)=>{
    state.showRegPop = action.payload
   },
   setHasClosedRegPop: (state, action: PayloadAction<boolean>)=>{
    state.hasClosedRegPop = action.payload
   }
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, setTags, setIsUserLoggedIn,setQiScore,setAgeRange,setsensitiveContents,setTopics,setUserTypes, setProfileImage, setSelectedFiltertype, setChatSectionId, setRegisteredUserGuide, setUnregisteredUserGuide, setGender, setShowRegPop, setHasClosedRegPop} = authSlice.actions

export default authSlice.reducer