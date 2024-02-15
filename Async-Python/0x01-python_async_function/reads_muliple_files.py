import asyncio
import time


start = time.perf_counter()

async def read_file(file_name):
    print(f"reading {file_name}")

    try:
        with open(file_name, "r") as file:
            content = await asyncio.to_thread(file.read)
            return file_name, content
    # catch the error if file not exist
    except FileNotFoundError:
        return file_name, None

async def main(files):
    # read the files one at a time and append them to a list of task
    tasks = [read_file(f) for f in files]

    # wait for all tasks to complete
    results = await asyncio.gather(*tasks)

    for file_name, content in results:
        if content:
            print(f"content of {file_name}: \n{content}")
        else:
            print(f"{file_name} not found.")

end = time.perf_counter()


if __name__ == "__main__":
    file_list = ["file1.txt", "file2.txt", "file3.txt", "file4.txt"]

    asyncio.run(main(file_list))

    print(f"time taken: {end - start}s")
