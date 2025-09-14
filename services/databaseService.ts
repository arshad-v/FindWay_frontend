import { supabase } from './supabaseClient';
import { UserData } from '../types';

export interface DatabaseUser {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface PreTestData {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  age?: number;
  gender?: string;
  education: string;
  degree?: string;
  department?: string;
  skills?: string;
  area_of_interest?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  // Create or update user profile
  static async upsertUser(clerkUserId: string, email: string, fullName?: string): Promise<DatabaseUser | null> {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            email: email,
            full_name: fullName,
            last_login: new Date().toISOString(),
            is_active: true
          })
          .eq('clerk_user_id', clerkUserId)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          return null;
        }
        return data;
      } else {
        // Insert new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            clerk_user_id: clerkUserId,
            email: email,
            full_name: fullName,
            last_login: new Date().toISOString(),
            is_active: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting user:', error);
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      return null;
    }
  }

  // Get user by Clerk ID
  static async getUserByClerkId(clerkUserId: string): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (error) {
        console.error('Error getting user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserByClerkId:', error);
      return null;
    }
  }

  // Save pretest data
  static async savePreTestData(clerkUserId: string, userData: UserData): Promise<PreTestData | null> {
    try {
      // First, get the user's database ID
      const user = await this.getUserByClerkId(clerkUserId);
      if (!user) {
        console.error('User not found in database');
        return null;
      }

      // Convert age string to number if provided
      const ageNumber = userData.age ? parseInt(userData.age, 10) : null;

      // Check if pretest data already exists
      const { data: existingData } = await supabase
        .from('user_pretest_data')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('user_pretest_data')
          .update({
            name: userData.name,
            phone: userData.phone || null,
            age: ageNumber,
            gender: userData.gender || null,
            education: userData.education,
            degree: userData.degree || null,
            department: userData.department || null,
            skills: userData.skills || null,
            area_of_interest: userData.areaOfInterest || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('user_pretest_data')
          .insert({
            user_id: user.id,
            name: userData.name,
            phone: userData.phone || null,
            age: ageNumber,
            gender: userData.gender || null,
            education: userData.education,
            degree: userData.degree || null,
            department: userData.department || null,
            skills: userData.skills || null,
            area_of_interest: userData.areaOfInterest || null
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving pretest data:', result.error);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('Error in savePreTestData:', error);
      return null;
    }
  }

  // Get pretest data for a user
  static async getPreTestData(clerkUserId: string): Promise<PreTestData | null> {
    try {
      const user = await this.getUserByClerkId(clerkUserId);
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_pretest_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error getting pretest data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPreTestData:', error);
      return null;
    }
  }

  // Log user activity
  static async logActivity(
    clerkUserId: string, 
    activityType: string, 
    activityData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    try {
      const user = await this.getUserByClerkId(clerkUserId);
      if (!user) {
        return false;
      }

      const { error } = await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData || null,
          ip_address: ipAddress || null,
          user_agent: userAgent || null
        });

      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in logActivity:', error);
      return false;
    }
  }
}
