import { hash, compare } from  'bcrypt';
const SALT = 10;

const generarHash = async (contrasena)=>{
    try {
        return await hash(contrasena, SALT);
    } catch (error) {
        throw { status: 500, message: 'Error al generar hash de la contraseña' };
    }
}

const compararHash = async (contrasena, hash)=>{
    try {
        return await compare(contrasena, hash);
    } catch (error) {
        throw { status: 500, message: 'Error al comparar hash de la contraseña' };
    }
}

export {
    generarHash,
    compararHash
}