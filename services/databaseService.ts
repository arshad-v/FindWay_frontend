import { createClerkSupabaseClient } from './supabaseClient';
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
  clerk_user_id: string;
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
  // Create or update user profile using Clerk JWT authentication
  static async upsertUser(session: any, email: string, fullName?: string): Promise<DatabaseUser | null> {
    try {
      const client = createClerkSupabaseClient(session);
      
      // Debug: Log the token
      const token = await session?.getToken();
      console.log('Clerk token:', token ? 'Token exists' : 'No token');
      
      // Check if user exists
      const { data: existingUser, error: selectError } = await client
        .from('users')
        .select('*')
        .maybeSingle();

      console.log('Existing user check:', { existingUser, selectError });

      if (existingUser && !selectError) {
        // Update existing user
        const { data, error } = await client
          .from('users')
          .update({
            email: email,
            full_name: fullName,
            last_login: new Date().toISOString(),
            is_active: true
          })
          .eq('clerk_user_id', existingUser.clerk_user_id)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          return null;
        }
        return data;
      } else {
        // Insert new user (clerk_user_id will be auto-populated from JWT)
        const { data, error } = await client
          .from('users')
          .insert({
            email: email,
            full_name: fullName,
            last_login: new Date().toISOString(),
            is_active: true
          })
          .select()
          .single();

        console.log('Insert user result:', { data, error });

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

  // Save pretest data using Clerk JWT authentication
  static async savePreTestData(session: any, userData: UserData): Promise<PreTestData | null> {
    try {
      const client = createClerkSupabaseClient(session);
      
      // Convert age string to number if provided
      const ageNumber = userData.age ? parseInt(userData.age, 10) : null;

      // Check if pretest data already exists for this user
      const { data: existingData, error: existingError } = await client
        .from('user_pretest_data')
        .select('id, clerk_user_id')
        .maybeSingle();

      console.log('Existing pretest data check:', { existingData, existingError });

      let result;
      if (existingData && !existingError) {
        // Update existing record
        result = await client
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
          .eq('clerk_user_id', existingData.clerk_user_id)
          .select();
          
        // Handle array result from update
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          result.data = result.data[0];
        }
      } else {
        // Insert new record (clerk_user_id will be auto-populated from JWT)
        result = await client
          .from('user_pretest_data')
          .insert({
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
          .select();
          
        // Handle array result from insert
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          result.data = result.data[0];
        }
      }

      if (result.error) {
        console.error('Error saving pretest data:', result.error);
        return null;
      }

      if (!result.data) {
        console.error('No data returned from pretest save operation');
        return null;
      }

      console.log('Pretest data saved successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error in savePreTestData:', error);
      return null;
    }
  }

  // Get pretest data for authenticated user
  static async getPreTestData(session: any): Promise<PreTestData | null> {
    try {
      const client = createClerkSupabaseClient(session);
      
      const { data, error } = await client
        .from('user_pretest_data')
        .select('*')
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

  // Log user activity using Clerk JWT authentication
  static async logActivity(
    session: any,
    activityType: string, 
    activityData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    try {
      const client = createClerkSupabaseClient(session);
      
      const { error } = await client
        .from('user_activity_log')
        .insert({
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
