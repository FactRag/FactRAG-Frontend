// src/services/auth.ts

export const socialAuth = {
  async googleLogin() {
    const response = await fetch('/api/auth/google/login/')
    const data = await response.json()
    window.location.href = data.auth_url
  },

  async orcidLogin() {
    const response = await fetch('/api/auth/orcid/login/')
    const data = await response.json()
    window.location.href = data.auth_url
  },


  async handleCallback(tokens: string) {
    try {
      const base64Url = tokens.split('.')[1]; // Extract the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64Url to Base64
      const decodedTokens = JSON.parse(atob(base64));
      localStorage.setItem('access_token', decodedTokens.access)
      localStorage.setItem('refresh_token', decodedTokens.refresh)
      return true
    } catch (error) {
      console.error('Failed to handle auth callback:', error)
      return false
    }
  }
}