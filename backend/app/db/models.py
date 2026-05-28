from __future__ import annotations

from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class CandidateModel(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    role: Mapped[str] = mapped_column(String(128))
    location: Mapped[str] = mapped_column(String(128))
    experience_years: Mapped[int] = mapped_column(Integer)
    summary: Mapped[str] = mapped_column(Text)
    leadership: Mapped[float] = mapped_column(Float)
    learning_velocity: Mapped[float] = mapped_column(Float)
    stability: Mapped[float] = mapped_column(Float)
    collaboration: Mapped[float] = mapped_column(Float)


class JobModel(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(256))
    description: Mapped[str] = mapped_column(Text)
