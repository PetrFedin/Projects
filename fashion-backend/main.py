from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Fashion backend OK"}
