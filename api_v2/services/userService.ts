// src/services/UserService.ts

import { EnvWithKV } from 'api/schemas/kv'; // Ensure the import path is correct
import UserRepository from '../repository/userRepository'; // Ensure the import path is correct
import { userLogin } from 'api_v2/types/userLogin'; // Ensure the import path is correct
import Auth from '../../app/utils/auth/auth-service'; // Adjust the import path to where your Auth class is located

class UserService {
  private userRepository: UserRepository;

  constructor(env: EnvWithKV) {
    this.userRepository = new UserRepository(env);
  }

  async loginUser(userData: userLogin) {

    const user = await this.userRepository.findUserByUsername(userData.username);
    if (!user) {
      return { success: false, message: "User does not exist." };
    }
    
    // Use Auth class to verify the password
    const passwordMatch = await Auth.verifyPassword(userData.password, user.password);
    if (!passwordMatch) {
      return { success: false, message: "Incorrect password." };
    }
    
    // User authenticated successfully
    return { success: true, user, message: "User logged in successfully." };
  }

  async registerUser(userData: userLogin) {
    // Check if user already exists
    const existingUser = await this.userRepository.findUserByUsername(userData.username);
    if (existingUser) {
      return { success: false, message: "User already exists." };
    }
    
    // Use Auth class to hash the user's password before saving to the database
    userData.password = await Auth.hashPassword(userData.password);
    
    // Add the new user to the database
    const userId = await this.userRepository.addUser(userData);
    if (userId) {
      return { success: true, userId, message: "User registered successfully." };
    } else {
      return { success: false, message: "Failed to register user." };
    }
  }
}

export default UserService;
