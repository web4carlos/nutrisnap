# Architecture Decision Log

## ADR-001: FastAPI

FastAPI is used for typed API development, automatic OpenAPI documentation, and asynchronous growth.

## ADR-002: MySQL

MySQL 8 is the primary relational database.

## ADR-003: SQLAlchemy and Alembic

SQLAlchemy 2.x provides ORM and database access. Alembic manages schema evolution.

## ADR-004: Vertical slices

Features will be delivered end to end rather than creating all domain tables in advance.
