{
  "targets": [
    {
      "target_name": "node-eclib",
      "sources": [ "src/cpp/node-eclib.cpp"
      			,"src/cpp/libmain.cpp" 
      			,"src/cpp/asyncencode.cpp"
      			,"src/cpp/asyncdecode.cpp"
            ,"src/cpp/asyncreconstruction.cpp"
      			],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}