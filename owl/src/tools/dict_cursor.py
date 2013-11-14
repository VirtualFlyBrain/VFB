#!/usr/bin/env jython

def dict_cursor(cursor):
    description = [x[0] for x in cursor.description]
    for row in cursor:
        yield dict(zip(description, row))  # Not sure that yield is the best option here, as produces a 
