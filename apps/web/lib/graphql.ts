export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4100/graphql";

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  includeCredentials?: boolean;
}

export async function graphQLFetch<T>({ query, variables, includeCredentials = true }: GraphQLRequest): Promise<T> {
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: includeCredentials ? "include" : "omit",
    body: JSON.stringify({ query, variables })
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    const message = payload.errors?.[0]?.message ?? response.statusText;
    throw new Error(message);
  }

  return payload.data as T;
}
