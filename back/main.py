from fastapi import FastAPI, HTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from tables import Base, UsersTasks
from schemas import TaskCreate, TaskResponse, UsersDaysCreate, UsersDaysResponse
from tables import User, UsersDays
from fastapi.middleware.cors import CORSMiddleware
from typing import List


DATABASE_URL = "sqlite+aiosqlite:///./test.db"  

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = AsyncSession(engine)

# Создаем фабрику сессий для взаимодействия с базой данных

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # список разрешённых доменов
    allow_credentials=True,       # разрешить отправку cookie
    allow_methods=["*"],          # разрешить все HTTP методы (GET, POST и т.д.)
    allow_headers=["*"],          # разрешить все заголовки
)



@app.on_event("startup")
async def on_startup():
    """Создаём таблицы при старте приложения"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)



@app.get("/get_or_create_user")
async def get_or_create_user(telegram_id: int, user_name: str, first_name: str, last_name: str):
    async with async_session as session:
        # Проверяем существующего пользователя
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            # Если пользователь есть — возвращаем 200 с данными
            return {"status": 200, "user": {
                "telegram_id": existing_user.telegram_id,
                "user_name": existing_user.user_name,
                "first_name": existing_user.first_name,
                "last_name": existing_user.last_name
            }}
        else:
            # Если пользователя нет — создаём
            new_user = User(
                telegram_id=telegram_id,
                user_name=user_name,
                first_name=first_name,
                last_name=last_name
            )
        
            session.add(new_user)
            await session.commit()
            return {"status": 201, "user": {
                "telegram_id": telegram_id,
                "user_name": user_name,
                "first_name": first_name,
                "last_name": last_name
            }}




@app.post("/create_task", response_model=TaskResponse)
async def create_task(task_data: TaskCreate):
    async with async_session as session:
        # ищем пользователя по telegram_id
        result = await session.execute(select(User).where(User.telegram_id == task_data.telegram_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        # создаём задачу
        new_task_for_user = UsersTasks(
            telegram_id=task_data.telegram_id,
            task_description=task_data.description,
        )
        session.add(new_task_for_user)
        await session.commit()
        await session.refresh(new_task_for_user)  # подтягиваем id после commit

        # возвращаем фронту объект задачи
        return TaskResponse(
            id=new_task_for_user.id,
            telegram_id=new_task_for_user.telegram_id,
            description=new_task_for_user.task_description
        )


@app.get("/tasks/{telegram_id}")
async def get_tasks(telegram_id: int):
    async with async_session as session:
        result = await session.execute(
            select(UsersTasks).where(UsersTasks.telegram_id == telegram_id)
        )
        tasks = result.scalars().all()
        
        return {"tasks": [{"id": t.id, "description": t.task_description} for t in tasks]}
    
@app.delete("/delete_task/{task_id}")
async def delete_task(task_id: int):
    async with async_session as session:
        result = await session.execute(select(UsersTasks).where(UsersTasks.id == task_id))
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(status_code=404, detail="Задача не найдена")

        await session.delete(task)
        await session.commit()
        return {"message": "Задача удалена"}
    

@app.post("/days/", response_model=UsersDaysResponse)
async def create_day(day: UsersDaysCreate):
    async with async_session as session:
        new_day = UsersDays(
            telegram_id=day.telegramId,
            day=day.day,
            month=day.currentMonth,
            year=day.currentYear,
            description=day.description
        )

        session.add(new_day)
        await session.commit()
        await session.refresh(new_day)

    return UsersDaysResponse(
        id=new_day.id,
        telegramId=new_day.telegram_id,
        day=new_day.day,
        currentMonth=new_day.month,
        currentYear=new_day.year,
        description=new_day.description
    )

@app.get("/days/{telegram_id}", response_model=List[UsersDaysResponse])
async def get_user_days(telegram_id: int):
    # делаем асинхронный запрос к базе
    async with async_session as session:
        result = await session.execute(select(UsersDays).where(UsersDays.telegram_id == telegram_id))
        tasks = result.scalars().all()

        return [
            UsersDaysResponse(
                id=task.id,
                telegramId=task.telegram_id,
                day=task.day,
                currentMonth=task.month,
                currentYear=task.year,
                description=task.description
            )
            for task in tasks
        ]

@app.delete("/days/{day_id}")
async def delete_day(day_id):
    async with async_session as session:
        result = await session.execute(select(UsersDays).where(UsersDays.id == day_id))
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(status_code=404, detail="Задача не найдена")

        await session.delete(task)
        await session.commit()
        return {"message": "Задача удалена"}