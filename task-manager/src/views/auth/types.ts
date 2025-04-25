export interface UserData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
}

export interface Credentials {
  username: string
  password: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
} 