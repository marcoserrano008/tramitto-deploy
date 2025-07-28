import UserProfile from "./components/UserProfile/UserProfile.tsx";
import {useAuth} from "../../../../context/AuthContext.tsx";
import {UpdateUserRequest} from "../../../../types/UpdateUserRequest.ts";
import {updateUserService} from "../../../../services/UpdateUserService.http.service.ts";
import {uploadFileService} from "../../../../services/UploadFile.http.service.ts";

export default function ProfilePage() {

  const {user, refreshUser} = useAuth()

  const handleUpdate = async (userId: number, data: UpdateUserRequest) => {
    try {
      console.log(`Updating user ${userId}:`, data)
      await updateUserService.update(userId, data)

      await refreshUser()

      console.log("User updated successfully!")
      alert("¡Perfil actualizado exitosamente!")
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error al actualizar el perfil")
      throw error
    }
  }

  const handleUploadImage = async (file: File) => {
    try {
      console.log("Uploading image:", file.name)
      const response = await uploadFileService.upload(file, "Profile picture")
      console.log("Image uploaded:", response)
      return response
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen")
      throw error
    }
  }

  return <UserProfile user={user!} onUpdate={handleUpdate} onUploadImage={handleUploadImage}/>
}
