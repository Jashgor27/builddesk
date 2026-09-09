from fastapi import FastAPI

from app.core.supabase import supabase


app = FastAPI(
    title="BuildDesk API",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/health/supabase")
async def supabase_health_check():
    response = supabase.table("projects").select("id").limit(1).execute()

    return {
        "status": "ok",
        "database": "connected",
        "table": "projects",
        "rows_checked": len(response.data),
    }