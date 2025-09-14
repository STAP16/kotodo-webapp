import typing
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import ForeignKey, String, BigInteger
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import (DeclarativeBase,
                            Mapped,
                            mapped_column,
                            relationship)



class Base(DeclarativeBase):
    pass



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True, nullable=False)
    user_name = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)

    # связь "один ко многим"
    tasks = relationship("UsersTasks", back_populates="user", cascade="all, delete-orphan")


class UsersTasks(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    task_description = Column(String, nullable=False)
    telegram_id = Column(Integer, ForeignKey("users.telegram_id"), nullable=False)

    # связь с юзером
    user = relationship("User", back_populates="tasks")

class UsersDays(Base):
    __tablename__ = "days"

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    telegram_id = Column(Integer, ForeignKey("users.telegram_id"), nullable=False)
    day = Column(Integer, nullable=False)          
    month = Column(Integer, nullable=False)         
    year = Column(Integer, nullable=False)          

