import asyncio

wait_random = __import__('0-basic_async_syntax').wait_random

async def wait_n(n: int, max_delay: int):
    tasks = [wait_random(max_delay) for _ in range(n)]

    results = await asyncio.gather(*tasks)

    return sorted(results)


if __name__ == '__main__':
    print(asyncio.run(wait_n(5, 5)))
    print(asyncio.run(wait_n(10, 7)))
    print(asyncio.run(wait_n(10, 0)))
