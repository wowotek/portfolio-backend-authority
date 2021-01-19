const crypto = require("crypto");


module.exports.generateSalt = async () => {
    let bytes = [];
    for(let i=0; i<512; i++){
        bytes.push(
            crypto.randomBytes(128)
        );
    }

    let nm = "";
    for(let byte of bytes){
        nm = `${nm}-${byte}`;
    }

    return nm;
};


const _hashPassword = async (
    literal_password,
    salt
) => {
    const hash = crypto.createHash("sha512");
    hash.update(`${literal_password}${salt}`);

    return hash.digest("hex").toString();
};

module.exports.hashPassword = async (
    literal_password,
    salt
) => {
    let nm = "";
    for(let i=0; i<512; i++){
        nm = `${nm}${await _hashPassword(literal_password, salt)}`;
    }

    return nm;
}


module.exports.comparePassword = async (
    saved_password,
    saved_salt,
    literal_password
) => {
    const hashed = await this.hashPassword(literal_password, saved_salt);

    return hashed == saved_password;
};