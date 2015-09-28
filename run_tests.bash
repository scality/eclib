#!/bin/bash

for t in `ls test`; do
  node test/$t
  if [ $? != 0 ]; then
    exit 1
  fi
done
