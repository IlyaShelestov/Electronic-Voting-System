export async function fetchWithCache<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "force-cache",
    });

    console.log(response)

    if (!response.ok) {
      console.error(`Error fetching ${url}:`, response.statusText);
      throw new Error(`Failed to fetch from ${url}: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
