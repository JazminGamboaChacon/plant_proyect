import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";

export function useAuth(){

	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: '675847252423-qt776dirq78ipi734a7sa1g21ljn78mg.apps.googleusercontent.com',
  });
  
  useEffect(()=>{
	  if(response){
		  if(response.type === 'success'){
			  console.log(response.authentication)
		  }else{
			  console.log("Error al autenticar con google")
		  }
	  }
  },[response])

	const authGoogle = () =>{
		
		promptAsync().catch((e)=>{
			console.error("Error al iniciar la sesión : ", e)
		})	
	}
	
	return {authGoogle}
}