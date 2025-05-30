import {RouteObject} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Profile from "./components/Profile/Profile.tsx";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler/OAuth2RedirectHandler.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import IdentityValidationPage from "./pages/IdentityValidationPage/IdentityValidationPage.tsx";
import CompleteProfilePage from "./pages/CompleteProfilePage/CompleteProfilePage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import {RegisterRequest} from "../../types/RegisterRequest.interface.ts";

// 1. Define a function to handle the registration
const handleActualRegistration = async (
  data: RegisterRequest,
): Promise<void> => {
  console.log("Registering user:", data);
  // Here you would typically make an API call to your backend
  // For example:
  // try {
  //   const response = await fetch('/api/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(errorData.message || 'Registration failed');
  //   }
  //   console.log('Registration successful!');
  //   // Handle successful registration (e.g., redirect to login)
  // } catch (error) {
  //   console.error('Registration error:', error);
  //   // Handle registration error (e.g., show an error message)
  //   throw error; // Re-throw to be caught by the RegisterPage if needed
  // }
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("User registration processed for:", data.email);
};

const authenticationRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage/>
  },
  {
    path: "oauth2/redirect",
    element: <OAuth2RedirectHandler/>
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute
        allowedRoles={[RoleEnum.ADMINISTRATOR, RoleEnum.APPLICANT, RoleEnum.ARCHIVES_MANAGER, RoleEnum.GENERAL_SECRETARY]}>
        <Profile/>
      </ProtectedRoute>
    )
  },
  {
    path: "validation",
    element: <IdentityValidationPage/>
  },
  {
    path: "register",
    element: <RegisterPage onRegister={handleActualRegistration}/>
  },
  {
    path: "complete-profile",
    element: <CompleteProfilePage/>
  },
];

export default authenticationRoutes;

