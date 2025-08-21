import 'server-only'
import { cookies } from 'next/headers' 
import { JWTPayload, SignJWT, jwtVerify } from 'jose' 

const secretKey = process.env.SESSION_SECRET
const sessionTimeoutInSecondsString = process.env.NEXT_PUBLIC_SESSION_TIMEOUT;
 
if(!secretKey) throw new Error('SESSION_SECRET env not set');

const encodedKey = new TextEncoder().encode(secretKey)

interface SessionPayload extends JWTPayload{
  apiRootJwt:string
}

 async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
 async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
    console.log(error)
  }
}
export async function createSession(rootJwt: string,publicJwt: string) {
    
  if(!sessionTimeoutInSecondsString) throw new Error('NEXT_PUBLIC_SESSION_TIMEOUT env not set');
 
  const expiresAt = new Date(Date.now());   
  expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(sessionTimeoutInSecondsString)); 
  const session = await encrypt({ apiRootJwt:rootJwt, expiresAt })
  const cookieStore = await cookies() 
  cookieStore.set('session', session, {
    httpOnly: true, //jwt not accessible by browser
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  //jwt for public side resources
  cookieStore.set('jwt',  publicJwt, {
    httpOnly: false,
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
   //browser app has to know when session started so it can call extend session before api jwt times out
  cookieStore.set('session_timestamp',  Date.now().toString(), {
    httpOnly: false,
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  cookieStore.delete('jwt')
  cookieStore.delete('session_timestamp')
}
export async function getJwt() { 
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session)
 
  if (!session || !payload || !payload.apiRootJwt) {
    return null
  }
  return payload.apiRootJwt;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  
  if (!session) {
    return null
  }

  const payload = await decrypt(session)
  
  if (!payload || !payload.apiRootJwt) {
    return null
  }
  
  return payload.apiRootJwt;
}

export async function verifySession() {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  try {
    // For development, decode the session to check if it's valid
    const parts = session.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    // Basic validation - in production you'd verify the signature
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if session has expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload
  } catch (error) {
    console.log('Session verification failed:', error)
    return null
  }
}
