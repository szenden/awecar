'use server'
 
 
import { cookies } from 'next/headers';
import Nav from './_components/layout/Nav'
import NavDialog from './_components/layout/NavDialog'
import ToastMessages from '@/_components/ToastMessages'  
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
    FullName?: string; 
  }
export default async function Layout({ children }: { children: React.ReactNode }) {
    
    const jwt = (await cookies()).get('jwt')?.value;
    
    if(!jwt) {
        redirect('/home/logout'); 
    }
    
    // Decode the JWT to get the claims
    let decodedToken: CustomJwtPayload;
    let fullName = '';
    
    try {
        decodedToken = jwtDecode<CustomJwtPayload>(jwt);
        fullName = decodedToken.FullName || '';
    } catch (error) {
        console.error('JWT decode error:', error);
        // If JWT is invalid or in wrong format, redirect to logout
        redirect('/home/logout');
    }
    
    // If there's no full name in the token, you might want to redirect or handle it
    if(!fullName) {
        redirect('/home/logout');
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/profilepicture/${jwt}`
    return (
        <>
            {/* <Timeout></Timeout> */}
            <ToastMessages></ToastMessages>
            <div>
                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-62 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                      <Nav  imageUrl={imageUrl} fullName={fullName}  onSmallScreen={false}></Nav>   
                    </div>
                </div>
                 <NavDialog imageUrl={imageUrl} fullName={fullName} ></NavDialog>   
                {children}
              
              </div>
        </>
    )
}
