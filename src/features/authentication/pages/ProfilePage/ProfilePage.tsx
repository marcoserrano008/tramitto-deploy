import UserProfile from "./components/UserProfile/UserProfile.tsx";

const mockUser = {
  id: 6,
  email: "juan.perez@example.com",
  firstName: "Juan",
  lastName: "Pérez",
  imageUrl: "/placeholder.svg?height=120&width=120",
  role: "USER",
  secondLastName: "García",
  avatarId: "avatar_123456",
  identificationNumber: "12345678",
  isIdentityValidated: true,
  sisCode: 987654321,
  birthdate: "1990-05-15",
}

export default function ProfilePage() {
  const handleUpdate = async (userId: number, data: any) => {
    console.log(`Updating user ${userId}:`, data)

    // Simulate API call to http://localhost:3000/api/v1/user/update/6
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) {
          console.log("User updated successfully!")
          alert("¡Perfil actualizado exitosamente!")
          resolve()
        } else {
          reject(new Error("Error updating user"))
        }
      }, 2000)
    })
  }

  const handleUploadImage = async (file: File) => {
    console.log("Uploading image:", file.name)

    // Simulate API call to http://localhost:3000/api/v1/document/upload
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) {
          const mockResponse = {
            id: `avatar_${Date.now()}`,
            filename: file.name,
            fileDownloadUri: `http://localhost:3000/api/v1/document/download/${file.name}`,
            fileType: file.type,
            size: file.size,
          }
          console.log("Image uploaded:", mockResponse)
          resolve(mockResponse)
        } else {
          reject(new Error("Error uploading image"))
        }
      }, 1500)
    })
  }

  return <UserProfile user={mockUser} onUpdate={handleUpdate} onUploadImage={handleUploadImage} />
}
