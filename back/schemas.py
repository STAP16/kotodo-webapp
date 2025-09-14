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

# Модель для запроса (создание новой задачи)
class UsersDaysCreate(BaseModel):
    telegramId: int
    currentMonth: int
    currentYear: int
    day: int
    description: str

# Модель для ответа (вывод задачи)
class UsersDaysResponse(BaseModel):
    id: int 
    telegramId: int
    currentMonth: int
    currentYear: int
    day: int
    description: str
