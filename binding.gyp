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
      'variables': {
        'LIBDIR': '<(module_root_dir)/libs/lib',
      },
      "conditions": [
        ['OS == "mac"', {
          'xcode_settings': {
            'GCC_OPTIMIZATION_LEVEL': '3',  # -O3
            'OTHER_CFLAGS': [
              '-fno-operator-names',
            ],
          },
          "libraries": [ "<(LIBDIR)/liberasurecode.dylib" ]
        }],
        ['OS == "linux"', {
          'cflags': [
            '-O3',
            '-fno-operator-names',
          ],
          'ldflags': [
            '-Wl,-rpath -Wl,<(LIBDIR)',
          ],
          "libraries": [ "<(LIBDIR)/liberasurecode.so" ]
        }],
      ],
    }
  ]
}
