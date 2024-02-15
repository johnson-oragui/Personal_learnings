import asyncio
from typing import List

task_wait_random = __import__('3-tasks').task_wait_random

async def task_wait_n(n: int, max_delay: int) -> List:
    tasks = [task_wait_random(max_delay) for _ in range(n)]

    results = await asyncio.gather(*tasks)

    return sorted(results)


if __name__ == '__main__':
    n = 5
    max_delay = 6
    print(asyncio.run(task_wait_n(n, max_delay)))
