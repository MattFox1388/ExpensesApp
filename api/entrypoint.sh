#!/bin/bash
python3 m flask --help
python3 -m flask initdb
python3 -m flask run --host=0.0.0.0 -p 5001