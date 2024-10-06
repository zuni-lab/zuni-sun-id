export class BaseApi {
  protected static async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }

  protected static async post<T>(url: string, payload: any): Promise<T> {
    return this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  protected static async get<T>(url: string): Promise<T> {
    return this.fetch(url);
  }
}
