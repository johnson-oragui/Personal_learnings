import asyncio
import time


wait_n = __import__('1-concurrent_coroutines').wait_n


def measure_time(n, max_delay):
    start = time.perf_counter()
    asyncio.run(wait_n(n, max_delay))
    end = time.perf_counter()

    return ((end - start) / n)


if __name__ == '__main__':
    n = 5
    max_delay = 9

    print(measure_time(n, max_delay))
