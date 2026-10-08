//GET DE USER

export const GET_ME = `
  query GetMe {
    getMe {
      sub
      nombre
      apellido_paterno
      apellido_materno
      correo
      telefono
      imagen
      estado
      permiso_app
      residencial {
        id
        nombre
      }
      unidad {
        id
        numero
        cuota_menual
      }
      usuarios_visibles {
        sub
        nombre
        apellido_paterno
        apellido_materno
        correo
        estado
        wallet {
          id
          saldo
        }
      }
      wallet {
        id
        saldo
      }
    }
  }
`;

//Mutation de user

export const CREATE_ME = `
  mutation CreateMe(
    $sub: String!
    $nombre: String!
    $apellido_paterno: String!
    $apellido_materno: String
    $correo: String!
    $telefono: String
    $imagen: String
    $estado: String
    $permiso_app: Boolean
    $residencial_id: ID!
    $unidad_id: ID!
  ) {
    createMe(
      sub: $sub
      nombre: $nombre
      apellido_paterno: $apellido_paterno
      apellido_materno: $apellido_materno
      correo: $correo
      telefono: $telefono
      imagen: $imagen
      estado: $estado
      permiso_app: $permiso_app
      residencial_id: $residencial_id
      unidad_id: $unidad_id
    ) {
      sub
      nombre
      apellido_paterno
      apellido_materno
      correo
      telefono
      imagen
      estado
      permiso_app
      residencial {
        id
        nombre
      }
      unidad {
        id
        numero
        cuota_menual
      }
      wallet {
        id
        saldo
      }
    }
  }
`;
