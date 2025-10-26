export interface UserRepository {
  findByEmail(email: string): Promise<any | null>;
  save(user: any): Promise<any>;
}


