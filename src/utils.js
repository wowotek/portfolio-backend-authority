const crypto = require("crypto");

module.exports.checkItemsContaintsNulls = async (
    items
) => {
    const p1 = (async () => {
        return items.include(null)
    });
    const p2 = (async () => {
        let condition = false;
        for(let item of items){
            if(item == null){
                return true
            }
            condition = true;
        }

        return condition;
    });

    return p1 && p2;
}


// --- Credentials and Cryptographics
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

module.exports.generateSessionID = async (
    username,
    password
) => {
    let salts = (async () => {
        let s = [];
        for(let i=0; i<128; i++){
            s.push(this.generateSalt());
        }

        await Promise.all(s);
        let ss = "";
        for(let salt of s){
            ss = `${ss}${salt}`;
        }

        return ss.toString();
    })();

    let data = `${username}${salts}${new Date()}${password}`;
    const hasher = crypto.createHash("sha512");
    hasher.update(data);

    return hasher.digest("hex").toString();
}