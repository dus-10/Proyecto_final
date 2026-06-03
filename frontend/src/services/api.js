const API = "http://127.0.0.1:8000"

export async function login(correo, password) {
  const formData = new URLSearchParams()

  formData.append("username", correo)
  formData.append("password", password)

  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })

  return response.json()
}