
import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { RiskSettings, TradeHistory } from '../models/trading.model';

// Define the structure of the user profile in Supabase
export interface Profile extends RiskSettings {
  id: string; // user_id
  full_name: string;
  account_balance: number;
}


@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.supabase.auth.onAuthStateChange((event, session) => {
        const user = session?.user ?? null;
        this.currentUser.set(user);
    });
  }
  
  // --- Auth ---

  getSession() {
    return this.supabase.auth.getSession();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string, fullName: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  // --- Database ---

  async getProfile(user: User): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116: row not found
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }
  
  async updateProfile(user: User, updates: Partial<Omit<Profile, 'id' | 'full_name'>>) {
      const { error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
      }
  }

  async getTradeHistory(user: User): Promise<TradeHistory[]> {
    const { data, error } = await this.supabase
      .from('trade_history')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching trade history:', error);
      return [];
    }
    return data as TradeHistory[];
  }

  async addTradeToHistory(user: User, trade: Omit<TradeHistory, 'id'>): Promise<TradeHistory | null> {
     const tradeData = {
      ...trade,
      user_id: user.id
    };
    
    const { data, error } = await this.supabase
      .from('trade_history')
      .insert(tradeData)
      .select()
      .single();

    if (error) {
      console.error('Error adding trade to history:', error);
      return null;
    }
    return data as TradeHistory;
  }
}
