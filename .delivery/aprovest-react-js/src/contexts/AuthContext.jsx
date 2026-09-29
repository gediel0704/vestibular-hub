import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
const AuthContext = createContext(null)
export function AuthProvider({ children }) { const [user,setUser]=useState(null); const [loading,setLoading]=useState(true); useEffect(()=>{let active=true; supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user??null);setLoading(false)}}); const {data}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user??null);setLoading(false)}); return()=>{active=false;data.subscription.unsubscribe()}},[]); const value=useMemo(()=>({user,loading}),[user,loading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider> }
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider ausente');return value}
