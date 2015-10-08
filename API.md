# eclib API documentation

The API is exposed in `node-eclib.js`.

```node
init(callback: ());
```
Creates a new instance.

```node
destroy(callback: ());
```
Destroy current instance.

```node
encode(o_data: Buffer, callback: ());
```

```node
encodev(n_buf, buf_array, total_size, callback: ());
```

```node
decode(d_data, n_frags, frag_len, force_metadata_check, callback: ());
```

```node
reconstructFragment(avail_fragments, missing_fragment_id, callback: ());
```

```node
reconstruct(avail_fragments, missing_fragments_ids, callback: ());
```

```node
getFragmentMetadata(fragment, fragment_metadata, callback: ());
```

```node
setOptions(opts);
```
