import asyncio


wait_random = __import__('0-basic_async_syntax').wait_random


def task_wait_random(max_delay):
    return asyncio.ensure_future(wait_random(max_delay))


async def test(max_delay: int) -> float:
    task = task_wait_random(max_delay)
    await task
    print(task.__class__)
    return 0.1

if __name__ == "__main__":

    asyncio.run(test(5))
