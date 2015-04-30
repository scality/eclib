{
  "targets": [
    {
      "target_name": "node-eclib",
      "sources": [ "src/cpp/node-eclib.cpp" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}