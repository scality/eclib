{
  "targets": [
    {
      "target_name": "node-eclib",
      "sources": [
        "src/cpp/node-eclib.cpp",
        "src/cpp/libmain.cpp",
        "src/cpp/asyncencode.cpp",
        "src/cpp/asyncdecode.cpp",
        "src/cpp/asyncreconstruction.cpp",
        "src/cpp/libutil.cpp"
      ],
      "include_dirs" : [
        "/usr/local/include/liberasurecode",
        "<!(node -e \"require('nan')\")"
      ],
      "conditions": [
        ['OS=="mac"', {
          "libraries": [ "/usr/local/lib/liberasurecode.dylib" ]
        }],
        ['OS=="linux"', {
          "libraries": [
            "$(shell out=`ldconfig -p | grep liberasurecode.so` && ldconfig -p | grep liberasurecode.so | rev | cut -d' ' -f1 | rev | sed 's/[^\/]\+$$//g' | sed -n '1p' | tr -d '\\n' && echo 'liberasurecode.so' || echo /usr/local/lib/liberasurecode.so)"
          ]
        }]
      ]
    }
  ]
}
