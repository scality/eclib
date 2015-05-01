#include <node.h>
#include <nan.h>
#include <erasurecode.h>
#include <erasurecode_helpers.h>


struct ec_args *create_ec_args(ec_backend_id_t be, ec_checksum_type_t ct, int backend_test_idx);
struct ec_backend_id_t get_ec_backend_id(int id);
struct ec_checksum_type_t get_ec_checksum_type(int ct);

