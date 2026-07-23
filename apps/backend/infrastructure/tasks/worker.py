# ============================================================
# NETRA AI — Background Task Manager
# ============================================================
import structlog
from typing import Callable, Any
from fastapi import BackgroundTasks

log = structlog.get_logger()

class TaskManager:
    """
    Abstractions for background processing.
    Currently maps to FastAPI BackgroundTasks for simple in-process tasks.
    Can be swapped to Celery or Catalyst Cron/Circuits for distributed tasks.
    """
    def __init__(self):
        pass

    def enqueue(self, background_tasks: BackgroundTasks, func: Callable, *args: Any, **kwargs: Any):
        """
        Enqueue a function to run in the background after the HTTP response.
        """
        log.debug("task_enqueued", func=func.__name__)
        background_tasks.add_task(func, *args, **kwargs)

task_manager = TaskManager()
