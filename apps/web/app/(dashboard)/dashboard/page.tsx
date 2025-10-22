import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATEWAY_URL } from "../../../../lib/graphql";

interface FeedItem {
  id: string;
  title: string;
  summary: string;
}

interface FeedResponse {
  feed: FeedItem[];
}

async function fetchFeed(): Promise<FeedResponse | null> {
  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {})
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query Feed {
          feed {
            id
            title
            summary
          }
        }
      `
    }),
    cache: "no-store"
  });

  const payload = await response.json();

  if (payload.errors) {
    const unauthenticated = payload.errors.find((error: any) => error.extensions?.code === "UNAUTHENTICATED");
    if (unauthenticated) {
      return null;
    }
    throw new Error(payload.errors[0]?.message ?? "Unexpected gateway error");
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return payload.data as FeedResponse;
}

export default async function DashboardPage() {
  const feed = await fetchFeed();

  if (!feed) {
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Dashboard</p>
        <h1 className="text-3xl font-bold text-slate-900">Your Community Feed</h1>
        <p className="text-slate-600">
          Explore highlights from the creators and circles you follow. This data is mocked until the feed service is available.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {feed.feed.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
