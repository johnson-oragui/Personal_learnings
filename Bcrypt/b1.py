#!/usr/bin/env python3

import bcrypt

passw = 'password'.encode()

salt = bcrypt.gensalt()

hashed = bcrypt.hashpw(passw, salt)

print(hashed)

# print(bcrypt.checkpw(passw, hashed))

if bcrypt.checkpw(passw, hashed):
    print('a match')
else:
    print('not a match')
