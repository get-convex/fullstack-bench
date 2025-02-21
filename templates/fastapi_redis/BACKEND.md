# Backend implementation

Use Tanstack Query, FastAPI, and Redis for implementing the backend.

Read the guidelines for writing apps with these tools in the cursor rules.

Please design how you'd like to store the application's data in Redis and
then the API endpoints for how to read, write, and subscribe to this data.

Then, connect the API endpoints to the existing app's UI. Do NOT
refactor or modify the existing UI code in `components/` unless absolutely
necessary. You MUST keep all visual styling the same.

Make sure all changes are reflected immediately in the UI without a refresh,
even if they've happened in another browser.

The existing app is currently set up using in-memory state with example data in
`lib/exampleData.ts`. Start by DELETING this file and then reimplementing its
behavior using the backend.

Since the Redis database is empty (other than auth), make sure the
app handles empty states gracefully. Keep the types in `lib/types.ts` the same.

On the server, ALWAYS use the async Redis client already instantiated at `server/db.py`.

Within the server, do NOT import files with relative syntax. Use an absolute import
path instead. For example importing `server/db.py` from `server/main.py` looks like:

```py
from db import redis_client
```

User authentication is already fully set up in `server/auth.py`, `server/main.py`,
and `lib/BackendContext.tsx`. Within the app use the `lib/BackendContext:useLoggedInUser`
hook to get the current user. Do NOT modify any of this code.

Use the `backendFetch` function in `lib/BackendContext.tsx` to talk to the server. Use
Tanstack Query's `useQuery` hook for state management, and its context is already
set up within `lib/BackendContext.tsx`. Do NOT modify this code.

Do NOT use WebSockets for implementing live updating. Instead use SSE events on the server,
using a pattern like the following:

```py
@app.get("/sse_streaming_example")
async def sse_streaming_example(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
):
    async def event_generator():
        for i in range(10):
            if await request.is_disconnected():
                break
            await asyncio.sleep(1)
            yield f"data: {i}\n\n"
    return EventSourceResponse(
        event_generator(),
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
```

Then, on the client ALWAYS use the `subscribeSSE` function defined in `lib/BackendContext.tsx`
to subscribe to SSE events.

Use Next client components for the UI: do not bother with server rendering.

Run `bun typecheck` from the app's root directory to check for type errors
across all files. Be sure to run this command and fix all errors before considering
yourself done.

This app should scale to multiple FastAPI servers talking to a shared Redis instance.
Our workload will also be read heavy, so do NOT implement live updating using polling,
either between the client and the server or between the server and Redis.

Assume that the FastAPI server, the NextJS server, and the Redis instance are running
in the background, automatically reload code changes, and are fully configured.
