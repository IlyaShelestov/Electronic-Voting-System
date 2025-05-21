export async function fetchWithCache(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "force-cache",
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Error fetching ${url}:`, response.statusText);
      throw new Error(`Failed to fetch from ${url}: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
