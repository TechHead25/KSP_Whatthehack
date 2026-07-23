import asyncio
import structlog
from functools import wraps

log = structlog.get_logger()

def with_retry(max_retries: int = 3, delay_seconds: float = 1.0):
    """
    Automatic retry decorator for transient network failures.
    Ideal for external ML endpoints or Neo4j queries.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        log.error("retry_exhausted", function=func.__name__, error=str(e))
                        raise
                    log.warning("transient_failure_retrying", function=func.__name__, retry=retries)
                    await asyncio.sleep(delay_seconds)
        return wrapper
    return decorator

class CircuitBreaker:
    """
    Fails fast if an external dependency goes down to prevent cascading timeouts.
    """
    def __init__(self, failure_threshold: int = 5):
        self.failure_threshold = failure_threshold
        self.failures = 0
        self.state = "CLOSED" # CLOSED, OPEN, HALF_OPEN

    def record_failure(self):
        self.failures += 1
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"
            log.error("circuit_breaker_opened")

    def reset(self):
        self.failures = 0
        self.state = "CLOSED"
        
circuit_breaker = CircuitBreaker()
