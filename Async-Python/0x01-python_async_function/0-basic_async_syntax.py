#!/usr/bin/env python3
"""
Write an asynchronous coroutine that takes in an integer argument
 (max_delay, with a default value of 10) named wait_random that 
 waits for a random delay between 0 and max_delay (included and 
 float value) seconds and eventually returns it.
"""

import random
import asyncio


async def wait_random(max_delay: int = 10) -> float:
    """Returns a random number of seconds
    
    Keyword arguments:
    argument -- a random number
    Return: a random number
    """
    
    random_delay = random.uniform(0, max_delay)
    await asyncio.sleep(random_delay)

    return random_delay


if __name__ == "__main__":
    print(asyncio.run(wait_random()))
