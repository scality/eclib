#include <erasurecode.h>
#include <erasurecode_helpers.h>


ec_args *create_ec_args(ec_backend_id_t be, ec_checksum_type_t ct, int backend_test_idx);
ec_backend_id_t get_ec_backend_id(int id);
ec_checksum_type_t get_ec_checksum_type(int ct);


