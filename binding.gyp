{
  "targets": [
    {
      "target_name": "node-eclib",
      "sources": [ "src/cpp/node-eclib.cpp","src/cpp/libmain.cpp" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}