const githubProgressUrl =
  'https://raw.githubusercontent.com/oguzhanozfe/steam-discovery/main/app/data/progress-tracker.json';
const maxProgressDataBytes = 4 * 1024 * 1024;

const baseResponseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};
const errorResponseHeaders = {
  ...baseResponseHeaders,
  'Cache-Control': 'private, no-store, max-age=0',
};
const successResponseHeaders = {
  ...baseResponseHeaders,
  'Cache-Control': 'private, no-store, max-age=0',
};

function errorResponse(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: errorResponseHeaders },
  );
}

export async function GET() {
  try {
    const upstream = await fetch(githubProgressUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'steam-discovery-progress',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!upstream.ok) {
      console.error('GitHub progress request failed.', {
        status: upstream.status,
        requestId: upstream.headers.get('x-github-request-id'),
      });
      return errorResponse('Progress data source is unavailable.', 502);
    }

    const declaredLength = Number(upstream.headers.get('content-length'));
    if (
      Number.isFinite(declaredLength) &&
      declaredLength > maxProgressDataBytes
    ) {
      return errorResponse('Progress data source is too large.', 502);
    }

    const payload = await upstream.arrayBuffer();
    if (payload.byteLength > maxProgressDataBytes) {
      return errorResponse('Progress data source is too large.', 502);
    }

    const text = new TextDecoder().decode(payload);
    const parsed: unknown = JSON.parse(text);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return errorResponse('Progress data source returned invalid JSON.', 502);
    }

    return new Response(text, { headers: successResponseHeaders });
  } catch (error) {
    console.error(
      'GitHub progress request failed.',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return errorResponse('Progress data source is unavailable.', 502);
  }
}
