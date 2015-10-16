{
  "targets": [
    {
      "target_name": "node-eclib",
      "type": 'loadable_module',
      "product_extension": 'node',
      "sources": [
        "src/cpp/node-eclib.cpp",
        "src/cpp/libmain.cpp",
        "src/cpp/asyncencode.cpp",
        "src/cpp/asyncdecode.cpp",
        "src/cpp/asyncreconstruction.cpp",
        "src/cpp/libutil.cpp"
      ],
      "include_dirs" : [
        "<(module_root_dir)/libs/include",
        "<!(node -e \"require('nan')\")"
      ],
      "conditions": [
        ['OS=="mac"', {
          "libraries": [ "<(module_root_dir)/libs/lib/liberasurecode.dylib" ]
        }],
        ['OS=="linux"', {
          "libraries": [ "<(module_root_dir)/libs/lib/liberasurecode.so" ]
        }]
      ]
    }
  ]
}
