import { User, Course, Enrollment } from '../types';

declare const google: {
  script?: {
    run?: {
      withSuccessHandler: (callback: (response: any) => void) => {
        withFailureHandler: (callback: (error: any) => void) => Record<string, Function>;
      };
    };
  };
};

export interface GASResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class GoogleSheetsService {
  private endpointUrl: string;

  constructor(endpointUrl?: string) {
    this.endpointUrl = endpointUrl || 'https://script.google.com/macros/s/AKfycbw2Qdx-p4RSEcbLPwbL8Zz2eUMMF085EexCyom1j1rvZa37bbX7q-dLXO53TTVmQy4E/exec';
  }

  /**
   * Configure or update the Web App Endpoint URL
   */
  public setEndpointUrl(url: string) {
    if (url) {
      this.endpointUrl = url;
    }
  }

  public getEndpointUrl(): string {
    return this.endpointUrl;
  }

  /**
   * Low-level generic call runner supporting both google.script.run and fetch API
   */
  public async callEndpoint<T = any>(action: string, payload: Record<string, any> = {}): Promise<GASResponse<T>> {
    // 1. Check if running inside Google Apps Script HTML Container
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      return new Promise((resolve) => {
        try {
          google.script.run
            ?.withSuccessHandler((result: any) => {
              if (typeof result === 'string') {
                try {
                  resolve(JSON.parse(result));
                } catch {
                  resolve({ success: true, data: result as any });
                }
              } else {
                resolve(result || { success: true });
              }
            })
            .withFailureHandler((err: any) => {
              resolve({
                success: false,
                error: err?.message || String(err) || 'Execution error in google.script.run'
              });
            })
            [action]?.(payload);
        } catch (err: any) {
          resolve({
            success: false,
            error: err?.message || 'Failed to call google.script.run action'
          });
        }
      });
    }

    // 2. Fallback to HTTP fetch request
    try {
      const requestBody = {
        action,
        ...payload
      };

      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // GAS Web Apps handle text/plain or application/json
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        return json;
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return { success: true, data: text as any };
      }
    } catch (error: any) {
      console.warn(`[GoogleSheetsService] Direct fetch failed or restricted by CORS: ${error?.message}. Attempting proxy/no-cors fallback.`);
      
      // Fallback for CORS no-cors write execution
      try {
        await fetch(this.endpointUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, ...payload })
        });
        return {
          success: true,
          message: 'Request sent successfully via async channel.'
        };
      } catch (fallbackError: any) {
        return {
          success: false,
          error: fallbackError?.message || 'Failed to reach Google Apps Script endpoint.'
        };
      }
    }
  }

  // ==========================================
  // USER CRUD OPERATIONS
  // ==========================================

  async getUsers(): Promise<GASResponse<User[]>> {
    return this.callEndpoint<User[]>('getUsers');
  }

  async getUserById(userId: string): Promise<GASResponse<User>> {
    return this.callEndpoint<User>('getUserById', { userId });
  }

  async createUser(userData: Partial<User>): Promise<GASResponse<User>> {
    return this.callEndpoint<User>('createUser', { user: userData });
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<GASResponse<User>> {
    return this.callEndpoint<User>('updateUser', { userId, user: userData });
  }

  async deleteUser(userId: string): Promise<GASResponse<boolean>> {
    return this.callEndpoint<boolean>('deleteUser', { userId });
  }

  // ==========================================
  // COURSE CRUD OPERATIONS
  // ==========================================

  async getCourses(): Promise<GASResponse<Course[]>> {
    return this.callEndpoint<Course[]>('getCourses');
  }

  async getCourseById(courseId: string): Promise<GASResponse<Course>> {
    return this.callEndpoint<Course>('getCourseById', { courseId });
  }

  async createCourse(courseData: Partial<Course>): Promise<GASResponse<Course>> {
    return this.callEndpoint<Course>('createCourse', { course: courseData });
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<GASResponse<Course>> {
    return this.callEndpoint<Course>('updateCourse', { courseId, course: courseData });
  }

  async deleteCourse(courseId: string): Promise<GASResponse<boolean>> {
    return this.callEndpoint<boolean>('deleteCourse', { courseId });
  }

  // ==========================================
  // PROGRESS / ENROLLMENT DATA UPDATES
  // ==========================================

  async getProgress(userId: string, courseId?: string): Promise<GASResponse<Enrollment[]>> {
    return this.callEndpoint<Enrollment[]>('getProgress', { userId, courseId });
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progress: number,
    status?: 'Active' | 'Completed' | 'Pending',
    finalScore?: number
  ): Promise<GASResponse<Enrollment>> {
    return this.callEndpoint<Enrollment>('updateProgress', {
      userId,
      courseId,
      progress,
      status,
      finalScore
    });
  }

  async createEnrollment(enrollmentData: Partial<Enrollment>): Promise<GASResponse<Enrollment>> {
    return this.callEndpoint<Enrollment>('createEnrollment', { enrollment: enrollmentData });
  }

  async syncAllData(data: {
    users?: Partial<User>[];
    courses?: Partial<Course>[];
    enrollments?: Partial<Enrollment>[];
  }): Promise<GASResponse> {
    return this.callEndpoint('syncAllData', data);
  }
}

export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
