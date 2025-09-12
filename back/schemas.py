from pydantic import BaseModel 

class TelegramUser(BaseModel):
    telegram_id: int  # id из Telegram
    user_name: str
    first_name: str | None = None
    last_name: str | None = None

class TaskCreate(BaseModel):
    telegram_id: int
    description: str

# Pydantic модель для ответа
class TaskResponse(BaseModel):
    id: int
    telegram_id: int
    description: str
